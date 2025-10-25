# Aula 10 - Estilização em Vue.js

## Objetivos da Aula

Nesta aula você vai aprender a estilizar aplicações Vue.js de forma profissional e responsiva, utilizando CSS moderno, frameworks como Bootstrap, e técnicas avançadas de componentes estilizados.

**O que você vai dominar:**
- CSS moderno com variáveis e flexbox/grid
- Integração do Bootstrap 5 com Vue.js
- Estilos scoped e global em componentes
- Design responsivo e mobile-first
- Pré-processadores CSS (SCSS/Sass)
- Temas dinâmicos e modo escuro
- Animações e transições
- Arquitetura CSS escalável

## Parte 1: Fundamentos de CSS em Vue.js

### Estilos em Componentes Vue

Vue permite três formas principais de adicionar CSS aos componentes:

#### 1. Estilos Scoped

Estilos que afetam apenas o componente atual:

```vue
<template>
  <div class="card">
    <h2 class="title">Meu Card</h2>
    <p class="content">Conteúdo do card</p>
  </div>
</template>

<script setup>
// Lógica do componente
</script>

<style scoped>
.card {
  padding: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: white;
}

.title {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-size: 1.5rem;
}

.content {
  color: #666;
  line-height: 1.6;
}
</style>
```

#### 2. Estilos Globais

Estilos que afetam toda a aplicação:

```vue
<style>
/* Sem 'scoped' - aplica globalmente */
body {
  margin: 0;
  font-family: 'Segoe UI', Tahoma, sans-serif;
}

* {
  box-sizing: border-box;
}
</style>
```

#### 3. Estilos Dinâmicos com Binding

Aplicar estilos reativos baseados em dados:

```vue
<template>
  <div 
    class="box"
    :style="{ 
      backgroundColor: cor, 
      width: largura + 'px',
      height: altura + 'px'
    }"
  >
    Caixa colorida
  </div>
  
  <div 
    :class="{
      'ativo': isAtivo,
      'destaque': temDestaque,
      'erro': temErro
    }"
  >
    Classes dinâmicas
  </div>
  
  <button 
    :class="['btn', tamanho, { 'btn-primary': isPrimario }]"
  >
    Botão com múltiplas classes
  </button>
</template>

<script setup>
import { ref } from 'vue'

const cor = ref('#42b983')
const largura = ref(200)
const altura = ref(150)

const isAtivo = ref(true)
const temDestaque = ref(false)
const temErro = ref(false)

const tamanho = ref('btn-lg')
const isPrimario = ref(true)
</script>

<style scoped>
.box {
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  transition: all 0.3s ease;
}

.ativo {
  opacity: 1;
}

.destaque {
  box-shadow: 0 0 10px rgba(66, 185, 131, 0.5);
}

.erro {
  border: 2px solid #e74c3c;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-lg {
  font-size: 1.2rem;
}

.btn-primary {
  background-color: #42b983;
  color: white;
}

.btn-primary:hover {
  background-color: #359268;
}
</style>
```

### CSS Moderno: Variáveis CSS

As variáveis CSS (custom properties) permitem reutilizar valores e criar temas dinâmicos:

```vue
<template>
  <div class="app">
    <h1>Título Principal</h1>
    <p class="texto">Parágrafo com cores do tema</p>
    <button class="botao">Ação</button>
  </div>
</template>

<style scoped>
.app {
  /* Definir variáveis CSS */
  --cor-primaria: #42b983;
  --cor-secundaria: #2c3e50;
  --cor-texto: #333;
  --espacamento-base: 1rem;
  --raio-borda: 8px;
  --fonte-principal: 'Segoe UI', sans-serif;
  
  font-family: var(--fonte-principal);
  padding: var(--espacamento-base);
}

h1 {
  color: var(--cor-primaria);
  margin-bottom: calc(var(--espacamento-base) * 2);
}

.texto {
  color: var(--cor-texto);
  margin-bottom: var(--espacamento-base);
}

.botao {
  background-color: var(--cor-primaria);
  color: white;
  padding: var(--espacamento-base);
  border: none;
  border-radius: var(--raio-borda);
  cursor: pointer;
  transition: background-color 0.3s;
}

.botao:hover {
  background-color: var(--cor-secundaria);
}
</style>
```

