# Aula 9: Testes em Vue.js

## Introducao

Nesta aula aprenderemos a escrever testes para aplicacoes Vue.js, garantindo qualidade e confiabilidade do codigo. Testes automatizados sao essenciais em projetos profissionais.

**Objetivo**: Configurar ambiente de testes, escrever testes unitarios para componentes e stores, e implementar testes end-to-end.

**O que vamos ver nessa aula**:
- Configurar Jest e Vue Test Utils
- Escrever testes unitarios para componentes
- Testar Pinia stores
- Mockar APIs e dependencias
- Testes end-to-end com Cypress
- Cobertura de codigo (coverage)

---

## Parte 1: Fundamentos de Testes

### Por que testar

Testes automatizados trazem beneficios importantes:

1. **Confianca no codigo**
   - Garante que funcionalidades nao quebram ao fazer mudancas
   - Detecta bugs antes de ir para producao

2. **Documentacao viva**
   - Testes mostram como o codigo deve ser usado
   - Servem como exemplos praticos

3. **Refatoracao segura**
   - Permite melhorar codigo sem medo de quebrar
   - Testes falham se algo para de funcionar

### Tipos de testes

**Testes Unitarios**:
- Testam funcoes e componentes isolados
- Rapidos de executar
- Focam em logica especifica

**Testes de Integracao**:
- Testam como partes diferentes trabalham juntas
- Componente + Store, Componente + API
- Mais proximos do uso real

**Testes End-to-End (E2E)**:
- Testam fluxo completo da aplicacao
- Simulam usuario real
- Mais lentos, mas mais confiav

eis

### O que testar

**Teste**:
- Logica de negocio (calculos, validacoes)
- Interacoes do usuario (clicks, inputs)
- Mudancas de estado
- Chamadas de API
- Navegacao entre rotas

**Nao teste**:
- Detalhes de implementacao interna
- Bibliotecas de terceiros (ja testadas)
- Estilos CSS (use testes visuais)

---

## Parte 2: Configuracao do Ambiente

### Passo 1: Instalar Dependencias

No terminal do projeto:

```bash
npm install --save-dev @vue/test-utils jest
npm install --save-dev jest-environment-jsdom
npm install --save-dev @babel/preset-env babel-jest
npm install --save-dev @pinia/testing
```

**O que cada pacote faz**:
- `@vue/test-utils`: Ferramentas para testar componentes Vue
- `jest`: Framework de testes
- `jest-environment-jsdom`: Simula navegador para testes
- `@babel/preset-env`: Transpila ES6+ para testes
- `@pinia/testing`: Helpers para testar stores Pinia

### Passo 2: Configurar Jest

Crie `jest.config.js` na raiz do projeto:

```javascript
module.exports = {
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js', 'json', 'vue'],
  transform: {
    '^.+\\.vue$': '@vue/vue3-jest',
    '^.+\\.js$': 'babel-jest'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  testMatch: [
    '<rootDir>/tests/unit/**/*.spec.js'
  ],
  collectCoverageFrom: [
    'src/**/*.{js,vue}',
    '!src/main.js',
    '!**/node_modules/**'
  ],
  coverageReporters: ['html', 'text']
}
```

**Configuracoes explicadas**:

1. **`testEnvironment: 'jsdom'`**
   - Simula DOM do navegador

2. **`transform`**
   - Como processar arquivos `.vue` e `.js`

3. **`moduleNameMapper`**
   - Resolve alias `@` para `src/`

4. **`testMatch`**
   - Onde procurar arquivos de teste

5. **`collectCoverageFrom`**
   - Quais arquivos incluir no relatorio de cobertura

### Passo 3: Scripts no package.json

