# Exercício 1 - Formulário de Cadastro Multi-Componente

## Objetivo

Refatorar o formulário de cadastro atual (FormularioCompleto.vue) em 4 componentes separados (DadosPessoaisForm, EnderecoForm, SenhaForm, TermosForm) integrados em uma CadastroView com barra de progresso.

Você vai aprender:
- Como separar um formulário grande em componentes menores
- Comunicação entre componentes (props e eventos)
- Validação independente em cada componente
- Coordenação central de validação

---

## Arquivos que Você Precisa Criar/Modificar

### Novos Arquivos:
1. `src/components/cadastro/DadosPessoaisForm.vue` - Componente de dados pessoais
2. `src/components/cadastro/EnderecoForm.vue` - Componente de endereço
3. `src/components/cadastro/SenhaForm.vue` - Componente de senha
4. `src/components/cadastro/TermosForm.vue` - Componente de termos
5. `src/views/CadastroView.vue` - View que integra tudo
6. `src/utils/validators.js` - Funções de validação (atualizar se necessário)

### Modificados:
- `src/App.vue` - Adicionar link para CadastroView

---

## Passo 1: Criar Pasta e Estrutura

Crie a pasta: `src/components/cadastro/`

Esta pasta vai conter todos os 4 componentes de formulário.

---

## Passo 2: Criar/Verificar validators.js

Arquivo: `src/utils/validators.js`

Copie este código completo (ou atualize se já tiver):

```javascript
export class FormValidator {
  constructor() {
    this.rules = {}
    this.errors = {}
  }

  setRules(rules) {
    this.rules = rules
    return this
  }

  validateField(fieldName, fieldValue) {
    if (!this.rules[fieldName]) {
      return true
    }

    const fieldRules = this.rules[fieldName]

    for (const rule of fieldRules) {
      const result = this.applyRule(rule, fieldValue)
      if (result !== true) {
        this.errors[fieldName] = result
        return false
      }
    }

    delete this.errors[fieldName]
    return true
  }

  validate(formData) {
    this.errors = {}
    let isValid = true

    for (const fieldName in this.rules) {
      const fieldValue = formData[fieldName] || ''
      if (!this.validateField(fieldName, fieldValue)) {
        isValid = false
      }
    }

    return isValid
  }

  applyRule(rule, value) {
    // Regras simples
    if (rule === 'required') {
      return value && value.toString().trim().length > 0 ? true : 'Campo obrigatório'
    }

    if (rule === 'email') {
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return !value || pattern.test(value) ? true : 'Email inválido'
    }

    if (rule === 'cpf') {
      const numbers = value?.replace(/\D/g, '') || ''
      return numbers.length === 11 ? true : 'CPF deve ter 11 dígitos'
    }

    // Regras com parâmetros
    if (typeof rule === 'string' && rule.includes(':')) {
      const [ruleName, param] = rule.split(':')

      if (ruleName === 'min') {
        const min = parseInt(param)
        return value && value.length >= min 
          ? true 
          : `Mínimo ${min} caracteres`
      }

      if (ruleName === 'max') {
        const max = parseInt(param)
        return !value || value.length <= max 
          ? true 
          : `Máximo ${max} caracteres`
      }
    }

    return true
  }

  getError(fieldName) {
    return this.errors[fieldName] || null
  }

  getErrors() {
    return this.errors
  }
}
```

---

## Passo 3: Criar DadosPessoaisForm.vue

Arquivo: `src/components/cadastro/DadosPessoaisForm.vue`

