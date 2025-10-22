<template>
  <form @submit.prevent="handleSubmit" class="post-form">
    <div class="form-group">
      <label for="title">Título</label>
      <input 
        id="title"
        v-model="form.title"
        type="text"
        required
        class="form-control"
      >
    </div>

    <div class="form-group">
      <label for="content">Conteúdo</label>
      <textarea
        id="content"
        v-model="form.content"
        rows="5"
        required
        class="form-control"
      ></textarea>
    </div>

    <div class="form-group">
      <label for="category">Categoria</label>
      <select 
        id="category"
        v-model="form.category"
        required
        class="form-control"
      >
        <option value="">Selecione uma categoria</option>
        <option 
          v-for="cat in availableCategories" 
          :key="cat.slug" 
          :value="cat.slug">
          {{ cat.name }}
        </option>
      </select>
    </div>

    <div class="form-group">
      <label for="publishDate">Data de Publicação</label>
      <input
        id="publishDate"
        v-model="form.publishDate"
        type="date"
        required
        class="form-control"
      >
    </div>

    <div class="form-group">
      <label for="status">Status</label>
      <select 
        id="status"
        v-model="form.status"
        required
        class="form-control"
      >
        <option value="draft">Rascunho</option>
        <option value="published">Publicado</option>
      </select>
    </div>

    <div class="form-actions">
      <button type="button" @click="$router.back()" class="btn btn-secondary">
        Cancelar
      </button>
      <button type="submit" class="btn btn-primary">
        {{ isEditing ? 'Atualizar Post' : 'Salvar Post' }}
      </button>
    </div>
  </form>
</template>

<script>
export default {
  name: 'PostForm',
  props: {
    // Esta prop é preenchida pela rota '/admin/posts/:id/edit'
    id: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      form: {
        title: '',
        content: '',
        category: '', // Isto agora vai salvar o 'slug' (ex: 'tech')
        publishDate: '',
        status: 'draft'
      },
      // Este array será preenchido com dados do localStorage
      availableCategories: [], 
      isEditing: false
    }
  },
  
  // *** MUDANÇA AQUI ***
  // Adicionado o 'created()' hook.
  // Ele é executado assim que o componente é criado.
  created() {
    // 1. Carrega as categorias do localStorage para o <select>
    this.availableCategories = JSON.parse(localStorage.getItem('categories') || '[]')

    // 2. Verifica se a prop 'id' foi passada (se estamos editando)
    if (this.id) {
      this.isEditing = true
      
      // Carrega os posts e encontra o post certo para editar
      const posts = JSON.parse(localStorage.getItem('posts') || '[]')
      // Usamos '==' pois 'id' da prop é String, e o 'post.id' pode ser Number
      const postToEdit = posts.find(post => post.id == this.id) 
      
      if (postToEdit) {
        // Preenche o 'form' com os dados do post encontrado
        this.form = { ...postToEdit }
      } else {
        console.error('Post não encontrado para edição!')
        this.$router.push('/admin/posts') // Volta para a lista
      }
    }
  },
  methods: {
    // *** MUDANÇA AQUI ***
    // O 'handleSubmit' foi atualizado para lidar com CRIAÇÃO e EDIÇÃO.
    handleSubmit() {
      // Carrega a lista atual de posts
      const posts = JSON.parse(localStorage.getItem('posts') || '[]')
      
      if (this.isEditing) {
        // LÓGICA DE ATUALIZAÇÃO (UPDATE)
        // Encontra o índice do post antigo no array
        const index = posts.findIndex(post => post.id == this.form.id)
        if (index !== -1) {
          // Substitui o post antigo (no índice 'index') pelo post atualizado ('this.form')
          posts.splice(index, 1, this.form)
        }
      } else {
        // LÓGICA DE CRIAÇÃO (CREATE) - a que você já tinha
        // Adiciona um ID ao novo post
        this.form.id = Date.now() 
        posts.push(this.form)
      }

      // Salva o array de posts (seja ele atualizado ou com um novo item)
      localStorage.setItem('posts', JSON.stringify(posts))
            
      // Redireciona de volta para a lista
      this.$router.push('/admin/posts')
    }
  }
}
</script>

<style scoped>
/* Seus estilos permanecem exatamente os mesmos */
.post-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}
.form-group {
  margin-bottom: 20px;
}
.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}
.form-control {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
}
.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.btn-primary {
  background: #42b983;
  color: white;
}
.btn-secondary {
  background: #666;
  color: white;
}
</style>