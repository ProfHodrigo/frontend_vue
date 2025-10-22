<template>
  <div class="home">
    <h1>Bloggerz</h1>
    <router-link to="/blog" class="blog-link">
      Ver todos os posts
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style scoped>
.blog-link {
  display: inline-block;
  padding: 10px 20px;
  background-color: #42b983;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  margin-top: 20px;
}
</style>