```vue
<template>
  <div class="card mb-4">
    <div class="card-header bg-light">
      <h5 class="mb-0">1. Dados Pessoais</h5>
    </div>
    
    <div class="card-body">
      <div class="row g-3">
        <!-- Nome -->
        <div class="col-md-6">
          <label class="form-label">Nome <span class="text-danger">*</span></label>
          <input
            v-model="form.nome"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': hasError('nome') }"
            @blur="validarCampo('nome')"
            placeholder="Seu nome completo"
          >
          <div class="invalid-feedback" v-if="hasError('nome')">
            {{ getError('nome') }}
          </div>
        </div>

        <!-- Email -->
        <div class="col-md-6">
          <label class="form-label">Email <span class="text-danger">*</span></label>
          <input
            v-model="form.email"
            type="email"
            class="form-control"
            :class="{ 'is-invalid': hasError('email') }"
            @blur="validarCampo('email')"
            placeholder="seu@email.com"
          >
          <div class="invalid-feedback" v-if="hasError('email')">
            {{ getError('email') }}
          </div>
        </div>

        <!-- CPF -->
        <div class="col-md-6">
          <label class="form-label">CPF <span class="text-danger">*</span></label>
          <input
            v-model="form.cpf"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': hasError('cpf') }"
            @blur="validarCampo('cpf')"
            placeholder="000.000.000-00"
          >
          <div class="invalid-feedback" v-if="hasError('cpf')">
            {{ getError('cpf') }}
          </div>
        </div>

        <!-- Telefone -->
        <div class="col-md-6">
          <label class="form-label">Telefone <span class="text-danger">*</span></label>
          <input
            v-model="form.telefone"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': hasError('telefone') }"
            @blur="validarCampo('telefone')"
            placeholder="(00) 00000-0000"
          >
          <div class="invalid-feedback" v-if="hasError('telefone')">
            {{ getError('telefone') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { FormValidator } from '@/utils/validators'

export default {
  name: 'DadosPessoaisForm',
  data() {
    return {
      form: {
        nome: '',
        email: '',
        cpf: '',
        telefone: ''
      },
      validator: null
    }
  },
  created() {
    this.validator = new FormValidator()
    this.validator.setRules({
      nome: ['required', 'min:3'],
      email: ['required', 'email'],
      cpf: ['required', 'cpf'],
      telefone: ['required', 'min:8']
    })
  },
  methods: {
    validarCampo(fieldName) {
      this.validator.validateField(fieldName, this.form[fieldName])
    },

    hasError(fieldName) {
      return this.validator.getError(fieldName) !== null
    },

    getError(fieldName) {
      return this.validator.getError(fieldName)
    },

    validarTudo() {
      return this.validator.validate(this.form)
    },

    obterDados() {
      return { ...this.form }
    },

    limpar() {
      this.form = {
        nome: '',
        email: '',
        cpf: '',
        telefone: ''
      }
      this.validator.errors = {}
    }
  }
}
</script>
```

---

## Passo 4: Criar EnderecoForm.vue

Arquivo: `src/components/cadastro/EnderecoForm.vue`

