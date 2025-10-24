<template>
  <div id="app">
    <header class="app-header">
      <h1>Loja Virtual - Aula 8: Pinia</h1>
      <div class="header-stats">
        <span class="stat">
          🛒 {{ cartStore.totalItems }}
        </span>
      </div>
    </header>
    
    <nav class="tabs">
      <button 
        :class="{ active: abaAtiva === 'carrinho' }"
        @click="abaAtiva = 'carrinho'"
      >
        🛒 Carrinho
      </button>
      <button 
        :class="{ active: abaAtiva === 'usuario' }"
        @click="abaAtiva = 'usuario'"
      >
        👤 Usuário
      </button>
    </nav>
    
    <main class="app-main">
      <ShoppingCart v-if="abaAtiva === 'carrinho'" />
      <UserProfile v-if="abaAtiva === 'usuario'" />
    </main>
  </div>
</template>

<script>
import { useCartStore } from '@/stores/cart'
import ShoppingCart from '@/components/ShoppingCart.vue'
import UserProfile from '@/components/UserProfile.vue'

export default {
  name: 'App',
  components: {
    ShoppingCart,
    UserProfile
  },
  setup() {
    const cartStore = useCartStore()
    return { cartStore }
  },
  data() {
    return {
      abaAtiva: 'carrinho'
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
