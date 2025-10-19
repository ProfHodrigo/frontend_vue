# Exercício 2 - Painel Administrativo para o Blog

## Objetivo

Estender o sistema de blog criado no Exercício 1 adicionando funcionalidades administrativas que permitam gerenciar os posts.

## Implementação Passo a Passo

### 1. Área Administrativa

1. Primeiro, crie os componentes necessários para a área administrativa:

```bash
src/
  views/
    admin/
      AdminLayout.vue
      AdminHome.vue
      AdminPosts.vue
```

1. Crie o arquivo `src/views/admin/AdminLayout.vue`:

```vue
<template>
  <div class="admin-layout">
    <nav class="admin-nav">
      <router-link to="/admin" class="nav-item">Dashboard</router-link>
      <router-link to="/admin/posts" class="nav-item">Posts</router-link>
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
</style>
```

1. Atualize o arquivo `src/router/index.js` para incluir as rotas administrativas:

```javascript
import AdminLayout from '@/views/admin/AdminLayout.vue'
import AdminHome from '@/views/admin/AdminHome.vue'
import AdminPosts from '@/views/admin/AdminPosts.vue'

const routes = [
  // ... rotas existentes ...

  {
    path: '/admin',
    component: AdminLayout,
    children: [
      {
        path: '',
        name: 'AdminHome',
        component: AdminHome
      },
      {
        path: 'posts',
        name: 'AdminPosts',
        component: AdminPosts
      }
    ],
    beforeEnter: (to, from, next) => {
      // Simples simulação de autenticação
      const isAuthenticated = localStorage.getItem('isAdmin')
      if (isAuthenticated) {
        next()
      } else {
        next('/')
      }
    }
  }
]
```

### 2. Formulário de Posts

1. Crie o componente `src/components/admin/PostForm.vue`:

```vue
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
        <option value="tech">Tecnologia</option>
        <option value="life">Lifestyle</option>
        <option value="code">Programação</option>
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
        Salvar Post
      </button>
    </div>
  </form>
</template>

<script>
export default {
  name: 'PostForm',
  data() {
    return {
      form: {
        title: '',
        content: '',
        category: '',
        publishDate: '',
        status: 'draft'
      }
    }
  },
  methods: {
    handleSubmit() {
      // Aqui você implementaria a lógica para salvar o post
      console.log('Dados do formulário:', this.form)
      
      // Simular salvamento
      const posts = JSON.parse(localStorage.getItem('posts') || '[]')
      posts.push({
        id: Date.now(),
        ...this.form
      })
      localStorage.setItem('posts', JSON.stringify(posts))
      
      // Redirecionar para lista de posts
      this.$router.push('/admin/posts')
    }
  }
}
</script>

<style scoped>
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
```

1. Atualize o componente `src/views/admin/AdminPosts.vue`:

```vue
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
      posts: []
    }
  },
  created() {
    // Carregar posts do localStorage
    this.posts = JSON.parse(localStorage.getItem('posts') || '[]')
  },
  methods: {
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
```

1. Atualize novamente o `src/router/index.js` para incluir as rotas do formulário:

```javascript
// ... imports anteriores ...
import PostForm from '@/components/admin/PostForm.vue'

const routes = [
  // ... rotas anteriores ...
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      // ... rotas admin anteriores ...
      {
        path: 'posts/new',
        name: 'AdminPostNew',
        component: PostForm
      },
      {
        path: 'posts/:id/edit',
        name: 'AdminPostEdit',
        component: PostForm,
        props: true
      }
    ]
  }
]
```

### 3. Sistema de Categorias

Implemente um sistema de categorias que permita:

- Listar categorias existentes
- Adicionar novas categorias
- Associar posts a categorias
- Filtrar posts por categoria na listagem

### 4. Sistema de Busca

Adicione funcionalidade de busca que permita:

- Buscar posts por título
- Filtrar por categoria
- Ordenar por data
- Mostrar resultados em tempo real

## Dicas de Implementação

1. **Estrutura de Rotas**:
   - Use rotas aninhadas para a área administrativa
   - Implemente guard routes para proteger a área administrativa
   - Considere lazy loading para componentes administrativos

2. **Gerenciamento de Estado**:
   - Planeje como os dados serão armazenados
   - Considere usar o localStorage para persistir dados
   - Organize os dados em uma estrutura clara

3. **Componentes Sugeridos**:
   - AdminLayout.vue
   - PostForm.vue
   - CategoryManager.vue
   - SearchBar.vue

4. **UX Considerations**:
   - Forneça feedback para ações do usuário
   - Implemente validações nos formulários
   - Adicione confirmações para ações de delete