```vue
<template>
  <div class="card mb-4">
    <div class="card-header bg-light">
      <h5 class="mb-0">2. Endereço</h5>
    </div>
    
    <div class="card-body">
      <div class="row g-3">
        <!-- CEP -->
        <div class="col-md-4">
          <label class="form-label">CEP <span class="text-danger">*</span></label>
          <input
            v-model="form.cep"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': hasError('cep') }"
            @blur="validarCampo('cep')"
            placeholder="00000-000"
          >
          <div class="invalid-feedback" v-if="hasError('cep')">
            {{ getError('cep') }}
          </div>
        </div>

        <!-- Logradouro -->
        <div class="col-md-8">
          <label class="form-label">Logradouro <span class="text-danger">*</span></label>
          <input
            v-model="form.logradouro"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': hasError('logradouro') }"
            @blur="validarCampo('logradouro')"
            placeholder="Rua, Avenida, etc"
          >
          <div class="invalid-feedback" v-if="hasError('logradouro')">
            {{ getError('logradouro') }}
          </div>
        </div>

        <!-- Número -->
        <div class="col-md-4">
          <label class="form-label">Número <span class="text-danger">*</span></label>
          <input
            v-model="form.numero"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': hasError('numero') }"
            @blur="validarCampo('numero')"
            placeholder="123"
          >
          <div class="invalid-feedback" v-if="hasError('numero')">
            {{ getError('numero') }}
          </div>
        </div>

        <!-- Complemento (opcional) -->
        <div class="col-md-8">
          <label class="form-label">Complemento (opcional)</label>
          <input
            v-model="form.complemento"
            type="text"
            class="form-control"
            placeholder="Apto, Sala, etc"
          >
        </div>

        <!-- Cidade -->
        <div class="col-md-6">
          <label class="form-label">Cidade <span class="text-danger">*</span></label>
          <input
            v-model="form.cidade"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': hasError('cidade') }"
            @blur="validarCampo('cidade')"
            placeholder="São Paulo"
          >
          <div class="invalid-feedback" v-if="hasError('cidade')">
            {{ getError('cidade') }}
          </div>
        </div>

        <!-- Estado -->
        <div class="col-md-6">
          <label class="form-label">Estado <span class="text-danger">*</span></label>
          <select
            v-model="form.estado"
            class="form-select"
            :class="{ 'is-invalid': hasError('estado') }"
            @blur="validarCampo('estado')"
          >
            <option value="">-- Selecione um estado --</option>
            <option v-for="estado in estados" :key="estado" :value="estado">
              {{ estado }}
            </option>
          </select>
          <div class="invalid-feedback" v-if="hasError('estado')">
            {{ getError('estado') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { FormValidator } from '@/utils/validators'

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
      validator: null,
      estados: [
        'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
        'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
        'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
      ]
    }
  },
  created() {
    this.validator = new FormValidator()
    this.validator.setRules({
      cep: ['required'],
      logradouro: ['required'],
      numero: ['required'],
      cidade: ['required'],
      estado: ['required']
    })
  },
  methods: {
    validarCampo(fieldName) {
      this.validator.validateField(fieldName, this.form[fieldName])
    },

    hasError(fieldName) {
      return this.validator.getError(fieldName) !== null
    },

    getError(fieldName) {
      return this.validator.getError(fieldName)
    },

    validarTudo() {
      return this.validator.validate(this.form)
    },

    obterDados() {
      return { ...this.form }
    },

    limpar() {
      this.form = {
        cep: '',
        logradouro: '',
        numero: '',
        complemento: '',
        cidade: '',
        estado: ''
      }
      this.validator.errors = {}
    }
  }
}
</script>
```

---

## Passo 5: Criar SenhaForm.vue

Arquivo: `src/components/cadastro/SenhaForm.vue`

