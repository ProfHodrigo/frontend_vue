<template>
  <div id="app">
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-gradient">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">
          <i class="bi bi-rocket-takeoff me-2"></i>
          Aula 11: Build e Deploy
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <a class="nav-link" :class="{ active: abaAtiva === 'ambiente' }" @click="abaAtiva = 'ambiente'" href="#">
                <i class="bi bi-gear me-1"></i>
                Ambiente
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" :class="{ active: abaAtiva === 'build' }" @click="abaAtiva = 'build'" href="#">
                <i class="bi bi-hammer me-1"></i>
                Build
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" :class="{ active: abaAtiva === 'deploy' }" @click="abaAtiva = 'deploy'" href="#">
                <i class="bi bi-cloud-upload me-1"></i>
                Deploy
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
            <h6 class="sidebar-titulo">Topicos</h6>
            <ul class="sidebar-menu">
              <li :class="{ ativo: abaAtiva === 'ambiente' }" @click="abaAtiva = 'ambiente'">
                <i class="bi bi-gear"></i>
                Configuracao
              </li>
              <li :class="{ ativo: abaAtiva === 'build' }" @click="abaAtiva = 'build'">
                <i class="bi bi-hammer"></i>
                Build
              </li>
              <li :class="{ ativo: abaAtiva === 'deploy' }" @click="abaAtiva = 'deploy'">
                <i class="bi bi-cloud-upload"></i>
                Plataformas
              </li>
            </ul>

            <div class="info-box mt-4">
              <h6><i class="bi bi-info-circle me-2"></i>Conceitos</h6>
              <ul class="info-lista">
                <li>Environment Variables</li>
                <li>Build Optimization</li>
                <li>CI/CD Pipelines</li>
                <li>Docker</li>
                <li>Monitoring</li>
              </ul>
            </div>
          </div>
        </aside>

        <!-- Area de Conteudo -->
        <main class="col-lg-10">
          <div class="secao-header mb-4">
            <h1 class="display-5">
              <i class="bi bi-rocket-takeoff me-3"></i>
              Build e Deploy de Aplicacoes Vue.js
            </h1>
            <p class="lead text-muted">
              Prepare, otimize e publique sua aplicacao em producao
            </p>
          </div>

          <!-- Tabs de Conteudo -->
          <div class="conteudo-abas">
            <transition name="fade" mode="out-in">
              <div v-if="abaAtiva === 'ambiente'" class="aba-conteudo" key="ambiente">
                <EnvironmentInfo />
              </div>
            </transition>

            <transition name="fade" mode="out-in">
              <div v-if="abaAtiva === 'build'" class="aba-conteudo" key="build">
                <BuildCommands />
              </div>
            </transition>

            <transition name="fade" mode="out-in">
              <div v-if="abaAtiva === 'deploy'" class="aba-conteudo" key="deploy">
                <DeployPlatforms />
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
              <strong>Aula 11:</strong> Build e Deploy - CI/CD, Docker, Monitoring
            </p>
          </div>
          <div class="col-md-6 text-md-end">
            <p class="mb-0">
              <i class="bi bi-github me-2"></i>
              <a href="https://docs.github.com/actions" target="_blank" class="link-footer">GitHub Actions</a>
              |
              <a href="https://www.netlify.com/" target="_blank" class="link-footer">Netlify</a>
              |
              <a href="https://www.docker.com/" target="_blank" class="link-footer">Docker</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import EnvironmentInfo from './components/EnvironmentInfo.vue'
import BuildCommands from './components/BuildCommands.vue'
import DeployPlatforms from './components/DeployPlatforms.vue'

export default {
  name: 'App',
  components: {
    EnvironmentInfo,
    BuildCommands,
    DeployPlatforms
  },
  data() {
    return {
      abaAtiva: 'ambiente'
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #f8f9fa;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Navbar */
.navbar {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.bg-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
}

.nav-link {
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 4px;
  margin: 0 0.25rem;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.1);
}

.nav-link.active {
  background: rgba(255, 255, 255, 0.2);
  font-weight: 600;
}

/* Sidebar */
.sidebar {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: sticky;
  top: 20px;
}

.sidebar-titulo {
  color: #495057;
  font-weight: 700;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e9ecef;
}

.sidebar-menu {
  list-style: none;
  padding: 0;
}

.sidebar-menu li {
  padding: 0.5rem 1rem;
  margin-bottom: 0.25rem;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s ease;
  color: #495057;
}

.sidebar-menu li i {
  margin-right: 0.5rem;
  color: #667eea;
}

.sidebar-menu li:hover {
  background: #f8f9fa;
  transform: translateX(5px);
}

.sidebar-menu li.ativo {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 600;
}

.sidebar-menu li.ativo i {
  color: white;
}

.info-box {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
}

.info-box h6 {
  color: #343a40;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.info-lista {
  font-size: 0.875rem;
  color: #6c757d;
  padding-left: 1.5rem;
}

.info-lista li {
  margin-bottom: 0.25rem;
}

/* Header da Secao */
.secao-header h1 {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
}

/* Abas */
.conteudo-abas {
  min-height: 500px;
}

.aba-conteudo {
  animation: fadeIn 0.3s ease;
}

/* Footer */
.footer {
  background: white;
  padding: 2rem 0;
  border-top: 1px solid #dee2e6;
  margin-top: auto;
}

.footer p {
  color: #495057;
}

.link-footer {
  color: #667eea;
  text-decoration: none;
  margin: 0 0.5rem;
  transition: all 0.3s ease;
}

.link-footer:hover {
  color: #764ba2;
  text-decoration: underline;
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

/* Responsividade */
@media (max-width: 991px) {
  .sidebar {
    margin-bottom: 1.5rem;
  }
  
  .secao-header h1 {
    font-size: 2rem;
  }
}
</style>
