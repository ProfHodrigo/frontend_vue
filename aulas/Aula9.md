# Aula 9: Testes em Vue.js

## Introdução

Nesta aula aprenderemos a escrever testes para aplicações Vue.js, garantindo qualidade e confiabilidade do código. Testes automatizados são essenciais em projetos profissionais.

**Objetivo**: Configurar ambiente de testes com Vitest, escrever testes unitários para componentes e stores, e implementar testes end-to-end.

**O que vamos ver nessa aula**:
- Configurar Vitest e Vue Test Utils
- Escrever testes unitários para componentes
- Testar Pinia stores
- Mockar APIs e dependências
- Cobertura de código (coverage)
- Introdução a testes E2E com Cypress

---

## Parte 1: Fundamentos de Testes

### Por que testar

Testes automatizados trazem benefícios importantes:

1. **Confiança no código**
   - Garante que funcionalidades não quebram ao fazer mudanças
   - Detecta bugs antes de ir para produção

2. **Documentação viva**
   - Testes mostram como o código deve ser usado
   - Servem como exemplos práticos

3. **Refatoração segura**
   - Permite melhorar código sem medo de quebrar
   - Testes falham se algo para de funcionar

### Tipos de testes

**Testes Unitários**:
- Testam funções e componentes isolados
- Rápidos de executar
- Focam em lógica específica

**Testes de Integração**:
- Testam como partes diferentes trabalham juntas
- Componente + Store, Componente + API
- Mais próximos do uso real

**Testes End-to-End (E2E)**:
- Testam fluxo completo da aplicação
- Simulam usuário real
- Mais lentos, mas mais confiáveis

### O que testar

**Teste**:
- Lógica de negócio (cálculos, validações)
- Interações do usuário (clicks, inputs)
- Mudanças de estado
- Chamadas de API
- Navegação entre rotas

**Não teste**:
- Detalhes de implementação interna
- Bibliotecas de terceiros
- Estilos CSS (use testes visuais)

---

## Parte 2: Configuração do Ambiente

### Passo 1: Instalar Dependências

Este projeto já está configurado com Vitest. Para novos projetos, instale:

```bash
npm install --save-dev vitest @vue/test-utils jsdom
npm install --save-dev @vitest/ui @vitest/coverage-v8
npm install --save-dev @pinia/testing
```

**O que cada pacote faz**:
- `vitest`: Framework de testes moderno e rápido
- `@vue/test-utils`: Ferramentas para testar componentes Vue
- `jsdom`: Simula navegador para testes
- `@vitest/ui`: Interface gráfica para testes
- `@vitest/coverage-v8`: Relatórios de cobertura
- `@pinia/testing`: Helpers para testar stores Pinia

### Passo 2: Configurar Vitest

O arquivo `vitest.config.js` já está configurado:

```javascript
import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/*'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        exclude: [
          'node_modules/',
          'tests/',
          '**/*.spec.js',
          '**/*.test.js',
          '**/main.js',
          'vite.config.js',
          'vitest.config.js'
        ]
      }
    }
  })
)
```

**Configurações explicadas**:

1. **`environment: 'jsdom'`**
   - Simula DOM do navegador

2. **`exclude`**
   - Arquivos/pastas a ignorar nos testes

3. **`coverage`**
   - Configuração de relatórios de cobertura
   - Exclui arquivos de configuração e os próprios testes

### Passo 3: Scripts no package.json

O `package.json` já possui os scripts:

```json
{
  "scripts": {
    "test": "vitest",
    "test:unit": "vitest",
    "test:coverage": "vitest --coverage",
    "test:ui": "vitest --ui"
  }
}
```

**Como usar**:
- `npm test`: Roda testes em modo watch (observa mudanças)
- `npm run test:unit`: Executa todos os testes
- `npm run test:coverage`: Gera relatório de cobertura
- `npm run test:ui`: Abre interface gráfica do Vitest

### Passo 4: Estrutura de Pastas

Este projeto usa a estrutura:

```
tests/
├── unit/
│   ├── components/
│   │   ├── Counter.spec.js
│   │   └── UserCard.spec.js
│   └── utils/
│       └── validators.spec.js
```

---

## Parte 3: Testando Funções Utilitárias