### Flexbox e Grid Layouts

#### Flexbox para Layouts Flexíveis

```vue
<template>
  <div class="container-flex">
    <div class="item">Item 1</div>
    <div class="item">Item 2</div>
    <div class="item">Item 3</div>
  </div>
  
  <div class="navbar">
    <div class="logo">Logo</div>
    <nav class="menu">
      <a href="#">Home</a>
      <a href="#">Produtos</a>
      <a href="#">Contato</a>
    </nav>
    <div class="actions">
      <button>Login</button>
    </div>
  </div>
</template>

<style scoped>
.container-flex {
  display: flex;
  gap: 1rem;
  padding: 1rem;
}

.item {
  flex: 1;
  padding: 2rem;
  background-color: #f0f0f0;
  text-align: center;
  border-radius: 8px;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #2c3e50;
  color: white;
}

.menu {
  display: flex;
  gap: 2rem;
}

.menu a {
  color: white;
  text-decoration: none;
  transition: color 0.3s;
}

.menu a:hover {
  color: #42b983;
}
</style>
```

#### CSS Grid para Layouts Complexos

```vue
<template>
  <div class="grid-container">
    <header class="header">Header</header>
    <aside class="sidebar">Sidebar</aside>
    <main class="main-content">Conteúdo Principal</main>
    <footer class="footer">Footer</footer>
  </div>
  
  <div class="product-grid">
    <div v-for="n in 6" :key="n" class="product-card">
      Produto {{ n }}
    </div>
  </div>
</template>

<style scoped>
.grid-container {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: 250px 1fr;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
  gap: 1rem;
}

.header {
  grid-area: header;
  background-color: #2c3e50;
  color: white;
  padding: 1.5rem;
}

.sidebar {
  grid-area: sidebar;
  background-color: #f5f5f5;
  padding: 1.5rem;
}

.main-content {
  grid-area: main;
  padding: 1.5rem;
}

.footer {
  grid-area: footer;
  background-color: #2c3e50;
  color: white;
  padding: 1rem;
  text-align: center;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  padding: 1.5rem;
}

.product-card {
  padding: 2rem;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  text-align: center;
  transition: transform 0.3s;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
```

## Parte 2: Bootstrap 5 com Vue.js

### Instalação do Bootstrap

Existem várias formas de integrar Bootstrap em Vue.js:

#### Método 1: Via CDN (Mais Simples)

No arquivo `index.html`:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vue.js + Bootstrap</title>
  
  <!-- Bootstrap CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
  <div id="app"></div>
  
  <!-- Bootstrap JavaScript Bundle -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

#### Método 2: Via npm (Recomendado)

```bash
npm install bootstrap@5.3.0
npm install @popperjs/core
```

No arquivo `src/main.js`:

```javascript
import { createApp } from 'vue'
import App from './App.vue'

// Importar Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css'

// Importar Bootstrap JavaScript
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

createApp(App).mount('#app')
```

### Componentes Bootstrap em Vue

#### Cards e Grid System

