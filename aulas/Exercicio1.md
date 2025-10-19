# Exercício 1 - Implementando um Sistema de Blog com Vue Router

## Objetivo

Criar um pequeno sistema de blog usando o Vue Router para gerenciar a navegação entre diferentes páginas.

## Passo 1: Configurar o Vue Router

1. Crie a pasta `src/router` se ela não existir.

2. Crie o arquivo `src/router/index.js` com o seguinte conteúdo:

```javascript
import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import BlogList from '@/views/BlogList.vue'
import BlogPost from '@/views/BlogPost.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/blog',
    name: 'BlogList',
    component: BlogList
  },
  {
    path: '/blog/:id',
    name: 'BlogPost',
    component: BlogPost,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
```

## Passo 2: Criar os Componentes

1. Crie a pasta `src/views` se ela não existir.

2. Crie o arquivo `src/views/Home.vue`:

```vue
<template>
  <div class="home">
    <h1>Meu Blog</h1>
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
```

1. Crie o arquivo `src/views/BlogList.vue`:

```vue
<template>
  <div class="blog-list">
    <h2>Posts do Blog</h2>
    <div v-for="post in posts" :key="post.id" class="post-card">
      <h3>{{ post.title }}</h3>
      <p>{{ post.excerpt }}</p>
      <router-link :to="{ name: 'BlogPost', params: { id: post.id }}" class="read-more">
        Ler mais
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BlogList',
  data() {
    return {
      posts: [
        {
          id: 1,
          title: 'Primeiro Post',
          excerpt: 'Uma breve descrição do primeiro post do blog...'
        },
        {
          id: 2,
          title: 'Segundo Post',
          excerpt: 'Uma breve descrição do segundo post do blog...'
        }
      ]
    }
  }
}
</script>

<style scoped>
.post-card {
  border: 1px solid #ddd;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 4px;
}

.read-more {
  color: #42b983;
  text-decoration: none;
}
</style>
```

1. Crie o arquivo `src/views/BlogPost.vue`:

```vue
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
```

## Passo 3: Atualizar o App.vue

1. Atualize o arquivo `src/App.vue`:

```vue
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
```

## Passo 4: Testar o Blog

1. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

1. Acesse o blog e teste a navegação:
   - Clique em "Ver todos os posts" na página inicial
   - Veja a lista de posts
   - Clique em "Ler mais" em um post
   - Use o link "Voltar para lista" para retornar
