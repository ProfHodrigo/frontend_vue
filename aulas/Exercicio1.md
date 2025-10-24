# Exercício 1: Dashboard do Usuário

## Objetivo

Criar um componente Dashboard que exibe informações do usuário autenticado com estatísticas da sessão.

---

## Contexto

Você já tem um sistema de autenticação funcionando. Agora vamos criar uma tela de dashboard que mostra informações relevantes do usuário logado, como:
- Nome e email
- Data de cadastro
- Tempo de sessão atual
- Estatísticas básicas

---

## Passo 1: Criar o componente Dashboard

Crie o arquivo `src/components/Dashboard.vue`:

```vue
<template>
  <div class="dashboard">
    <div class="card">
      <div class="card-header bg-info text-white">
        <h5 class="mb-0">
          <i class="fas fa-tachometer-alt me-2"></i>
          Dashboard
        </h5>
      </div>
      
      <div class="card-body">
        <!-- Passo 2: Informações do usuário -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {
      usuario: null,
      tempoSessao: '0s'
    }
  }
}
</script>

<style scoped>
.dashboard {
  margin-top: 20px;
}
</style>
```

---

## Passo 2: Importar e usar AuthService

No `<script>` do `Dashboard.vue`, importe o AuthService e busque dados do usuário:

```javascript
import AuthService from '@/services/AuthService'

export default {
  name: 'Dashboard',
  data() {
    return {
      usuario: null,
      tempoSessao: '0s',
      inicioSessao: null
    }
  },
  mounted() {
    // Buscar dados do usuário do localStorage
    this.usuario = AuthService.getCurrentUser()
    this.inicioSessao = Date.now()
    
    // Atualizar tempo de sessão a cada segundo
    this.intervaloTempo = setInterval(() => {
      this.atualizarTempoSessao()
    }, 1000)
  },
  beforeUnmount() {
    // Limpar intervalo ao destruir componente
    if (this.intervaloTempo) {
      clearInterval(this.intervaloTempo)
    }
  },
  methods: {
    atualizarTempoSessao() {
      const agora = Date.now()
      const diff = Math.floor((agora - this.inicioSessao) / 1000) // segundos
      
      const horas = Math.floor(diff / 3600)
      const minutos = Math.floor((diff % 3600) / 60)
      const segundos = diff % 60
      
      if (horas > 0) {
        this.tempoSessao = `${horas}h ${minutos}m ${segundos}s`
      } else if (minutos > 0) {
        this.tempoSessao = `${minutos}m ${segundos}s`
      } else {
        this.tempoSessao = `${segundos}s`
      }
    }
  }
}
```

**O que fizemos**:
- Importamos `AuthService` para acessar dados do usuário
- No `mounted()`, buscamos o usuário com `getCurrentUser()`
- Criamos um intervalo que atualiza o tempo de sessão a cada segundo
- No `beforeUnmount()`, limpamos o intervalo para evitar memory leaks

---

## Passo 3: Exibir informações do usuário no template

Atualize a seção `<div class="card-body">` do template:

```vue
<div class="card-body">
  <div v-if="!usuario" class="text-center text-muted">
    <i class="fas fa-spinner fa-spin fa-2x mb-2"></i>
    <div>Carregando...</div>
  </div>

  <div v-else>
    <!-- Informações básicas -->
    <div class="row mb-4">
      <div class="col-md-6">
        <h6 class="text-muted mb-3">
          <i class="fas fa-user me-2"></i>
          Informações Pessoais
        </h6>
        
        <div class="mb-2">
          <strong>Nome:</strong> {{ usuario.nome }}
        </div>
        <div class="mb-2">
          <strong>Email:</strong> {{ usuario.email }}
        </div>
        <div class="mb-2">
          <strong>Membro desde:</strong> {{ formatarData(usuario.data_criacao) }}
        </div>
      </div>

      <div class="col-md-6">
        <h6 class="text-muted mb-3">
          <i class="fas fa-clock me-2"></i>
          Sessão Atual
        </h6>
        
        <div class="mb-2">
          <strong>Tempo de sessão:</strong> {{ tempoSessao }}
        </div>
        <div class="mb-2">
          <strong>Status:</strong> 
          <span class="badge bg-success">Ativo</span>
        </div>
      </div>
    </div>

    <!-- Estatísticas -->
    <div class="row">
      <div class="col-md-4 mb-3">
        <div class="card bg-primary text-white">
          <div class="card-body text-center">
            <i class="fas fa-sign-in-alt fa-2x mb-2"></i>
            <h3 class="mb-0">{{ totalLogins }}</h3>
            <small>Total de Logins</small>
          </div>
        </div>
      </div>

      <div class="col-md-4 mb-3">
        <div class="card bg-success text-white">
          <div class="card-body text-center">
            <i class="fas fa-calendar-check fa-2x mb-2"></i>
            <h3 class="mb-0">{{ diasDesdeRegistro }}</h3>
            <small>Dias Cadastrado</small>
          </div>
        </div>
      </div>

      <div class="col-md-4 mb-3">
        <div class="card bg-info text-white">
          <div class="card-body text-center">
            <i class="fas fa-shield-alt fa-2x mb-2"></i>
            <h3 class="mb-0">{{ tokenValido ? 'Válido' : 'Inválido' }}</h3>
            <small>Status do Token</small>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

---

## Passo 4: Adicionar computed properties para estatísticas

No `<script>`, adicione a seção `computed` após `data()`:

```javascript
computed: {
  totalLogins() {
    // Buscar do localStorage (incrementar a cada login)
    const count = localStorage.getItem('total_logins')
    return count ? parseInt(count) : 1
  },
  
  diasDesdeRegistro() {
    if (!this.usuario || !this.usuario.data_criacao) return 0
    
    const dataCriacao = new Date(this.usuario.data_criacao)
    const agora = new Date()
    const diff = agora - dataCriacao
    const dias = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    return dias
  },
  
  tokenValido() {
    return AuthService.isAuthenticated()
  }
}
```

---

## Passo 5: Adicionar método para formatar data

Adicione este método na seção `methods`:

```javascript
methods: {
  // ... métodos anteriores (atualizarTempoSessao)
  
  formatarData(dataISO) {
    if (!dataISO) return 'N/A'
    
    const data = new Date(dataISO)
    const opcoes = { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    }
    
    return data.toLocaleDateString('pt-BR', opcoes)
  }
}
```

---

## Passo 6: Incrementar contador de logins

Para que o `totalLogins` funcione, precisamos incrementá-lo no `AuthService.login()`.

Abra `src/services/AuthService.js` e modifique o método `login`:

```javascript
static async login(credentials) {
  try {
    const response = await api.post('/login', credentials)
    const { access_token, user } = response.data
    
    localStorage.setItem('authToken', access_token)
    localStorage.setItem('userData', JSON.stringify(user))
    
    // Incrementar contador de logins
    const totalLogins = parseInt(localStorage.getItem('total_logins') || '0')
    localStorage.setItem('total_logins', (totalLogins + 1).toString())
    
    return {
      sucesso: true,
      token: access_token,
      usuario: user,
      mensagem: 'Login realizado com sucesso!'
    }
  } catch (error) {
    return {
      sucesso: false,
      token: null,
      usuario: null,
      mensagem: this.tratarErroAuth(error)
    }
  }
}
```

---

## Passo 7: Integrar Dashboard no App.vue

Abra `src/App.vue` e importe o componente:

```javascript
import Dashboard from '@/components/Dashboard.vue'

export default {
  name: 'App',
  components: { 
    LoginForm, 
    CadastroForm, 
    Dashboard  // ← adicionar aqui
  },
  // ... resto do código
}
```

No template do `App.vue`, adicione o Dashboard na área autenticada (logo após o `<main>`):

```vue
<main class="container my-4">
  <!-- Adicionar Dashboard aqui -->
  <Dashboard />
  
  <!-- Resto do conteúdo (cards existentes) -->
  <div class="row">
    <!-- ... código existente ... -->
  </div>
</main>
```

---

## Passo 8: Testar

1. Salve todos os arquivos
2. Certifique-se de que backend e frontend estão rodando
3. Faça login com `prof@admin.com / admin123`
4. Você deve ver:
   - Nome, email e data de cadastro
   - Tempo de sessão sendo atualizado a cada segundo
   - Cards com estatísticas (total de logins, dias cadastrado, status do token)

---

**Dica**: Se tiver dúvidas, consulte os componentes existentes (`LoginForm.vue`, `App.vue`) para ver exemplos de como estruturar Vue components.

---

## Próximo Exercício

Continue para `Exercicio2.md` para implementar edição de perfil!
