<template>
  <div class="cadastro-form">
    <div class="card shadow-lg" style="max-width: 450px; margin: 0 auto;">
      <div class="card-header bg-success text-white text-center">
        <h4 class="mb-0">
          <i class="fas fa-user-plus me-2"></i>
          Criar Conta
        </h4>
      </div>
      
      <div class="card-body">
        <div v-if="mensagem" class="alert" :class="alertClass" role="alert">
          <i class="fas" :class="mensagem.tipo === 'erro' ? 'fa-exclamation-triangle' : 'fa-check-circle'"></i>
          {{ mensagem.texto }}
        </div>

        <form @submit.prevent="fazerCadastro">
          <div class="mb-3">
            <label for="nome" class="form-label">
              <i class="fas fa-user me-2"></i>
              Nome Completo
            </label>
            <input
              id="nome"
              v-model.trim="form.nome"
              type="text"
              class="form-control"
              :class="{ 'is-invalid': erros.nome }"
              placeholder="Seu nome completo"
              required
              :disabled="fazendoCadastro"
              autocomplete="name"
            >
            <div v-if="erros.nome" class="invalid-feedback">
              {{ erros.nome }}
            </div>
          </div>

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
              :disabled="fazendoCadastro"
              autocomplete="email"
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
                :disabled="fazendoCadastro"
                autocomplete="new-password"
              >
              <button
                type="button"
                class="btn btn-outline-secondary"
                @click="mostrarSenha = !mostrarSenha"
                :disabled="fazendoCadastro"
              >
                <i class="fas" :class="mostrarSenha ? 'fa-eye-slash' : 'fa-eye'"></i>
              </button>
            </div>
            <div v-if="erros.senha" class="invalid-feedback">
              {{ erros.senha }}
            </div>
            <div class="form-text">
              <small>A senha deve ter pelo menos 8 caracteres</small>
            </div>
          </div>

          <div class="mb-3">
            <label for="confirmarSenha" class="form-label">
              <i class="fas fa-lock me-2"></i>
              Confirmar Senha
            </label>
            <input
              id="confirmarSenha"
              v-model="form.confirmarSenha"
              :type="mostrarSenha ? 'text' : 'password'"
              class="form-control"
              :class="{ 'is-invalid': erros.confirmarSenha }"
              placeholder="Confirme sua senha"
              required
              :disabled="fazendoCadastro"
              autocomplete="new-password"
            >
            <div v-if="erros.confirmarSenha" class="invalid-feedback">
              {{ erros.confirmarSenha }}
            </div>
          </div>

          <div v-if="form.senha" class="mb-3">
            <div class="progress" style="height: 8px;">
              <div
                class="progress-bar"
                :class="forcaSenhaClass"
                :style="{ width: forcaSenhaPercent + '%' }"
              ></div>
            </div>
            <small :class="forcaSenhaTextClass">
              Força: {{ forcaSenhaTexto }}
            </small>
          </div>

          <div class="mb-3 form-check">
            <input
              id="aceitarTermos"
              v-model="form.aceitarTermos"
              type="checkbox"
              class="form-check-input"
              :class="{ 'is-invalid': erros.aceitarTermos }"
              required
              :disabled="fazendoCadastro"
            >
            <label for="aceitarTermos" class="form-check-label">
              Aceito os <a href="#" @click.prevent="mostrarTermos">termos de uso</a> 
              e <a href="#" @click.prevent="mostrarPrivacidade">política de privacidade</a>
            </label>
            <div v-if="erros.aceitarTermos" class="invalid-feedback">
              {{ erros.aceitarTermos }}
            </div>
          </div>

          <div class="d-grid">
            <button
              type="submit"
              class="btn btn-success"
              :disabled="!formularioValido || fazendoCadastro"
            >
              <span v-if="fazendoCadastro" class="spinner-border spinner-border-sm me-2"></span>
              <i v-else class="fas fa-user-plus me-2"></i>
              {{ fazendoCadastro ? 'Cadastrando...' : 'Criar Conta' }}
            </button>
          </div>
        </form>

        <div class="text-center mt-3">
          <p class="small text-muted mb-0">
            Já tem uma conta?
            <a href="#" @click.prevent="$emit('mostrar-login')" class="text-decoration-none">
              Faça login aqui
            </a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { AuthService } from '@/services/AuthService'