Adicione em `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

**Como usar**:
- `npm test`: Roda todos os testes uma vez
- `npm run test:watch`: Roda testes ao salvar arquivos
- `npm run test:coverage`: Gera relatorio de cobertura

### Passo 4: Estrutura de Pastas

Crie a estrutura:

```
tests/
├── unit/
│   ├── components/
│   │   └── UserProfile.spec.js
│   ├── stores/
│   │   └── user.spec.js
│   └── utils/
│       └── validators.spec.js
└── setup.js
```

---

## Parte 3: Testando Funcoes Utilitarias

### Exemplo: Validators

Arquivo `src/utils/validators.js`:

```javascript
export const validators = {
  email(value) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(value)
  },
  
  cpf(value) {
    // Remove formatacao
    const cleanCPF = value.replace(/[^\d]/g, '')
    
    if (cleanCPF.length !== 11) return false
    
    // Verifica se todos digitos sao iguais
    if (/^(\d)\1{10}$/.test(cleanCPF)) return false
    
    // Calcula digitos verificadores
    let soma = 0
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cleanCPF.charAt(i)) * (10 - i)
    }
    let digito1 = 11 - (soma % 11)
    if (digito1 > 9) digito1 = 0
    
    soma = 0
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cleanCPF.charAt(i)) * (11 - i)
    }
    let digito2 = 11 - (soma % 11)
    if (digito2 > 9) digito2 = 0
    
    return cleanCPF.charAt(9) == digito1 && cleanCPF.charAt(10) == digito2
  },
  
  telefone(value) {
    const cleanPhone = value.replace(/[^\d]/g, '')
    return cleanPhone.length === 10 || cleanPhone.length === 11
  }
}
```

### Teste do Validators

Arquivo `tests/unit/utils/validators.spec.js`:

```javascript
import { validators } from '@/utils/validators'

describe('validators', () => {
  describe('email', () => {
    it('deve validar email correto', () => {
      expect(validators.email('teste@exemplo.com')).toBe(true)
    })
    
    it('deve rejeitar email sem @', () => {
      expect(validators.email('teste.exemplo.com')).toBe(false)
    })
    
    it('deve rejeitar email sem dominio', () => {
      expect(validators.email('teste@')).toBe(false)
    })
    
    it('deve rejeitar string vazia', () => {
      expect(validators.email('')).toBe(false)
    })
  })
  
  describe('cpf', () => {
    it('deve validar CPF correto', () => {
      expect(validators.cpf('11144477735')).toBe(true)
    })
    
    it('deve validar CPF com formatacao', () => {
      expect(validators.cpf('111.444.777-35')).toBe(true)
    })
    
    it('deve rejeitar CPF invalido', () => {
      expect(validators.cpf('12345678901')).toBe(false)
    })
    
    it('deve rejeitar CPF com todos digitos iguais', () => {
      expect(validators.cpf('11111111111')).toBe(false)
    })
    
    it('deve rejeitar CPF com tamanho incorreto', () => {
      expect(validators.cpf('123')).toBe(false)
    })
  })
  
  describe('telefone', () => {
    it('deve validar telefone fixo', () => {
      expect(validators.telefone('1133334444')).toBe(true)
    })
    
    it('deve validar celular', () => {
      expect(validators.telefone('11999998888')).toBe(true)
    })
    
    it('deve validar com formatacao', () => {
      expect(validators.telefone('(11) 99999-8888')).toBe(true)
    })
    
    it('deve rejeitar numero com tamanho incorreto', () => {
      expect(validators.telefone('123')).toBe(false)
    })
  })
})
```

**Estrutura de um teste**:

1. **`describe('nome', () => {})`**
   - Agrupa testes relacionados
   - Pode ter `describe` dentro de `describe`

2. **`it('deve...', () => {})`**
   - Cada teste individual
   - Descreve o comportamento esperado

3. **`expect(valor).toBe(esperado)`**
   - Afirmacao (assertion)
   - Compara valor com o esperado

### Executar Testes

```bash
npm test
```

Resultado esperado:

```
PASS  tests/unit/utils/validators.spec.js
  validators
    email
      ✓ deve validar email correto
      ✓ deve rejeitar email sem @
      ✓ deve rejeitar email sem dominio
      ✓ deve rejeitar string vazia
    cpf
      ✓ deve validar CPF correto
      ✓ deve validar CPF com formatacao
      ✓ deve rejeitar CPF invalido
      ✓ deve rejeitar CPF com todos digitos iguais
      ✓ deve rejeitar CPF com tamanho incorreto
    telefone
      ✓ deve validar telefone fixo
      ✓ deve validar celular
      ✓ deve validar com formatacao
      ✓ deve rejeitar numero com tamanho incorreto

