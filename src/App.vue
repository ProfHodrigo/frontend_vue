<template>
  <div id="app">
    <nav class="nav">
      <router-link to="/" class="nav-link">Home</router-link>
      <router-link to="/blog" class="nav-link">Blog</router-link>
    </nav>

    <main class="main-content">
      <router-view></router-view>
    </main>
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
#app {
  font-family: Arial, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.nav {
  margin-bottom: 30px;
  padding: 10px 0;
  border-bottom: 1px solid #ddd;
}

.nav-link {
  margin-right: 15px;
  text-decoration: none;
  color: #2c3e50;
}

.nav-link.router-link-active {
  color: #42b983;
}

.main-content {
  padding: 20px;
}
</style>
