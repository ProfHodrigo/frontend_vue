<template>
  <div id="app">
    <!-- Header da aplicação -->
    <header class="bg-primary text-white py-3 mb-4">
      <div class="container">
        <h1 class="mb-0">
          <i class="fas fa-graduation-cap me-2"></i>
          Frontend Vue.js - Aula 3
        </h1>
        <p class="mb-0 opacity-75">Comunicação com API Flask</p>
      </div>
    </header>

    <!-- Conteúdo principal -->
    <div class="container">
      <TesteAPI />
    </div>

    <!-- Footer -->
    <footer class="bg-light text-center py-3 mt-5">
      <div class="container">
        <p class="text-muted mb-0">
          Aula 3 - Comunicação com API | 
          <a href="https://axios-http.com/" target="_blank" class="text-decoration-none">
            Documentação Axios
          </a>
        </p>
      </div>
    </footer>
  </div>
</template>

<script>
import TesteAPI from './components/TesteAPI.vue'

export default {
  name: 'App',
  components: {
    TesteAPI
  }
}
</script>

<style>
/* Estilos globais da aplicação */
body {
  margin: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.container {
  flex: 1;
}

/* Animações suaves */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Estilos customizados */
.card {
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  border: none;
}

.bg-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
}
</style>