### Exemplo: Validators

O arquivo `src/utils/validators.js` possui funções de validação:

```javascript
export function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

export function validarCPF(cpf) {
  const cleanCPF = cpf.replace(/[^\d]/g, '')
  
  if (cleanCPF.length !== 11) return false
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false
  
  // Calcula dígito verificador
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
}

export function validarTelefone(telefone) {
  const cleanPhone = telefone.replace(/[^\d]/g, '')
  return cleanPhone.length === 10 || cleanPhone.length === 11
}
```

### Teste do Validators

Veja o arquivo `tests/unit/utils/validators.spec.js`:

```javascript
import { describe, it, expect } from 'vitest'
import { validarEmail, validarCPF, validarTelefone } from '@/utils/validators'

describe('Validators', () => {
  describe('validarEmail', () => {
    it('deve validar email correto', () => {
      expect(validarEmail('teste@exemplo.com')).toBe(true)
      expect(validarEmail('user@dominio.com.br')).toBe(true)
    })
    
    it('deve rejeitar email sem @', () => {
      expect(validarEmail('teste.exemplo.com')).toBe(false)
    })
    
    it('deve rejeitar email sem domínio', () => {
      expect(validarEmail('teste@')).toBe(false)
    })
    
    it('deve rejeitar string vazia', () => {
      expect(validarEmail('')).toBe(false)
    })
  })
  
  describe('validarCPF', () => {
    it('deve validar CPF correto', () => {
      expect(validarCPF('11144477735')).toBe(true)
    })
    
    it('deve validar CPF com formatação', () => {
      expect(validarCPF('111.444.777-35')).toBe(true)
    })
    
    it('deve rejeitar CPF inválido', () => {
      expect(validarCPF('12345678901')).toBe(false)
    })
    
    it('deve rejeitar CPF com todos dígitos iguais', () => {
      expect(validarCPF('11111111111')).toBe(false)
    })
  })
  
  describe('validarTelefone', () => {
    it('deve validar telefone fixo', () => {
      expect(validarTelefone('1133334444')).toBe(true)
    })
    
    it('deve validar celular', () => {
      expect(validarTelefone('11999998888')).toBe(true)
    })
    
    it('deve validar com formatação', () => {
      expect(validarTelefone('(11) 99999-8888')).toBe(true)
    })
  })
})
```

**Estrutura de um teste Vitest**:

```javascript
import { describe, it, expect } from 'vitest'

describe('Nome do módulo', () => {
  it('deve fazer algo específico', () => {
    // Arrange (preparar)
    const entrada = 'valor'
    
    // Act (agir)
    const resultado = minhaFuncao(entrada)
    
    // Assert (verificar)
    expect(resultado).toBe('esperado')
  })
})
```

---

## Parte 4: Testando Componentes Vue

### Componente Counter

O componente `src/components/Counter.vue`:

```vue
<template>
  <div class="counter">
    <h3>Contador: <span class="count">{{ count }}</span></h3>
    <div class="buttons">
      <button @click="decrementar" :disabled="count === 0">-</button>
      <button @click="resetar">Reset</button>
      <button @click="incrementar">+</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const count = ref(0)

function incrementar() {
  count.value++
}

function decrementar() {
  if (count.value > 0) {
    count.value--
  }
}

function resetar() {
  count.value = 0
}
</script>
```

### Teste do Counter

Arquivo `tests/unit/components/Counter.spec.js`:

```javascript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Counter from '@/components/Counter.vue'

describe('Counter.vue', () => {
  it('deve renderizar o contador com valor inicial 0', () => {
    const wrapper = mount(Counter)
    expect(wrapper.find('.count').text()).toBe('0')
  })

  it('deve incrementar o contador', async () => {
    const wrapper = mount(Counter)
    const botaoIncrementar = wrapper.findAll('button')[2]
    
    await botaoIncrementar.trigger('click')
    expect(wrapper.find('.count').text()).toBe('1')
    
    await botaoIncrementar.trigger('click')
    expect(wrapper.find('.count').text()).toBe('2')
  })

  it('deve decrementar o contador', async () => {
    const wrapper = mount(Counter)
    const botaoIncrementar = wrapper.findAll('button')[2]
    const botaoDecrementar = wrapper.findAll('button')[0]
    
    // Incrementar primeiro
    await botaoIncrementar.trigger('click')
    await botaoIncrementar.trigger('click')
    
    // Decrementar
    await botaoDecrementar.trigger('click')
    expect(wrapper.find('.count').text()).toBe('1')
  })

  it('não deve permitir valores negativos', async () => {
    const wrapper = mount(Counter)
    const botaoDecrementar = wrapper.findAll('button')[0]
    
    await botaoDecrementar.trigger('click')
    expect(wrapper.find('.count').text()).toBe('0')
  })

  it('deve desabilitar botão decrementar quando count é 0', () => {
    const wrapper = mount(Counter)
    const botaoDecrementar = wrapper.findAll('button')[0]
    
    expect(botaoDecrementar.attributes('disabled')).toBeDefined()
  })

  it('deve resetar o contador para 0', async () => {
    const wrapper = mount(Counter)
    const botaoIncrementar = wrapper.findAll('button')[2]
    const botaoReset = wrapper.findAll('button')[1]
    
    // Incrementar
    await botaoIncrementar.trigger('click')
    await botaoIncrementar.trigger('click')
    await botaoIncrementar.trigger('click')
    
    // Resetar
    await botaoReset.trigger('click')
    expect(wrapper.find('.count').text()).toBe('0')
  })
})
```

**Métodos importantes do @vue/test-utils**:

- `mount(Component)`: Monta componente para teste
- `wrapper.find(selector)`: Busca elemento no template
- `wrapper.findAll(selector)`: Busca todos elementos
- `element.text()`: Retorna texto do elemento
- `element.trigger('click')`: Dispara evento
- `element.attributes()`: Retorna atributos do elemento

---

## Parte 5: Testando Props e Events

### Componente UserCard

O componente `src/components/UserCard.vue`:

```vue
<template>
  <div class="user-card">
    <div class="avatar">
      <img v-if="user.avatar" :src="user.avatar" :alt="user.nome" />
      <div v-else class="avatar-placeholder">{{ iniciais }}</div>
    </div>
    <div class="info">
      <h3>{{ user.nome }}</h3>
      <p class="user-email">{{ user.email }}</p>
      <p v-if="user.cargo" class="user-cargo">{{ user.cargo }}</p>
    </div>
    <div class="actions">
      <button v-if="showEditButton" class="btn-edit" @click="editar">
        Editar
      </button>
      <button v-if="showDeleteButton" class="btn-delete" @click="excluir">
        Excluir
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  user: {
    type: Object,
    required: true
  },
  showEditButton: {
    type: Boolean,
    default: true
  },
  showDeleteButton: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['edit', 'delete'])

const iniciais = computed(() => {
  const partes = props.user.nome.split(' ')
  if (partes.length === 1) return partes[0][0]
  return partes[0][0] + partes[partes.length - 1][0]
})

function editar() {
  emit('edit', props.user)
}

function excluir() {
  emit('delete', props.user.id || props.user.email)
}
</script>
```

### Teste do UserCard

Arquivo `tests/unit/components/UserCard.spec.js`:

```javascript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UserCard from '@/components/UserCard.vue'

describe('UserCard.vue', () => {
  const usuarioMock = {
    nome: 'João Silva',
    email: 'joao@email.com',
    cargo: 'Desenvolvedor'
  }

  it('deve renderizar informações do usuário', () => {
    const wrapper = mount(UserCard, {
      props: { user: usuarioMock }
    })

    expect(wrapper.find('h3').text()).toBe('João Silva')
    expect(wrapper.find('.user-email').text()).toBe('joao@email.com')
    expect(wrapper.find('.user-cargo').text()).toBe('Desenvolvedor')
  })

  it('deve mostrar iniciais quando não há avatar', () => {
    const wrapper = mount(UserCard, {
      props: { user: usuarioMock }
    })

    expect(wrapper.find('.avatar-placeholder').text()).toBe('JS')
  })

  it('deve mostrar imagem quando avatar está presente', () => {
    const usuarioComAvatar = {
      ...usuarioMock,
      avatar: 'https://example.com/avatar.jpg'
    }

    const wrapper = mount(UserCard, {
      props: { user: usuarioComAvatar }
    })

    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('https://example.com/avatar.jpg')
  })

  it('deve exibir botão editar por padrão', () => {
    const wrapper = mount(UserCard, {
      props: { user: usuarioMock }
    })

    expect(wrapper.find('.btn-edit').exists()).toBe(true)
  })

  it('deve ocultar botão editar quando showEditButton é false', () => {
    const wrapper = mount(UserCard, {
      props: {
        user: usuarioMock,
        showEditButton: false
      }
    })

    expect(wrapper.find('.btn-edit').exists()).toBe(false)
  })

  it('deve emitir evento edit ao clicar em editar', async () => {
    const wrapper = mount(UserCard, {
      props: { user: usuarioMock }
    })

    await wrapper.find('.btn-edit').trigger('click')

    expect(wrapper.emitted()).toHaveProperty('edit')
    expect(wrapper.emitted('edit')).toHaveLength(1)
    expect(wrapper.emitted('edit')[0]).toEqual([usuarioMock])
  })

  it('deve emitir evento delete ao clicar em excluir', async () => {
    const usuarioComId = {
      ...usuarioMock,
      id: 123
    }

    const wrapper = mount(UserCard, {
      props: {
        user: usuarioComId,
        showDeleteButton: true
      }
    })

    await wrapper.find('.btn-delete').trigger('click')

    expect(wrapper.emitted()).toHaveProperty('delete')
    expect(wrapper.emitted('delete')[0]).toEqual([123])
  })
})
```

**Testando Props**:
```javascript
const wrapper = mount(Component, {
  props: {
    propName: 'valor'
  }
})
```

**Testando Events**:
```javascript
await wrapper.find('button').trigger('click')
expect(wrapper.emitted('eventName')).toBeTruthy()
expect(wrapper.emitted('eventName')[0]).toEqual([payload])
```

---

## Parte 6: Testando Pinia Stores

### Criando uma Store

Arquivo `src/stores/products.js` (exemplo):

```javascript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export const useProductsStore = defineStore('products', () => {
  const products = ref([])
  const loading = ref(false)
  const error = ref(null)

  const totalProducts = computed(() => products.value.length)
  
  const productsInStock = computed(() => {
    return products.value.filter(p => p.estoque > 0)
  })

  async function fetchProducts() {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get('/products')
      products.value = response.data
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  function addProduct(product) {
    products.value.push({
      ...product,
      id: Date.now()
    })
  }

  function removeProduct(id) {
    const index = products.value.findIndex(p => p.id === id)
    if (index !== -1) {
      products.value.splice(index, 1)
    }
  }

  function updateStock(id, quantidade) {
    const product = products.value.find(p => p.id === id)
    if (product) {
      product.estoque = quantidade
    }
  }

  return {
    products,
    loading,
    error,
    totalProducts,
    productsInStock,
    fetchProducts,
    addProduct,
    removeProduct,
    updateStock
  }
})
```

### Teste da Store

Arquivo `tests/unit/stores/products.spec.js`:

