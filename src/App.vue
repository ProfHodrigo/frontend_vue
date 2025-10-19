<template>
  <div id="app">
    <!-- Barra de Navegação -->
    <nav class="navbar">
      <router-link to="/" class="nav-link">Home</router-link>
      <router-link to="/sobre" class="nav-link">Sobre</router-link>
      <router-link :to="{ name: 'User', params: { id: 1 }}" class="nav-link">
        Usuário 1
      </router-link>
    </nav>

    <!-- Área principal onde os componentes serão renderizados -->
    <main>
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
    </main>

    <!-- Painel de Informações da Rota -->
    <div class="route-info">
      <div class="card">
        <div class="card-header">
          <h4>
            <i class="fas fa-info me-2"></i>
            Informações da Rota Atual
          </h4>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-6">
              <p><strong>Path:</strong> <code>{{ $route.path }}</code></p>
              <p><strong>Name:</strong> <code>{{ $route.name }}</code></p>
              <p><strong>Hash:</strong> <code>{{ $route.hash || 'Nenhum' }}</code></p>
            </div>
            <div class="col-md-6">
              <p><strong>Params:</strong> <code>{{ JSON.stringify($route.params) }}</code></p>
              <p><strong>Query:</strong> <code>{{ JSON.stringify($route.query) }}</code></p>
              <p><strong>Meta:</strong> <code>{{ JSON.stringify($route.meta) }}</code></p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer simples -->
    <footer>
      <p>Prof. Rodrigo Viana - Aula 04 - Vue Router</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App',
  watch: {
    '$route'(to, from) {
      console.log('Rota mudou:', { 
        de: { nome: from.name, params: from.params }, 
        para: { nome: to.name, params: to.params } 
      })
    }
  }
}
</script>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.navbar {
  background-color: #42b983;
  padding: 20px;
  text-align: center;
}

.nav-link {
  color: white;
  text-decoration: none;
  margin: 0 15px;
  font-weight: bold;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.nav-link.router-link-active {
  background-color: rgba(255, 255, 255, 0.3);
}

main {
  flex: 1;
  padding: 20px;
}

footer {
  background-color: #f5f5f5;
  padding: 20px;
  text-align: center;
  color: #666;
}

/* Transições de página */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Painel de informações da rota */
.route-info {
  padding: 20px;
  margin-top: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.route-info .card {
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.route-info .card-header {
  background-color: #42b983;
  color: white;
}

.route-info code {
  background: #fff;
  padding: 2px 6px;
  border-radius: 4px;
  color: #e83e8c;
  font-size: 0.9em;
}
</style>