Test Suites: 1 passed, 1 total
Tests:       13 passed, 13 total
```

---

## Parte 4: Testando Componentes Vue

### Componente Simples

Arquivo `src/components/Counter.vue`:

```vue
<template>
  <div class="counter">
    <h3>Contador: {{ count }}</h3>
    <button @click="increment">Incrementar</button>
    <button @click="decrement">Decrementar</button>
    <button @click="reset">Resetar</button>
  </div>
</template>

<script>
export default {
  name: 'Counter',
  data() {
    return {
      count: 0
    }
  },
  methods: {
    increment() {
      this.count++
    },
    decrement() {
      this.count--
    },
    reset() {
      this.count = 0
    }
  }
}
</script>
```

### Teste do Componente

Arquivo `tests/unit/components/Counter.spec.js`:

```javascript
import { mount } from '@vue/test-utils'
import Counter from '@/components/Counter.vue'

describe('Counter.vue', () => {
  it('deve renderizar com contagem inicial 0', () => {
    const wrapper = mount(Counter)
    expect(wrapper.text()).toContain('Contador: 0')
  })
  
  it('deve incrementar ao clicar no botao', async () => {
    const wrapper = mount(Counter)
    const button = wrapper.find('button:first-of-type')
    
    await button.trigger('click')
    
    expect(wrapper.text()).toContain('Contador: 1')
  })
  
  it('deve decrementar ao clicar no botao', async () => {
    const wrapper = mount(Counter)
    const buttons = wrapper.findAll('button')
    
    await buttons[1].trigger('click')
    
    expect(wrapper.text()).toContain('Contador: -1')
  })
  
  it('deve resetar contador', async () => {
    const wrapper = mount(Counter)
    const incrementBtn = wrapper.findAll('button')[0]
    const resetBtn = wrapper.findAll('button')[2]
    
    // Incrementa 3 vezes
    await incrementBtn.trigger('click')
    await incrementBtn.trigger('click')
    await incrementBtn.trigger('click')
    expect(wrapper.text()).toContain('Contador: 3')
    
    // Reseta
    await resetBtn.trigger('click')
    expect(wrapper.text()).toContain('Contador: 0')
  })
})
```

**Metodos do Vue Test Utils**:

1. **`mount(Component)`**
   - Cria instancia do componente para teste
   - Retorna `wrapper` com metodos de teste

2. **`wrapper.find(selector)`**
   - Encontra elemento (CSS selector)
   - `wrapper.find('button')`

3. **`wrapper.findAll(selector)`**
   - Encontra todos elementos
   - Retorna array

4. **`wrapper.text()`**
   - Pega texto renderizado

5. **`wrapper.trigger('evento')`**
   - Simula evento
   - Retorna Promise (usar `await`)

---

## Parte 5: Testando Componentes com Props

### Componente com Props

Arquivo `src/components/UserCard.vue`:

```vue
<template>
  <div class="user-card">
    <h3>{{ user.nome }}</h3>
    <p>{{ user.email }}</p>
    <span :class="['badge', user.ativo ? 'ativo' : 'inativo']">
      {{ user.ativo ? 'Ativo' : 'Inativo' }}
    </span>
    <button @click="$emit('editar', user.id)">Editar</button>
    <button @click="$emit('excluir', user.id)">Excluir</button>
  </div>
