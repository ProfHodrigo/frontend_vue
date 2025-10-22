<template>
  <div class="admin-posts">
    <div class="header">
      <h1>Gerenciar Posts</h1>
      <router-link to="/admin/posts/new" class="btn btn-primary">
        Novo Post
      </router-link>
    </div>

    <table class="posts-table">
      <thead>
        <tr>
          <th>Título</th>
          <th>Categoria</th>
          <th>Status</th>
          <th>Data</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="post in posts" :key="post.id">
          <td>{{ post.title }}</td>
          <td>{{ post.category }}</td>
          <td>{{ post.status }}</td>
          <td>{{ post.publishDate }}</td>
          <td>
            <button @click="editPost(post)" class="btn btn-small">
              Editar
            </button>
            <button @click="deletePost(post.id)" class="btn btn-danger btn-small">
              Excluir
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'AdminPosts',
  data() {
    return {
      posts: [],
      categories: []
    }
  },
  created() {
    // Carregar posts do localStorage
    this.posts = JSON.parse(localStorage.getItem('posts') || '[]')
    this.categories = JSON.parse(localStorage.getItem('categories') || '[]')
  },
  methods: {
    getCategoryName(slug) {
      const category = this.categories.find(cat => cat.slug === slug)
      return category ? category.name : (slug || 'Sem Categoria')
    },
    editPost(post) {
      this.$router.push(`/admin/posts/${post.id}/edit`)
    },
    deletePost(id) {
      if (confirm('Tem certeza que deseja excluir este post?')) {
        this.posts = this.posts.filter(post => post.id !== id)
        localStorage.setItem('posts', JSON.stringify(this.posts))
      }
    }
  }
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.posts-table {
  width: 100%;
  border-collapse: collapse;
}

.posts-table th,
.posts-table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.btn-small {
  padding: 4px 8px;
  margin-right: 5px;
}

.btn-danger {
  background: #ff4444;
  color: white;
}
</style>