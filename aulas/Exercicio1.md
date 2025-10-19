# Exercício 1 - Implementando um Sistema de Blog com Vue Router# Exercício 1 — Sua Primeira Requisição com Axios (COMPLETO)



Neste exercício, você irá criar um pequeno sistema de blog usando o Vue Router.## Objetivo



## Passo 1: Configurar o Vue RouterNeste exercício você vai **aprender na prática** como fazer nossa primeira requisição HTTP usando Axios. Vamos criar um componente simples que busca dados de uma API pública e exibe na tela.



1. Crie a pasta `src/router` se ela não existir.**Este é um guia completo e detalhado!** Seguindo cada passo teremos um componente funcionando ao final.



2. Crie o arquivo `src/router/index.js` com o seguinte conteúdo:---



```javascript## O que vamos fazer?

import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/views/Home.vue'Criar um componente chamado `BuscadorUsuario.vue` que:

import BlogList from '@/views/BlogList.vue'- ✅ Busca informações de usuários de uma API pública

import BlogPost from '@/views/BlogPost.vue'- ✅ Exibe os dados em um card bonito

- ✅ Mostra loading enquanto carrega

const routes = [- ✅ Trata erros se algo der errado

  {- ✅ Tem um botão para buscar um novo usuário aleatório

    path: '/',

    name: 'Home',---

    component: Home

  },## API que vamos usar

  {

    path: '/blog',**API Pública:** `https://randomuser.me/api/`

    name: 'BlogList',

    component: BlogListEsta API retorna dados de usuários fictícios.

  },

  {**Exemplo de resposta:**

    path: '/blog/:id',```json

    name: 'BlogPost',{

    component: BlogPost,  "results": [

    props: true    {

  }      "name": {

]        "first": "João",

        "last": "Silva"

const router = createRouter({      },

  history: createWebHistory(),      "email": "joao.silva@example.com",

  routes      "phone": "(11) 98765-4321",

})      "picture": {

        "large": "https://..."

export default router      },

```      "location": {

        "city": "São Paulo",

## Passo 2: Criar os Componentes        "country": "Brazil"

      }

1. Crie a pasta `src/views` se ela não existir.    }

  ]

2. Crie o arquivo `src/views/Home.vue`:}

```

```vue

<template>---

  <div class="home">

    <h1>Meu Blog</h1>## 🚀 Passo 1: Instalar o Axios

    <router-link to="/blog" class="blog-link">

      Ver todos os postsPrimeiro, precisamos instalar o Axios no projeto.

    </router-link>

  </div>Abra o terminal e execute:

</template>

```bash

<script>npm install axios

export default {```

  name: 'Home'

}Aguarde a instalação terminar. Você verá algo como:

</script>```

added 1 package, and audited X packages in Xs

<style scoped>```

.blog-link {

  display: inline-block;✅ **Pronto!** O Axios está instalado e pronto para usar.

  padding: 10px 20px;

  background-color: #42b983;---

  color: white;

  text-decoration: none;## Passo 2: Criar o arquivo do componente

  border-radius: 4px;

  margin-top: 20px;Crie um novo arquivo chamado `BuscadorUsuario.vue` dentro da pasta `src/components/`.

}

</style>**Caminho:** `src/components/BuscadorUsuario.vue`

```

---

3. Crie o arquivo `src/views/BlogList.vue`:

## Passo 3: Estrutura Básica do Template

```vue

