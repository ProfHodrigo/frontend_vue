<template>
  <div class="home">
    <h1>Bem-vindo ao Vue Router</h1>
    <p>Demonstração de navegação entre páginas</p>

    <!-- Navegação Declarativa -->
    <div class="navigation-section">
      <h2>Navegação com router-link</h2>
      <nav class="nav-buttons">
        <router-link to="/" class="nav-button">Home</router-link>
        <router-link to="/sobre" class="nav-button">Sobre</router-link>
        <router-link :to="{ name: 'User', params: { id: 1 }}" class="nav-button">
          Usuário 1
        </router-link>
      </nav>
    </div>

    <!-- Navegação Programática -->
    <div class="navigation-section">
      <h2>Navegação Programática</h2>
      <div class="nav-buttons">
        <button @click="irParaSobre" class="nav-button">Ir para Sobre</button>
        <button @click="verUsuario" class="nav-button">Ver Usuário 2</button>
        <button @click="voltar" class="nav-button secondary">Voltar</button>
      </div>
    </div>

    <!-- Navegação com Parâmetros e Query -->
    <div class="navigation-section">
      <h2>Navegação com Parâmetros e Query</h2>
      <div class="form-group">
        <label>ID do Usuário:</label>
        <input v-model="userId" type="number" class="form-control" placeholder="Ex: 123">
        <button @click="verPerfilUsuario" class="nav-button" :disabled="!userId">
          Ver Perfil
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      userId: '',
      categoria: ''
    }
  },
  methods: {
    irParaSobre() {
      this.$router.push('/sobre')
    },
    verUsuario() {
      this.$router.push({ name: 'User', params: { id: 2 }})
    },
    voltar() {
      this.$router.go(-1)
    },
    verPerfilUsuario() {
      if (this.userId) {
        this.$router.push({
          name: 'User',
          params: { id: this.userId }
        })
      }
    }
  }
}
</script>

<style scoped>
.home {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.navigation-section {
  margin: 30px 0;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.nav-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 15px;
}

.nav-button {
  padding: 8px 16px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  font-weight: bold;
}

.nav-button.secondary {
  background-color: #666;
}

.nav-button:hover {
  opacity: 0.9;
}

.form-group {
  margin-top: 20px;
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-control {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.mt-3 {
  margin-top: 15px;
}
</style>