```vue
<template>
  <div class="container mt-5">
    <h1 class="text-center mb-4">Produtos em Destaque</h1>
    
    <div class="row g-4">
      <div 
        v-for="produto in produtos" 
        :key="produto.id"
        class="col-12 col-md-6 col-lg-4"
      >
        <div class="card h-100">
          <img 
            :src="produto.imagem" 
            class="card-img-top" 
            :alt="produto.nome"
          >
          <div class="card-body">
            <h5 class="card-title">{{ produto.nome }}</h5>
            <p class="card-text">{{ produto.descricao }}</p>
            <p class="text-primary fw-bold">
              R$ {{ produto.preco.toFixed(2) }}
            </p>
          </div>
          <div class="card-footer">
            <button 
              class="btn btn-primary w-100"
              @click="adicionarAoCarrinho(produto)"
            >
              Adicionar ao Carrinho
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const produtos = ref([
  {
    id: 1,
    nome: 'Notebook',
    descricao: 'Notebook de alta performance',
    preco: 2500.00,
    imagem: 'https://via.placeholder.com/300x200'
  },
  {
    id: 2,
    nome: 'Mouse',
    descricao: 'Mouse ergonômico sem fio',
    preco: 150.00,
    imagem: 'https://via.placeholder.com/300x200'
  },
  {
    id: 3,
    nome: 'Teclado',
    descricao: 'Teclado mecânico RGB',
    preco: 300.00,
    imagem: 'https://via.placeholder.com/300x200'
  }
])

function adicionarAoCarrinho(produto) {
  alert(`${produto.nome} adicionado ao carrinho!`)
}
</script>
```

#### Navbar Responsivo

```vue
<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">
        <i class="bi bi-shop"></i>
        Minha Loja
      </a>
      
      <button 
        class="navbar-toggler" 
        type="button" 
        data-bs-toggle="collapse" 
        data-bs-target="#navbarNav"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <a class="nav-link active" href="#">Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Produtos</a>
          </li>
          <li class="nav-item dropdown">
            <a 
              class="nav-link dropdown-toggle" 
              href="#" 
              role="button" 
              data-bs-toggle="dropdown"
            >
              Categorias
            </a>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="#">Eletrônicos</a></li>
              <li><a class="dropdown-item" href="#">Roupas</a></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item" href="#">Ver Todas</a></li>
            </ul>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">
              <i class="bi bi-cart"></i>
              Carrinho
              <span class="badge bg-danger">{{ quantidadeCarrinho }}</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'

const quantidadeCarrinho = ref(3)
</script>
```

#### Modais e Formulários

```vue
<template>
  <div class="container mt-5">
    <button 
      class="btn btn-primary" 
      data-bs-toggle="modal" 
      data-bs-target="#loginModal"
    >
      Abrir Login
    </button>
    
    <!-- Modal -->
    <div 
      class="modal fade" 
      id="loginModal" 
      tabindex="-1"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Login</h5>
            <button 
              type="button" 
              class="btn-close" 
              data-bs-dismiss="modal"
            ></button>
          </div>
          
          <div class="modal-body">
            <form @submit.prevent="fazerLogin">
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input 
                  v-model="form.email"
                  type="email" 
                  class="form-control"
                  :class="{ 'is-invalid': erros.email }"
                  required
                >
                <div v-if="erros.email" class="invalid-feedback">
                  {{ erros.email }}
                </div>
              </div>
              
              <div class="mb-3">
                <label class="form-label">Senha</label>
                <input 
                  v-model="form.senha"
                  type="password" 
                  class="form-control"
                  :class="{ 'is-invalid': erros.senha }"
                  required
                >
                <div v-if="erros.senha" class="invalid-feedback">
                  {{ erros.senha }}
                </div>
              </div>
              
              <div class="form-check mb-3">
                <input 
                  v-model="form.lembrar"
                  class="form-check-input" 
                  type="checkbox" 
                  id="lembrar"
                >
                <label class="form-check-label" for="lembrar">
                  Lembrar-me
                </label>
              </div>
            </form>
          </div>
          
          <div class="modal-footer">
            <button 
              type="button" 
              class="btn btn-secondary" 
              data-bs-dismiss="modal"
            >
              Cancelar
            </button>
            <button 
              type="button" 
              class="btn btn-primary"
              @click="fazerLogin"
            >
              Entrar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const form = ref({
  email: '',
  senha: '',
  lembrar: false
})

const erros = ref({
  email: '',
  senha: ''
})

function fazerLogin() {
  erros.value = {}
  
  if (!form.value.email) {
    erros.value.email = 'Email é obrigatório'
    return
  }
  
  if (!form.value.senha) {
    erros.value.senha = 'Senha é obrigatória'
    return
  }
  
  console.log('Login:', form.value)
}
</script>
```

