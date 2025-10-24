# Aula 8: Gerenciamento de Estado com Pinia

## Introducao

Nesta aula aprenderemos a gerenciar estado global da aplicacao usando Pinia, o gerenciador de estado oficial do Vue.js.

**Objetivo**: Criar um sistema de gerenciamento de estado para compartilhar dados entre componentes, implementar carrinho de compras e gerenciar configuracoes de usuario.

**O que voce aprendera**:
- O que eh estado global e quando usa-lo
- Como configurar Pinia no projeto
- Criar stores para diferentes funcionalidades
- Usar state, getters e actions
- Compartilhar dados entre componentes sem props
- Persistir estado no localStorage

---

## Parte 1: Conceitos Fundamentais

### O que eh Estado Global

Estado eh qualquer dado que sua aplicacao precisa armazenar e acessar. Existem dois tipos:

**Estado Local** (dentro de um componente):

```javascript
data() {
  return {
    contador: 0  // Este dado so existe neste componente
  }
}
```

**Estado Global** (compartilhado entre componentes):

```javascript
// Store Pinia - acessivel em QUALQUER componente
const useCounterStore = defineStore('counter', {
  state: () => ({
    contador: 0  // Todos os componentes podem acessar este dado
  })
})
```

### Quando usar Estado Global

Use estado global quando:

1. **Multiplos componentes precisam dos mesmos dados**
   - Usuario logado (nome, email, foto)
   - Carrinho de compras
   - Configuracoes (tema, idioma)

2. **Dados precisam persistir entre navegacao**
   - Lista de produtos favoritos
   - Historico de busca

3. **Compartilhar dados sem passar props em cadeia**
   - Evita "prop drilling" (passar props por varios niveis)

**Nao use estado global para**:
- Dados temporarios de formulario
- Estado de UI local (abrir/fechar menu)
- Dados que so um componente usa

### O que eh Pinia

Pinia eh o gerenciador de estado oficial do Vue 3. Substitui o Vuex com:
- Sintaxe mais simples
- TypeScript nativo
- Melhor suporte a DevTools
- Modular por design

**Arquitetura de uma Store**:

```
Store Pinia
├── State (dados)
├── Getters (computed)
└── Actions (metodos)
```

---

## Parte 2: Instalacao e Configuracao

### Passo 1: Instalar Pinia

No terminal do projeto:

```bash
npm install pinia
```

### Passo 2: Configurar no main.js

Abra `src/main.js` e adicione:

```javascript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.mount('#app')
```

**O que fizemos**:
1. Importamos `createPinia` do pacote
2. Criamos instancia do Pinia
3. Registramos no app com `app.use(pinia)`

### Passo 3: Criar estrutura de pastas

Crie a pasta `src/stores/` para organizar suas stores:

```
src/
├── stores/
│   ├── user.js      (dados do usuario)
│   ├── cart.js      (carrinho de compras)
│   └── products.js  (produtos)
├── components/
└── App.vue
```

---

## Parte 3: Criando sua Primeira Store

### Store de Usuario

Crie o arquivo `src/stores/user.js`:

```javascript
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  // State: dados reativos
  state: () => ({
    nome: '',
    email: '',
    isLoggedIn: false
  }),
  
  // Getters: computed properties
  getters: {
    nomeCompleto(state) {
      return state.nome ? `Ola, ${state.nome}!` : 'Visitante'
    },
    
    primeiroNome(state) {
      return state.nome.split(' ')[0]
    }
  },
  
  // Actions: metodos que modificam state
  actions: {
    login(nome, email) {
      this.nome = nome
      this.email = email
      this.isLoggedIn = true
    },
    
    logout() {
      this.nome = ''
      this.email = ''
      this.isLoggedIn = false
    }
  }
})
```

**Estrutura explicada**:

1. **`defineStore('user', { ... })`**
   - Primeiro parametro: ID unico da store ('user')
   - Segundo parametro: objeto de configuracao

2. **`state: () => ({ ... })`**
   - Funcao que retorna objeto com dados iniciais
   - Deve ser funcao (nao objeto direto) para reutilizacao