```vue
<template>
  <div class="card mb-4">
    <div class="card-header bg-light">
      <h5 class="mb-0">3. Senha</h5>
    </div>
    
    <div class="card-body">
      <div class="row g-3">
        <!-- Senha -->
        <div class="col-12">
          <label class="form-label">Senha <span class="text-danger">*</span></label>
          <div class="input-group">
            <input
              :type="mostrarSenha ? 'text' : 'password'"
              v-model="form.senha"
              class="form-control"
              :class="{ 'is-invalid': hasError('senha') }"
              @blur="validarCampo('senha')"
              placeholder="Mínimo 8 caracteres"
            >
            <button
              type="button"
              class="btn btn-outline-secondary"
              @click="mostrarSenha = !mostrarSenha"
            >
              {{ mostrarSenha ? 'Esconder' : 'Mostrar' }}
            </button>
          </div>
          <div class="invalid-feedback" v-if="hasError('senha')">
            {{ getError('senha') }}
          </div>

          <!-- Indicador de força -->
          <div class="mt-2" v-if="form.senha">
            <div class="progress" style="height: 6px;">
              <div
                class="progress-bar"
                :class="classeForca"
                :style="{ width: percentualForca + '%' }"
              ></div>
            </div>
            <small class="text-muted">
              Força: <strong :class="classeForca">{{ nomeForca }}</strong>
            </small>
          </div>
        </div>

        <!-- Confirmar Senha -->
        <div class="col-12">
          <label class="form-label">Confirmar Senha <span class="text-danger">*</span></label>
          <div class="input-group">
            <input
              :type="mostrarConfirma ? 'text' : 'password'"
              v-model="form.confirma"
              class="form-control"
              :class="{ 'is-invalid': hasError('confirma') }"
              @blur="validarCampo('confirma')"
              placeholder="Digite a mesma senha"
            >
            <button
              type="button"
              class="btn btn-outline-secondary"
              @click="mostrarConfirma = !mostrarConfirma"
            >
              {{ mostrarConfirma ? 'Esconder' : 'Mostrar' }}
            </button>
          </div>
          <div class="invalid-feedback" v-if="hasError('confirma')">
            {{ getError('confirma') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { FormValidator } from '@/utils/validators'

export default {
  name: 'SenhaForm',
  data() {
    return {
      form: {
        senha: '',
        confirma: ''
      },
      validator: null,
      mostrarSenha: false,
      mostrarConfirma: false
    }
  },
  computed: {
    percentualForca() {
      const senha = this.form.senha
      if (!senha) return 0
      
      let pontos = 0
      if (senha.length >= 8) pontos += 30
      if (senha.length >= 12) pontos += 10
      if (/[A-Z]/.test(senha)) pontos += 20
      if (/[0-9]/.test(senha)) pontos += 20
      if (/[!@#$%^&*]/.test(senha)) pontos += 20
      
      return Math.min(pontos, 100)
    },

    nomeForca() {
      const p = this.percentualForca
      if (p < 40) return 'Fraca'
      if (p < 70) return 'Média'
      return 'Forte'
    },

    classeForca() {
      const p = this.percentualForca
      if (p < 40) return 'bg-danger'
      if (p < 70) return 'bg-warning'
      return 'bg-success'
    }
  },
  created() {
    this.validator = new FormValidator()
    this.validator.setRules({
      senha: ['required', 'min:8'],
      confirma: ['required']
    })
  },
  methods: {
    validarCampo(fieldName) {
      if (fieldName === 'confirma') {
        if (this.form.senha !== this.form.confirma) {
          this.validator.errors.confirma = 'As senhas não conferem'
          return false
        } else {
          delete this.validator.errors.confirma
          return true
        }
      }
      
      this.validator.validateField(fieldName, this.form[fieldName])
    },

    hasError(fieldName) {
      return this.validator.getError(fieldName) !== null
    },

    getError(fieldName) {
      return this.validator.getError(fieldName)
    },

    validarTudo() {
      const senhaOk = this.validator.validate(this.form)
      const confirmaOk = this.validarCampo('confirma')
      return senhaOk && confirmaOk
    },

    obterDados() {
      return {
        senha: this.form.senha
      }
    },

    limpar() {
      this.form = {
        senha: '',
        confirma: ''
      }
      this.validator.errors = {}
    }
  }
}
</script>
```

---

## Passo 6: Criar TermosForm.vue

Arquivo: `src/components/cadastro/TermosForm.vue`

```vue
<template>
  <div class="card mb-4">
    <div class="card-header bg-light">
      <h5 class="mb-0">4. Termos e Condições</h5>
    </div>
    
    <div class="card-body">
      <!-- Texto dos termos -->
      <div class="mb-3 p-3 bg-light" style="height: 150px; overflow-y: auto;">
        <h6>Termos de Uso e Condições</h6>
        <p class="small mb-1">
          Ao criar uma conta, você concorda com nossos termos de serviço e política de privacidade.
        </p>
        <p class="small mb-1">
          Você é responsável por manter confidencial sua senha e por toda atividade que ocorrer 
          em sua conta.
        </p>
        <p class="small mb-1">
          Você concorda em não transmitir qualquer conteúdo ilegal ou ofensivo através de nossa 
          plataforma.
        </p>
        <p class="small mb-1">
          Reservamo-nos o direito de remover qualquer conta que viole estes termos, a qualquer 
          momento.
        </p>
        <p class="small">
          Para mais detalhes, visite nossa página de política de privacidade.
        </p>
      </div>

      <!-- Checkbox -->
      <div class="form-check">
        <input
          v-model="form.aceitar"
          type="checkbox"
          class="form-check-input"
          :class="{ 'is-invalid': hasError('aceitar') }"
          id="aceitar"
        >
        <label class="form-check-label" for="aceitar">
          Li e aceito os termos e condições <span class="text-danger">*</span>
        </label>
        <div class="invalid-feedback" v-if="hasError('aceitar')">
          {{ getError('aceitar') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { FormValidator } from '@/utils/validators'

export default {
  name: 'TermosForm',
  data() {
    return {
      form: {
        aceitar: false
      },
      validator: null
    }
  },
  created() {
    this.validator = new FormValidator()
  },
  methods: {
    validarCampo() {
      if (!this.form.aceitar) {
        this.validator.errors.aceitar = 'Você deve aceitar os termos'
        return false
      } else {
        delete this.validator.errors.aceitar
        return true
      }
    },

    hasError(fieldName) {
      return this.validator.getError(fieldName) !== null
    },

    getError(fieldName) {
      return this.validator.getError(fieldName)
    },

    validarTudo() {
      return this.validarCampo()
    },

    obterDados() {
      return { ...this.form }
    },

    limpar() {
      this.form = { aceitar: false }
      this.validator.errors = {}
    }
  }
}
</script>
```

