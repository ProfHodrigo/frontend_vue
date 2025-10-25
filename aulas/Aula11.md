# Aula 11: Build e Deploy

Esta aula aborda o processo completo de preparacao, build e deploy de aplicacoes Vue.js em producao. Vamos explorar desde a configuracao de ambientes ate estrategias avancadas de deployment e monitoramento.

## Objetivos da Aula

- Configurar builds otimizadas para producao
- Gerenciar multiplos ambientes (development, staging, production)
- Implementar pipelines de CI/CD
- Deploy em diferentes plataformas (Netlify, Vercel, AWS)
- Configurar Docker para containerizacao
- Implementar monitoring e observabilidade
- Criar estrategias de rollback

## Parte 1: Configuracao de Ambientes

### 1.1 Variaveis de Ambiente

As variaveis de ambiente permitem configurar a aplicacao para diferentes contextos sem alterar o codigo.

#### Arquivo `.env.development`

```env
VITE_APP_TITLE=Aplicacao Vue - Desenvolvimento
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_ENV=development
VITE_ENABLE_DEVTOOLS=true
VITE_LOG_LEVEL=debug
```

#### Arquivo `.env.production`

```env
VITE_APP_TITLE=Aplicacao Vue
VITE_API_BASE_URL=https://api.seusite.com/api
VITE_APP_ENV=production
VITE_ENABLE_DEVTOOLS=false
VITE_LOG_LEVEL=error
VITE_SENTRY_DSN=https://chave@sentry.io/projeto
VITE_GTM_ID=GTM-XXXXXXX
```

### 1.2 Modulo de Configuracao

Criar um modulo centralizado para acessar variaveis de ambiente:

**Arquivo: `src/config/environment.js`**

```javascript
export const ENV = {
  APP_TITLE: import.meta.env.VITE_APP_TITLE || 'Vue App',
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',
  APP_ENV: import.meta.env.VITE_APP_ENV || 'development',
  ENABLE_DEVTOOLS: import.meta.env.VITE_ENABLE_DEVTOOLS === 'true',
  LOG_LEVEL: import.meta.env.VITE_LOG_LEVEL || 'info',
  
  // Propriedades computadas
  get isDevelopment() {
    return this.APP_ENV === 'development'
  },
  
  get isProduction() {
    return this.APP_ENV === 'production'
  }
}

export default ENV
```

**Uso no codigo:**

```javascript
import ENV from '@/config/environment'

// Configurar axios com base no ambiente
axios.defaults.baseURL = ENV.API_BASE_URL

// Log condicional
if (ENV.isDevelopment) {
  console.log('Dados:', data)
}
```

### 1.3 Configuracao do Vite para Producao

**Arquivo: `vite.config.js`**

```javascript
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [vue()],
    
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    
    build: {
      // Otimizacoes de producao
      target: 'es2015',
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: true
        }
      },
      
      // Code splitting
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['vue', 'vue-router', 'pinia'],
            ui: ['bootstrap'],
            utils: ['axios']
          }
        }
      },
      
      // Limite de tamanho de chunk
      chunkSizeWarningLimit: 1000
    },
    
    // Definir constantes globais
    define: {
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
      __VERSION__: JSON.stringify('1.0.0')
    }
  }
})
```

## Parte 2: Deploy em Plataformas

### 2.1 Deploy no Netlify

Netlify oferece deploy gratuito com CI/CD integrado.

#### Arquivo `netlify.toml`

```toml
[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

# Redirects para SPA
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# Proxy para API
[[redirects]]
  from = "/api/*"
  to = "https://api.backend.com/api/:splat"
  status = 200
  force = true

# Headers de seguranca
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"

# Cache para assets
[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

#### Deploy via CLI

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

### 2.2 Deploy no Vercel

Vercel e otimizado para aplicacoes frontend.

#### Arquivo `vercel.json`

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://api.backend.com/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

#### Deploy via CLI

```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### 2.3 Deploy na AWS S3 + CloudFront

