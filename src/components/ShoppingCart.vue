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
    diminuir(produtoId) {
      const item = this.cartStore.items.find(i => i.id === produtoId)
      if (item) {
        this.cartStore.atualizarQuantidade(produtoId, item.quantidade - 1)
      }
    },
    aumentar(produtoId) {
      const item = this.cartStore.items.find(i => i.id === produtoId)
      if (item) {
        this.cartStore.atualizarQuantidade(produtoId, item.quantidade + 1)
      }
    }
  }
}
</script>

<style scoped>
.shopping-cart {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin: 20px;
}

.empty {
  color: #999;
  padding: 20px;
  text-align: center;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.controls {
  display: flex;
  gap: 10px;
  align-items: center;
}

.controls button {
  padding: 5px 10px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.controls button:hover {
  background: #35a372;
}

.total {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 2px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total button {
  padding: 8px 16px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.total button:hover {
  background: #c0392b;
}
</style>
