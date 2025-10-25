# Exercicio 1: Pipeline CI/CD Completo

## Objetivo

Configurar um pipeline completo de CI/CD usando GitHub Actions que inclua testes automatizados, build otimizado e deploy automatico em producao.

## Contexto

Voce foi contratado para modernizar o processo de deployment de uma aplicacao Vue.js. Atualmente, o deploy e feito manualmente, o que causa erros e demora. Sua missao e automatizar todo o processo usando GitHub Actions.

## Requisitos

### 1. Pipeline de Testes

Criar workflow que execute:
- Instalacao de dependencias
- Lint do codigo
- Testes unitarios com coverage
- Testes E2E

### 2. Pipeline de Build

- Build otimizado para producao
- Validacao de bundle size
- Geracao de source maps para staging
- Upload de artifacts

### 3. Pipeline de Deploy

- Deploy automatico em merge para main
- Deploy de preview em pull requests
- Notificacao de sucesso/falha
- Rollback automatico em caso de falha

## Estrutura do Projeto

```
projeto/
├── .github/
│   └── workflows/
│       ├── ci.yml           # Pipeline de testes
│       ├── deploy.yml       # Pipeline de deploy
│       └── pr-preview.yml   # Preview de PRs
├── src/
├── tests/
│   ├── unit/
│   └── e2e/
├── scripts/
│   ├── deploy.js
│   └── health-check.js
└── package.json
```

## Implementacao

### Passo 1: Configurar Secrets no GitHub

Adicione os seguintes secrets no repositorio GitHub:

1. Acesse: Repository > Settings > Secrets > Actions
2. Adicione:
   - `NETLIFY_AUTH_TOKEN`
   - `NETLIFY_SITE_ID`
   - `PROD_API_URL`
   - `SENTRY_DSN`
   - `SLACK_WEBHOOK` (opcional)

### Passo 2: Criar Workflow de CI

**Arquivo: `.github/workflows/ci.yml`**

```yaml
name: Continuous Integration

on:
  pull_request:
    branches: [ main, develop ]
  push:
    branches: [ main, develop ]

env:
  NODE_VERSION: '18'
  CACHE_KEY: deps-node-modules-${{ hashFiles('**/package-lock.json') }}

jobs:
  # Job 1: Quality Checks
  quality:
    name: Code Quality
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout repository
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run ESLint
        run: npm run lint
        continue-on-error: false
      
      - name: Check TypeScript types
        run: npm run type-check
        if: hashFiles('tsconfig.json') != ''

  # Job 2: Unit Tests
  unit-tests:
    name: Unit Tests
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm run test:unit -- --coverage
      
      - name: Generate coverage report
        run: |
          echo "## Test Coverage Report" >> $GITHUB_STEP_SUMMARY
          echo "\`\`\`" >> $GITHUB_STEP_SUMMARY
          cat coverage/coverage-summary.txt >> $GITHUB_STEP_SUMMARY
          echo "\`\`\`" >> $GITHUB_STEP_SUMMARY
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
          flags: unittests
          fail_ci_if_error: true

  # Job 3: E2E Tests
  e2e-tests:
    name: E2E Tests
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: npm run build
      
      - name: Run Cypress tests
        uses: cypress-io/github-action@v5
        with:
          start: npm run preview
          wait-on: 'http://localhost:4173'
          wait-on-timeout: 120
          browser: chrome
          record: false
      
      - name: Upload screenshots on failure
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: cypress-screenshots
          path: cypress/screenshots
          retention-days: 7
      
      - name: Upload videos
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: cypress-videos
          path: cypress/videos
          retention-days: 7

  # Job 4: Security Audit
  security:
    name: Security Audit
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
      
      - name: Run npm audit
        run: npm audit --production
        continue-on-error: true
      
      - name: Run Snyk security scan
        uses: snyk/actions/node@master
        continue-on-error: true
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
```

### Passo 3: Criar Workflow de Deploy

**Arquivo: `.github/workflows/deploy.yml`**

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

env:
  NODE_VERSION: '18'

