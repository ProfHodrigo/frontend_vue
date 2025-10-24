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
      return state.nome ? `Olá, ${state.nome}!` : 'Visitante'
    },
    
    primeiroNome(state) {
      return state.nome.split(' ')[0]
    }
  },
  
  // Actions: métodos que modificam state
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