</template>

<script>
export default {
  name: 'UserCard',
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  emits: ['editar', 'excluir']
}
</script>
```

### Teste com Props e Eventos

Arquivo `tests/unit/components/UserCard.spec.js`:

```javascript
import { mount } from '@vue/test-utils'
import UserCard from '@/components/UserCard.vue'

describe('UserCard.vue', () => {
  const mockUser = {
    id: 1,
    nome: 'João Silva',
    email: 'joao@exemplo.com',
    ativo: true
  }
  
  it('deve renderizar informacoes do usuario', () => {
    const wrapper = mount(UserCard, {
      props: { user: mockUser }
    })
    
    expect(wrapper.text()).toContain('João Silva')
    expect(wrapper.text()).toContain('joao@exemplo.com')
  })
  
  it('deve mostrar badge ativo quando usuario ativo', () => {
    const wrapper = mount(UserCard, {
      props: { user: mockUser }
    })
    
    const badge = wrapper.find('.badge')
    expect(badge.classes()).toContain('ativo')
    expect(badge.text()).toBe('Ativo')
  })
  
  it('deve mostrar badge inativo quando usuario inativo', () => {
    const inactiveUser = { ...mockUser, ativo: false }
    const wrapper = mount(UserCard, {
      props: { user: inactiveUser }
    })
    
    const badge = wrapper.find('.badge')
    expect(badge.classes()).toContain('inativo')
    expect(badge.text()).toBe('Inativo')
  })
  
  it('deve emitir evento editar com id do usuario', async () => {
    const wrapper = mount(UserCard, {
      props: { user: mockUser }
    })
    
    const editBtn = wrapper.findAll('button')[0]
    await editBtn.trigger('click')
    
    expect(wrapper.emitted()).toHaveProperty('editar')
    expect(wrapper.emitted().editar[0]).toEqual([1])
  })
  
  it('deve emitir evento excluir com id do usuario', async () => {
    const wrapper = mount(UserCard, {
      props: { user: mockUser }
    })
    
    const deleteBtn = wrapper.findAll('button')[1]
    await deleteBtn.trigger('click')
    
    expect(wrapper.emitted()).toHaveProperty('excluir')
    expect(wrapper.emitted().excluir[0]).toEqual([1])
  })
})
```

**Testando Props**:
```javascript
mount(Component, {
  props: { propName: value }
})
```

**Testando Eventos**:
```javascript
wrapper.emitted()  // Retorna objeto com todos eventos
wrapper.emitted().nomeEvento  // Array de chamadas
wrapper.emitted().nomeEvento[0]  // Argumentos da primeira chamada
```

---

## Parte 6: Testando Pinia Stores

### Store de Usuario

Arquivo `src/stores/user.js`:

```javascript
import { defineStore } from 'pinia'
import api from '@/services/api'

export const useUserStore = defineStore('user', {
  state: () => ({
    usuario: null,
    loading: false,
    erro: null
  }),
  
  getters: {
    isLoggedIn(state) {
      return state.usuario !== null
    },
    
    nomeCompleto(state) {
      return state.usuario ? state.usuario.nome : 'Visitante'
    }
  },
  
  actions: {
    async login(email, senha) {
      this.loading = true
      this.erro = null
      
      try {
        const response = await api.post('/login', { email, senha })
        this.usuario = response.data.usuario
        localStorage.setItem('token', response.data.token)
        return { sucesso: true }
      } catch (error) {
        this.erro = error.response?.data?.mensagem || 'Erro ao fazer login'
        return { sucesso: false, erro: this.erro }
      } finally {
        this.loading = false
      }
    },
    
    logout() {
      this.usuario = null
      localStorage.removeItem('token')
    }
  }
})
```

### Teste da Store

Arquivo `tests/unit/stores/user.spec.js`:

```javascript
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from '@/stores/user'
import api from '@/services/api'

