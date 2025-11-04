<template>
  <div id="app">
    <!-- Navbar Bootstrap -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-gradient">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">
          <i class="bi bi-palette-fill me-2"></i>
          Aula 10: Estilizacao
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <a class="nav-link" :class="{ active: abaAtiva === 'botoes' }" @click="abaAtiva = 'botoes'" href="#">
                <i class="bi bi-square-fill me-1"></i>
                Botoes
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" :class="{ active: abaAtiva === 'cards' }" @click="abaAtiva = 'cards'" href="#">
                <i class="bi bi-grid-fill me-1"></i>
                Cards
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" :class="{ active: abaAtiva === 'temas' }" @click="abaAtiva = 'temas'" href="#">
                <i class="bi bi-moon-stars-fill me-1"></i>
                Temas
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Conteudo Principal -->
    <div class="container-fluid py-4">
      <div class="row">
        <!-- Sidebar -->
        <aside class="col-lg-2 d-none d-lg-block">
          <div class="sidebar">
            <h6 class="sidebar-titulo">Topicos da Aula 10</h6>
            <ul class="sidebar-menu">
              <li :class="{ ativo: abaAtiva === 'botoes' }" @click="abaAtiva = 'botoes'">
                <i class="bi bi-square-fill"></i>
                Botoes Estilizados
              </li>
              <li :class="{ ativo: abaAtiva === 'cards' }" @click="abaAtiva = 'cards'">
                <i class="bi bi-grid-fill"></i>
                Cards Responsivos
              </li>
              <li :class="{ ativo: abaAtiva === 'temas' }" @click="abaAtiva = 'temas'">
                <i class="bi bi-moon-stars-fill"></i>
                Sistema de Temas
              </li>
            </ul>

            <!-- Info Box -->
            <div class="info-box mt-4">
              <h6><i class="bi bi-info-circle me-2"></i>Conceitos</h6>
              <ul class="info-lista">
                <li>CSS Scoped</li>
                <li>SCSS Variables</li>
                <li>Bootstrap 5</li>
                <li>Flexbox & Grid</li>
                <li>CSS Variables</li>
                <li>Responsividade</li>
              </ul>
            </div>
          </div>
        </aside>

        <!-- Area de Conteudo -->
        <main class="col-lg-10">
          <!-- Header da Secao -->
          <div class="secao-header mb-4">
            <h1 class="display-5">
              <i class="bi bi-brush-fill me-3"></i>
              Estilizacao Avancada em Vue.js
            </h1>
            <p class="lead text-muted">
              Aprenda a criar interfaces modernas com CSS, SCSS, Bootstrap 5 e componentes estilizados
            </p>
          </div>

          <!-- Tabs de Conteudo -->
          <div class="conteudo-abas">
            <!-- Aba: Botoes Estilizados -->
            <transition name="fade" mode="out-in">
              <div v-if="abaAtiva === 'botoes'" class="aba-conteudo" key="botoes">
                <div class="row">
                  <div class="col-lg-8">
                    <BotaoEstilizado />
                  </div>
                  <div class="col-lg-4">
                    <div class="explicacao-card">
                      <h5><i class="bi bi-book me-2"></i>Como Funciona</h5>
                      <p><strong>CSS Scoped:</strong> Estilos isolados por componente</p>
                      <p><strong>Classes Dinamicas:</strong> :class com arrays e objetos</p>
                      <p><strong>Estilos Inline:</strong> :style com objetos reativos</p>
                      <p><strong>SCSS:</strong> Variaveis, mixins e funcoes</p>
                      <div class="codigo-exemplo">
                        <code>:class="['btn', 'btn-primary']"</code><br>
                        <code>:style="{ color: corTexto }"</code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </transition>

            <!-- Aba: Cards Responsivos -->
            <transition name="fade" mode="out-in">
              <div v-if="abaAtiva === 'cards'" class="aba-conteudo" key="cards">
                <div class="row">
                  <div class="col-12">
                    <CardResponsivo />
                  </div>
                </div>
                <div class="row mt-4">
                  <div class="col-lg-6">
                    <div class="explicacao-card">
                      <h5><i class="bi bi-grid-3x3 me-2"></i>Bootstrap Grid</h5>
                      <p>Sistema de grid de 12 colunas responsivo:</p>
                      <ul>
                        <li><code>col-12</code> - Mobile (100%)</li>
                        <li><code>col-sm-6</code> - Tablet (50%)</li>
                        <li><code>col-md-4</code> - Desktop (33%)</li>
                        <li><code>col-lg-3</code> - Large (25%)</li>
                      </ul>
                    </div>
                  </div>
                  <div class="col-lg-6">
                    <div class="explicacao-card">
                      <h5><i class="bi bi-layout-split me-2"></i>Flexbox & Grid</h5>
                      <p><strong>Flexbox:</strong> Layout unidimensional (linha ou coluna)</p>
                      <p><strong>CSS Grid:</strong> Layout bidimensional (linhas e colunas)</p>
                      <p>Use Flexbox para componentes, Grid para layouts de pagina</p>
                    </div>
                  </div>
                </div>
              </div>
            </transition>

            <!-- Aba: Temas -->
            <transition name="fade" mode="out-in">
              <div v-if="abaAtiva === 'temas'" class="aba-conteudo" key="temas">
                <div class="row">
                  <div class="col-lg-9">
                    <TemaSimples />
                  </div>
                  <div class="col-lg-3">
                    <div class="explicacao-card">
                      <h5><i class="bi bi-palette me-2"></i>CSS Variables</h5>
                      <p>Variaveis CSS (Custom Properties) permitem temas dinamicos:</p>
                      <div class="codigo-exemplo">
                        <code>--cor-primaria: #42b983;</code><br>
                        <code>color: var(--cor-primaria);</code>
                      </div>
                      <p class="mt-3"><strong>Vantagens:</strong></p>
                      <ul>
                        <li>Mudanca de tema em tempo real</li>
                        <li>Menos codigo CSS</li>
                        <li>Mais manutencao</li>
                        <li>Performance otimizada</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </main>
      </div>
    </div>

    <!-- Footer -->
    <footer class="footer mt-5">
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-6">
            <p class="mb-0">
              <i class="bi bi-book me-2"></i>
              <strong>Aula 10:</strong> Estilizacao - CSS Moderno, Bootstrap, SCSS, Responsividade
            </p>
          </div>
          <div class="col-md-6 text-md-end">
            <p class="mb-0">
              <i class="bi bi-github me-2"></i>
              <a href="https://getbootstrap.com/" target="_blank" class="link-footer">Bootstrap 5</a>
              |
              <a href="https://sass-lang.com/" target="_blank" class="link-footer">SCSS</a>
              |
              <a href="https://vuejs.org/" target="_blank" class="link-footer">Vue.js</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import BotaoEstilizado from './components/BotaoEstilizado.vue'