<template>Vamos começar pelo template (a parte visual do componente).

  <div class="blog-list">

    <h2>Posts do Blog</h2>Cole este código no arquivo `BuscadorUsuario.vue`:

    <div v-for="post in posts" :key="post.id" class="post-card">

      <h3>{{ post.title }}</h3>```vue

      <p>{{ post.excerpt }}</p><template>

      <router-link :to="{ name: 'BlogPost', params: { id: post.id }}" class="read-more">  <div class="buscador-usuario">

        Ler mais    <div class="card">

      </router-link>      <!-- Cabeçalho -->

    </div>      <div class="card-header">

  </div>        <h2>Buscador de Usuários</h2>

</template>        <p class="subtitle">Buscando usuários aleatórios da API</p>

      </div>

<script>

export default {      <div class="card-body">

  name: 'BlogList',        <!-- Botão para buscar -->

  data() {        <button 

    return {          @click="buscarUsuario" 

      posts: [          class="btn btn-primary"

        {          :disabled="carregando"

          id: 1,        >

          title: 'Primeiro Post',          {{ carregando ? 'Buscando...' : 'Buscar Usuário Aleatório' }}

          excerpt: 'Uma breve descrição do primeiro post do blog...'        </button>

        },

        {        <!-- Estado: Carregando -->

          id: 2,        <div v-if="carregando" class="loading">

          title: 'Segundo Post',          <div class="spinner"></div>

          excerpt: 'Uma breve descrição do segundo post do blog...'          <p>Carregando dados do usuário...</p>

        }        </div>

      ]

    }        <!-- Estado: Erro -->

  }        <div v-else-if="erro" class="alert alert-danger">

}          <h4>Ops! Algo deu errado</h4>

</script>          <p>{{ erro }}</p>

          <button @click="buscarUsuario" class="btn btn-secondary">

<style scoped>            Tentar Novamente

.post-card {          </button>

  border: 1px solid #ddd;        </div>

  padding: 15px;

  margin-bottom: 15px;        <!-- Estado: Sucesso - Exibir Usuário -->

  border-radius: 4px;        <div v-else-if="usuario" class="usuario-card">

}          <img :src="usuario.foto" :alt="usuario.nome" class="usuario-foto">

.read-more {          

  color: #42b983;          <div class="usuario-info">

  text-decoration: none;            <h3>{{ usuario.nome }}</h3>

}            

</style>            <div class="info-item">

```              <span class="icon">📧</span>

              <span>{{ usuario.email }}</span>

4. Crie o arquivo `src/views/BlogPost.vue`:            </div>

            

```vue            <div class="info-item">

<template>              <span class="icon">📱</span>

  <div class="blog-post">              <span>{{ usuario.telefone }}</span>

    <router-link to="/blog" class="back-link">            </div>

      ← Voltar para lista            

    </router-link>            <div class="info-item">

                  <span class="icon">📍</span>

    <div v-if="post" class="post-content">              <span>{{ usuario.cidade }}, {{ usuario.pais }}</span>

      <h2>{{ post.title }}</h2>            </div>

      <div class="post-meta">          </div>

        <span>Por {{ post.author }}</span>        </div>

        <span>{{ post.date }}</span>

      </div>        <!-- Estado: Inicial (sem dados ainda) -->

      <p>{{ post.content }}</p>        <div v-else class="inicial">

    </div>          <p>Clique no botão para buscar um usuário.</p>

    <div v-else>        </div>

      <p>Post não encontrado</p>      </div>

    </div>    </div>

  </div>  </div>

</template></template>

```

<script>

export default {**Explicação do template:**

  name: 'BlogPost',- `@click="buscarUsuario"`: Quando clicar no botão, chama a função `buscarUsuario()`

  props: {- `:disabled="carregando"`: Desabilita o botão enquanto está carregando

    id: {- `v-if="carregando"`: Mostra loading quando `carregando` for `true`

      type: String,- `v-else-if="erro"`: Mostra erro se existir

      required: true- `v-else-if="usuario"`: Mostra os dados quando tiver usuário

    }- `v-else`: Mostra mensagem inicial

  },

  data() {---

    return {

      post: null## Passo 4: Script do Componente

    }

  },Agora vamos adicionar a lógica JavaScript. Cole este código logo após o `</template>`:

  created() {

    // Simula busca do post pelo ID```vue

    this.post = {<script>

      id: this.id,import axios from 'axios'

      title: `Post ${this.id}`,

      author: 'John Doe',export default {

      date: '18/10/2025',  name: 'BuscadorUsuario',

      content: 'Conteúdo completo do post...'  

    }  data() {

  }    return {

}      // Estado de loading

</script>      carregando: false,

      

<style scoped>      // Mensagem de erro (se houver)

.back-link {      erro: null,

  display: inline-block;      

  margin-bottom: 20px;      // Dados do usuário

  color: #42b983;      usuario: null

  text-decoration: none;    }

}  },

.post-content {

  max-width: 800px;  // Busca um usuário quando o componente é montado

  margin: 0 auto;  mounted() {

}    this.buscarUsuario()

.post-meta {  },

  color: #666;

  margin-bottom: 20px;  methods: {

}    async buscarUsuario() {

.post-meta span {      // 1. Inicia o estado de carregamento

  margin-right: 15px;      this.carregando = true

}      this.erro = null

</style>      this.usuario = null

```

      try {

## Passo 3: Atualizar o App.vue        // 2. Faz a requisição para a API

        const response = await axios.get('https://randomuser.me/api/')

1. Atualize o arquivo `src/App.vue`:        

        // 3. Extrai os dados do primeiro usuário

```vue        const dadosApi = response.data.results[0]

<template>        

  <div id="app">        // 4. Organiza os dados em um formato mais simples

    <nav class="nav">        this.usuario = {

      <router-link to="/" class="nav-link">Home</router-link>          nome: `${dadosApi.name.first} ${dadosApi.name.last}`,

      <router-link to="/blog" class="nav-link">Blog</router-link>          email: dadosApi.email,

    </nav>          telefone: dadosApi.phone,

              cidade: dadosApi.location.city,

    <main class="main-content">          pais: dadosApi.location.country,

      <router-view></router-view>          foto: dadosApi.picture.large

    </main>        }

  </div>

</template>        console.log('✅ Usuário carregado:', this.usuario)



<style>      } catch (error) {

#app {        // 5. Captura e trata erros

  font-family: Arial, sans-serif;        console.error('❌ Erro ao buscar usuário:', error)

  max-width: 1200px;        

  margin: 0 auto;        if (error.response) {

  padding: 20px;          // Erro retornado pela API

}          this.erro = `Erro ${error.response.status}: ${error.response.statusText}`

        } else if (error.request) {

.nav {          // Requisição foi feita mas não houve resposta

  margin-bottom: 30px;          this.erro = 'Não foi possível conectar à API. Verifique sua internet.'

  padding: 10px 0;        } else {

  border-bottom: 1px solid #ddd;          // Outro tipo de erro

}          this.erro = `Erro: ${error.message}`

        }

.nav-link {

  margin-right: 15px;      } finally {

  text-decoration: none;        // 6. Finaliza o estado de carregamento (sempre executa)

  color: #2c3e50;        this.carregando = false

}      }

    }