jobs:
  # Job 1: Build
  build:
    name: Build Application
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
      
      - name: Build for production
        run: npm run build
        env:
          VITE_API_BASE_URL: ${{ secrets.PROD_API_URL }}
          VITE_SENTRY_DSN: ${{ secrets.SENTRY_DSN }}
          VITE_APP_ENV: production
      
      - name: Check bundle size
        run: |
          BUNDLE_SIZE=$(du -sh dist | cut -f1)
          echo "Bundle size: $BUNDLE_SIZE"
          echo "::notice::Production bundle size: $BUNDLE_SIZE"
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: production-build
          path: dist
          retention-days: 30

  # Job 2: Deploy to Netlify
  deploy:
    name: Deploy to Netlify
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://seusite.netlify.app
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: production-build
          path: dist
      
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v2.0
        with:
          publish-dir: './dist'
          production-deploy: true
          github-token: ${{ secrets.GITHUB_TOKEN }}
          deploy-message: "Deploy from GitHub Actions - ${{ github.sha }}"
          enable-pull-request-comment: false
          enable-commit-comment: true
          overwrites-pull-request-comment: false
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
        timeout-minutes: 5
      
      - name: Get deployment URL
        id: deployment
        run: |
          DEPLOY_URL="https://seusite.netlify.app"
          echo "url=$DEPLOY_URL" >> $GITHUB_OUTPUT
          echo "::notice::Deployed to: $DEPLOY_URL"

  # Job 3: Smoke Tests
  smoke-tests:
    name: Production Smoke Tests
    needs: deploy
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Wait for deployment
        run: sleep 30
      
      - name: Check if site is accessible
        run: |
          response=$(curl -s -o /dev/null -w "%{http_code}" https://seusite.netlify.app)
          if [ $response -eq 200 ]; then
            echo "✓ Site is accessible"
          else
            echo "✗ Site returned status code: $response"
            exit 1
          fi
      
      - name: Check critical pages
        run: |
          PAGES=("/" "/about" "/contact")
          for page in "${PAGES[@]}"; do
            response=$(curl -s -o /dev/null -w "%{http_code}" "https://seusite.netlify.app$page")
            echo "Page $page: HTTP $response"
          done

  # Job 4: Lighthouse CI
  lighthouse:
    name: Lighthouse Performance
    needs: deploy
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
      
      - name: Install Lighthouse CI
        run: npm install -g @lhci/cli@0.12.x
      
      - name: Run Lighthouse CI
        run: |
          lhci autorun \
            --collect.url=https://seusite.netlify.app \
            --collect.numberOfRuns=3 \
            --assert.preset=lighthouse:recommended
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}

  # Job 5: Notify
  notify:
    name: Send Notifications
    needs: [deploy, smoke-tests, lighthouse]
    runs-on: ubuntu-latest
    if: always()
    
    steps:
      - name: Notify Slack on success
        if: success()
        uses: 8398a7/action-slack@v3
        with:
          status: custom
          custom_payload: |
            {
              text: "✅ Deploy to production successful!",
              blocks: [
                {
                  type: "section",
                  text: {
                    type: "mrkdwn",
                    text: "*Deploy Successful* :white_check_mark:\n*Branch:* ${{ github.ref }}\n*Commit:* ${{ github.sha }}\n*Author:* ${{ github.actor }}"
                  }
                }
              ]
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
      
      - name: Notify Slack on failure
        if: failure()
        uses: 8398a7/action-slack@v3
        with:
          status: custom
          custom_payload: |
            {
              text: "❌ Deploy to production failed!",
              blocks: [
                {
                  type: "section",
                  text: {
                    type: "mrkdwn",
                    text: "*Deploy Failed* :x:\n*Branch:* ${{ github.ref }}\n*Commit:* ${{ github.sha }}\n*Author:* ${{ github.actor }}"
                  }
                }
              ]
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

### Passo 4: Criar Workflow para PR Previews

**Arquivo: `.github/workflows/pr-preview.yml`**

```yaml
name: PR Preview Deploy

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  preview:
    name: Deploy Preview
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build for preview
        run: npm run build
        env:
          VITE_API_BASE_URL: https://api-staging.example.com/api
          VITE_APP_ENV: staging
      
      - name: Deploy preview to Netlify
        uses: nwtgck/actions-netlify@v2.0
        with:
          publish-dir: './dist'
          production-deploy: false
          github-token: ${{ secrets.GITHUB_TOKEN }}
          deploy-message: "Preview for PR #${{ github.event.number }}"
          enable-pull-request-comment: true
          enable-commit-comment: false
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

### Passo 5: Script de Health Check

**Arquivo: `scripts/health-check.js`**

```javascript
const https = require('https')

const SITE_URL = process.env.SITE_URL || 'https://seusite.netlify.app'
const MAX_RETRIES = 5
const RETRY_DELAY = 10000 // 10 segundos

async function checkHealth(url, retries = 0) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        console.log(`✓ Health check passed: ${url}`)
        resolve(true)
      } else if (retries < MAX_RETRIES) {
        console.log(`Retry ${retries + 1}/${MAX_RETRIES} - Status: ${res.statusCode}`)
        setTimeout(() => {
          checkHealth(url, retries + 1).then(resolve).catch(reject)
        }, RETRY_DELAY)
      } else {
        reject(new Error(`Health check failed after ${MAX_RETRIES} retries`))
      }
    }).on('error', (err) => {
      if (retries < MAX_RETRIES) {
        console.log(`Retry ${retries + 1}/${MAX_RETRIES} - Error: ${err.message}`)
        setTimeout(() => {
          checkHealth(url, retries + 1).then(resolve).catch(reject)
        }, RETRY_DELAY)
      } else {
        reject(err)
      }
    })
  })
}