// Mock da API
jest.mock('@/services/api')

describe('useUserStore', () => {
  beforeEach(() => {
    // Cria nova instancia do Pinia antes de cada teste
    setActivePinia(createPinia())
    
    // Limpa mocks
    jest.clearAllMocks()
    localStorage.clear()
  })
  
  it('deve inicializar com estado vazio', () => {
    const store = useUserStore()
    
    expect(store.usuario).toBeNull()
    expect(store.loading).toBe(false)
    expect(store.erro).toBeNull()
  })
  
  describe('getters', () => {
    it('isLoggedIn deve retornar false quando nao logado', () => {
      const store = useUserStore()
      expect(store.isLoggedIn).toBe(false)
    })
    
    it('isLoggedIn deve retornar true quando logado', () => {
      const store = useUserStore()
      store.usuario = { id: 1, nome: 'João' }
      expect(store.isLoggedIn).toBe(true)
    })
    
    it('nomeCompleto deve retornar Visitante quando nao logado', () => {
      const store = useUserStore()
      expect(store.nomeCompleto).toBe('Visitante')
    })
    
    it('nomeCompleto deve retornar nome do usuario quando logado', () => {
      const store = useUserStore()
      store.usuario = { id: 1, nome: 'João Silva' }
      expect(store.nomeCompleto).toBe('João Silva')
    })
  })
  
  describe('login', () => {
    it('deve fazer login com sucesso', async () => {
      const store = useUserStore()
      const mockResponse = {
        data: {
          usuario: { id: 1, nome: 'João', email: 'joao@exemplo.com' },
          token: 'fake-token-123'
        }
      }
      
      api.post.mockResolvedValue(mockResponse)
      
      const result = await store.login('joao@exemplo.com', 'senha123')
      
      expect(result.sucesso).toBe(true)
      expect(store.usuario).toEqual(mockResponse.data.usuario)
      expect(store.loading).toBe(false)
      expect(localStorage.getItem('token')).toBe('fake-token-123')
    })
    
    it('deve tratar erro de login', async () => {
      const store = useUserStore()
      const mockError = {
        response: {
          data: { mensagem: 'Credenciais invalidas' }
        }
      }
      
      api.post.mockRejectedValue(mockError)
      
      const result = await store.login('joao@exemplo.com', 'senha-errada')
      
      expect(result.sucesso).toBe(false)
      expect(result.erro).toBe('Credenciais invalidas')
      expect(store.usuario).toBeNull()
      expect(store.loading).toBe(false)
    })
    
    it('deve definir loading como true durante login', () => {
      const store = useUserStore()
      api.post.mockImplementation(() => new Promise(() => {}))
      
      store.login('joao@exemplo.com', 'senha123')
      
      expect(store.loading).toBe(true)
    })
  })
  
  describe('logout', () => {
    it('deve limpar usuario e remover token', () => {
      const store = useUserStore()
      store.usuario = { id: 1, nome: 'João' }
      localStorage.setItem('token', 'fake-token')
      
      store.logout()
      
      expect(store.usuario).toBeNull()
      expect(localStorage.getItem('token')).toBeNull()
    })
  })
})
```

**Mockando API**:

1. **`jest.mock('@/services/api')`**
   - Substitui modulo real por mock

2. **`api.post.mockResolvedValue(data)`**
   - Simula resposta de sucesso

3. **`api.post.mockRejectedValue(error)`**
   - Simula erro

4. **`jest.clearAllMocks()`**
   - Limpa historico de chamadas entre testes

---

## Parte 7: Testando Componentes com Store

### Componente com Store

Arquivo `src/components/UserProfile.vue`:

```vue
<template>
  <div class="user-profile">
    <div v-if="userStore.isLoggedIn">
      <h3>{{ userStore.nomeCompleto }}</h3>
      <button @click="userStore.logout()">Sair</button>
    </div>
    
    <div v-else>
      <input v-model="email" placeholder="Email">
      <input v-model="senha" type="password" placeholder="Senha">
      <button @click="handleLogin" :disabled="userStore.loading">
        {{ userStore.loading ? 'Entrando...' : 'Entrar' }}
      </button>
      <p v-if="userStore.erro" class="erro">{{ userStore.erro }}</p>
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
      email: '',
      senha: ''
    }
  },
  methods: {
    async handleLogin() {
      await this.userStore.login(this.email, this.senha)
    }
  }
}
</script>
```

### Teste do Componente com Store

Arquivo `tests/unit/components/UserProfile.spec.js`:

```javascript
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import UserProfile from '@/components/UserProfile.vue'
import { useUserStore } from '@/stores/user'