#### Alertas e Notificações

```vue
<template>
  <div class="container mt-5">
    <button 
      class="btn btn-success me-2"
      @click="mostrarAlerta('success', 'Operação realizada com sucesso!')"
    >
      Sucesso
    </button>
    
    <button 
      class="btn btn-danger me-2"
      @click="mostrarAlerta('danger', 'Ocorreu um erro!')"
    >
      Erro
    </button>
    
    <button 
      class="btn btn-warning"
      @click="mostrarAlerta('warning', 'Atenção: verifique os dados!')"
    >
      Aviso
    </button>
    
    <!-- Alertas -->
    <div class="mt-4">
      <div 
        v-for="(alerta, index) in alertas" 
        :key="index"
        :class="`alert alert-${alerta.tipo} alert-dismissible fade show`"
        role="alert"
      >
        {{ alerta.mensagem }}
        <button 
          type="button" 
          class="btn-close"
          @click="fecharAlerta(index)"
        ></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const alertas = ref([])

function mostrarAlerta(tipo, mensagem) {
  alertas.value.push({ tipo, mensagem })
  
  // Auto-fechar após 5 segundos
  setTimeout(() => {
    alertas.value.shift()
  }, 5000)
}

function fecharAlerta(index) {
  alertas.value.splice(index, 1)
}
</script>
```

## Parte 3: Design Responsivo

### Mobile-First Approach

O Bootstrap usa breakpoints mobile-first:

```
xs: < 576px   (extra small - mobile)
sm: ≥ 576px   (small - mobile landscape)
md: ≥ 768px   (medium - tablet)
lg: ≥ 992px   (large - desktop)
xl: ≥ 1200px  (extra large - wide desktop)
xxl: ≥ 1400px (extra extra large)
```

#### Grid Responsivo

```vue
<template>
  <div class="container">
    <!-- 1 coluna em mobile, 2 em tablet, 3 em desktop -->
    <div class="row g-3">
      <div 
        v-for="n in 6" 
        :key="n"
        class="col-12 col-md-6 col-lg-4"
      >
        <div class="card">
          <div class="card-body">
            Item {{ n }}
          </div>
        </div>
      </div>
    </div>
    
    <!-- Layout complexo -->
    <div class="row mt-4">
      <!-- Sidebar: full width em mobile, 1/4 em desktop -->
      <aside class="col-12 col-lg-3 mb-3">
        <div class="card">
          <div class="card-body">
            <h5>Filtros</h5>
            <!-- Filtros aqui -->
          </div>
        </div>
      </aside>
      
      <!-- Conteúdo: full width em mobile, 3/4 em desktop -->
      <main class="col-12 col-lg-9">
        <div class="card">
          <div class="card-body">
            <h5>Produtos</h5>
            <!-- Lista de produtos -->
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
```

### Media Queries Customizadas

```vue
<template>
  <div class="responsive-container">
    <div class="content">
      <h1>Título Responsivo</h1>
      <p>Conteúdo que se adapta</p>
    </div>
  </div>
</template>

<style scoped>
.responsive-container {
  padding: 1rem;
}

.content h1 {
  font-size: 1.5rem;
}

/* Tablet */
@media (min-width: 768px) {
  .responsive-container {
    padding: 2rem;
  }
  
  .content h1 {
    font-size: 2rem;
  }
}

/* Desktop */
@media (min-width: 992px) {
  .responsive-container {
    padding: 3rem;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .content h1 {
    font-size: 2.5rem;
  }
}

/* Wide Desktop */
@media (min-width: 1400px) {
  .content h1 {
    font-size: 3rem;
  }
}
</style>
```

### Utilitários Responsivos do Bootstrap