async function runHealthChecks() {
  const criticalPages = [
    SITE_URL,
    `${SITE_URL}/about`,
    `${SITE_URL}/contact`
  ]
  
  try {
    for (const page of criticalPages) {
      await checkHealth(page)
    }
    console.log('\n✓ All health checks passed!')
    process.exit(0)
  } catch (error) {
    console.error('\n✗ Health checks failed:', error.message)
    process.exit(1)
  }
}

runHealthChecks()
```

## Testes

### 1. Testar Pipeline de CI

```bash
# 1. Criar nova branch
git checkout -b feature/new-feature

# 2. Fazer alteracoes e commit
git add .
git commit -m "Add new feature"

# 3. Push e criar Pull Request
git push origin feature/new-feature

# 4. Verificar no GitHub se os workflows foram executados
```

### 2. Testar Deploy de Producao

```bash
# 1. Merge do PR para main
# O deploy automatico sera acionado

# 2. Verificar logs do workflow no GitHub Actions

# 3. Acessar site em producao
curl -I https://seusite.netlify.app
```

### 3. Testar Rollback

Se o deploy falhar, o workflow deve:
1. Detectar a falha nos smoke tests
2. Notificar no Slack
3. Manter versao anterior ativa

## Melhorias Opcionais

### 1. Cache de Dependencias

Ja implementado com `cache: 'npm'` no setup do Node.js.

### 2. Parallel Jobs

Os jobs de quality, unit-tests e e2e-tests rodam em paralelo.

### 3. Conditional Steps

```yaml
- name: Run step only on main
  if: github.ref == 'refs/heads/main'
  run: echo "This runs only on main branch"
```

### 4. Manual Approval para Producao

```yaml
deploy:
  environment:
    name: production
    # Requer aprovacao manual no GitHub
```

## Resultado Esperado

Apos implementacao completa:

1. Todo PR automaticamente:
   - Executa testes
   - Gera preview
   - Mostra coverage report

2. Todo merge para main automaticamente:
   - Executa CI completo
   - Build otimizado
   - Deploy em producao
   - Smoke tests
   - Lighthouse audit
   - Notificacoes

3. Em caso de falha:
   - Rollback automatico
   - Notificacao imediata
   - Logs detalhados

## Checklist de Validacao

- [ ] Workflow CI executa em PRs
- [ ] Todos os testes passam
- [ ] Coverage report gerado
- [ ] Preview deploy funciona
- [ ] Deploy para producao automatico
- [ ] Smoke tests passam
- [ ] Lighthouse score > 90
- [ ] Notificacoes funcionam
- [ ] Rollback disponivel
- [ ] Documentacao atualizada

## Recursos Adicionais

- [GitHub Actions Documentation](https://docs.github.com/actions)
- [Netlify Deploy Contexts](https://docs.netlify.com/site-deploys/overview/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