describe('UserProfile.vue', () => {
  it('deve mostrar formulario de login quando nao logado', () => {
    const wrapper = mount(UserProfile, {
      global: {
        plugins: [createTestingPinia()]
      }
    })
    
    expect(wrapper.find('input[placeholder="Email"]').exists()).toBe(true)
    expect(wrapper.find('input[placeholder="Senha"]').exists()).toBe(true)
    expect(wrapper.find('button').text()).toBe('Entrar')
  })
  
  it('deve mostrar informacoes do usuario quando logado', () => {
    const wrapper = mount(UserProfile, {
      global: {
        plugins: [createTestingPinia({
          initialState: {
            user: {
              usuario: { id: 1, nome: 'João Silva' }
            }
          }
        })]
      }
    })
    
    expect(wrapper.text()).toContain('João Silva')
    expect(wrapper.find('button').text()).toBe('Sair')
  })
  
  it('deve chamar login ao clicar no botao', async () => {
    const wrapper = mount(UserProfile, {
      global: {
        plugins: [createTestingPinia()]
      }
    })
    
    const store = useUserStore()
    
    await wrapper.find('input[placeholder="Email"]').setValue('joao@exemplo.com')
    await wrapper.find('input[placeholder="Senha"]').setValue('senha123')
    await wrapper.find('button').trigger('click')
    
    expect(store.login).toHaveBeenCalledWith('joao@exemplo.com', 'senha123')
  })
  
  it('deve mostrar mensagem de carregamento durante login', () => {
    const wrapper = mount(UserProfile, {
      global: {
        plugins: [createTestingPinia({
          initialState: {
            user: { loading: true }
          }
        })]
      }
    })
    
    const button = wrapper.find('button')
    expect(button.text()).toBe('Entrando...')
    expect(button.attributes('disabled')).toBeDefined()
  })
  
  it('deve mostrar mensagem de erro quando login falha', () => {
    const wrapper = mount(UserProfile, {
      global: {
        plugins: [createTestingPinia({
          initialState: {
            user: { erro: 'Credenciais invalidas' }
          }
        })]
      }
    })
    
    expect(wrapper.find('.erro').text()).toBe('Credenciais invalidas')
  })
})
```

**createTestingPinia**:

```javascript
createTestingPinia({
  initialState: {
    nomeDaStore: { propriedade: valor }
  }
})
```

- Define estado inicial para testes
- Actions sao automaticamente mockadas

---

## Parte 8: Cobertura de Codigo (Coverage)

### Gerar Relatorio

```bash
npm run test:coverage
```

Resultado:

```
--------------------------|---------|----------|---------|---------|
File                      | % Stmts | % Branch | % Funcs | % Lines |
--------------------------|---------|----------|---------|---------|
All files                 |   85.71 |    75.00 |   88.88 |   85.71 |
 components               |   90.00 |    80.00 |  100.00 |   90.00 |
  Counter.vue             |   100.0 |   100.00 |  100.00 |  100.00 |
  UserCard.vue            |   100.0 |   100.00 |  100.00 |  100.00 |
  UserProfile.vue         |   80.00 |    66.66 |  100.00 |   80.00 |
 stores                   |   85.00 |    70.00 |   80.00 |   85.00 |
  user.js                 |   85.00 |    70.00 |   80.00 |   85.00 |
 utils                    |   100.0 |   100.00 |  100.00 |  100.00 |
  validators.js           |   100.0 |   100.00 |  100.00 |  100.00 |
