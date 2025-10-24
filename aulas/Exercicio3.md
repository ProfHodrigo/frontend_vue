# Test 3: Store de Notificações

## Objetivo

Criar um sistema completo de notificações tipo toast usando Pinia, com diferentes tipos de mensagens, auto-remoção e animações.

---

## Contexto

Neste exercício você vai criar uma store que gerencia notificações temporárias (toasts) e um componente que exibe essas notificações com animações.

---

## Passo 1: Criar a Store de Notificações

Crie o arquivo `src/stores/notifications.js`:

```javascript
import { defineStore } from 'pinia'

export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    notificacoes: [],
    proximoId: 1
  }),
  
  getters: {
    notificacoesAtivas(state) {
      return state.notificacoes
    },
    
    totalNotificacoes(state) {
      return state.notificacoes.length
    },
    
    notificacoesPorTipo: (state) => (tipo) => {
      return state.notificacoes.filter(n => n.tipo === tipo)
    }
  },
  
  actions: {
    adicionar(mensagem, tipo = 'info', duracao = 5000) {
      const notificacao = {
        id: this.proximoId++,
        mensagem,
        tipo, // 'success', 'error', 'warning', 'info'
        timestamp: new Date(),
        duracao
      }
      
      this.notificacoes.push(notificacao)
      
      // Auto-remover após a duração
      if (duracao > 0) {
        setTimeout(() => {
          this.remover(notificacao.id)
        }, duracao)
      }
      
      return notificacao.id
    },
    
    remover(id) {
      const index = this.notificacoes.findIndex(n => n.id === id)
      if (index > -1) {
        this.notificacoes.splice(index, 1)
      }
    },
    
    limparTodas() {
      this.notificacoes = []
    },
    
    // Métodos de conveniência
    success(mensagem, duracao = 5000) {
      return this.adicionar(mensagem, 'success', duracao)
    },
    
    error(mensagem, duracao = 5000) {
      return this.adicionar(mensagem, 'error', duracao)
    },
    
    warning(mensagem, duracao = 5000) {
      return this.adicionar(mensagem, 'warning', duracao)
    },
    
    info(mensagem, duracao = 5000) {
      return this.adicionar(mensagem, 'info', duracao)
    }
  }
})
```

**O que fizemos**:

1. **State**: Array de notificações e contador de IDs
2. **Getter `notificacoesPorTipo`**: Filtra notificações por tipo
3. **Action `adicionar`**: Cria notificação e agenda auto-remoção
4. **Métodos de conveniência**: `success()`, `error()`, `warning()`, `info()`
5. **Auto-remoção**: `setTimeout` remove notificação após duração

---

## Passo 2: Criar Componente NotificationToast

Crie `src/components/NotificationToast.vue`:

```vue
<template>
  <div class="notifications-container">
    <TransitionGroup name="toast">
      <div 
        v-for="notificacao in notificationsStore.notificacoesAtivas"
        :key="notificacao.id"
        :class="['toast', `toast-${notificacao.tipo}`]"
        @click="notificationsStore.remover(notificacao.id)"
      >
        <div class="toast-icon">
          <i :class="getIcone(notificacao.tipo)"></i>
        </div>
        
        <div class="toast-content">
          <p class="toast-mensagem">{{ notificacao.mensagem }}</p>
          <span class="toast-tempo">{{ formatarTempo(notificacao.timestamp) }}</span>
        </div>
        
        <button 
          class="toast-close"
          @click.stop="notificationsStore.remover(notificacao.id)"
        >
          <i class="fas fa-times"></i>
        </button>
        
        <div 
          class="toast-progress"
          :style="{ animationDuration: `${notificacao.duracao}ms` }"
        ></div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script>
import { useNotificationsStore } from '@/stores/notifications'

export default {
  name: 'NotificationToast',
  setup() {
    const notificationsStore = useNotificationsStore()
    return { notificationsStore }
  },
  methods: {
    getIcone(tipo) {
      const icones = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
      }
      return icones[tipo] || icones.info
    },
    
    formatarTempo(timestamp) {
      const agora = new Date()
      const diff = Math.floor((agora - timestamp) / 1000)
      
      if (diff < 60) return 'Agora'
      if (diff < 3600) return `${Math.floor(diff / 60)}min atrás`
      return `${Math.floor(diff / 3600)}h atrás`
    }
  }
}
</script>

<style scoped>
.notifications-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 400px;
}

.toast {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  cursor: pointer;
  overflow: hidden;
  min-width: 300px;
}

.toast:hover {
  box-shadow: 0 6px 16px rgba(0,0,0,0.2);
}

/* Cores por tipo */
.toast-success {
  border-left: 4px solid #27ae60;
}

.toast-success .toast-icon {
  color: #27ae60;
}

.toast-error {
  border-left: 4px solid #e74c3c;
}

.toast-error .toast-icon {
  color: #e74c3c;
}

.toast-warning {
  border-left: 4px solid #f39c12;
}

.toast-warning .toast-icon {
  color: #f39c12;
}

.toast-info {
  border-left: 4px solid #3498db;
}

.toast-info .toast-icon {
  color: #3498db;
}

/* Ícone */
.toast-icon {
  font-size: 1.5em;
  flex-shrink: 0;
}

/* Conteúdo */
.toast-content {
  flex: 1;
  min-width: 0;
}

.toast-mensagem {
  margin: 0 0 4px 0;
  color: #333;
  font-weight: 500;
  word-wrap: break-word;
}

.toast-tempo {
  font-size: 0.8em;
  color: #999;
}

/* Botão fechar */
.toast-close {
  background: none;
  border: none;
  color: #999;
  font-size: 1.2em;
  cursor: pointer;
  padding: 4px;
  flex-shrink: 0;
  transition: color 0.3s;
}

.toast-close:hover {
  color: #333;
}

/* Barra de progresso */
.toast-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: currentColor;
  opacity: 0.3;
  animation: progress linear forwards;
}

@keyframes progress {
  from { width: 100%; }
  to { width: 0%; }
}

/* Animações de entrada/saída */
.toast-enter-active {
  animation: slideIn 0.3s ease-out;
}

.toast-leave-active {
  animation: slideOut 0.3s ease-in;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

/* Responsivo */
@media (max-width: 480px) {
  .notifications-container {
    top: 10px;
    right: 10px;
    left: 10px;
    max-width: none;
  }
  
  .toast {
    min-width: auto;
  }
}
</style>
```

**Destaques**:

- Posicionamento fixo no topo direito
- Cores diferentes por tipo de notificação
- Barra de progresso animada (mostra tempo restante)
- Timestamp relativo ("Agora", "5min atrás")
- TransitionGroup para animações suaves
- Click para fechar
- Responsivo para mobile

---

## Passo 3: Integrar no App.vue

Atualize `src/App.vue` para incluir o componente de notificações:

```vue
<template>
  <div id="app">
    <!-- Header existente -->
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
    
    <!-- Tabs existentes -->
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
    
    <!-- Conteúdo principal -->
    <main class="app-main">
      <ProductsList v-if="abaAtiva === 'produtos'" />
      <FavoritesList v-if="abaAtiva === 'favoritos'" />
      <ShoppingCart v-if="abaAtiva === 'carrinho'" />
    </main>
    
    <!-- Componente de notificações (sempre visível) -->
    <NotificationToast />
  </div>
</template>

<script>
import { useFavoritesStore } from '@/stores/favorites'
import { useCartStore } from '@/stores/cart'
import ProductsList from '@/components/ProductsList.vue'
import FavoritesList from '@/components/FavoritesList.vue'
import ShoppingCart from '@/components/ShoppingCart.vue'
import NotificationToast from '@/components/NotificationToast.vue'

export default {
  name: 'App',
  components: {
    ProductsList,
    FavoritesList,
    ShoppingCart,
    NotificationToast
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
/* Estilos existentes... */
</style>
```

---

## Passo 4: Usar Notificações nos Componentes

Atualize `ProductCard.vue` para mostrar notificações ao favoritar:

```vue
<script>
import { useFavoritesStore } from '@/stores/favorites'
import { useNotificationsStore } from '@/stores/notifications'

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
    const notificationsStore = useNotificationsStore()
    return { favoritesStore, notificationsStore }
  },
  methods: {
    toggleFavorito() {
      const isFavorito = this.favoritesStore.isFavorito(this.produto.id)
      
      this.favoritesStore.toggleFavorito(this.produto.id)
      
      if (isFavorito) {
        this.notificationsStore.info(`${this.produto.nome} removido dos favoritos`)
      } else {
        this.notificationsStore.success(`${this.produto.nome} adicionado aos favoritos`)
      }
    }
  }
}
</script>

<template>
  <div class="product-card">
    <div class="product-header">
      <h3>{{ produto.nome }}</h3>
      <button 
        class="btn-favorito"
        :class="{ ativo: favoritesStore.isFavorito(produto.id) }"
        @click="toggleFavorito"
        :title="favoritesStore.isFavorito(produto.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'"
      >
        <i class="fas fa-heart"></i>
      </button>
    </div>
    
    <!-- Resto do template... -->
  </div>
</template>

<!-- Estilos existentes... -->
```

Atualize `ProductsList.vue` para notificações ao adicionar ao carrinho:

```vue
<script>
import { useProductsStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'
import { useNotificationsStore } from '@/stores/notifications'
import ProductCard from './ProductCard.vue'

export default {
  name: 'ProductsList',
  components: { ProductCard },
  setup() {
    const productsStore = useProductsStore()
    const cartStore = useCartStore()
    const notificationsStore = useNotificationsStore()
    return { productsStore, cartStore, notificationsStore }
  },
  methods: {
    adicionarAoCarrinho(produto) {
      this.cartStore.adicionarItem(produto)
      this.notificationsStore.success(`${produto.nome} adicionado ao carrinho!`)
    }
  }
}
</script>

<!-- Template existente... -->
```

Atualize `FavoritesList.vue`:

```vue
<script>
import { useFavoritesStore } from '@/stores/favorites'
import { useCartStore } from '@/stores/cart'
import { useNotificationsStore } from '@/stores/notifications'

export default {
  name: 'FavoritesList',
  setup() {
    const favoritesStore = useFavoritesStore()
    const cartStore = useCartStore()
    const notificationsStore = useNotificationsStore()
    return { favoritesStore, cartStore, notificationsStore }
  },
  methods: {
    adicionarAoCarrinho(produto) {
      this.cartStore.adicionarItem(produto)
      this.notificationsStore.success(`${produto.nome} adicionado ao carrinho!`)
    },
    
    limparFavoritos() {
      if (this.favoritesStore.totalFavoritos === 0) return
      
      if (confirm('Deseja limpar todos os favoritos?')) {
        const total = this.favoritesStore.totalFavoritos
        this.favoritesStore.limparFavoritos()
        this.notificationsStore.warning(`${total} favoritos removidos`)
      }
    }
  }
}
</script>

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
        @click="limparFavoritos"
      >
        <i class="fas fa-trash"></i> Limpar Tudo
      </button>
    </div>
    
    <!-- Resto do template... -->
  </div>
</template>

<!-- Estilos existentes... -->
```

---

## Passo 5: Criar Painel de Teste de Notificações

Crie `src/components/NotificationDemo.vue` para testar todos os tipos:

```vue
<template>
  <div class="notification-demo">
    <h2>Teste de Notificações</h2>
    
    <div class="demo-grid">
      <button 
        class="btn-demo btn-success"
        @click="notificationsStore.success('Operação realizada com sucesso!')"
      >
        <i class="fas fa-check-circle"></i> Success
      </button>
      
      <button 
        class="btn-demo btn-error"
        @click="notificationsStore.error('Ocorreu um erro ao processar!')"
      >
        <i class="fas fa-exclamation-circle"></i> Error
      </button>
      
      <button 
        class="btn-demo btn-warning"
        @click="notificationsStore.warning('Atenção! Verifique os dados.')"
      >
        <i class="fas fa-exclamation-triangle"></i> Warning
      </button>
      
      <button 
        class="btn-demo btn-info"
        @click="notificationsStore.info('Você tem uma nova mensagem.')"
      >
        <i class="fas fa-info-circle"></i> Info
      </button>
    </div>
    
    <div class="demo-controls">
      <button 
        class="btn-demo btn-custom"
        @click="notificacaoPersonalizada"
      >
        <i class="fas fa-magic"></i> Notificação Personalizada (10s)
      </button>
      
      <button 
        class="btn-demo btn-multiple"
        @click="notificacoesMultiplas"
      >
        <i class="fas fa-layer-group"></i> Múltiplas Notificações
      </button>
      
      <button 
        class="btn-demo btn-clear"
        @click="notificationsStore.limparTodas()"
        :disabled="notificationsStore.totalNotificacoes === 0"
      >
        <i class="fas fa-trash"></i> Limpar Todas
      </button>
    </div>
    
    <div class="demo-stats">
      <p>Total de notificações ativas: <strong>{{ notificationsStore.totalNotificacoes }}</strong></p>
    </div>
  </div>
</template>

<script>
import { useNotificationsStore } from '@/stores/notifications'

export default {
  name: 'NotificationDemo',
  setup() {
    const notificationsStore = useNotificationsStore()
    return { notificationsStore }
  },
  methods: {
    notificacaoPersonalizada() {
      this.notificationsStore.adicionar(
        'Esta notificação fica visível por 10 segundos',
        'info',
        10000
      )
    },
    
    notificacoesMultiplas() {
      setTimeout(() => this.notificationsStore.success('Primeira notificação'), 0)
      setTimeout(() => this.notificationsStore.info('Segunda notificação'), 300)
      setTimeout(() => this.notificationsStore.warning('Terceira notificação'), 600)
      setTimeout(() => this.notificationsStore.error('Quarta notificação'), 900)
    }
  }
}
</script>

<style scoped>
.notification-demo {
  padding: 40px 20px;
  max-width: 800px;
  margin: 0 auto;
}

.notification-demo h2 {
  text-align: center;
  margin-bottom: 32px;
  color: #333;
}

.demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.demo-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 24px;
}

.btn-demo {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  color: white;
  font-size: 1em;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
}

.btn-demo:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.btn-demo:active:not(:disabled) {
  transform: translateY(0);
}

.btn-demo:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-success {
  background: #27ae60;
}

.btn-success:hover:not(:disabled) {
  background: #229954;
}

.btn-error {
  background: #e74c3c;
}

.btn-error:hover:not(:disabled) {
  background: #c0392b;
}

.btn-warning {
  background: #f39c12;
}

.btn-warning:hover:not(:disabled) {
  background: #e67e22;
}

.btn-info {
  background: #3498db;
}

.btn-info:hover:not(:disabled) {
  background: #2980b9;
}

.btn-custom {
  background: #9b59b6;
  flex: 1;
}

.btn-custom:hover:not(:disabled) {
  background: #8e44ad;
}

.btn-multiple {
  background: #16a085;
  flex: 1;
}

.btn-multiple:hover:not(:disabled) {
  background: #138d75;
}

.btn-clear {
  background: #95a5a6;
  flex: 1;
}

.btn-clear:hover:not(:disabled) {
  background: #7f8c8d;
}

.demo-stats {
  text-align: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.demo-stats p {
  margin: 0;
  color: #666;
  font-size: 1.1em;
}

.demo-stats strong {
  color: #333;
  font-size: 1.3em;
}
</style>
```

Adicione ao `App.vue` como uma nova aba:

```vue
<template>
  <div id="app">
    <!-- Header existente -->
    
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
      <button 
        :class="{ active: abaAtiva === 'demo' }"
        @click="abaAtiva = 'demo'"
      >
        <i class="fas fa-flask"></i> Demo
      </button>
    </nav>
    
    <main class="app-main">
      <ProductsList v-if="abaAtiva === 'produtos'" />
      <FavoritesList v-if="abaAtiva === 'favoritos'" />
      <ShoppingCart v-if="abaAtiva === 'carrinho'" />
      <NotificationDemo v-if="abaAtiva === 'demo'" />
    </main>
    
    <NotificationToast />
  </div>
</template>

<script>
import NotificationDemo from '@/components/NotificationDemo.vue'
// Outros imports...

export default {
  components: {
    // Componentes existentes...
    NotificationDemo
  }
  // Resto do código...
}
</script>
```

---

## Passo 6: Testar

1. Salve todos os arquivos
2. Execute `npm run dev`
3. Teste as funcionalidades:
   - Navegue para aba "Demo"
   - Clique em cada botão de tipo de notificação
   - Observe as cores, ícones e animações
   - Teste notificação personalizada (10s)
   - Teste múltiplas notificações (aparecem em sequência)
   - Clique em uma notificação para fechá-la
   - Aguarde 5s para ver auto-remoção
   - Use o app normalmente e veja notificações em ações (favoritar, adicionar ao carrinho)