Deploy em infraestrutura AWS para maior controle.

#### Script de Deploy

**Arquivo: `scripts/deploy-aws.js`**

```javascript
const AWS = require('aws-sdk')
const fs = require('fs')
const path = require('path')
const mime = require('mime-types')

// Configurar AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-east-1'
})

const s3 = new AWS.S3()
const cloudfront = new AWS.CloudFront()

const BUCKET_NAME = process.env.S3_BUCKET_NAME
const CLOUDFRONT_ID = process.env.CLOUDFRONT_DISTRIBUTION_ID

async function uploadDirectory(dirPath) {
  const files = getAllFiles(dirPath)
  
  for (const file of files) {
    await uploadFile(file)
  }
}

function getAllFiles(dir, files = []) {
  const fileList = fs.readdirSync(dir)
  
  for (const file of fileList) {
    const filePath = path.join(dir, file)
    
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, files)
    } else {
      files.push(filePath)
    }
  }
  
  return files
}

async function uploadFile(filePath) {
  const fileContent = fs.readFileSync(filePath)
  const key = filePath.replace('dist/', '')
  
  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
    Body: fileContent,
    ContentType: mime.lookup(filePath) || 'application/octet-stream',
    CacheControl: getCacheControl(key)
  }
  
  await s3.upload(params).promise()
  console.log(`Uploaded: ${key}`)
}

function getCacheControl(key) {
  if (key.includes('/assets/')) {
    return 'public, max-age=31536000, immutable'
  }
  return 'public, max-age=0, must-revalidate'
}

async function invalidateCloudFront() {
  const params = {
    DistributionId: CLOUDFRONT_ID,
    InvalidationBatch: {
      CallerReference: `deploy-${Date.now()}`,
      Paths: {
        Quantity: 1,
        Items: ['/*']
      }
    }
  }
  
  await cloudfront.createInvalidation(params).promise()
  console.log('CloudFront invalidation created')
}

async function deploy() {
  try {
    await uploadDirectory('dist')
    await invalidateCloudFront()
    console.log('Deploy completed!')
  } catch (error) {
    console.error('Deploy failed:', error)
    process.exit(1)
  }
}

deploy()
```

## Parte 3: CI/CD com GitHub Actions

### 3.1 Pipeline Basico

**Arquivo: `.github/workflows/deploy.yml`**

```yaml
name: Build and Deploy

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

env:
  NODE_VERSION: '18'

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run tests
      run: npm test
      
    - name: Run linter
      run: npm run lint

  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      env:
        VITE_API_BASE_URL: ${{ secrets.API_URL }}
        
    - name: Upload artifacts
      uses: actions/upload-artifact@v3
      with:
        name: dist
        path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - name: Download artifacts
      uses: actions/download-artifact@v3
      with:
        name: dist
        path: dist
        
    - name: Deploy to Netlify
      uses: nwtgck/actions-netlify@v2.0
      with:
        publish-dir: './dist'
        production-deploy: true
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

### 3.2 Pipeline Avancado com Testes E2E

```yaml
name: Complete Pipeline

on:
  push:
    branches: [ main ]

jobs:
  quality-checks:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - run: npm ci
    - run: npm run lint
    - run: npm run type-check
    
  unit-tests:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - run: npm ci
    - run: npm run test:coverage
    
    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info
  
  e2e-tests:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - run: npm ci
    - run: npm run build
    - run: npm run test:e2e:ci
    
    - name: Upload screenshots
      uses: actions/upload-artifact@v3
      if: failure()
      with:
        name: cypress-screenshots
        path: cypress/screenshots
  
  deploy-production:
    needs: [quality-checks, unit-tests, e2e-tests]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - run: npm ci
    - run: npm run build
      env:
        VITE_API_BASE_URL: ${{ secrets.PROD_API_URL }}
        VITE_SENTRY_DSN: ${{ secrets.SENTRY_DSN }}
        
    - name: Deploy to AWS S3
      run: node scripts/deploy-aws.js
      env:
        AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
        AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        S3_BUCKET_NAME: ${{ secrets.S3_BUCKET_NAME }}
        CLOUDFRONT_DISTRIBUTION_ID: ${{ secrets.CLOUDFRONT_ID }}