--------------------------|---------|----------|---------|---------|
```

**Metricas de Cobertura**:

- **Stmts (Statements)**: Linhas de codigo executadas
- **Branch**: Todas os caminhos (if/else) testados
- **Funcs (Functions)**: Funcoes chamadas
- **Lines**: Linhas totais cobertas

**Meta recomendada**: 80% ou mais

### Visualizar Relatorio HTML

Apos rodar `npm run test:coverage`, abra:

```
coverage/index.html
```

O relatorio mostra:
- Arquivos com baixa cobertura (em vermelho)
- Linhas nao testadas
- Branches nao cobertos

---

## Parte 9: Exercicios Praticos

### Exercicio 1: Testar Store de Produtos

Criar testes completos para a store de produtos:

1. Testar estado inicial
2. Testar getters (`produtosDisponiveis`, `produtoPorId`)
3. Testar action `buscarProdutos` (sucesso e erro)
4. Testar action `criarProduto`
5. Mockar chamadas de API
6. Verificar tratamento de erros

**Objetivo**: Dominar testes de stores Pinia com acoes assincronas.

### Exercicio 2: Testar Componente de Formulario

Criar testes para componente de formulario completo:

1. Renderizacao inicial
2. Validacao de campos (email, CPF, telefone)
3. Mensagens de erro
4. Submit do formulario
5. Limpeza apos submit
6. Estados de loading
7. Integracao com validators

**Objetivo**: Praticar testes de formularios e validacoes.

### Exercicio 3: Testes End-to-End

Instalar Cypress e criar teste E2E:

1. Instalar: `npm install --save-dev cypress`
2. Configurar Cypress
3. Criar teste de fluxo de compra:
   - Navegar para produtos
   - Adicionar ao carrinho
   - Finalizar compra
   - Verificar confirmacao
4. Tirar screenshots em cada etapa

**Objetivo**: Aprender testes end-to-end com Cypress.

---

## Parte 10: Melhores Praticas

### Organize seus testes

```
tests/
├── unit/
│   ├── components/    # Testes de componentes
│   ├── stores/        # Testes de stores
│   └── utils/         # Testes de funcoes
├── integration/       # Testes de integracao
├── e2e/              # Testes end-to-end
└── setup.js          # Configuracao global
```

### Nomeie testes claramente

Ruim:
```javascript
it('funciona', () => {
  // ...
})
```

Bom:
```javascript
it('deve validar email correto', () => {
  // ...
})
```

### Use beforeEach para setup

```javascript
describe('MeuComponente', () => {
  let wrapper
  
  beforeEach(() => {
    wrapper = mount(MeuComponente, {
      props: { /* props comuns */ }
    })
  })
  
  it('teste 1', () => {
    // wrapper ja esta montado
  })
  
  it('teste 2', () => {
    // wrapper remontado para este teste
  })
})
```

### Teste comportamento, nao implementacao

Ruim (testa implementacao interna):
```javascript
it('deve chamar metodo interno', () => {
  expect(wrapper.vm.metodoPrivado).toHaveBeenCalled()
})
```

Bom (testa comportamento visivel):
```javascript
it('deve mostrar mensagem de sucesso', () => {
  expect(wrapper.find('.sucesso').text()).toBe('Operacao concluida')
})
```

### Mantenha testes rapidos

- Mocke APIs externas
- Use `createTestingPinia` ao inves de store real
- Evite timeouts desnecessarios
- Teste unitario deve rodar em milissegundos