import CardResponsivo from './components/CardResponsivo.vue'
import TemaSimples from './components/TemaSimples.vue'

export default {
  name: 'App',
  components: {
    BotaoEstilizado,
    CardResponsivo,
    TemaSimples
  },
  data() {
    return {
      abaAtiva: 'botoes'
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/variables.scss';

/* Reset e estilos globais */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: $fonte-primaria;
  background: $cinza-100;
  color: $cinza-900;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Navbar customizada */
.navbar {
  box-shadow: $sombra-md;
  
  &.bg-gradient {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  }
  
  .nav-link {
    cursor: pointer;
    transition: all 0.3s ease;
    border-radius: $raio-borda-sm;
    margin: 0 $espacamento-xs;
    
    &:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateY(-2px);
    }
    
    &.active {
      background: rgba(255, 255, 255, 0.2);
      font-weight: 600;
    }
  }
}

/* Sidebar */
.sidebar {
  background: white;
  border-radius: $raio-borda-md;
  padding: $espacamento-lg;
  box-shadow: $sombra-sm;
  position: sticky;
  top: 20px;
  
  .sidebar-titulo {
    color: $cinza-700;
    font-weight: 700;
    margin-bottom: $espacamento-md;
    padding-bottom: $espacamento-sm;
    border-bottom: 2px solid $cinza-200;
  }
  
  .sidebar-menu {
    list-style: none;
    padding: 0;
    
    li {
      padding: $espacamento-sm $espacamento-md;
      margin-bottom: $espacamento-xs;
      cursor: pointer;
      border-radius: $raio-borda-sm;
      transition: all 0.3s ease;
      color: $cinza-700;
      
      i {
        margin-right: $espacamento-sm;
        color: $cor-primaria;
      }
      
      &:hover {
        background: $cinza-100;
        transform: translateX(5px);
      }
      
      &.ativo {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        font-weight: 600;
        
        i {
          color: white;
        }
      }
    }
  }
}

.info-box {
  background: $cinza-100;
  padding: $espacamento-md;
  border-radius: $raio-borda-sm;
  
  h6 {
    color: $cinza-800;
    font-weight: 700;
    margin-bottom: $espacamento-sm;
  }
  
  .info-lista {
    font-size: $tamanho-texto-sm;
    color: $cinza-600;
    padding-left: $espacamento-lg;
    
    li {
      margin-bottom: $espacamento-xs;
    }
  }
}

/* Header da Secao */
.secao-header {
  h1 {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: 700;
  }
}

/* Abas de Conteudo */
.conteudo-abas {
  min-height: 500px;
}

.aba-conteudo {
  animation: fadeIn 0.3s ease;
}

/* Cards de Explicacao */
.explicacao-card {
  background: white;
  border-radius: $raio-borda-md;
  padding: $espacamento-xl;
  box-shadow: $sombra-md;
  height: 100%;
  
  h5 {
    color: $cor-primaria;
    margin-bottom: $espacamento-lg;
    font-weight: 700;
  }
  
  p {
    color: $cinza-700;
    margin-bottom: $espacamento-md;
    line-height: 1.6;
  }
  
  ul {
    color: $cinza-600;
    
    li {
      margin-bottom: $espacamento-xs;
    }
  }
  
  .codigo-exemplo {
    background: $cinza-900;
    padding: $espacamento-md;
    border-radius: $raio-borda-sm;
    margin-top: $espacamento-md;
    
    code {
      color: #61dafb;
      font-family: $fonte-mono;
      font-size: $tamanho-texto-sm;
    }
  }
}

/* Footer */
.footer {
  background: white;
  padding: $espacamento-xl 0;
  border-top: 1px solid $cinza-300;
  margin-top: auto;
  
  p {
    color: $cinza-700;
  }
  
  .link-footer {
    color: $cor-primaria;
    text-decoration: none;
    margin: 0 $espacamento-sm;
    transition: all 0.3s ease;
    
    &:hover {
      color: darken($cor-primaria, 15%);
      text-decoration: underline;
    }
  }
}

/* Transicoes */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsividade Mobile */
@media (max-width: 991px) {
  .sidebar {
    margin-bottom: $espacamento-lg;
  }
  
  .secao-header h1 {
    font-size: 2rem;
  }
  
  .explicacao-card {
    margin-top: $espacamento-lg;
  }
}

@media (max-width: 575px) {
  .navbar-brand {
    font-size: 1rem;
  }
  
  .secao-header h1 {
    font-size: 1.5rem;
  }
  
  .explicacao-card {
    padding: $espacamento-lg;
  }
}
</style>