---

## Passo 7: Criar CadastroView.vue

Arquivo: `src/views/CadastroView.vue`

```vue
<template>
  <div class="container mt-5 mb-5">
    <div class="row">
      <div class="col-md-8 mx-auto">
        <div class="card shadow">
          <div class="card-header bg-primary text-white">
            <h3 class="mb-0">Cadastro Completo</h3>
            <p class="mb-0 opacity-75">Preencha todos os campos para criar sua conta</p>
          </div>

          <div class="card-body">
            <!-- Barra de progresso -->
            <div class="mb-4">
              <div class="d-flex justify-content-between mb-2">
                <span><strong>Progresso</strong></span>
                <span>{{ progresso }}%</span>
              </div>
              <div class="progress">
                <div
                  class="progress-bar"
                  :style="{ width: progresso + '%' }"
                ></div>
              </div>
            </div>

            <!-- Formulário -->
            <form @submit.prevent="enviarFormulario">
              <!-- Componente 1: Dados Pessoais -->
              <DadosPessoaisForm ref="dadosPessoais" />

              <!-- Componente 2: Endereço -->
              <EnderecoForm ref="endereco" />

              <!-- Componente 3: Senha -->
              <SenhaForm ref="senha" />

              <!-- Componente 4: Termos -->
              <TermosForm ref="termos" />

              <!-- Mensagem de erro (se houver) -->
              <div v-if="erroGeral" class="alert alert-danger mb-4">
                {{ erroGeral }}
              </div>

              <!-- Botões -->
              <div class="d-flex gap-2">
                <button
                  type="button"
                  class="btn btn-secondary"
                  @click="limparFormulario"
                >
                  Limpar
                </button>

                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="processando"
                >
                  <span v-if="processando" class="spinner-border spinner-border-sm me-2"></span>
                  {{ processando ? 'Cadastrando...' : 'Cadastrar' }}
                </button>
              </div>
            </form>

            <!-- Sucesso -->
            <div v-if="sucesso" class="alert alert-success mt-4">
              Cadastro realizado com sucesso!
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
      processando: false,
      erroGeral: null,
      sucesso: false
    }
  },
  computed: {
    progresso() {
      let total = 0
      let preenchidos = 0

      // Verifica dados pessoais
      const dp = this.$refs.dadosPessoais?.form || {}
      if (dp.nome) preenchidos++
      if (dp.email) preenchidos++
      if (dp.cpf) preenchidos++
      if (dp.telefone) preenchidos++
      total += 4

      // Verifica endereço
      const end = this.$refs.endereco?.form || {}
      if (end.cep) preenchidos++
      if (end.logradouro) preenchidos++
      if (end.numero) preenchidos++
      if (end.cidade) preenchidos++
      if (end.estado) preenchidos++
      total += 5

      // Verifica senha
      const sen = this.$refs.senha?.form || {}
      if (sen.senha) preenchidos++
      if (sen.confirma) preenchidos++
      total += 2

      // Verifica termos
      const ter = this.$refs.termos?.form || {}
      if (ter.aceitar) preenchidos++
      total += 1

      return total > 0 ? Math.round((preenchidos / total) * 100) : 0
    }
  },
  methods: {
    enviarFormulario() {
      this.erroGeral = null
      this.sucesso = false

      // Valida cada componente
      const dadosPessoaisOk = this.$refs.dadosPessoais.validarTudo()
      const enderecoOk = this.$refs.endereco.validarTudo()
      const senhaOk = this.$refs.senha.validarTudo()
      const termosOk = this.$refs.termos.validarTudo()

      if (!dadosPessoaisOk) {
        this.erroGeral = 'Preencha corretamente os dados pessoais'
        return
      }
      if (!enderecoOk) {
        this.erroGeral = 'Preencha corretamente o endereço'
        return
      }
      if (!senhaOk) {
        this.erroGeral = 'Senha inválida ou não confere'
        return
      }
      if (!termosOk) {
        this.erroGeral = 'Você deve aceitar os termos'
        return
      }

      // Coleta dados de todos os componentes
      const dados = {
        ...this.$refs.dadosPessoais.obterDados(),
        ...this.$refs.endereco.obterDados(),
        ...this.$refs.senha.obterDados(),
        ...this.$refs.termos.obterDados()
      }

      // Simula envio ao servidor
      this.processando = true
      setTimeout(() => {
        console.log('Dados do cadastro:', dados)
        this.sucesso = true
        this.processando = false

        // Limpa formulário após 2 segundos
        setTimeout(() => {
          this.limparFormulario()
          this.sucesso = false
        }, 2000)
      }, 1500)
    },

    limparFormulario() {
      this.$refs.dadosPessoais.limpar()
      this.$refs.endereco.limpar()
      this.$refs.senha.limpar()
      this.$refs.termos.limpar()
      this.erroGeral = null
      this.sucesso = false
    }
  }
}
</script>

<style scoped>
.shadow {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}

.gap-2 {
  gap: 0.5rem;
}
</style>
```