3. **`getters: { ... }`**
   - Propriedades computadas baseadas no state
   - Recebem `state` como primeiro parametro
   - Sao cacheadas (so recalculam se dependencias mudarem)

4. **`actions: { ... }`**
   - Metodos que modificam o state
   - Usam `this` para acessar state/getters/outras actions
   - Podem ser async

### Usando a Store em Componente

Crie `src/components/UserProfile.vue`:

```vue
<template>
  <div class="user-profile">
    <div v-if="userStore.isLoggedIn">
      <h3>{{ userStore.nomeCompleto }}</h3>
      <p>Email: {{ userStore.email }}</p>
      <button @click="userStore.logout()">Sair</button>
    </div>
    
    <div v-else>
      <input v-model="nome" placeholder="Nome">
      <input v-model="email" placeholder="Email">
      <button @click="fazerLogin">Entrar</button>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/user'

export default {
  name: 'UserProfile',
  setup() {
    const userStore = useUserStore()
    return { userStore }
  },
  data() {
    return {
      nome: '',
      email: ''
    }
  },
  methods: {
    fazerLogin() {
      this.userStore.login(this.nome, this.email)
    }
  }
}
</script>
```

**Como funciona**:
1. Importamos `useUserStore` do arquivo da store
2. Chamamos `useUserStore()` no `setup()` para obter instancia
3. Retornamos para tornar acessivel no template
4. Acessamos state/getters diretamente: `userStore.nome`
5. Chamamos actions: `userStore.login()`

---

## Parte 4: Store de Carrinho de Compras

### Criar Store Cart

Crie `src/stores/cart.js`:

```javascript
import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: []  // Array de { id, nome, preco, quantidade }
  }),
  
  getters: {
    totalItems(state) {
      return state.items.reduce((total, item) => total + item.quantidade, 0)
    },
    
    totalPreco(state) {
      return state.items.reduce((total, item) => {
        return total + (item.preco * item.quantidade)
      }, 0)
    },
    
    carrinhoVazio(state) {
      return state.items.length === 0
    }
  },
  
  actions: {
    adicionarItem(produto) {
      const itemExistente = this.items.find(item => item.id === produto.id)
      
      if (itemExistente) {
        itemExistente.quantidade++
      } else {
        this.items.push({
          id: produto.id,
          nome: produto.nome,
          preco: produto.preco,
          quantidade: 1
        })
      }
    },
    
    removerItem(produtoId) {
      const index = this.items.findIndex(item => item.id === produtoId)
      if (index > -1) {
        this.items.splice(index, 1)
      }
    },
    
    atualizarQuantidade(produtoId, quantidade) {
      const item = this.items.find(item => item.id === produtoId)
      if (item) {
        item.quantidade = quantidade
        if (item.quantidade <= 0) {
          this.removerItem(produtoId)
        }
      }
    },
    
    limparCarrinho() {
      this.items = []
    }
  }
})
```

### Componente de Carrinho

Crie `src/components/ShoppingCart.vue`:

```vue
<template>
  <div class="shopping-cart">
    <h3>Carrinho ({{ cartStore.totalItems }})</h3>
    
    <div v-if="cartStore.carrinhoVazio" class="empty">
      Carrinho vazio
    </div>
    
    <div v-else>
      <div v-for="item in cartStore.items" :key="item.id" class="cart-item">
        <div class="info">
          <strong>{{ item.nome }}</strong>
          <span>R$ {{ item.preco.toFixed(2) }}</span>
        </div>
        
        <div class="controls">
          <button @click="diminuir(item.id)">-</button>
          <span>{{ item.quantidade }}</span>
          <button @click="aumentar(item.id)">+</button>
          <button @click="cartStore.removerItem(item.id)">X</button>
        </div>
      </div>
      
      <div class="total">
        <strong>Total: R$ {{ cartStore.totalPreco.toFixed(2) }}</strong>
        <button @click="cartStore.limparCarrinho()">Limpar</button>
      </div>
    </div>
  </div>
</template>

<script>
import { useCartStore } from '@/stores/cart'

export default {
  name: 'ShoppingCart',
  setup() {
    const cartStore = useCartStore()
    return { cartStore }
  },
  methods: {
    aumentar(id) {
      const item = this.cartStore.items.find(i => i.id === id)
      this.cartStore.atualizarQuantidade(id, item.quantidade + 1)
    },
    
    diminuir(id) {
      const item = this.cartStore.items.find(i => i.id === id)
      this.cartStore.atualizarQuantidade(id, item.quantidade - 1)
    }
  }
}
</script>

<style scoped>
.shopping-cart { padding: 20px; border: 1px solid #ddd; }
.cart-item { display: flex; justify-content: space-between; padding: 10px; border-bottom: 1px solid #eee; }
.controls { display: flex; gap: 10px; }
.total { margin-top: 20px; font-size: 1.2em; }
</style>
```

