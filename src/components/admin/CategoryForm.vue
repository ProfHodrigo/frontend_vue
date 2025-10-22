<template>
  <form @submit.prevent="handleSubmit" class="category-form">
    <div class="form-group">
      <label for="name">Nome da Categoria</label>
      <input
        id="name"
        v-model="form.name"
        type="text"
        required
        class="form-control"
        placeholder="Ex: Tecnologia"
      />
    </div>

    <div class="form-group">
      <label for="slug">Slug (URL)</label>
      <input
        id="slug"
        v-model="form.slug"
        type="text"
        required
        class="form-control"
        placeholder="Ex: tecnologia (sem espaços ou acentos)"
      />
    </div>

    <div class="form-actions">
      <button type="button" @click="$router.back()" class="btn btn-secondary">
        Cancelar
      </button>
      <button type="submit" class="btn btn-primary">
        {{ isEditing ? 'Atualizar Categoria' : 'Criar Categoria' }}
      </button>
    </div>
  </form>
</template>

<script>
export default {
  name: 'CategoryForm',
  props: {
    // Esta prop será preenchida pelo Vue Router quando estivermos editando
    // graças ao 'props: true' na rota
    id: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      form: {
        id: null,
        name: '',
        slug: ''
      },
      categories: [],
      isEditing: false
    }
  },
  created() {
    // 1. Carregar as categorias existentes
    this.categories = JSON.parse(localStorage.getItem('categories') || '[]')

    // 2. Verificar se é uma edição
    if (this.id) {
      this.isEditing = true
      // Encontrar a categoria que está sendo editada
      const categoryToEdit = this.categories.find(
        // O ID da prop vem como String, o ID no objeto pode ser número
        cat => cat.id == this.id 
      )
      
      if (categoryToEdit) {
        // Preencher o formulário com os dados existentes
        this.form = { ...categoryToEdit }
      } else {
        console.error('Categoria não encontrada!')
        this.$router.push('/admin/categories')
      }
    }
  },
  methods: {
    handleSubmit() {
      if (this.isEditing) {
        // Lógica de ATUALIZAÇÃO (Update)
        // Encontrar o índice da categoria antiga no array
        const index = this.categories.findIndex(cat => cat.id == this.form.id)
        if (index !== -1) {
          // Substituir a categoria antiga pela nova (atualizada)
          this.categories.splice(index, 1, this.form)
        }
      } else {
        // Lógica de CRIAÇÃO (Create)
        this.form.id = Date.now() // Gerar um ID único
        this.categories.push(this.form)
      }

      // Salvar o array de categorias atualizado no localStorage
      localStorage.setItem('categories', JSON.stringify(this.categories))

      // Redirecionar de volta para a lista
      this.$router.push('/admin/categories')
    }
  }
}
</script>

<style scoped>
/* Estilos identicos aos do seu PostForm para consistência */
.category-form {
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