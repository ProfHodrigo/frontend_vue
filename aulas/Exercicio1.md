# Exercício 1 - Formulário de Cadastro Multi-Etapas

## Objetivo

Criar um formulário de cadastro modular usando componentes Vue.js, com validação e feedback visual.

## Estrutura de Arquivos

```
src/
  components/
    cadastro/
      DadosPessoaisForm.vue
      EnderecoForm.vue
      SenhaForm.vue
      TermosForm.vue
  views/
    CadastroView.vue
  utils/
    validators.js
```

## Passo a Passo

### 1. Criar Utilitário de Validação

1. Criar arquivo `src/utils/validators.js`:

```javascript
export const validators = {
  required: (value) => !!value || 'Campo obrigatório',
  
  email: (value) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return !value || pattern.test(value) || 'Email inválido'
  },
  
  minLength: (min) => (value) => 
    !value || value.length >= min || `Mínimo ${min} caracteres`,
  
  maxLength: (max) => (value) => 
    !value || value.length <= max || `Máximo ${max} caracteres`,
  
  password: (value) => {
    const hasUpper = /[A-Z]/.test(value)
    const hasLower = /[a-z]/.test(value)
    const hasNumber = /\d/.test(value)
    if (!value) return true
    if (!hasUpper) return 'Necessário pelo menos uma letra maiúscula'
    if (!hasLower) return 'Necessário pelo menos uma letra minúscula'
    if (!hasNumber) return 'Necessário pelo menos um número'
    return true
  },
  
  matchPassword: (password) => (value) => 
    value === password || 'As senhas não coincidem',
  
  cpf: (value) => {
    if (!value) return true
    const cpf = value.replace(/\D/g, '')
    if (cpf.length !== 11) return 'CPF deve ter 11 dígitos'
    return true
  },
  
  phone: (value) => {
    if (!value) return true
    const phone = value.replace(/\D/g, '')
    return phone.length >= 10 || 'Telefone inválido'
  },
  
  age18: (value) => {
    if (!value) return true
    const birth = new Date(value)
    const age = Math.floor((Date.now() - birth) / 31557600000)
    return age >= 18 || 'Deve ser maior de 18 anos'
  }
}
```

### 2. Criar Componentes de Formulário

1. **DadosPessoaisForm.vue** (`src/components/cadastro/DadosPessoaisForm.vue`):

```vue
<template>
  <div class="dados-pessoais">
    <h3 class="mb-4">Dados Pessoais</h3>
    
    <div class="row g-3">
      <div class="col-md-6">
        <label class="form-label">Nome Completo *</label>
        <input
          v-model="form.nome"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errors.nome }"
          @blur="validate('nome')"
        >
        <div class="invalid-feedback">{{ errors.nome }}</div>
      </div>

      <div class="col-md-6">
        <label class="form-label">Email *</label>
        <input
          v-model="form.email"
          type="email"
          class="form-control"
          :class="{ 'is-invalid': errors.email }"
          @blur="validate('email')"
        >
        <div class="invalid-feedback">{{ errors.email }}</div>
      </div>

      <div class="col-md-6">
        <label class="form-label">CPF *</label>
        <input
          v-model="form.cpf"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errors.cpf }"
          @blur="validate('cpf')"
        >
        <div class="invalid-feedback">{{ errors.cpf }}</div>
      </div>

      <div class="col-md-6">
        <label class="form-label">Data de Nascimento *</label>
        <input
          v-model="form.nascimento"
          type="date"
          class="form-control"
          :class="{ 'is-invalid': errors.nascimento }"
          @blur="validate('nascimento')"
        >
        <div class="invalid-feedback">{{ errors.nascimento }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { validators } from '@/utils/validators'

export default {
  name: 'DadosPessoaisForm',
  data() {
    return {
      form: {
        nome: '',
        email: '',
        cpf: '',
        nascimento: ''
      },
      errors: {}
    }
  },
  methods: {
    validate(field) {
      const rules = {
        nome: [validators.required, validators.minLength(3)],
        email: [validators.required, validators.email],
        cpf: [validators.required, validators.cpf],
        nascimento: [validators.required, validators.age18]
      }

      const value = this.form[field]
      const fieldRules = rules[field]

      for (const rule of fieldRules) {
        const result = rule(value)
        if (result !== true) {
          this.errors[field] = result
          return false
        }
      }

      this.errors[field] = null
      return true
    },
    validateAll() {
      return Object.keys(this.form).every(field => this.validate(field))
    },
    getData() {
      return this.form
    }
  }
}
</script>
```

