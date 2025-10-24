import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './style.css'

// Criar Pinia (gerenciador de estado)
const pinia = createPinia()

// Criar e montar a aplicação Vue
const app = createApp(App)
app.use(pinia)
app.mount('#app')

console.log('🚀 Aplicação Vue iniciada com Pinia!')
console.log('📚 Curso Frontend Vue.js consumindo API Flask')