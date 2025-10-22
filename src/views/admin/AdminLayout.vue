<template>
  <div class="admin-layout">
    <nav class="admin-nav">
      <router-link to="/admin" class="nav-item">Dashboard</router-link>
      <router-link to="/admin/posts" class="nav-item">Posts</router-link>
      <router-link to="/admin/categories" class="nav-item">Categorias</router-link>
      <router-link to="/" class="nav-item">Voltar ao Site</router-link>
    </nav>
    <main class="admin-content">
      <router-view></router-view>
    </main>
  </div>
</template>

<style scoped>
.admin-layout {
  display: grid;
  grid-template-columns: 200px 1fr;
  min-height: 100vh;
}

.admin-nav {
  background: #2c3e50;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.nav-item {
  color: white;
  padding: 10px;
  text-decoration: none;
  margin-bottom: 5px;
}

.nav-item.router-link-active {
  background: #42b983;
  border-radius: 4px;
}

.admin-content {
  padding: 20px;
}
.admin-layout {  
  display: grid;  
  grid-template-columns: 200px 1fr;  
  min-height: 100vh;
}
.admin-nav {  
  background: #2c3e50;  
  padding: 20px;  
  display: flex;  
  flex-direction: column;
}
.nav-item {
  color: white;  
  padding: 10px;  
  text-decoration: none;  
  margin-bottom: 5px;
}
.nav-item.router-link-active {
  background: #42b983;  
  border-radius: 4px;
}
.admin-content {
  padding: 20px;
}
</style>