<template>
  <div class="blog-post">
    <router-link to="/blog" class="back-link">
      ← Voltar para lista
    </router-link>

    <div v-if="post" class="post-content">
      <h2>{{ post.title }}</h2>
      <div class="post-meta">
        <span>Por {{ post.author }}</span>
        <span>{{ post.date }}</span>
      </div>
      <p>{{ post.content }}</p>
    </div>
    <div v-else>
      <p>Post não encontrado</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BlogPost',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      post: null
    }
  },
  created() {
    // Simula busca do post pelo ID
    this.post = {
      id: this.id,
      title: `Post ${this.id}`,
      author: 'Rodrigo Viana',
      date: '18/10/2025',
      content: 'Conteúdo completo do post...'
    }
  }
}
</script>

<style scoped>
.back-link {
  display: inline-block;
  margin-bottom: 20px;
  color: #42b983;
  text-decoration: none;
}

.post-content {
  max-width: 800px;
  margin: 0 auto;
}

.post-meta {
  color: #666;
  margin-bottom: 20px;
}

.post-meta span {
  margin-right: 15px;
}
</style>