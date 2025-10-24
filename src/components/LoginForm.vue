<template>
  <div class="login-form">
    <div class="card shadow-lg" style="max-width: 400px; margin: 0 auto;">
      <div class="card-header bg-primary text-white text-center">
        <h4 class="mb-0">
          <i class="fas fa-sign-in-alt me-2"></i>
          Entrar no Sistema
        </h4>
      </div>
      
      <div class="card-body">
        <div v-if="mensagem" class="alert" :class="alertClass" role="alert">
          <i class="fas" :class="mensagem.tipo === 'erro' ? 'fa-exclamation-triangle' : 'fa-check-circle'"></i>
          {{ mensagem.texto }}
        </div>

        <form @submit.prevent="fazerLogin">
          <div class="mb-3">
            <label for="email" class="form-label">
              <i class="fas fa-envelope me-2"></i>
              Email
            </label>
            <input
              id="email"
              v-model.trim="form.email"
              type="email"
              class="form-control"
              :class="{ 'is-invalid': erros.email }"
              placeholder="seu@email.com"
              required
              :disabled="fazendoLogin"
              autocomplete="username"
            >
            <div v-if="erros.email" class="invalid-feedback">
              {{ erros.email }}
            </div>
          </div>

          <div class="mb-3">
            <label for="senha" class="form-label">
              <i class="fas fa-lock me-2"></i>
              Senha
            </label>
            <div class="input-group">
              <input
                id="senha"
                v-model="form.senha"
                :type="mostrarSenha ? 'text' : 'password'"
                class="form-control"
                :class="{ 'is-invalid': erros.senha }"
                placeholder="Sua senha"
                required
                :disabled="fazendoLogin"
                autocomplete="current-password"
              >
              <button
                type="button"
                class="btn btn-outline-secondary"
                @click="mostrarSenha = !mostrarSenha"
                :disabled="fazendoLogin"
              >
                <i class="fas" :class="mostrarSenha ? 'fa-eye-slash' : 'fa-eye'"></i>
              </button>
            </div>
            <div v-if="erros.senha" class="invalid-feedback">
              {{ erros.senha }}
            </div>
          </div>

          <div class="mb-3 form-check">
            <input
              id="lembrarMe"
              v-model="form.lembrarMe"
              type="checkbox"
              class="form-check-input"
              :disabled="fazendoLogin"
            >
            <label for="lembrarMe" class="form-check-label">
              Lembrar-me neste dispositivo
            </label>
          </div>

          <div class="d-grid">
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="!formularioValido || fazendoLogin"
            >
              <span v-if="fazendoLogin" class="spinner-border spinner-border-sm me-2"></span>
              <i v-else class="fas fa-sign-in-alt me-2"></i>
              {{ fazendoLogin ? 'Entrando...' : 'Entrar' }}
            </button>
          </div>
        </form>

        <div class="text-center mt-3">
          <p class="small text-muted mb-2">
            Não tem uma conta?
            <a href="#" @click.prevent="$emit('mostrar-cadastro')" class="text-decoration-none">
              Cadastre-se aqui
            </a>
          </p>
          <a href="#" @click.prevent="mostrarEsqueceuSenha" class="small text-muted text-decoration-none">
            Esqueceu sua senha?
          </a>
        </div>
      </div>
    </div>

    <div v-if="isDevelopment" class="mt-4 card">
      <div class="card-header">
        <small>Debug Info (dev only)</small>
      </div>
      <div class="card-body">
        <small class="text-muted">
          <strong>Usuários de teste:</strong><br>
          prof@admin.com / admin123<br>
          aluno@user.com / user123
        </small>
      </div>
    </div>
  </div>
</template>

<script>
import { AuthService } from '@/services/AuthService'

export default {
  name: 'LoginForm',
  emits: ['mostrar-cadastro', 'login-sucesso'],
  data() {
    return {
      form: {
        email: '',
        senha: '',
        lembrarMe: false
      },
      erros: {},
      mensagem: null,
      fazendoLogin: false,
      mostrarSenha: false
    }
  },
  computed: {
    formularioValido() {
      return this.form.email && 
             this.form.senha && 
             this.isValidEmail(this.form.email) &&
             Object.keys(this.erros).length === 0
    },
    alertClass() {
      return {
        'alert-success': this.mensagem?.tipo === 'sucesso',
        'alert-danger': this.mensagem?.tipo === 'erro',
        'alert-info': this.mensagem?.tipo === 'info'
      }
    },
    isDevelopment() {
      return process.env.NODE_ENV === 'development'
    }
  },
  watch: {
    'form.email'() {
      this.validarEmail()
    },
    'form.senha'() {
      this.validarSenha()
    }
  },
  methods: {
    async fazerLogin() {
      this.validarFormulario()
      if (!this.formularioValido) {
        this.mostrarMensagem('erro', 'Corrija os erros no formulário')
        return
      }

      this.fazendoLogin = true
      this.mensagem = null

      try {
        const resultado = await AuthService.login({
          email: this.form.email,
          senha: this.form.senha
        })

        if (resultado.sucesso) {
          this.mostrarMensagem('sucesso', resultado.mensagem)
          setTimeout(() => {
            this.$emit('login-sucesso', resultado.usuario)
          }, 1000)
        } else {
          this.mostrarMensagem('erro', resultado.mensagem)
        }
      } catch (error) {
        console.error('Erro inesperado no login:', error)
        this.mostrarMensagem('erro', 'Erro inesperado. Tente novamente.')
      } finally {
        this.fazendoLogin = false
      }
    },

    validarFormulario() {
      this.erros = {}
      this.validarEmail()
      this.validarSenha()
    },

    validarEmail() {
      if (!this.form.email) {
        this.erros.email = 'Email é obrigatório'
      } else if (!this.isValidEmail(this.form.email)) {
        this.erros.email = 'Email inválido'
      } else {
        delete this.erros.email
      }
    },

    validarSenha() {
      if (!this.form.senha) {
        this.erros.senha = 'Senha é obrigatória'
      } else if (this.form.senha.length < 6) {
        this.erros.senha = 'Senha deve ter pelo menos 6 caracteres'
      } else {
        delete this.erros.senha
      }
    },

    isValidEmail(email) {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return regex.test(email)
    },

    mostrarMensagem(tipo, texto) {
      this.mensagem = { tipo, texto }
      setTimeout(() => { this.mensagem = null }, 5000)
    },

    mostrarEsqueceuSenha() {
      this.mostrarMensagem('info', 'Funcionalidade em desenvolvimento. Contate o administrador.')
    }
  }
}
</script>

<style scoped>
.login-form {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.card {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
  border: none;
}

.form-control:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

.btn-primary { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: none; }
.btn-primary:hover { transform: translateY(-1px); }
.invalid-feedback { display: block; }
.alert { animation: slideDown 0.3s ease-out; }
@keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
</style>