```vue
<template>
  <div class="container">
    <!-- Visibilidade responsiva -->
    <div class="d-none d-md-block">
      Visível apenas em tablet e desktop
    </div>
    
    <div class="d-block d-md-none">
      Visível apenas em mobile
    </div>
    
    <!-- Espaçamento responsivo -->
    <div class="mt-3 mt-md-4 mt-lg-5">
      Margem que aumenta com o tamanho da tela
    </div>
    
    <!-- Alinhamento responsivo -->
    <div class="text-center text-md-start">
      Centralizado em mobile, alinhado à esquerda em tablet+
    </div>
    
    <!-- Flex responsivo -->
    <div class="d-flex flex-column flex-md-row gap-3">
      <div class="flex-fill">Coluna 1</div>
      <div class="flex-fill">Coluna 2</div>
      <div class="flex-fill">Coluna 3</div>
    </div>
  </div>
</template>
```

## Parte 4: SCSS/Sass com Vue.js

### Instalação do Sass

```bash
npm install -D sass
```

### Usando Sass em Componentes

```vue
<template>
  <div class="card-produto">
    <div class="card-header">
      <h3 class="titulo">{{ produto.nome }}</h3>
      <span class="badge">Novo</span>
    </div>
    <div class="card-body">
      <p class="descricao">{{ produto.descricao }}</p>
      <div class="preco-container">
        <span class="preco-original">R$ {{ produto.precoOriginal }}</span>
        <span class="preco-desconto">R$ {{ produto.preco }}</span>
      </div>
    </div>
    <div class="card-footer">
      <button class="btn btn-comprar">Comprar</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const produto = ref({
  nome: 'Notebook Gamer',
  descricao: 'Notebook de alta performance para jogos',
  precoOriginal: 3500.00,
  preco: 2800.00
})
</script>

<style lang="scss" scoped>
$cor-primaria: #42b983;
$cor-secundaria: #2c3e50;
$cor-cinza: #666;
$espacamento: 1rem;
$raio-borda: 8px;

.card-produto {
  border: 1px solid #ddd;
  border-radius: $raio-borda;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $espacamento;
    background-color: #f8f9fa;
    
    .titulo {
      margin: 0;
      color: $cor-secundaria;
      font-size: 1.25rem;
    }
    
    .badge {
      background-color: $cor-primaria;
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.875rem;
    }
  }
  
  .card-body {
    padding: $espacamento;
    
    .descricao {
      color: $cor-cinza;
      margin-bottom: $espacamento;
    }
    
    .preco-container {
      display: flex;
      gap: $espacamento;
      align-items: center;
      
      .preco-original {
        text-decoration: line-through;
        color: $cor-cinza;
        font-size: 0.9rem;
      }
      
      .preco-desconto {
        color: $cor-primaria;
        font-size: 1.5rem;
        font-weight: bold;
      }
    }
  }
  
  .card-footer {
    padding: $espacamento;
    background-color: white;
    
    .btn-comprar {
      width: 100%;
      padding: 0.75rem;
      background-color: $cor-primaria;
      color: white;
      border: none;
      border-radius: 4px;
      font-weight: bold;
      cursor: pointer;
      transition: background-color 0.3s;
      
      &:hover {
        background-color: darken($cor-primaria, 10%);
      }
      
      &:active {
        transform: scale(0.98);
      }
    }
  }
}
</style>
```

### Variáveis Globais SCSS

Crie `src/styles/variables.scss`:

```scss
// Cores
$cor-primaria: #42b983;
$cor-secundaria: #2c3e50;
$cor-sucesso: #28a745;
$cor-perigo: #dc3545;
$cor-aviso: #ffc107;
$cor-info: #17a2b8;

// Tons de cinza
$cinza-100: #f8f9fa;
$cinza-200: #e9ecef;
$cinza-300: #dee2e6;
$cinza-400: #ced4da;
$cinza-500: #adb5bd;
$cinza-600: #6c757d;
$cinza-700: #495057;
$cinza-800: #343a40;
$cinza-900: #212529;

// Espaçamentos
$espacamento-xs: 0.25rem;
$espacamento-sm: 0.5rem;
$espacamento-md: 1rem;
$espacamento-lg: 1.5rem;
$espacamento-xl: 2rem;
$espacamento-xxl: 3rem;

// Tipografia
$fonte-primaria: 'Segoe UI', Tahoma, sans-serif;
$fonte-secundaria: Georgia, serif;
$fonte-mono: 'Courier New', monospace;

$tamanho-texto-xs: 0.75rem;
$tamanho-texto-sm: 0.875rem;
$tamanho-texto-md: 1rem;
$tamanho-texto-lg: 1.25rem;
$tamanho-texto-xl: 1.5rem;
$tamanho-texto-xxl: 2rem;

// Bordas
$raio-borda-sm: 4px;
$raio-borda-md: 8px;
$raio-borda-lg: 12px;
$raio-borda-xl: 16px;
$raio-borda-circular: 50%;

// Sombras
$sombra-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
$sombra-md: 0 4px 6px rgba(0, 0, 0, 0.1);
$sombra-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
$sombra-xl: 0 20px 25px rgba(0, 0, 0, 0.15);

// Breakpoints
$breakpoint-sm: 576px;
$breakpoint-md: 768px;
$breakpoint-lg: 992px;
$breakpoint-xl: 1200px;
$breakpoint-xxl: 1400px;

// Mixins
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

@mixin responde-para($breakpoint) {
  @if $breakpoint == sm {
    @media (min-width: $breakpoint-sm) { @content; }
  }
  @else if $breakpoint == md {
    @media (min-width: $breakpoint-md) { @content; }
  }
  @else if $breakpoint == lg {
    @media (min-width: $breakpoint-lg) { @content; }
  }
  @else if $breakpoint == xl {
    @media (min-width: $breakpoint-xl) { @content; }
  }
  @else if $breakpoint == xxl {
    @media (min-width: $breakpoint-xxl) { @content; }
  }
}
```

Configure o Vite para importar variáveis automaticamente em `vite.config.js`:

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
```

Agora você pode usar as variáveis em qualquer componente sem importar:

```vue
<style lang="scss" scoped>
.meu-componente {
  color: $cor-primaria;
  padding: $espacamento-md;
  border-radius: $raio-borda-md;
  box-shadow: $sombra-md;
  
  @include responde-para(md) {
    padding: $espacamento-lg;
  }
  
  .titulo {
    font-size: $tamanho-texto-xl;
    margin-bottom: $espacamento-sm;
  }
}
</style>
```

## Parte 5: Temas Dinâmicos e Modo Escuro

### Sistema de Temas com Variáveis CSS

```vue
<template>
  <div class="app" :data-theme="temaAtual">
    <header class="header">
      <h1>Minha Aplicação</h1>
      <button 
        class="btn-tema"
        @click="alternarTema"
      >
        {{ temaAtual === 'claro' ? '🌙 Escuro' : '☀️ Claro' }}
      </button>
    </header>
    
    <main class="conteudo">
      <div class="card">
        <h2>Card com Tema</h2>
        <p>O tema se adapta automaticamente</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const temaAtual = ref('claro')

function alternarTema() {
  temaAtual.value = temaAtual.value === 'claro' ? 'escuro' : 'claro'
}

// Salvar tema no localStorage
watch(temaAtual, (novoTema) => {
  localStorage.setItem('tema', novoTema)
})

// Carregar tema salvo
onMounted(() => {
  const temaSalvo = localStorage.getItem('tema')
  if (temaSalvo) {
    temaAtual.value = temaSalvo
  }
})
</script>

<style scoped>
.app {
  min-height: 100vh;
  background-color: var(--cor-fundo);
  color: var(--cor-texto);
  transition: background-color 0.3s, color 0.3s;
}

/* Tema Claro */
.app[data-theme="claro"] {
  --cor-fundo: #ffffff;
  --cor-texto: #2c3e50;
  --cor-primaria: #42b983;
  --cor-secundaria: #f8f9fa;
  --cor-borda: #dee2e6;
}

