<template>
  <div class="blog-list-page">
    
    <nav class="category-filters">
      <router-link to="/blog" class="filter-item">
        Todos os Posts
      </router-link>
      <router-link
        v-for="cat in categories"
        :key="cat.slug"
        :to="`/blog/category/${cat.slug}`"
        class="filter-item"
      >
        {{ cat.name }}
      </router-link>
    </nav>

    <div class="controls-container">
    <div class="search-bar">
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="Buscar posts por título..."
        class="search-input"
      />
    </div>

    <div class="sort-bar">
        <label for="sort-order">Ordenar por:</label>
        <select id="sort-order" v-model="sortOrder" class="sort-select">
          <option value="desc">Mais recentes</option>
          <option value="asc">Mais antigos</option>
        </select>
      </div>
    </div>

    <h1>{{ pageTitle }}</h1>

    <div v-if="filteredPosts.length > 0" class="posts-container">
      <article v-for="post in filteredPosts" :key="post.id" class="post-card">
        <h2>{{ post.title }}</h2>
        <p>{{ truncate(post.content, 100) }}</p>
        <router-link :to="`/blog/${post.id}`" class="read-more">
          Ler mais
        </router-link>
      </article>
    </div>
    
    <div v-else class="no-posts">
      <p>Nenhum post encontrado nesta categoria.</p>
    </div>

  </div>
</template>

<script>
export default {
  name: 'BlogList',
  props: {
    slug: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      allPosts: [],
      categories: [],
      searchQuery: '',
      sortOrder: 'desc'
    }
  },
  created() {
    this.allPosts = JSON.parse(localStorage.getItem('posts') || '[]')
    this.categories = JSON.parse(localStorage.getItem('categories') || '[]')
  },
  
  // *** A CORREÇÃO ESTÁ AQUI ***
  computed: {
    filteredPosts() {
      // 1. Começamos com TODOS os posts publicados
      let posts = this.allPosts.filter(
        post => post.status === 'published'
      );

      // 2. Aplicamos o filtro de Categoria (se existir)
      // Se 'this.slug' tiver um valor (ex: 'tech'), filtramos a lista 'posts'
      if (this.slug) {
        posts = posts.filter(
          post => post.category === this.slug
        )
      }
      
      // 3. Aplicamos o filtro de Busca (se existir)
      //    sobre a lista JÁ FILTRADA pela categoria.
      if (this.searchQuery.trim() !== '') {
        const query = this.searchQuery.toLowerCase().trim();
        posts = posts.filter(
          post => post.title.toLowerCase().includes(query)
        )
      }
      posts.sort((a, b) => {
        // Converte as datas de string para Objeto Date para comparar
        const dateA = new Date(a.publishDate);
        const dateB = new Date(b.publishDate);
        
        if (this.sortOrder === 'asc') {
          // 'asc' (ascendente) = mais antigo primeiro
          return dateA - dateB;
        } else {
          // 'desc' (descendente) = mais novo primeiro
          return dateB - dateA;
        }
      });

      // 4. Retornamos o resultado final que passou por todos os filtros
      return posts
    },

    pageTitle() {
      if (!this.slug) {
        return 'Posts do Blog'
      }
      const category = this.categories.find(cat => cat.slug === this.slug)
      return category ? `Posts em "${category.name}"` : 'Posts do Blog'
    }
  },
  methods: {
    truncate(text, length) {
      if (text.length <= length) {
        return text;
      }
      return text.substring(0, length) + '...';
    }
  }
}
</script>

<style scoped>
.blog-list-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

/* Estilos para os filtros de categoria */
.category-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 25px;
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
}

.filter-item {
  text-decoration: none;
  color: #2c3e50;
  background: #f4f4f4;
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 0.9em;
  transition: all 0.2s;
}

.filter-item:hover {
  background: #e0e0e0;
}

/* Estilo do filtro ATIVO */
.filter-item.router-link-exact-active {
  background: #42b983;
  color: white;
  font-weight: bold;
}
.controls-container {
  display: flex;
  justify-content: space-between; /* Alinha busca e ordenação */
  align-items: center;
  gap: 20px;
  margin-bottom: 25px;
}
.search-bar {
  margin-bottom: 25px;
}

.search-input {
  width: 100%;
  padding: 12px 15px;
  font-size: 1em;
  border: 1px solid #ddd;
  border-radius: 4px;
  /* Garante que o padding não mude a largura total */
  box-sizing: border-box; 
}
.sort-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  /* Faz com que não encolha */
  flex-shrink: 0; 
}

.sort-bar label {
  color: #555;
  font-size: 0.9em;
}

.sort-select {
  padding: 12px 10px; /* Ajustado para ter a mesma altura da busca */
  font-size: 0.9em;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
}

/* Estilos dos cards (baseado no seu print) */
.post-card {
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  padding: 20px;
  margin-bottom: 20px;
}

.post-card h2 {
  margin-top: 0;
}

.post-card p {
  color: #555;
  line-height: 1.6;
}

.read-more {
  color: #42b983;
  text-decoration: none;
  font-weight: bold;
}

.no-posts {
  padding: 20px;
  text-align: center;
  color: #777;
}
</style>