```

## Parte 4: Docker e Containerizacao

### 4.1 Dockerfile Multi-Stage

**Arquivo: `Dockerfile`**

```dockerfile
# Stage 1: Build
FROM node:18-alpine as build

WORKDIR /app

# Copiar arquivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar codigo fonte
COPY . .

# Build da aplicacao
RUN npm run build

# Stage 2: Production
FROM nginx:alpine

# Copiar configuracao do nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar build da aplicacao
COPY --from=build /app/dist /usr/share/nginx/html

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 4.2 Configuracao do Nginx

**Arquivo: `nginx.conf`**

```nginx
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer"';
    
    access_log /var/log/nginx/access.log main;
    
    # Performance
    sendfile on;
    tcp_nopush on;
    keepalive_timeout 65;
    
    # Compressao Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/json
        application/xml+rss;
    
    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;
        
        # SPA fallback
        location / {
            try_files $uri $uri/ /index.html;
        }
        
        # Cache para assets estaticos
        location /assets {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
        
        # Health check
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
        
        # Headers de seguranca
        add_header X-Frame-Options "DENY" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
    }
}
```

### 4.3 Docker Compose

**Arquivo: `docker-compose.yml`**

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "-q", "--spider", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

**Comandos Docker:**

```bash
# Build da imagem
docker build -t vue-app:latest .

# Executar container
docker run -p 80:80 vue-app:latest

# Com docker-compose
docker-compose up -d
```

## Parte 5: Monitoring e Observabilidade

### 5.1 Integracao com Sentry

**Arquivo: `src/plugins/sentry.js`**

```javascript
import * as Sentry from "@sentry/vue"
import ENV from '@/config/environment'

export function initSentry(app, router) {
  if (!ENV.SENTRY_DSN) return
  
  Sentry.init({
    app,
    dsn: ENV.SENTRY_DSN,
    environment: ENV.APP_ENV,
    
    integrations: [
      new Sentry.BrowserTracing({
        routingInstrumentation: Sentry.vueRouterInstrumentation(router)
      })
    ],
    
    tracesSampleRate: ENV.isProduction ? 0.1 : 1.0,
    
    beforeSend(event) {
      // Filtrar erros em desenvolvimento
      if (ENV.isDevelopment) {
        console.error('Sentry Error:', event)
      }
      return event
    }
  })
}

// Capturar excecoes customizadas
export function captureException(error, context = {}) {
  Sentry.withScope(scope => {
    Object.keys(context).forEach(key => {
      scope.setContext(key, context[key])
    })
    Sentry.captureException(error)
  })
}
```

**Uso no `main.js`:**

```javascript
import { createApp } from 'vue'
import { createRouter } from 'vue-router'
import App from './App.vue'
import { initSentry } from './plugins/sentry'

const app = createApp(App)
const router = createRouter({ /* config */ })

// Inicializar Sentry
initSentry(app, router)

app.use(router)
app.mount('#app')
```

### 5.2 Google Analytics / Tag Manager

**Arquivo: `src/plugins/analytics.js`**

```javascript
import ENV from '@/config/environment'

export function initGTM() {
  if (!ENV.GTM_ID) return
  
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtm.js?id=${ENV.GTM_ID}`
  document.head.appendChild(script)
  
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    'gtm.start': new Date().getTime(),
    event: 'gtm.js'
  })
}

// Rastrear eventos
export function trackEvent(action, category, label, value) {
  if (!window.dataLayer) return
  
  window.dataLayer.push({
    event: 'custom_event',
    event_category: category,
    event_action: action,
    event_label: label,
    event_value: value
  })
}

