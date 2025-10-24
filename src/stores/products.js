import { defineStore } from 'pinia'

export const useProductsStore = defineStore('products', {
  state: () => ({
    produtos: [
      { id: 1, nome: 'Notebook', preco: 2500, categoria: 'eletronicos', estoque: 10 },
      { id: 2, nome: 'Mouse', preco: 50, categoria: 'perifericos', estoque: 50 },
      { id: 3, nome: 'Teclado', preco: 150, categoria: 'perifericos', estoque: 30 },
      { id: 4, nome: 'Monitor', preco: 800, categoria: 'eletronicos', estoque: 15 },
      { id: 5, nome: 'Webcam', preco: 200, categoria: 'perifericos', estoque: 20 }
    ],
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
      // Simula API call
      this.loading = true
      this.erro = null
      
      try {
        // Em produção, usar: const response = await api.get('/produtos')
        await new Promise(resolve => setTimeout(resolve, 500))
        // this.produtos já tem dados mock acima
      } catch (error) {
        this.erro = 'Erro ao buscar produtos'
        console.error(error)
      } finally {
        this.loading = false
      }
    }
  }
})
