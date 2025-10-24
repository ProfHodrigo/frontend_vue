# Test 2: Store de Favoritos

## Objetivo

Criar um sistema completo de produtos favoritos usando Pinia, permitindo que o usuário marque/desmarque produtos como favoritos e visualize sua lista.

---

## Contexto

Você já conhece o básico de Pinia. Agora vamos criar uma store que se comunica com outra store (products) e persiste dados no localStorage.

---

## Passo 1: Criar a Store de Favoritos

Crie o arquivo `src/stores/favorites.js`:

```javascript
import { defineStore } from 'pinia'
import { useProductsStore } from './products'

export const useFavoritesStore = defineStore('favorites', {
  state: () => ({
    favoritos: []  // Array de IDs dos produtos favoritos
  }),
  
  getters: {
    totalFavoritos(state) {
      return state.favoritos.length
    },
    
    isFavorito: (state) => (produtoId) => {
      return state.favoritos.includes(produtoId)
    },
    
    produtosFavoritos() {
      const productsStore = useProductsStore()
      
      // Retorna objetos completos dos produtos favoritos
      return this.favoritos
        .map(id => productsStore.produtoPorId(id))
        .filter(produto => produto !== undefined)
    }
  },
  
  actions: {
    adicionarFavorito(produtoId) {
      if (!this.favoritos.includes(produtoId)) {
        this.favoritos.push(produtoId)
      }
    },
    
    removerFavorito(produtoId) {
      const index = this.favoritos.indexOf(produtoId)
      if (index > -1) {
        this.favoritos.splice(index, 1)
      }
    },
    
    toggleFavorito(produtoId) {
      if (this.isFavorito(produtoId)) {
        this.removerFavorito(produtoId)
      } else {
        this.adicionarFavorito(produtoId)
      }
    },
    
    limparFavoritos() {
      if (confirm('Deseja limpar todos os favoritos?')) {
        this.favoritos = []
      }
    }
  },
  
  // Persistir no localStorage
  persist: true
})
```

**O que fizemos**:

1. **State**: Array simples de IDs (mais eficiente que objetos completos)
2. **Getter `isFavorito`**: Retorna função que verifica se ID está nos favoritos
3. **Getter `produtosFavoritos`**: Busca objetos completos da productsStore
4. **Action `toggleFavorito`**: Adiciona ou remove dependendo do estado atual
5. **`persist: true`**: Salva automaticamente no localStorage

---

## Passo 2: Atualizar Store de Produtos (se necessário)

Verifique se `src/stores/products.js` tem o getter `produtoPorId`:

```javascript
import { defineStore } from 'pinia'

export const useProductsStore = defineStore('products', {
  state: () => ({
    produtos: [
      { id: 1, nome: 'Notebook', preco: 2500, categoria: 'eletronicos', estoque: 10 },
      { id: 2, nome: 'Mouse', preco: 50, categoria: 'perifericos', estoque: 50 },
      { id: 3, nome: 'Teclado', preco: 150, categoria: 'perifericos', estoque: 30 },
      { id: 4, nome: 'Monitor', preco: 800, categoria: 'eletronicos', estoque: 15 },
      { id: 5, nome: 'Webcam', preco: 200, categoria: 'perifericos', estoque: 20 }
    ]
  }),
  
  getters: {
    produtoPorId: (state) => (id) => {
      return state.produtos.find(p => p.id === id)
    },
    
    produtosDisponiveis(state) {
      return state.produtos.filter(p => p.estoque > 0)
    }
  }
})
```

---

## Passo 3: Criar Componente ProductCard com Favorito

Crie `src/components/ProductCard.vue`:

```vue
<template>
  <div class="product-card">
    <div class="product-header">
      <h3>{{ produto.nome }}</h3>
      <button 
        class="btn-favorito"
        :class="{ ativo: favoritesStore.isFavorito(produto.id) }"
        @click="favoritesStore.toggleFavorito(produto.id)"
        :title="favoritesStore.isFavorito(produto.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'"
      >
        <i class="fas fa-heart"></i>
      </button>
    </div>
    
    <div class="product-body">
      <p class="categoria">{{ produto.categoria }}</p>
      <p class="preco">R$ {{ produto.preco.toFixed(2) }}</p>
      <p class="estoque" :class="{ baixo: produto.estoque < 10 }">
        Estoque: {{ produto.estoque }}
      </p>
    </div>
    
    <div class="product-footer">
      <button class="btn-comprar" @click="$emit('adicionar-carrinho', produto)">
        <i class="fas fa-cart-plus"></i> Adicionar ao Carrinho
      </button>
    </div>
  </div>
</template>

<script>
import { useFavoritesStore } from '@/stores/favorites'

export default {
  name: 'ProductCard',
  props: {
    produto: {
      type: Object,
      required: true
    }
  },
  emits: ['adicionar-carrinho'],
  setup() {
    const favoritesStore = useFavoritesStore()
    return { favoritesStore }
  }
}
</script>

<style scoped>
.product-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.product-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 12px;
}

.product-header h3 {
  margin: 0;
  font-size: 1.2em;
}

.btn-favorito {
  background: none;
  border: none;
  font-size: 1.5em;
  color: #ccc;
  cursor: pointer;
  transition: color 0.3s;
}

.btn-favorito:hover {
  color: #ff6b6b;
}

.btn-favorito.ativo {
  color: #e74c3c;
  animation: pulse 0.3s ease-in-out;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.product-body {
  margin-bottom: 16px;
}

.categoria {
  color: #666;
  font-size: 0.9em;
  text-transform: uppercase;
  margin: 4px 0;
}

.preco {
  font-size: 1.5em;
  font-weight: bold;
  color: #27ae60;
  margin: 8px 0;
}

.estoque {
  color: #666;
  font-size: 0.9em;
}

.estoque.baixo {
  color: #e74c3c;
  font-weight: bold;
}

.btn-comprar {
  width: 100%;
  padding: 10px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1em;
  transition: background 0.3s;
}

.btn-comprar:hover {
  background: #2980b9;
}

.btn-comprar:active {
  transform: scale(0.98);
}
</style>
```

**Destaques**:

- Botão de favorito com ícone de coração
- Classe `ativo` quando produto é favorito (muda cor)
- Animação de pulse ao favoritar
- Uso do getter `isFavorito` para verificar estado
- Toggle ao clicar (adiciona ou remove)

---

## Passo 4: Criar Lista de Favoritos

Crie `src/components/FavoritesList.vue`:

```vue
<template>
  <div class="favorites-list">
    <div class="header">
      <h2>
        <i class="fas fa-heart"></i> 
        Meus Favoritos ({{ favoritesStore.totalFavoritos }})
      </h2>
      
      <button 
        v-if="favoritesStore.totalFavoritos > 0"
        class="btn-limpar"
        @click="favoritesStore.limparFavoritos()"
      >
        <i class="fas fa-trash"></i> Limpar Tudo
      </button>
    </div>
    
    <div v-if="favoritesStore.totalFavoritos === 0" class="empty">
      <i class="fas fa-heart-broken fa-3x"></i>
      <p>Você ainda não tem favoritos</p>
      <p class="subtitle">Explore os produtos e adicione seus preferidos aqui!</p>
    </div>
    
    <div v-else class="favorites-grid">
      <div 
        v-for="produto in favoritesStore.produtosFavoritos" 
        :key="produto.id"
        class="favorite-item"
      >
        <button 
          class="btn-remover"
          @click="favoritesStore.removerFavorito(produto.id)"
          title="Remover dos favoritos"
        >
          <i class="fas fa-times"></i>
        </button>
        
        <h3>{{ produto.nome }}</h3>
        <p class="categoria">{{ produto.categoria }}</p>
        <p class="preco">R$ {{ produto.preco.toFixed(2) }}</p>
        
        <button 
          class="btn-adicionar"
          @click="adicionarAoCarrinho(produto)"
        >
          <i class="fas fa-cart-plus"></i> Adicionar ao Carrinho
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { useFavoritesStore } from '@/stores/favorites'
import { useCartStore } from '@/stores/cart'

export default {
  name: 'FavoritesList',
  setup() {
    const favoritesStore = useFavoritesStore()
    const cartStore = useCartStore()
    return { favoritesStore, cartStore }
  },
  methods: {
    adicionarAoCarrinho(produto) {
      this.cartStore.adicionarItem(produto)
      alert(`${produto.nome} adicionado ao carrinho!`)
    }
  }
}
</script>

<style scoped>
.favorites-list {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header h2 {
  margin: 0;
  color: #e74c3c;
}

.btn-limpar {
  padding: 8px 16px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-limpar:hover {
  background: #c0392b;
}

.empty {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.empty i {
  color: #ddd;
  margin-bottom: 20px;
}

.empty p {
  font-size: 1.2em;
  margin: 8px 0;
}

.subtitle {
  font-size: 0.9em !important;
  color: #bbb;
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.favorite-item {
  position: relative;
  border: 2px solid #e74c3c;
  border-radius: 8px;
  padding: 20px;
  background: #fff;
  transition: transform 0.2s;
}

.favorite-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.2);
}

.btn-remover {
  position: absolute;
  top: 8px;
  right: 8px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-remover:hover {
  background: #c0392b;
}

.favorite-item h3 {
  margin: 0 0 8px 0;
  color: #333;
}

.categoria {
  color: #666;
  font-size: 0.9em;
  text-transform: uppercase;
  margin: 4px 0;
}

.preco {
  font-size: 1.4em;
  font-weight: bold;
  color: #27ae60;
  margin: 12px 0;
}

.btn-adicionar {
  width: 100%;
  padding: 10px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-adicionar:hover {
  background: #2980b9;
}
</style>
```

