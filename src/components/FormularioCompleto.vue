<template>
  <div class="card">
    <div class="card-header bg-primary text-white">
      <h3 class="mb-0">
        <i class="fas fa-user-plus me-2"></i>
        Formulário de Cadastro
      </h3>
    </div>
    
    <div class="card-body">
      <form @submit.prevent="handleSubmit" novalidate>
        <!-- Dados Pessoais -->
        <div class="mb-4">
          <h4 class="border-bottom pb-2">Dados Pessoais</h4>
          
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label">Nome <span class="text-danger">*</span></label>
              <input
                v-model="form.nome"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': hasFieldError('nome') }"
                @blur="validateField('nome')"
                placeholder="Seu nome completo"
              >
              <div class="invalid-feedback">{{ getFieldError('nome') }}</div>
            </div>
            
            <div class="col-md-6">
              <label class="form-label">Email <span class="text-danger">*</span></label>
              <input
                v-model="form.email"
                type="email"
                class="form-control"
                :class="{ 'is-invalid': hasFieldError('email') }"
                @blur="validateField('email')"
                placeholder="seu@email.com"
              >
              <div class="invalid-feedback">{{ getFieldError('email') }}</div>
            </div>
            
            <div class="col-md-6">
              <label class="form-label">CPF <span class="text-danger">*</span></label>
              <input
                v-model="form.cpf"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': hasFieldError('cpf') }"
                @blur="validateField('cpf')"
                placeholder="000.000.000-00"
              >
              <div class="invalid-feedback">{{ getFieldError('cpf') }}</div>
            </div>
            
            <div class="col-md-6">
              <label class="form-label">Telefone <span class="text-danger">*</span></label>
              <input
                v-model="form.telefone"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': hasFieldError('telefone') }"
                @blur="validateField('telefone')"
                placeholder="(00) 00000-0000"
              >
              <div class="invalid-feedback">{{ getFieldError('telefone') }}</div>
            </div>
          </div>
        </div>

        <!-- Endereço -->
        <div class="mb-4">
          <h4 class="border-bottom pb-2">Endereço</h4>
          
          <div class="row g-3">
            <div class="col-md-4">
              <label class="form-label">CEP <span class="text-danger">*</span></label>
              <input
                v-model="form.cep"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': hasFieldError('cep') }"
                @blur="validateField('cep')"
                placeholder="00000-000"
              >
              <div class="invalid-feedback">{{ getFieldError('cep') }}</div>
            </div>
            
            <div class="col-md-8">
              <label class="form-label">Logradouro <span class="text-danger">*</span></label>
              <input
                v-model="form.logradouro"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': hasFieldError('logradouro') }"
                @blur="validateField('logradouro')"
                placeholder="Rua, Avenida, etc"
              >
              <div class="invalid-feedback">{{ getFieldError('logradouro') }}</div>
            </div>
          </div>
        </div>

        <!-- Botões -->
        <div class="d-flex justify-content-between">
          <button 
            type="button" 
            class="btn btn-secondary"
            @click="resetForm"
          >
            <i class="fas fa-undo me-2"></i>
            Limpar
          </button>
          
          <button 
            type="submit"
            class="btn btn-primary"
            :disabled="!formValid || submitting"
          >
            <span v-if="submitting" class="spinner-border spinner-border-sm me-2"></span>
            <i v-else class="fas fa-save me-2"></i>
            {{ submitting ? 'Salvando...' : 'Salvar' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { FormValidator } from '@/utils/validators'

export default {
  name: 'FormularioCompleto',
  
  data() {
    return {
      form: {
        nome: '',
        email: '',
        cpf: '',
        telefone: '',
        cep: '',
        logradouro: ''
      },
      validator: new FormValidator(),
      submitting: false,
      validatedFields: new Set()
    }
  },
  
  computed: {
    formValid() {
      return this.validator.validate(this.form) && this.validatedFields.size > 0
    }
  },
  
  mounted() {
    this.setupValidation()
  },
  
  methods: {
    setupValidation() {
      this.validator
        .setRules('nome', ['required', { type: 'min', value: 3 }])
        .setRules('email', ['required', 'email'])
        .setRules('cpf', ['required', 'cpf'])
        .setRules('telefone', ['required'])
        .setRules('cep', ['required'])
        .setRules('logradouro', ['required'])
    },
    
    validateField(fieldName) {
      this.validator.validateField(fieldName, this.form[fieldName])
      this.validatedFields.add(fieldName)
    },
    
    hasFieldError(fieldName) {
      return this.validator.hasFieldError(fieldName)
    },
    
    getFieldError(fieldName) {
      return this.validator.getFirstFieldError(fieldName)
    },
    
    async handleSubmit() {
      // Validar todos os campos
      Object.keys(this.validator.rules).forEach(field => {
        this.validateField(field)
      })
      
      if (!this.formValid) {
        alert('Por favor, corrija os erros no formulário')
        return
      }
      
      this.submitting = true
      
      try {
        // Simular envio
        await new Promise(resolve => setTimeout(resolve, 1500))
        alert('Formulário enviado com sucesso!')
        this.resetForm()
      } catch (error) {
        alert('Erro ao enviar formulário: ' + error.message)
      } finally {
        this.submitting = false
      }
    },
    
    resetForm() {
      Object.keys(this.form).forEach(key => {
        this.form[key] = ''
      })
      this.validatedFields.clear()
      this.validator.clearErrors()
    }
  }
}
</script>

<style scoped>
.card {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}
</style>