```javascript
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useProductsStore } from '@/stores/products'
import api from '@/services/api'

// Mock da API
vi.mock('@/services/api')

describe('useProductsStore', () => {
  beforeEach(() => {
    // Cria nova instância do Pinia antes de cada teste
    setActivePinia(createPinia())
  })

  it('deve inicializar com estado vazio', () => {
    const store = useProductsStore()
    
    expect(store.products).toEqual([])
    expect(store.loading).toBe(false)
    expect(store.error).toBe(null)
  })

  it('deve adicionar produto', () => {
    const store = useProductsStore()
    
    const novoProduto = {
      nome: 'Notebook',
      preco: 3000,
      estoque: 10
    }
    
    store.addProduct(novoProduto)
    
    expect(store.products).toHaveLength(1)
    expect(store.products[0].nome).toBe('Notebook')
    expect(store.products[0].id).toBeDefined()
  })

  it('deve remover produto por id', () => {
    const store = useProductsStore()
    
    store.addProduct({ nome: 'Produto 1', preco: 100 })
    store.addProduct({ nome: 'Produto 2', preco: 200 })
    
    const idRemover = store.products[0].id
    store.removeProduct(idRemover)
    
    expect(store.products).toHaveLength(1)
    expect(store.products[0].nome).toBe('Produto 2')
  })

  it('deve calcular total de produtos', () => {
    const store = useProductsStore()
    
    expect(store.totalProducts).toBe(0)
    
    store.addProduct({ nome: 'P1', preco: 10 })
    store.addProduct({ nome: 'P2', preco: 20 })
    
    expect(store.totalProducts).toBe(2)
  })

  it('deve filtrar produtos em estoque', () => {
    const store = useProductsStore()
    
    store.addProduct({ nome: 'P1', estoque: 5 })
    store.addProduct({ nome: 'P2', estoque: 0 })
    store.addProduct({ nome: 'P3', estoque: 10 })
    
    expect(store.productsInStock).toHaveLength(2)
    expect(store.productsInStock[0].nome).toBe('P1')
    expect(store.productsInStock[1].nome).toBe('P3')
  })

  it('deve atualizar estoque de produto', () => {
    const store = useProductsStore()
    
    store.addProduct({ nome: 'Produto', estoque: 10 })
    const id = store.products[0].id
    
    store.updateStock(id, 25)
    
    expect(store.products[0].estoque).toBe(25)
  })

  it('deve buscar produtos da API', async () => {
    const store = useProductsStore()
    
    // Mock da resposta da API
    const mockProducts = [
      { id: 1, nome: 'P1', preco: 100 },
      { id: 2, nome: 'P2', preco: 200 }
    ]
    
    api.get.mockResolvedValue({ data: mockProducts })
    
    await store.fetchProducts()
    
    expect(store.loading).toBe(false)
    expect(store.products).toEqual(mockProducts)
    expect(api.get).toHaveBeenCalledWith('/products')
  })

  it('deve lidar com erro ao buscar produtos', async () => {
    const store = useProductsStore()
    
    api.get.mockRejectedValue(new Error('Erro de rede'))
    
    await store.fetchProducts()
    
    expect(store.loading).toBe(false)
    expect(store.error).toBe('Erro de rede')
    expect(store.products).toEqual([])
  })
})
```

**Conceitos importantes**:

- `setActivePinia(createPinia())`: Cria Pinia para testes
- `beforeEach()`: Executa antes de cada teste
- `vi.mock()`: Cria mock de módulo
- `mockResolvedValue()`: Mock de Promise resolvida
- `mockRejectedValue()`: Mock de Promise rejeitada

---

## Parte 7: Mockando APIs

### Mock manual

```javascript
import { vi } from 'vitest'

// Mock da função fetch
global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ data: 'mock data' })
  })
)
```

### Mock de módulo

```javascript
import { vi } from 'vitest'
import api from '@/services/api'

vi.mock('@/services/api')

// No teste
api.get.mockResolvedValue({ data: [] })
api.post.mockResolvedValue({ data: { id: 1 } })
```

### Verificar chamadas

```javascript
// Verificar se foi chamado
expect(api.get).toHaveBeenCalled()

// Verificar número de chamadas
expect(api.get).toHaveBeenCalledTimes(1)

// Verificar argumentos
expect(api.get).toHaveBeenCalledWith('/users')

// Resetar mocks
vi.clearAllMocks()
```

---

## Parte 8: Cobertura de Código

### Executar com cobertura

```bash
npm run test:coverage
```

### Interpretar relatório

O Vitest gera relatório em `coverage/`:

```
-----------------------|---------|----------|---------|---------|
File                   | % Stmts | % Branch | % Funcs | % Lines |
-----------------------|---------|----------|---------|---------|
All files             |   85.5  |   78.2   |   90.0  |   85.5  |
 components/          |   92.3  |   85.7   |   100   |   92.3  |
  Counter.vue         |   100   |   100    |   100   |   100   |
  UserCard.vue        |   87.5  |   80.0   |   100   |   87.5  |
 stores/              |   80.0  |   66.7   |   85.7  |   80.0  |
  products.js         |   80.0  |   66.7   |   85.7  |   80.0  |
-----------------------|---------|----------|---------|---------|
```