**Funcionalidades**:

- Mostra total de favoritos no título
- Estado vazio com mensagem motivacional
- Grid responsivo de produtos favoritos
- Botão X para remover individual
- Botão "Limpar Tudo" com confirmação
- Integração com carrinho de compras

---

## Passo 5: Criar Lista de Produtos

Crie `src/components/ProductsList.vue`:

```vue
<template>
  <div class="products-list">
    <h2>Produtos Disponíveis</h2>
    
    <div class="products-grid">
      <ProductCard
        v-for="produto in productsStore.produtosDisponiveis"
        :key="produto.id"
        :produto="produto"
        @adicionar-carrinho="adicionarAoCarrinho"
      />
    </div>
  </div>
</template>

<script>
import { useProductsStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'
import ProductCard from './ProductCard.vue'

export default {
  name: 'ProductsList',
  components: { ProductCard },
  setup() {
    const productsStore = useProductsStore()
    const cartStore = useCartStore()
    return { productsStore, cartStore }
  },
  methods: {
    adicionarAoCarrinho(produto) {
      this.cartStore.adicionarItem(produto)
      alert(`${produto.nome} adicionado ao carrinho!`)
    }
  }
}
</script>

<style scoped>
.products-list {
  padding: 20px;
}

.products-list h2 {
  margin-bottom: 24px;
  color: #333;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}
</style>
```

---

## Passo 6: Integrar no App.vue

Atualize `src/App.vue`:

```vue
<template>
  <div id="app">
    <header class="app-header">
      <h1>Loja Virtual</h1>
      <div class="header-stats">
        <span class="stat">
          <i class="fas fa-heart"></i> {{ favoritesStore.totalFavoritos }}
        </span>
        <span class="stat">
          <i class="fas fa-shopping-cart"></i> {{ cartStore.totalItems }}
        </span>
      </div>
    </header>
    
    <nav class="tabs">
      <button 
        :class="{ active: abaAtiva === 'produtos' }"
        @click="abaAtiva = 'produtos'"
      >
        <i class="fas fa-store"></i> Produtos
      </button>
      <button 
        :class="{ active: abaAtiva === 'favoritos' }"
        @click="abaAtiva = 'favoritos'"
      >
        <i class="fas fa-heart"></i> Favoritos
      </button>
      <button 
        :class="{ active: abaAtiva === 'carrinho' }"
        @click="abaAtiva = 'carrinho'"
      >
        <i class="fas fa-shopping-cart"></i> Carrinho
      </button>
    </nav>
    
    <main class="app-main">
      <ProductsList v-if="abaAtiva === 'produtos'" />
      <FavoritesList v-if="abaAtiva === 'favoritos'" />
      <ShoppingCart v-if="abaAtiva === 'carrinho'" />
    </main>
  </div>
</template>

<script>
import { useFavoritesStore } from '@/stores/favorites'
import { useCartStore } from '@/stores/cart'
import ProductsList from '@/components/ProductsList.vue'
import FavoritesList from '@/components/FavoritesList.vue'
import ShoppingCart from '@/components/ShoppingCart.vue'

export default {
  name: 'App',
  components: {
    ProductsList,
    FavoritesList,
    ShoppingCart
  },
  setup() {
    const favoritesStore = useFavoritesStore()
    const cartStore = useCartStore()
    return { favoritesStore, cartStore }
  },
  data() {
    return {
      abaAtiva: 'produtos'
    }
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
  background: #f5f5f5;
}

#app {
  min-height: 100vh;
}

.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.app-header h1 {
  margin: 0;
  font-size: 2em;
}

.header-stats {
  display: flex;
  gap: 20px;
}

.stat {
  background: rgba(255,255,255,0.2);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 1.1em;
}

.tabs {
  display: flex;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.tabs button {
  flex: 1;
  padding: 16px;
  border: none;
  background: white;
  cursor: pointer;
  font-size: 1em;
  transition: all 0.3s;
  border-bottom: 3px solid transparent;
}

.tabs button:hover {
  background: #f8f9fa;
}

.tabs button.active {
  color: #667eea;
  border-bottom-color: #667eea;
  font-weight: bold;
}

.app-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
</style>
```

---

## Passo 7: Testar

1. Salve todos os arquivos
2. Certifique-se de que o Pinia está configurado no `main.js`
3. Execute `npm run dev`
4. Teste as funcionalidades:
   - Clique no coração nos cards de produto
   - Veja o contador de favoritos no header aumentar
   - Navegue para aba "Favoritos"
   - Remova favoritos individualmente ou todos de uma vez
   - Recarregue a página (favoritos devem persistir)