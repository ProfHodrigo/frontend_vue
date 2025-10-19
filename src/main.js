import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'

// Criar e montar a aplicação Vue
const app = createApp(App)
app.use(router)
app.mount('#app')

console.log('🚀 Aplicação Vue iniciada - Aula 4!')
console.log('📚 Curso Frontend Vue.js consumindo API Flask')