---

## Parte 5: Actions Assincronas

### Store de Produtos com API

Crie `src/stores/products.js`:

```javascript
import { defineStore } from 'pinia'
import api from '@/services/api'  // axios instance

export const useProductsStore = defineStore('products', {
  state: () => ({
    produtos: [],
    loading: false,
    erro: null
  }),
  
  getters: {
    produtosDisponiveis(state) {
      return state.produtos.filter(p => p.estoque > 0)
    },
    
    produtoPorId: (state) => (id) => {
      return state.produtos.find(p => p.id === id)
    }
  },
  
  actions: {
    async buscarProdutos() {
      this.loading = true
      this.erro = null
      
      try {
        const response = await api.get('/produtos')
        this.produtos = response.data
      } catch (error) {
        this.erro = 'Erro ao buscar produtos'
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    
    async criarProduto(produto) {
      try {
        const response = await api.post('/produtos', produto)
        this.produtos.push(response.data)
        return { sucesso: true, produto: response.data }
      } catch (error) {
        return { sucesso: false, erro: error.message }
      }
    }
  }
})
```

### Usar em Componente

```vue
<template>
  <div>
    <div v-if="productsStore.loading">Carregando...</div>
    <div v-else-if="productsStore.erro">{{ productsStore.erro }}</div>
    
    <div v-else>
      <div v-for="produto in productsStore.produtosDisponiveis" :key="produto.id">
        <h4>{{ produto.nome }}</h4>
        <p>R$ {{ produto.preco }}</p>
        <button @click="adicionarAoCarrinho(produto)">Adicionar</button>
      </div>
    </div>
  </div>
</template>

<script>
import { useProductsStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'

export default {
  setup() {
    const productsStore = useProductsStore()
    const cartStore = useCartStore()
    return { productsStore, cartStore }
  },
  mounted() {
    this.productsStore.buscarProdutos()
  },
  methods: {
    adicionarAoCarrinho(produto) {
      this.cartStore.adicionarItem(produto)
    }
  }
}
</script>
```

---

## Parte 6: Comunicacao Entre Stores

Stores podem acessar outras stores:

```javascript
// src/stores/checkout.js
import { defineStore } from 'pinia'
import { useCartStore } from './cart'
import { useUserStore } from './user'

export const useCheckoutStore = defineStore('checkout', {
  state: () => ({
    pedidos: []
  }),
  
  actions: {
    async finalizarCompra() {
      const cartStore = useCartStore()
      const userStore = useUserStore()
      
      if (!userStore.isLoggedIn) {
        throw new Error('Usuario nao autenticado')
      }
      
      if (cartStore.carrinhoVazio) {
        throw new Error('Carrinho vazio')
      }
      
      const pedido = {
        usuario: userStore.email,
        items: cartStore.items,
        total: cartStore.totalPreco,
        data: new Date()
      }
      
      this.pedidos.push(pedido)
      cartStore.limparCarrinho()
      
      return pedido
    }
  }
})
```

---

## Parte 7: Persistencia com LocalStorage

### Plugin de Persistencia

Instale o plugin oficial:

```bash
npm install pinia-plugin-persistedstate
```

Configure em `src/main.js`:

```javascript
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
```

### Usar em Store

```javascript
export const useCartStore = defineStore('cart', {
  state: () => ({
    items: []
  }),
  
  // Adicionar esta opcao
  persist: true  // Salva automaticamente no localStorage
})
```

**Opcoes avancadas**:

```javascript
persist: {
  key: 'meu-carrinho',  // chave customizada
  storage: localStorage,  // ou sessionStorage
  paths: ['items']  // persistir apenas alguns campos
}
```

---

## Parte 8: Boas Praticas

### 1. Organizacao de Stores

```
stores/
├── modules/
│   ├── auth.js       (autenticacao)
│   ├── cart.js       (carrinho)
│   └── products.js   (produtos)
└── index.js          (exportar todas)
```

**`stores/index.js`**:

```javascript
export { useUserStore } from './modules/auth'
export { useCartStore } from './modules/cart'
export { useProductsStore } from './modules/products'
```

### 2. Nomenclatura

- Store: `useNomeStore` (camelCase com prefixo "use")
- State: substantivos (`produtos`, `usuario`)
- Getters: adjetivos ou perguntas (`produtosDisponiveis`, `isLoggedIn`)
- Actions: verbos (`buscarProdutos`, `login`)

### 3. State Inicial

Sempre use funcao arrow:

```javascript
// Correto
state: () => ({
  items: []
})

// Errado - nao reutilizavel
state: {
  items: []
}
```

### 4. Getters com Parametros

```javascript
getters: {
  produtoPorCategoria: (state) => (categoria) => {
    return state.produtos.filter(p => p.categoria === categoria)
  }
}

// Uso
const eletronicos = store.produtoPorCategoria('eletronicos')
```

### 5. Actions Mutaveis

```javascript
// Pode modificar state diretamente
actions: {
  adicionarItem(item) {
    this.items.push(item)  // OK
  }
}
```

---

## Parte 9: Exercicios Praticos

### Exercicio 1: Store de Configuracoes

**Objetivo**: Criar store para gerenciar preferencias do usuario.

**Tarefas**:
1. Criar `src/stores/settings.js`
2. State: `tema` (claro/escuro), `idioma` (pt/en), `notificacoes` (true/false)
3. Getters: `temaAtivo`, `idiomaAtual`
4. Actions: `alterarTema()`, `alterarIdioma()`, `toggleNotificacoes()`
5. Persistir no localStorage
6. Criar componente `SettingsPanel.vue` para exibir/alterar
7. Aplicar tema dinamicamente no App.vue

**Resultado esperado**: Usuario altera tema e configuracoes permanecem ao recarregar.

### Exercicio 2: Store de Favoritos

**Objetivo**: Sistema de produtos favoritos.

**Tarefas**:
1. Criar `src/stores/favorites.js`
2. State: `favoritos` (array de IDs)
3. Getters: `totalFavoritos`, `isFavorito(id)`
4. Actions: `adicionarFavorito(id)`, `removerFavorito(id)`, `limparFavoritos()`
5. Integrar com `productsStore` para buscar dados completos
6. Criar componente `FavoritesList.vue`
7. Adicionar icone de favorito nos cards de produto
8. Persistir no localStorage

**Resultado esperado**: Usuario marca/desmarca favoritos e lista persiste.

### Exercicio 3: Store de Notificacoes

**Objetivo**: Sistema de notificacoes toast.

**Tarefas**:
1. Criar `src/stores/notifications.js`
2. State: `notificacoes` (array de { id, tipo, mensagem, timestamp })
3. Getters: `notificacoesAtivas`, `totalNaoLidas`
4. Actions: `adicionar(tipo, mensagem)`, `remover(id)`, `limparTodas()`
5. Auto-remover apos 5 segundos
6. Criar componente `NotificationToast.vue`
7. Integrar em outras stores (ex: ao adicionar item no carrinho)
8. Tipos: sucesso, erro, aviso, info

**Resultado esperado**: Notificacoes aparecem e desaparecem automaticamente.

---

## Resumo

Aula 8 apresentou:

- Conceito de estado global vs local
- Configuracao do Pinia no projeto
- Estrutura de stores (state, getters, actions)
- Criacao de stores de usuario, carrinho e produtos
- Actions assincronas com API
- Comunicacao entre stores
- Persistencia com localStorage
- Boas praticas de organizacao
- 3 exercicios praticos focados em Vue.js e Pinia

**Proxima aula**: Componentes avancados e slots.
