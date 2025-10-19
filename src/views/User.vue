<template>
  <div class="user">
    <h1>Perfil do Usuário {{ id }}</h1>
    
    <div class="user-info" v-if="user">
      <h2>{{ user.name }}</h2>
      <p>{{ user.email }}</p>
      <p>{{ user.description }}</p>
    </div>

    <button @click="voltar" class="nav-button">
      Voltar para Home
    </button>
  </div>
</template>

<script>
export default {
  name: 'User',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      user: null
    }
  },
  created() {
    // Simulando dados de um usuário
    this.user = {
      id: this.id,
      name: `Usuário ${this.id}`,
      email: `user${this.id}@example.com`,
      description: 'Este é um exemplo de perfil de usuário utilizando parâmetros de rota.'
    }
  },
  methods: {
    voltar() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
.user {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

.user-info {
  margin: 20px 0;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.nav-button {
  padding: 8px 16px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;
}

.nav-button:hover {
  opacity: 0.9;
}
</style>