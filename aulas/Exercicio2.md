# Exercício 2 — Buscar e Exibir Posts

## Objetivo

Criar um componente chamado `ListaPosts.vue` que:
- Busque posts de uma API
- Exiba os posts em cards estilizados
- Permita filtrar posts por título
- Mostre estado de loading e erro
- Tenha botão para recarregar

---

## API a Utilizar

**Endpoint:** `https://jsonplaceholder.typicode.com/posts`

Este endpoint retorna uma lista de 100 posts com a seguinte estrutura:

```json
{
  "userId": 1,
  "id": 1,
  "title": "Título do post",
  "body": "Conteúdo do post..."
}
```

---

## Requisitos

### 1. Estrutura de Dados

O componente deve ter:

```javascript
data() {
  return {
    carregando: false,
    erro: null,
    posts: [],
    filtro: ''  // Para busca por título
  }
}
```

### 2. Funcionalidades

✅ **Buscar posts ao montar o componente**
- Use o hook `mounted()` para buscar automaticamente

✅ **Exibir lista de posts**
- Use `v-for` para iterar pelos posts
- Mostre título e corpo do post em cards

✅ **Filtro de busca**
- Campo de input com `v-model` ligado a `filtro`
- Use `computed` para filtrar posts por título

✅ **Estados visuais**
- Loading: spinner enquanto carrega
- Erro: mensagem de erro com botão para tentar novamente
- Vazio: mensagem quando não há posts (após filtrar)
- Sucesso: lista de cards

✅ **Botão recarregar**
- Permite buscar os posts novamente

---

## Dicas de Implementação

### Dica 1: Buscar Posts

```javascript
methods: {
  async buscarPosts() {
    this.carregando = true
    this.erro = null
    
    try {
      // Faça a requisição aqui
      // Armazene os dados em this.posts
    } catch (error) {
      // Trate o erro
    } finally {
      this.carregando = false
    }
  }
}
```

### Dica 2: Filtrar Posts

Use uma propriedade computada:

```javascript
computed: {
  postsFiltrados() {
    if (!this.filtro) {
      return this.posts
    }
    return this.posts.filter(post => {
      // Retorne posts cujo título inclui o filtro
      // Dica: use .toLowerCase() para busca case-insensitive
    })
  }
}
```

### Dica 3: Template - Campo de Busca

```vue
<template>
  <div>
    <input 
      v-model="filtro"
      type="text"
      class="form-control mb-3"
      placeholder="Buscar por título..."
    >
    
    <!-- Lista de posts aqui -->
  </div>
</template>
```

### Dica 4: Template - Card de Post

```vue
<div v-for="post in postsFiltrados" :key="post.id" class="card mb-3">
  <div class="card-body">
    <h5 class="card-title">{{ post.title }}</h5>
    <p class="card-text">{{ post.body }}</p>
    <small class="text-muted">Post #{{ post.id }} | User {{ post.userId }}</small>
  </div>
</div>
```

### Dica 5: Limitar Conteúdo do Post

Para não mostrar todo o texto do post, você pode limitar os caracteres:

```vue
<p>{{ post.body.substring(0, 150) }}...</p>
```

Ou criar um método auxiliar:

```javascript
methods: {
  resumo(texto, tamanho = 150) {
    return texto.length > tamanho 
      ? texto.substring(0, tamanho) + '...' 
      : texto
  }
}
```

E usar no template:

```vue
<p>{{ resumo(post.body) }}</p>
```

---

## Estrutura Sugerida do Template

```vue
<template>
  <div class="lista-posts">
    <div class="card">
      <div class="card-header">
        <h3>Posts</h3>
      </div>
      
      <div class="card-body">
        <!-- Botão Recarregar -->
        
        <!-- Campo de Busca -->
        
        <!-- Loading State -->
        <div v-if="carregando">
          <!-- Spinner aqui -->
        </div>
        
        <!-- Error State -->
        <div v-else-if="erro">
          <!-- Mensagem de erro -->
        </div>
        
        <!-- Success State -->
        <div v-else-if="postsFiltrados.length > 0">
          <!-- Lista de cards -->
        </div>
        
        <!-- Empty State -->
        <div v-else>
          <!-- Mensagem: nenhum post encontrado -->
        </div>
      </div>
    </div>
  </div>
</template>
```

---

## Estilos Sugeridos

```vue
<style scoped>
.lista-posts {
  padding: 1rem;
  max-width: 900px;
  margin: 0 auto;
}

.card {
  border: none;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.card-title {
  color: #333;
  font-weight: bold;
  text-transform: capitalize;
}

.card-text {
  color: #666;
  line-height: 1.6;
}
</style>
```

---

## Testando

1. **Teste normal**: Deve carregar e exibir 100 posts

2. **Teste o filtro**: Digite "qui" no campo de busca
   - Deve mostrar apenas posts com "qui" no título

3. **Teste estado vazio**: Digite "xyzabc" (algo que não existe)
   - Deve mostrar mensagem "Nenhum post encontrado"

4. **Teste de erro**: Altere a URL para uma inválida
   - Deve mostrar mensagem de erro

5. **Teste recarregar**: Clique no botão
   - Deve buscar os posts novamente

---

## Conceitos Praticados

✅ Requisições GET com Axios  
✅ Hook `mounted()`  
✅ Computed properties  
✅ Filtro de array  
✅ v-if/v-else para estados  
✅ v-for para listas  
✅ v-model para input  
✅ String methods (substring, includes, toLowerCase)  

---

## Próximo Exercício

**Exercício 3:** Criar um CRUD simples de produtos com:
- Listar
- Criar
- Editar
- Deletar

**Veja dicas em:** `Exercicio3.md`

---

## Recursos Úteis

- [Array.filter()](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
- [String.includes()](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/String/includes)
- [Computed Properties](https://vuejs.org/guide/essentials/computed.html)
- [Lifecycle Hooks](https://vuejs.org/guide/essentials/lifecycle.html)

**Dica:** Se tiver dúvidas, consulte o Exercício 1 como referência!