2. **EnderecoForm.vue** (`src/components/cadastro/EnderecoForm.vue`):

```vue
<template>
  <div class="endereco">
    <h3 class="mb-4">Endereço</h3>
    
    <div class="row g-3">
      <div class="col-md-4">
        <label class="form-label">CEP *</label>
        <input
          v-model="form.cep"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errors.cep }"
          @blur="validate('cep')"
        >
        <div class="invalid-feedback">{{ errors.cep }}</div>
      </div>

      <div class="col-md-8">
        <label class="form-label">Logradouro *</label>
        <input
          v-model="form.logradouro"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errors.logradouro }"
          @blur="validate('logradouro')"
        >
        <div class="invalid-feedback">{{ errors.logradouro }}</div>
      </div>

      <div class="col-md-4">
        <label class="form-label">Número *</label>
        <input
          v-model="form.numero"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errors.numero }"
          @blur="validate('numero')"
        >
        <div class="invalid-feedback">{{ errors.numero }}</div>
      </div>

      <div class="col-md-8">
        <label class="form-label">Complemento</label>
        <input
          v-model="form.complemento"
          type="text"
          class="form-control"
        >
      </div>

      <div class="col-md-6">
        <label class="form-label">Cidade *</label>
        <input
          v-model="form.cidade"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errors.cidade }"
          @blur="validate('cidade')"
        >
        <div class="invalid-feedback">{{ errors.cidade }}</div>
      </div>

      <div class="col-md-6">
        <label class="form-label">Estado *</label>
        <select
          v-model="form.estado"
          class="form-select"
          :class="{ 'is-invalid': errors.estado }"
          @blur="validate('estado')"
        >
          <option value="">Selecione...</option>
          <option v-for="estado in estados" :key="estado" :value="estado">
            {{ estado }}
          </option>
        </select>
        <div class="invalid-feedback">{{ errors.estado }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { validators } from '@/utils/validators'

export default {
  name: 'EnderecoForm',
  data() {
    return {
      form: {
        cep: '',
        logradouro: '',
        numero: '',
        complemento: '',
        cidade: '',
        estado: ''
      },
      errors: {},
      estados: [
        'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
        'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
        'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
      ]
    }
  },
  methods: {
    validate(field) {
      const rules = {
        cep: [validators.required],
        logradouro: [validators.required],
        numero: [validators.required],
        cidade: [validators.required],
        estado: [validators.required]
      }

      const value = this.form[field]
      const fieldRules = rules[field]

      if (!fieldRules) return true

      for (const rule of fieldRules) {
        const result = rule(value)
        if (result !== true) {
          this.errors[field] = result
          return false
        }
      }

      this.errors[field] = null
      return true
    },
    validateAll() {
      return Object.keys(this.form)
        .filter(field => field !== 'complemento')
        .every(field => this.validate(field))
    },
    getData() {
      return this.form
    }
  }
}
</script>
```

3. **SenhaForm.vue** (`src/components/cadastro/SenhaForm.vue`):

