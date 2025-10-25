import { createApp } from 'vue'
import App from './App.vue'

// Bootstrap CSS e JS
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Bootstrap Icons
import 'bootstrap-icons/font/bootstrap-icons.css'

// Estilos globais
import './style.css'

// Criar e montar a aplicação Vue
const app = createApp(App)
app.mount('#app')

console.log('Aplicacao Vue iniciada - Aula 10: Estilizacao')
console.log('Bootstrap 5 + SCSS + CSS Moderno')