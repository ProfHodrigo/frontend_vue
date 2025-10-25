<template>
  <div id="app">
    <header class="header">
      <h1>Curso Vue.js - Aula 9: Testes</h1>
      <p>Exemplos de componentes testáveis</p>
    </header>

    <div class="container">
      <nav class="tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="abaAtiva = tab.id"
          :class="{ active: abaAtiva === tab.id }"
        >
          {{ tab.nome }}
        </button>
      </nav>

      <div class="content">
        <!-- Aba Counter -->
        <div v-if="abaAtiva === 'counter'" class="tab-content">
          <h2>Componente Counter</h2>
          <p>Exemplo simples de componente com estado local</p>
          <Counter />
        </div>

        <!-- Aba UserCard -->
        <div v-else-if="abaAtiva === 'usercard'" class="tab-content">
          <h2>Componente UserCard</h2>
          <p>Exemplo de componente com props e events</p>
          <div class="user-cards">
            <UserCard 
              v-for="user in usuarios"
              :key="user.id"
              :user="user"
              :show-edit-button="true"
              :show-delete-button="true"
              @edit="handleEdit"
              @delete="handleDelete"
            />
          </div>
        </div>

        <!-- Aba UserProfile -->
        <div v-else-if="abaAtiva === 'profile'" class="tab-content">
          <h2>Componente UserProfile</h2>
          <p>Exemplo de componente integrado com Pinia store</p>
          <UserProfile />
        </div>

        <!-- Aba ShoppingCart -->
        <div v-else-if="abaAtiva === 'cart'" class="tab-content">
          <h2>Componente ShoppingCart</h2>
          <p>Exemplo de gerenciamento de estado com Pinia</p>
          <ShoppingCart />
        </div>
      </div>
    </div>

    <footer class="footer">
      <p>Aula 9 - Testes em Vue.js | Prof. Rodrigo</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Counter from './components/Counter.vue'
import UserCard from './components/UserCard.vue'
import UserProfile from './components/UserProfile.vue'
import ShoppingCart from './components/ShoppingCart.vue'

const abaAtiva = ref('counter')

const tabs = [
  { id: 'counter', nome: 'Counter' },
  { id: 'usercard', nome: 'UserCard' },
  { id: 'profile', nome: 'Perfil' },
  { id: 'cart', nome: 'Carrinho' }
]

const usuarios = ref([
  {
    id: 1,
    nome: 'João Silva',
    email: 'joao@email.com',
    cargo: 'Desenvolvedor Frontend'
  },
  {
    id: 2,
    nome: 'Maria Santos',
    email: 'maria@email.com',
    cargo: 'Designer UX/UI',
    avatar: 'https://i.pravatar.cc/150?img=1'
  },
  {
    id: 3,
    nome: 'Pedro Oliveira',
    email: 'pedro@email.com',
    cargo: 'Desenvolvedor Backend'
  }
])

function handleEdit(user) {
  alert(`Editar usuário: ${user.nome}`)
}

function handleDelete(userId) {
  const index = usuarios.value.findIndex(u => u.id === userId)
  if (index !== -1 && confirm(`Deseja excluir ${usuarios.value[index].nome}?`)) {
    usuarios.value.splice(index, 1)
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
  background-color: #f5f5f5;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header h1 {
  margin-bottom: 0.5rem;
}

.header p {
  opacity: 0.9;
}

.container {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  width: 100%;
}

.tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 0;
}

.tabs button {
  padding: 1rem 2rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  color: #666;
  border-bottom: 3px solid transparent;
  transition: all 0.3s;
  margin-bottom: -2px;
}

.tabs button:hover {
  color: #42b983;
}

.tabs button.active {
  color: #42b983;
  border-bottom-color: #42b983;
  font-weight: bold;
}

.content {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.tab-content h2 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.tab-content p {
  color: #666;
  margin-bottom: 2rem;
}

.user-cards {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.footer {
  background-color: #2c3e50;
  color: white;
  text-align: center;
  padding: 1.5rem;
  margin-top: 2rem;
}

.footer p {
  margin: 0;
}
</style>
