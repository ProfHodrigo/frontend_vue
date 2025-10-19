<template>
  <div class="about">
    <h1>Sobre</h1>
    <div class="content">
      <p>Esta é uma página de demonstração do Vue Router.</p>
      <p>Aqui demonstramos como criar e navegar entre diferentes páginas em uma SPA.</p>
    </div>
    
    <button @click="voltar" class="nav-button">
      Voltar para Home
    </button>
  </div>
</template>

<script>
export default {
  name: 'About',
  methods: {
    voltar() {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.about {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

.content {
  margin: 20px 0;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.nav-button {
  padding: 8px 16px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.nav-button:hover {
  opacity: 0.9;
}
</style>