---

## Passo 8: Atualizar App.vue

Arquivo: `src/App.vue`

**Importe CadastroView e adicione um link/navegação para ela.**

Atualize o import:

```javascript
// Antes
import FormularioCompleto from './components/FormularioCompleto.vue'

// Depois
import FormularioCompleto from './components/FormularioCompleto.vue'
import CadastroView from './views/CadastroView.vue'
```

Atualize o componente:

```javascript
components: {
  FormularioCompleto,
  CadastroView
}
```

Atualize o template para mostrar um botão/link:

```vue
<template>
  <div id="app">
    <!-- ... header ... -->

    <!-- Conteúdo principal -->
    <div class="container">
      <!-- Botão para trocar entre visualizações -->
      <div class="mb-4">
        <button 
          class="btn btn-outline-primary me-2"
          @click="visualizacao = 'formulario'"
          :class="{ active: visualizacao === 'formulario' }"
        >
          Formulário Original
        </button>
        <button 
          class="btn btn-outline-primary"
          @click="visualizacao = 'cadastro'"
          :class="{ active: visualizacao === 'cadastro' }"
        >
          Cadastro Multi-Componente
        </button>
      </div>

      <!-- Mostra um ou outro -->
      <div v-show="visualizacao === 'formulario'">
        <div class="row">
          <div class="col-md-9">
            <FormularioCompleto />
          </div>
          <div class="col-md-3">
            <!-- sidebar -->
          </div>
        </div>
      </div>

      <div v-show="visualizacao === 'cadastro'">
        <CadastroView />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visualizacao: 'formulario'
    }
  }
}
</script>
```

---

## Passo 9: Testar o Exercício

Execute:

```bash
npm run dev
```

Acesse: `http://localhost:5173`

**Teste:**

1. Preencha dados pessoais incompletos - deve mostrar erros ao sair de cada campo
2. Preencha tudo e veja a barra de progresso aumentar
3. Clique em "Cadastrar" - deve validar tudo antes de enviar
4. Após sucesso, deve limpar os campos
5. Teste o botão "Limpar" para resetar tudo