**Métricas**:
- **Statements**: % de instruções testadas
- **Branch**: % de ramificações (if/else) testadas
- **Functions**: % de funções testadas
- **Lines**: % de linhas testadas

**Meta ideal**: 80% de cobertura ou mais

---

## Parte 9: Interface Gráfica do Vitest

### Executar Vitest UI

```bash
npm run test:ui
```

Abre interface em `http://localhost:51204/`

**Recursos da UI**:
- Visualizar todos os testes
- Executar testes individuais
- Ver relatório de cobertura
- Modo watch automático
- Filtrar testes
- Ver detalhes de falhas

---

## Parte 10: Boas Práticas

### 1. Nomenclatura clara

```javascript
// ❌ Ruim
it('test 1', () => {})

// ✅ Bom
it('deve adicionar produto ao carrinho', () => {})
```

### 2. Arrange-Act-Assert

```javascript
it('deve calcular total', () => {
  // Arrange (preparar)
  const carrinho = { items: [{ preco: 10 }, { preco: 20 }] }
  
  // Act (agir)
  const total = calcularTotal(carrinho)
  
  // Assert (verificar)
  expect(total).toBe(30)
})
```

### 3. Um conceito por teste

```javascript
// ❌ Ruim - testa múltiplas coisas
it('deve adicionar e remover produto', () => {
  store.addProduct(produto)
  expect(store.products).toHaveLength(1)
  
  store.removeProduct(produto.id)
  expect(store.products).toHaveLength(0)
})

// ✅ Bom - testes separados
it('deve adicionar produto', () => {
  store.addProduct(produto)
  expect(store.products).toHaveLength(1)
})

it('deve remover produto', () => {
  store.addProduct(produto)
  const id = store.products[0].id
  
  store.removeProduct(id)
  expect(store.products).toHaveLength(0)
})
```

### 4. Isolar testes

```javascript
// Use beforeEach para resetar estado
beforeEach(() => {
  setActivePinia(createPinia())
  vi.clearAllMocks()
})
```

### 5. Não testar implementação

```javascript
// ❌ Ruim - testa implementação interna
it('deve chamar método interno', () => {
  const spy = vi.spyOn(component, 'metodoInterno')
  component.metodoPublico()
  expect(spy).toHaveBeenCalled()
})

// ✅ Bom - testa comportamento
it('deve exibir mensagem após salvar', async () => {
  await wrapper.find('button').trigger('click')
  expect(wrapper.find('.message').text()).toBe('Salvo!')
})
```

---

## Parte 11: Introdução a Testes E2E

### O que são testes E2E

Testes End-to-End simulam usuário real:
- Abrem navegador
- Navegam pela aplicação
- Clicam, digitam, rolam página
- Verificam resultado final

### Cypress (Opcional)

Para instalar Cypress:

```bash
npm install --save-dev cypress
```

Exemplo de teste E2E:

```javascript
describe('Fluxo de cadastro', () => {
  it('deve cadastrar novo usuário', () => {
    cy.visit('http://localhost:3000')
    
    cy.get('input[name="nome"]').type('João Silva')
    cy.get('input[name="email"]').type('joao@email.com')
    cy.get('button[type="submit"]').click()
    
    cy.contains('Usuário cadastrado com sucesso')
  })
})
```

---

## Resumo

Nesta aula aprendemos:

✅ Configurar Vitest em projeto Vue  
✅ Escrever testes unitários de funções  
✅ Testar componentes Vue com @vue/test-utils  
✅ Testar props, events e computed  
✅ Testar Pinia stores  
✅ Mockar APIs e dependências  
✅ Gerar relatórios de cobertura  
✅ Usar interface gráfica do Vitest  
✅ Aplicar boas práticas de testes  

### Comandos úteis

```bash
# Executar testes
npm test

# Testes com cobertura
npm run test:coverage

# Interface gráfica
npm run test:ui

# Executar teste específico
npm test Counter.spec.js
```

---

## Recursos Adicionais

**Documentação**:
- [Vitest](https://vitest.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Pinia Testing](https://pinia.vuejs.org/cookbook/testing.html)

**Artigos**:
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Vue Testing Handbook](https://lmiller1990.github.io/vue-testing-handbook/)

---

**Próxima aula**: Deploy e otimização de aplicações Vue.js
