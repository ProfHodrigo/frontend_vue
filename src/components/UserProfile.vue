<template>
  <div class="user-profile">
    <div v-if="userStore.isLoggedIn">
      <h3>{{ userStore.nomeCompleto }}</h3>
      <p>Email: {{ userStore.email }}</p>
      <button @click="userStore.logout()">Sair</button>
    </div>
    
    <div v-else>
      <input v-model="nome" placeholder="Nome">
      <input v-model="email" placeholder="Email">
      <button @click="fazerLogin">Entrar</button>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/user'

export default {
  name: 'UserProfile',
  setup() {
    const userStore = useUserStore()
    return { userStore }
  },
  data() {
    return {
      nome: '',
      email: ''
    }
  },
  methods: {
    fazerLogin() {
      this.userStore.login(this.nome, this.email)
      this.nome = ''
      this.email = ''
    }
  }
}
</script>

<style scoped>
.user-profile {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin: 20px;
}

input {
  display: block;
  margin: 10px 0;
  padding: 8px;
  width: 100%;
  max-width: 300px;
}

button {
  padding: 8px 16px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #35a372;
}
</style>
