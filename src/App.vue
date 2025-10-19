<template>
  <div id="app">
    <!-- Header da aplicação -->
    <header class="bg-primary text-white py-3 mb-4">
      <div class="container">
        <h1 class="mb-0">
          <i class="fas fa-graduation-cap me-2"></i>
          Frontend Vue.js - Aula 5
        </h1>
        <p class="mb-0 opacity-75">Formulários e Validação</p>
      </div>
    </header>

    <!-- Conteúdo principal -->
    <div class="container">
      <div class="row">
        <div class="col-md-9">
          <!-- Formulário principal -->
          <FormularioCompleto />
        </div>
        
        <div class="col-md-3">
          <!-- Sidebar com informações -->
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="fas fa-info-circle me-2"></i>
                Conceitos Abordados
              </h5>
            </div>
            <div class="card-body">
              <ul class="list-unstyled">
                <li><i class="fas fa-check text-success me-2"></i>v-model</li>
                <li><i class="fas fa-check text-success me-2"></i>Validação de Formulários</li>
                <li><i class="fas fa-check text-success me-2"></i>Tratamento de Erros</li>
                <li><i class="fas fa-check text-success me-2"></i>Feedback Visual</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="bg-light text-center py-3 mt-5">
      <div class="container">
        <p class="text-muted mb-0">
          Curso Vue.js - Prof. Rodrigo | 
          <a href="https://vuejs.org/" target="_blank" class="text-decoration-none">
            Documentação Vue.js
          </a>
        </p>
      </div>
    </footer>
  </div>
</template>

<script>
import FormularioCompleto from './components/FormularioCompleto.vue'

export default {
  name: 'App',
  components: {
    FormularioCompleto
  }
}
</script>

<style>
@import 'bootstrap/dist/css/bootstrap.min.css';
@import '@fortawesome/fontawesome-free/css/all.min.css';

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

.card {
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  border: none;
  margin-bottom: 1.5rem;
}

.bg-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
}
</style>