export default {
  name: 'CadastroForm',
  emits: ['mostrar-login', 'cadastro-sucesso'],
  data() {
    return {
      form: {
        nome: '',
        email: '',
        senha: '',
        confirmarSenha: '',
        aceitarTermos: false
      },
      erros: {},
      mensagem: null,
      fazendoCadastro: false,
      mostrarSenha: false
    }
  },
  computed: {
    formularioValido() {
      return this.form.nome && 
             this.form.email && 
             this.form.senha &&
             this.form.confirmarSenha &&
             this.form.aceitarTermos &&
             this.isValidEmail(this.form.email) &&
             this.form.senha === this.form.confirmarSenha &&
             this.form.senha.length >= 8 &&
             Object.keys(this.erros).length === 0
    },
    alertClass() {
      return {
        'alert-success': this.mensagem?.tipo === 'sucesso',
        'alert-danger': this.mensagem?.tipo === 'erro',
        'alert-info': this.mensagem?.tipo === 'info'
      }
    },
    forcaSenha() {
      const senha = this.form.senha
      let score = 0
      if (senha.length >= 8) score += 1
      if (senha.length >= 12) score += 1
      if (/[a-z]/.test(senha)) score += 1
      if (/[A-Z]/.test(senha)) score += 1
      if (/[0-9]/.test(senha)) score += 1
      if (/[^A-Za-z0-9]/.test(senha)) score += 1
      return score
    },
    forcaSenhaPercent() { return (this.forcaSenha / 6) * 100 },
    forcaSenhaClass() {
      const score = this.forcaSenha
      if (score <= 2) return 'bg-danger'
      if (score <= 4) return 'bg-warning'
      return 'bg-success'
    },
    forcaSenhaTexto() {
      const score = this.forcaSenha
      if (score <= 2) return 'Fraca'
      if (score <= 4) return 'Média'
      return 'Forte'
    },
    forcaSenhaTextClass() {
      const score = this.forcaSenha
      if (score <= 2) return 'text-danger'
      if (score <= 4) return 'text-warning'
      return 'text-success'
    }
  },
  watch: {
    'form.nome'() { this.validarNome() },
    'form.email'() { this.validarEmail() },
    'form.senha'() { this.validarSenha(); if (this.form.confirmarSenha) this.validarConfirmarSenha() },
    'form.confirmarSenha'() { this.validarConfirmarSenha() },
    'form.aceitarTermos'() { this.validarTermos() }
  },
  methods: {
    async fazerCadastro() {
      this.validarFormulario()
      if (!this.formularioValido) {
        this.mostrarMensagem('erro', 'Corrija os erros no formulário')
        return
      }

      this.fazendoCadastro = true
      this.mensagem = null

      try {
        const resultado = await AuthService.cadastrar({
          nome: this.form.nome,
          email: this.form.email,
          senha: this.form.senha
        })

        if (resultado.sucesso) {
          this.mostrarMensagem('sucesso', resultado.mensagem)
          setTimeout(() => { this.$emit('cadastro-sucesso') }, 2000)
        } else {
          this.mostrarMensagem('erro', resultado.mensagem)
        }
      } catch (error) {
        console.error('Erro inesperado no cadastro:', error)
        this.mostrarMensagem('erro', 'Erro inesperado. Tente novamente.')
      } finally {
        this.fazendoCadastro = false
      }
    },

    validarFormulario() { this.erros = {}; this.validarNome(); this.validarEmail(); this.validarSenha(); this.validarConfirmarSenha(); this.validarTermos() },

    validarNome() { if (!this.form.nome) { this.erros.nome = 'Nome é obrigatório' } else if (this.form.nome.length < 2) { this.erros.nome = 'Nome deve ter pelo menos 2 caracteres' } else { delete this.erros.nome } },
    validarEmail() { if (!this.form.email) { this.erros.email = 'Email é obrigatório' } else if (!this.isValidEmail(this.form.email)) { this.erros.email = 'Email inválido' } else { delete this.erros.email } },
    validarSenha() { if (!this.form.senha) { this.erros.senha = 'Senha é obrigatória' } else if (this.form.senha.length < 8) { this.erros.senha = 'Senha deve ter pelo menos 8 caracteres' } else { delete this.erros.senha } },
    validarConfirmarSenha() { if (!this.form.confirmarSenha) { this.erros.confirmarSenha = 'Confirmação de senha é obrigatória' } else if (this.form.senha !== this.form.confirmarSenha) { this.erros.confirmarSenha = 'Senhas não coincidem' } else { delete this.erros.confirmarSenha } },
    validarTermos() { if (!this.form.aceitarTermos) { this.erros.aceitarTermos = 'Você deve aceitar os termos de uso' } else { delete this.erros.aceitarTermos } },

    isValidEmail(email) { const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; return regex.test(email) },

    mostrarMensagem(tipo, texto) { this.mensagem = { tipo, texto }; setTimeout(() => { this.mensagem = null }, 5000) },
    mostrarTermos() { this.mostrarMensagem('info', 'Termos de uso em desenvolvimento.') },
    mostrarPrivacidade() { this.mostrarMensagem('info', 'Política de privacidade em desenvolvimento.') }
  }
}
</script>

<style scoped>
.cadastro-form { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); padding: 20px; }
.card { backdrop-filter: blur(10px); background: rgba(255,255,255,0.95); border: none }
.form-control:focus { border-color: #11998e; box-shadow: 0 0 0 0.2rem rgba(17,153,142,0.25) }
.btn-success { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); border: none }
.invalid-feedback { display: block }
.progress { border-radius: 10px; overflow: hidden }
.progress-bar { transition: all 0.3s ease }
</style>
