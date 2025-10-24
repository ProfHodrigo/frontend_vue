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