.nav-link.router-link-active {  }

  color: #42b983;}

}</script>

```

.main-content {

  padding: 20px;**Explicação do script:**

}

</style>### Data (Dados Reativos)

``````javascript

data() {

## Passo 4: Testar o Blog  return {

    carregando: false,  // Controla se está fazendo requisição

1. Inicie o servidor de desenvolvimento:    erro: null,         // Armazena mensagem de erro

```bash    usuario: null       // Armazena dados do usuário

npm run dev  }

```}

```

2. Acesse o blog e teste a navegação:

   - Clique em "Ver todos os posts" na página inicial### Mounted (Hook de Ciclo de Vida)

   - Veja a lista de posts```javascript

   - Clique em "Ler mais" em um postmounted() {

   - Use o link "Voltar para lista" para retornar  this.buscarUsuario()  // Busca um usuário assim que o componente aparecer

}

## Desafios Extras```



1. Adicione mais posts ao blog### Método buscarUsuario()

2. Implemente uma busca de posts

3. Adicione categorias aos posts**Passo a passo do que acontece:**

4. Crie um formulário para adicionar novos posts
1. **Prepara o estado:**
   - `carregando = true` → Mostra loading
   - `erro = null` → Limpa erro anterior
   - `usuario = null` → Limpa usuário anterior

2. **Faz a requisição:**
   - `await axios.get(...)` → Busca dados da API
   - `await` espera a resposta chegar

3. **Processa a resposta:**
   - `response.data.results[0]` → Pega o primeiro usuário
   - Organiza os dados em um objeto mais simples

4. **Trata erros:**
   - `try/catch` captura qualquer erro
   - Diferentes tipos de erro recebem mensagens diferentes

5. **Finaliza:**
   - `finally` sempre executa
   - `carregando = false` → Esconde loading

---

## Passo 5: Estilos

Agora vamos deixar bonito! Cole este CSS após o `</script>`:

```vue
<style scoped>
.buscador-usuario {
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
}

.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  text-align: center;
}

.card-header h2 {
  margin: 0;
  font-size: 1.8rem;
}

.subtitle {
  margin: 0.5rem 0 0 0;
  opacity: 0.9;
  font-size: 0.9rem;
}

.card-body {
  padding: 2rem;
}

/* Botão */
.btn {
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 1.5rem;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #6c757d;
  color: white;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  width: auto;
}

.btn-secondary:hover {
  background: #5a6268;
}

/* Loading */
.loading {
  text-align: center;
  padding: 2rem;
}

.spinner {
  width: 50px;
  height: 50px;
  margin: 0 auto 1rem;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Estado de Erro */
.alert {
  padding: 1.5rem;
  border-radius: 8px;
  margin-top: 1rem;
}

.alert-danger {
  background: #f8d7da;
  border: 1px solid #f5c2c7;
  color: #842029;
}

.alert h4 {
  margin: 0 0 0.5rem 0;
}

.alert p {
  margin: 0 0 1rem 0;
}

/* Card do Usuário */
.usuario-card {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
}

.usuario-foto {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 5px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin-bottom: 1.5rem;
}

.usuario-info h3 {
  margin: 0 0 1.5rem 0;
  color: #333;
  font-size: 1.8rem;
}

.info-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: white;
  border-radius: 8px;
  margin-bottom: 0.75rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.icon {
  font-size: 1.2rem;
}

.info-item span:last-child {
  color: #555;
  font-size: 1rem;
}

/* Estado Inicial */
.inicial {
  text-align: center;
  padding: 3rem 1rem;
  color: #666;
  font-size: 1.1rem;
}
</style>
```