```vue
<template>
  <div class="senha">
    <h3 class="mb-4">Senha</h3>
    
    <div class="row g-3">
      <div class="col-md-6">
        <label class="form-label">Senha *</label>
        <div class="input-group">
          <input
            v-model="form.senha"
            :type="showPassword ? 'text' : 'password'"
            class="form-control"
            :class="{ 'is-invalid': errors.senha }"
            @blur="validate('senha')"
          >
          <button 
            class="btn btn-outline-secondary" 
            type="button"
            @click="showPassword = !showPassword"
          >
            <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
          </button>
          <div class="invalid-feedback">{{ errors.senha }}</div>
        </div>
        
        <!-- Indicador de força da senha -->
        <div v-if="form.senha" class="password-strength mt-2">
          <div class="progress" style="height: 5px;">
            <div 
              class="progress-bar" 
              :class="strengthClass"
              :style="{ width: strengthPercent + '%' }"
            ></div>
          </div>
          <small :class="strengthTextClass">{{ strengthText }}</small>
        </div>
      </div>

      <div class="col-md-6">
        <label class="form-label">Confirmar Senha *</label>
        <input
          v-model="form.confirmarSenha"
          :type="showPassword ? 'text' : 'password'"
          class="form-control"
          :class="{ 'is-invalid': errors.confirmarSenha }"
          @blur="validate('confirmarSenha')"
        >
        <div class="invalid-feedback">{{ errors.confirmarSenha }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { validators } from '@/utils/validators'

export default {
  name: 'SenhaForm',
  data() {
    return {
      form: {
        senha: '',
        confirmarSenha: ''
      },
      errors: {},
      showPassword: false
    }
  },
  computed: {
    passwordStrength() {
      const senha = this.form.senha
      if (!senha) return 0
      
      let score = 0
      if (senha.length >= 8) score++
      if (/[A-Z]/.test(senha)) score++
      if (/[a-z]/.test(senha)) score++
      if (/[0-9]/.test(senha)) score++
      if (/[^A-Za-z0-9]/.test(senha)) score++
      
      return score
    },
    strengthPercent() {
      return (this.passwordStrength / 5) * 100
    },
    strengthClass() {
      const score = this.passwordStrength
      if (score <= 2) return 'bg-danger'
      if (score <= 3) return 'bg-warning'
      return 'bg-success'
    },
    strengthText() {
      const score = this.passwordStrength
      if (score <= 2) return 'Fraca'
      if (score <= 3) return 'Média'
      return 'Forte'
    },
    strengthTextClass() {
      const score = this.passwordStrength
      if (score <= 2) return 'text-danger'
      if (score <= 3) return 'text-warning'
      return 'text-success'
    }
  },
  methods: {
    validate(field) {
      const rules = {
        senha: [
          validators.required,
          validators.minLength(8),
          validators.password
        ],
        confirmarSenha: [
          validators.required,
          validators.matchPassword(this.form.senha)
        ]
      }

      const value = this.form[field]
      const fieldRules = rules[field]

      for (const rule of fieldRules) {
        const result = rule(value)
        if (result !== true) {
          this.errors[field] = result
          return false
        }
      }

      this.errors[field] = null
      return true
    },
    validateAll() {
      return Object.keys(this.form).every(field => this.validate(field))
    },
    getData() {
      return this.form
    }
  }
}
</script>

<style scoped>
.password-strength {
  font-size: 0.875rem;
}
</style>
```

4. **TermosForm.vue** (`src/components/cadastro/TermosForm.vue`):

```vue
<template>
  <div class="termos">
    <h3 class="mb-4">Termos e Condições</h3>
    
    <div class="card mb-3">
      <div class="card-body">
        <h5>Termos de Uso</h5>
        <p class="mb-0">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
          Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>
    </div>
    
    <div class="form-check">
      <input
        v-model="form.aceitarTermos"
        type="checkbox"
        class="form-check-input"
        :class="{ 'is-invalid': errors.aceitarTermos }"
        id="termos"
        @change="validate('aceitarTermos')"
      >
      <label class="form-check-label" for="termos">
        Li e aceito os termos de uso e política de privacidade *
      </label>
      <div class="invalid-feedback">{{ errors.aceitarTermos }}</div>
    </div>
  </div>
</template>

<script>
import { validators } from '@/utils/validators'

export default {
  name: 'TermosForm',
  data() {
    return {
      form: {
        aceitarTermos: false
      },
      errors: {}
    }
  },
  methods: {
    validate(field) {
      if (field === 'aceitarTermos') {
        if (!this.form.aceitarTermos) {
          this.errors.aceitarTermos = 'Você deve aceitar os termos'
          return false
        }
        this.errors.aceitarTermos = null
        return true
      }
      return true
    },
    validateAll() {
      return this.validate('aceitarTermos')
    },
    getData() {
      return this.form
    }
  }
}
</script>
```

### 3. Criar View Principal

Criar arquivo `src/views/CadastroView.vue`:

```vue
<template>
  <div class="cadastro-view">
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-10">
          <div class="card shadow">
            <div class="card-header bg-primary text-white">
              <h2 class="mb-0">Cadastro de Usuário</h2>
            </div>
            
            <div class="card-body">
              <!-- Progress Bar -->
              <div class="progress mb-4" style="height: 5px;">
                <div 
                  class="progress-bar bg-success" 
                  :style="{ width: progress + '%' }"
                ></div>
              </div>
              
              <!-- Formulário -->
              <form @submit.prevent="handleSubmit">
                <div class="mb-5">
                  <DadosPessoaisForm ref="dadosPessoais" />
                </div>
                
                <div class="mb-5">
                  <EnderecoForm ref="endereco" />
                </div>
                
                <div class="mb-5">
                  <SenhaForm ref="senha" />
                </div>
                
                <div class="mb-5">
                  <TermosForm ref="termos" />
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
                    :disabled="!isValid || submitting"
                  >
                    <span v-if="submitting" class="spinner-border spinner-border-sm me-2"></span>
                    <i v-else class="fas fa-save me-2"></i>
                    {{ submitting ? 'Salvando...' : 'Cadastrar' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          <!-- Preview (desenvolvimento) -->
          <div v-if="showPreview" class="card mt-4">
            <div class="card-header">
              <h4 class="mb-0">Preview dos Dados</h4>
            </div>
            <div class="card-body">
              <pre>{{ formData }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DadosPessoaisForm from '@/components/cadastro/DadosPessoaisForm.vue'
import EnderecoForm from '@/components/cadastro/EnderecoForm.vue'
import SenhaForm from '@/components/cadastro/SenhaForm.vue'
import TermosForm from '@/components/cadastro/TermosForm.vue'

export default {
  name: 'CadastroView',
  components: {
    DadosPessoaisForm,
    EnderecoForm,
    SenhaForm,
    TermosForm
  },
  data() {
    return {
      submitting: false,
      showPreview: true // Alterar para false em produção
    }
  },
  computed: {
    isValid() {
      return this.getFormRefs().every(ref => ref.validateAll())
    },
    progress() {
      const forms = this.getFormRefs()
      const validForms = forms.filter(ref => ref.validateAll()).length
      return (validForms / forms.length) * 100
    },
    formData() {
      const data = {}
      this.getFormRefs().forEach(ref => {
        Object.assign(data, ref.getData())
      })
      return data
    }
  },
  methods: {
    getFormRefs() {
      return [
        this.$refs.dadosPessoais,
        this.$refs.endereco,
        this.$refs.senha,
        this.$refs.termos
      ]
    },
    async handleSubmit() {
      if (!this.isValid) {
        alert('Por favor, corrija os erros no formulário')
        return
      }
      
      this.submitting = true
      try {
        // Simular envio
        await new Promise(resolve => setTimeout(resolve, 1500))
        console.log('Dados do formulário:', this.formData)
        alert('Cadastro realizado com sucesso!')
        this.resetForm()
      } catch (error) {
        alert('Erro ao enviar formulário: ' + error.message)
      } finally {
        this.submitting = false
      }
    },
    resetForm() {
      if (confirm('Tem certeza que deseja limpar o formulário?')) {
        this.getFormRefs().forEach(ref => {
          Object.keys(ref.form).forEach(key => {
            if (typeof ref.form[key] === 'boolean') {
              ref.form[key] = false
            } else {
              ref.form[key] = ''
            }
          })
          ref.errors = {}
        })
      }
    }
  }
}
</script>
```

### 4. Atualizar Rotas

Atualizar o arquivo `src/router/index.js` para incluir a nova rota:

```javascript
import { createRouter, createWebHistory } from 'vue-router'
import CadastroView from '@/views/CadastroView.vue'

const routes = [
  {
    path: '/cadastro',
    name: 'Cadastro',
    component: CadastroView
  }
  // ... outras rotas existentes
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
```

### 5. Configurar App.vue

Atualizar o arquivo `src/App.vue` para incluir o link de cadastro:

```vue
<template>
  <!-- ... header existente ... -->
  
  <nav>
    <!-- ... outros links ... -->
    <router-link to="/cadastro" class="nav-link">Cadastro</router-link>
  </nav>
  
  <router-view></router-view>
  
  <!-- ... footer existente ... -->
</template>
```

### 6. Como Executar

1. Instalar dependências (caso ainda não tenha feito):
```bash
npm install
```

2. Rodar o projeto:
```bash
npm run dev
```

3. Acessar a URL:
- Abra o navegador
- Acesse `http://localhost:3000/cadastro`

## Estrutura Final

```
src/
  components/
    cadastro/
      DadosPessoaisForm.vue
      EnderecoForm.vue
      SenhaForm.vue
      TermosForm.vue
  views/
    CadastroView.vue
  utils/
    validators.js
  router/
    index.js
  App.vue
```

Cada componente é responsável por:
- Validação dos seus campos
- Gerenciamento do seu próprio estado
- Feedback visual de erros
- Interface com o componente pai

A view principal (CadastroView) é responsável por:
- Orquestrar os componentes
- Gerenciar o estado geral do formulário
- Controlar o envio dos dados
- Mostrar o progresso geral

Todos os componentes seguem o mesmo padrão de interface:
- Método `validateAll()` para validação completa
- Método `getData()` para obter os dados
- Propriedade `form` para os dados
- Propriedade `errors` para os erros