// Rastrear pageviews
export function trackPageView(path, title) {
  if (!window.dataLayer) return
  
  window.dataLayer.push({
    event: 'page_view',
    page_path: path,
    page_title: title
  })
}
```

## Parte 6: Estrategias de Rollback

### 6.1 Versionamento de Deploys

Manter versoes anteriores para rollback rapido:

```bash
# AWS S3 - Versionamento habilitado
aws s3 cp dist/ s3://bucket/releases/v1.2.3/ --recursive
aws s3 cp s3://bucket/releases/v1.2.3/ s3://bucket/current/ --recursive

# Rollback para versao anterior
aws s3 cp s3://bucket/releases/v1.2.2/ s3://bucket/current/ --recursive
```

### 6.2 Blue-Green Deployment

**Script simplificado:**

```javascript
// scripts/blue-green-deploy.js
class BlueGreenDeployment {
  constructor() {
    this.blueEnv = 'blue-bucket'
    this.greenEnv = 'green-bucket'
    this.current = null
  }
  
  async getCurrentEnvironment() {
    // Verificar qual ambiente esta ativo
    // Retorna 'blue' ou 'green'
  }
  
  async deployToInactive() {
    const target = this.current === 'blue' ? 'green' : 'blue'
    console.log(`Deploying to ${target}`)
    
    // Upload files para ambiente inativo
    await this.uploadFiles(target)
    
    // Executar health checks
    await this.healthCheck(target)
  }
  
  async switchTraffic() {
    // Alternar trafego para novo ambiente
    console.log('Switching traffic')
  }
  
  async rollback() {
    // Voltar para ambiente anterior
    console.log('Rolling back')
  }
}
```

### 6.3 Canary Deployment

Liberar gradualmente para um percentual de usuarios:

```nginx
# nginx.conf - Split traffic
upstream backend {
    server app-v1.example.com weight=9;
    server app-v2.example.com weight=1;
}
```

## Parte 7: Performance e Otimizacao

### 7.1 Analise de Bundle

```bash
# Instalar analisador
npm install --save-dev rollup-plugin-visualizer

# Adicionar ao vite.config.js
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    vue(),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true
    })
  ]
})

# Gerar analise
npm run build
```

### 7.2 Lazy Loading de Rotas

```javascript
// router/index.js
const routes = [
  {
    path: '/',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/about',
    component: () => import('@/views/About.vue')
  },
  {
    path: '/dashboard',
    component: () => import('@/views/Dashboard.vue')
  }
]
```

### 7.3 Preload de Assets Criticos

```html
<!-- index.html -->
<head>
  <link rel="preload" href="/assets/logo.svg" as="image">
  <link rel="preload" href="/assets/fonts/main.woff2" as="font" crossorigin>
</head>
```

## Comandos Uteis

### Scripts do package.json

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:staging": "vite build --mode staging",
    "preview": "vite preview",
    "lint": "eslint src --ext .vue,.js",
    "test": "vitest",
    "test:e2e": "cypress run",
    "deploy:netlify": "netlify deploy --prod",
    "deploy:aws": "node scripts/deploy-aws.js",
    "analyze": "vite-bundle-visualizer"
  }
}
```

### Verificacao Pre-Deploy

```bash
# 1. Executar testes
npm test

# 2. Verificar linter
npm run lint

# 3. Build de producao
npm run build

# 4. Preview local
npm run preview

# 5. Analisar bundle
npm run analyze
```

## Checklist de Deploy

- [ ] Todas as variaveis de ambiente configuradas
- [ ] Testes passando (unit + e2e)
- [ ] Build de producao sem erros
- [ ] Bundle size dentro do limite
- [ ] Performance Lighthouse > 90
- [ ] Headers de seguranca configurados
- [ ] Monitoring (Sentry) configurado
- [ ] Analytics configurado
- [ ] Backup da versao anterior
- [ ] Plano de rollback definido
- [ ] Documentacao atualizada