---

## Passo 6: Usar o Componente

Agora precisamos adicionar o componente no `App.vue` para vê-lo funcionando.

Abra o arquivo `src/App.vue` e substitua todo o conteúdo por:

```vue
<template>
  <div id="app">
    <BuscadorUsuario />
  </div>
</template>

<script>
import BuscadorUsuario from './components/BuscadorUsuario.vue'

export default {
  name: 'App',
  components: {
    BuscadorUsuario
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 2rem 0;
}

#app {
  width: 100%;
}
</style>
```

---

## ▶Passo 7: Executar o Projeto

Agora vamos ver tudo funcionando!

No terminal, execute:

```bash
npm run dev
```

Abra o navegador em `http://localhost:5173` (ou a URL que aparecer no terminal).

---

## O que você deve ver

1. **Ao carregar a página:**
   - Um card roxo bonito com título
   - Um spinner de loading aparecendo brevemente
   - Os dados de um usuário aleatório sendo exibidos

2. **Ao clicar em "Buscar Usuário Aleatório":**
   - O botão fica desabilitado
   - Aparece um loading
   - Um novo usuário é carregado e exibido

3. **Cada usuário mostra:**
   - Foto
   - Nome completo
   - Email
   - Telefone
   - Cidade e país

---

## Testes para Fazer

### Teste 1: Funcionamento Normal
1. Abra a página
2. Clique no botão várias vezes
3. Cada vez deve mostrar um usuário diferente

### Teste 2: Ver o Loading
1. Abra o DevTools (F12)
2. Vá em Network > Throttling
3. Selecione "Slow 3G"
4. Clique no botão
5. Você verá o spinner por mais tempo

### Teste 3: Console do Navegador
1. Abra o DevTools (F12)
2. Vá na aba Console
3. Clique no botão
4. Você verá: `Uusário carregado: {...}`

### Teste 4: Ver a Requisição
1. Abra o DevTools (F12)
2. Vá na aba Network
3. Clique no botão
4. Você verá a requisição para `randomuser.me`
5. Clique nela e veja a resposta JSON

### Teste 5: Simular Erro
1. No código, troque a URL para: `'https://api-invalida.com'`
2. Salve o arquivo
3. Recarregue a página
4. Você verá a mensagem de erro
5. Clique em "Tentar Novamente"

---

### Boas Práticas
- Sempre ter 3 estados: loading, erro e sucesso
- Tratar diferentes tipos de erros
- Usar `finally` para código que sempre deve executar
- Desabilitar botões durante loading
- Mensagens de erro amigáveis para o usuário
- Console.log para debug

### Estados Assíncronos
```javascript
// 1. Antes da requisição
carregando = true
erro = null

// 2. Durante a requisição
await axios.get(...)

// 3a. Se der certo
usuario = dados

// 3b. Se der erro
erro = mensagem

// 4. Sempre no final
carregando = false
```

---


## Código Completo

Se tiver dúvidas, aqui está o código completo do componente:

<details>
<summary> Clique para ver o código completo</summary>

