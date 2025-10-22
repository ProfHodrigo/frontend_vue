<template>
  <div class="admin-categories">
    <div class="header">
      <h1>Gerenciar Categorias</h1>
      <router-link to="/admin/categories/new" class="btn btn-primary">
        Nova Categoria
      </router-link>
    </div>

    <table class="categories-table">
      <thead>
        <tr>
          <th>Nome da Categoria</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="category in categories" :key="category.id">
          <td>{{ category.name }}</td>
          <td>
            <button @click="editCategory(category)" class="btn btn-small">
              Editar
            </button>
            <button @click="deleteCategory(category.id)" class="btn btn-danger btn-small">
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
  name: 'AdminCategories',
  data() {
    return {
      categories: []
    }
  },
  created() {
    // Carregar categorias do localStorage
    let categoriesData = localStorage.getItem('categories')
    
    // Para fins de teste, se não houver nada, vamos popular com as categorias
    // que você já tinha no seu formulário de post.
    if (!categoriesData) {
      const initialCategories = [
        { id: 1, name: 'Tecnologia', slug: 'tech' },
        { id: 2, name: 'Lifestyle', slug: 'life' },
        { id: 3, name: 'Programação', slug: 'code' }
      ]
      localStorage.setItem('categories', JSON.stringify(initialCategories))
      categoriesData = JSON.stringify(initialCategories)
    }
    
    this.categories = JSON.parse(categoriesData)
  },
  methods: {
    editCategory(category) {
      // Leva para a rota de edição, que criaremos depois
      this.$router.push(`/admin/categories/${category.id}/edit`)
    },
    deleteCategory(id) {
      if (confirm('Tem certeza que deseja excluir esta categoria? Isso pode afetar posts existentes.')) {
        // Filtra a categoria fora do array
        this.categories = this.categories.filter(cat => cat.id !== id)
        // Atualiza o localStorage
        localStorage.setItem('categories', JSON.stringify(this.categories))
      }
    }
  }
}
</script>

<style scoped>
/* Você pode reusar os mesmos estilos do AdminPosts ou criar novos */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.categories-table {
  width: 100%;
  border-collapse: collapse;
}

.categories-table th,
.categories-table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
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
  text-decoration: none;
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