/* Tema Escuro */
.app[data-theme="escuro"] {
  --cor-fundo: #1a1a1a;
  --cor-texto: #e0e0e0;
  --cor-primaria: #42b983;
  --cor-secundaria: #2d2d2d;
  --cor-borda: #404040;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background-color: var(--cor-secundaria);
  border-bottom: 1px solid var(--cor-borda);
}

.btn-tema {
  padding: 0.5rem 1rem;
  background-color: var(--cor-primaria);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.3s;
}

.btn-tema:hover {
  opacity: 0.8;
}

.conteudo {
  padding: 2rem;
}

.card {
  background-color: var(--cor-secundaria);
  border: 1px solid var(--cor-borda);
  border-radius: 8px;
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
}
</style>
```

## Parte 6: Animações e Transições

### Transições CSS Simples

```vue
<template>
  <div class="demo-transicoes">
    <button @click="visivel = !visivel">
      {{ visivel ? 'Ocultar' : 'Mostrar' }}
    </button>
    
    <transition name="fade">
      <div v-if="visivel" class="box">
        Elemento com fade
      </div>
    </transition>
    
    <transition name="slide">
      <div v-if="visivel" class="box">
        Elemento com slide
      </div>
    </transition>
    
    <transition name="scale">
      <div v-if="visivel" class="box">
        Elemento com escala
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const visivel = ref(true)
</script>

<style scoped>
.box {
  padding: 2rem;
  margin: 1rem 0;
  background-color: #42b983;
  color: white;
  border-radius: 8px;
}

/* Fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Slide */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.5s, opacity 0.5s;
}

.slide-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* Scale */
.scale-enter-active,
.scale-leave-active {
  transition: transform 0.5s, opacity 0.5s;
}

.scale-enter-from,
.scale-leave-to {
  transform: scale(0);
  opacity: 0;
}
</style>
```

### Animações em Listas

```vue
<template>
  <div class="lista-animada">
    <button @click="adicionarItem">Adicionar Item</button>
    <button @click="embaralhar">Embaralhar</button>
    
    <transition-group name="lista" tag="div" class="itens">
      <div 
        v-for="item in itens" 
        :key="item.id"
        class="item"
      >
        {{ item.texto }}
        <button @click="removerItem(item.id)">×</button>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const itens = ref([
  { id: 1, texto: 'Item 1' },
  { id: 2, texto: 'Item 2' },
  { id: 3, texto: 'Item 3' }
])

let proximoId = 4

function adicionarItem() {
  itens.value.push({
    id: proximoId++,
    texto: `Item ${proximoId - 1}`
  })
}

function removerItem(id) {
  const index = itens.value.findIndex(item => item.id === id)
  if (index > -1) {
    itens.value.splice(index, 1)
  }
}

function embaralhar() {
  itens.value = itens.value.sort(() => Math.random() - 0.5)
}
</script>

<style scoped>
.itens {
  margin-top: 1rem;
}

.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  margin: 0.5rem 0;
  background-color: #f0f0f0;
  border-radius: 4px;
}

.lista-move,
.lista-enter-active,
.lista-leave-active {
  transition: all 0.5s ease;
}

.lista-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.lista-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.lista-leave-active {
  position: absolute;
  width: 100%;
}
</style>
```

## Exercícios Práticos

Esta aula possui 3 exercícios práticos para você aplicar os conceitos aprendidos:

### Exercício 1: Card de Produto Estilizado
Criar um card de produto responsivo usando Bootstrap e SCSS, com efeitos hover e layout que se adapta do mobile ao desktop.

### Exercício 2: Sistema de Temas
Implementar um sistema completo de temas (claro/escuro) com múltiplas paletas de cores, salvando preferências no localStorage.

### Exercício 3: Dashboard Responsivo
Desenvolver um dashboard administrativo responsivo com sidebar colapsável, cards informativos e gráficos que se adaptam a diferentes tamanhos de tela.