```vue
<template>
  <div class="buscador-usuario">
    <div class="card">
      <div class="card-header">
        <h2>Buscador de Usuários</h2>
        <p class="subtitle">Buscando usuários aleatórios da API</p>
      </div>

      <div class="card-body">
        <button 
          @click="buscarUsuario" 
          class="btn btn-primary"
          :disabled="carregando"
        >
          {{ carregando ? 'Buscando...' : 'Buscar Usuário Aleatório' }}
        </button>

        <div v-if="carregando" class="loading">
          <div class="spinner"></div>
          <p>Carregando dados do usuário...</p>
        </div>

        <div v-else-if="erro" class="alert alert-danger">
          <h4>Ops! Algo deu errado</h4>
          <p>{{ erro }}</p>
          <button @click="buscarUsuario" class="btn btn-secondary">
            Tentar Novamente
          </button>
        </div>

        <div v-else-if="usuario" class="usuario-card">
          <img :src="usuario.foto" :alt="usuario.nome" class="usuario-foto">
          
          <div class="usuario-info">
            <h3>{{ usuario.nome }}</h3>
            
            <div class="info-item">
              <span class="icon">📧</span>
              <span>{{ usuario.email }}</span>
            </div>
            
            <div class="info-item">
              <span class="icon">📱</span>
              <span>{{ usuario.telefone }}</span>
            </div>
            
            <div class="info-item">
              <span class="icon">📍</span>
              <span>{{ usuario.cidade }}, {{ usuario.pais }}</span>
            </div>
          </div>
        </div>

        <div v-else class="inicial">
          <p>Clique no botão para buscar um usuário.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'BuscadorUsuario',
  
  data() {
    return {
      carregando: false,
      erro: null,
      usuario: null
    }
  },

  mounted() {
    this.buscarUsuario()
  },

  methods: {
    async buscarUsuario() {
      this.carregando = true
      this.erro = null
      this.usuario = null

      try {
        const response = await axios.get('https://randomuser.me/api/')
        const dadosApi = response.data.results[0]
        
        this.usuario = {
          nome: `${dadosApi.name.first} ${dadosApi.name.last}`,
          email: dadosApi.email,
          telefone: dadosApi.phone,
          cidade: dadosApi.location.city,
          pais: dadosApi.location.country,
          foto: dadosApi.picture.large
        }

        console.log('✅ Usuário carregado:', this.usuario)

      } catch (error) {
        console.error('❌ Erro ao buscar usuário:', error)
        
        if (error.response) {
          this.erro = `Erro ${error.response.status}: ${error.response.statusText}`
        } else if (error.request) {
          this.erro = 'Não foi possível conectar à API. Verifique sua internet.'
        } else {
          this.erro = `Erro: ${error.message}`
        }

      } finally {
        this.carregando = false
      }
    }
  }
}
</script>

<style scoped>
.buscador-usuario {
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
}

.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  text-align: center;
}

.card-header h2 {
  margin: 0;
  font-size: 1.8rem;
}

.subtitle {
  margin: 0.5rem 0 0 0;
  opacity: 0.9;
  font-size: 0.9rem;
}

.card-body {
  padding: 2rem;
}

.btn {
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 1.5rem;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #6c757d;
  color: white;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  width: auto;
}

.btn-secondary:hover {
  background: #5a6268;
}

.loading {
  text-align: center;
  padding: 2rem;
}

.spinner {
  width: 50px;
  height: 50px;
  margin: 0 auto 1rem;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.alert {
  padding: 1.5rem;
  border-radius: 8px;
  margin-top: 1rem;
}

.alert-danger {
  background: #f8d7da;
  border: 1px solid #f5c2c7;
  color: #842029;
}

.alert h4 {
  margin: 0 0 0.5rem 0;
}

.alert p {
  margin: 0 0 1rem 0;
}

.usuario-card {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
}

.usuario-foto {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 5px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin-bottom: 1.5rem;
}

.usuario-info h3 {
  margin: 0 0 1.5rem 0;
  color: #333;
  font-size: 1.8rem;
}

.info-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: white;
  border-radius: 8px;
  margin-bottom: 0.75rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.icon {
  font-size: 1.2rem;
}

.info-item span:last-child {
  color: #555;
  font-size: 1rem;
}

.inicial {
  text-align: center;
  padding: 3rem 1rem;
  color: #666;
  font-size: 1.1rem;
}
</style>
```

</details>

---

## Problemas Comuns

### Erro: "Cannot find module 'axios'"
**Solução:** Execute `npm install axios`

### Erro: "localhost refused to connect"
**Solução:** Execute `npm run dev` para iniciar o servidor

### Componente não aparece
**Solução:** Verifique se importou corretamente no `App.vue`

### Dados não aparecem
**Solução:** Abra o Console (F12) e veja se tem erros

### CORS Error
**Não é problema!** A API Random User já tem CORS habilitado.

---

## Próximos Passos

Agora que fizemos um tutorial sobre requisições com Axios:

1. **Exercício 2:** Buscar lista de posts e implementar filtros
   - Arquivo: `Exercicio2.md`

2. **Exercício 3:** Criar CRUD completo
   - Arquivo: `Exercicio3.md`

---

## 📚 Recursos Úteis

- [Documentação do Axios](https://axios-http.com/)
- [Random User API](https://randomuser.me/)
- [Vue.js - Lifecycle Hooks](https://vuejs.org/guide/essentials/lifecycle.html)
- [MDN - Async/Await](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Statements/async_function)

**Dica:** Quando tiver dúvidas, leia novamente este exercício. Ele tem tudo explicado passo a passo.
