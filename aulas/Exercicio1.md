# Test 1: Testar Store de Produtos

## Objetivo

Criar testes completos para a store de produtos, cobrindo estado inicial, getters, actions assincronas e tratamento de erros.

---

## Contexto

Voce ja conhece os fundamentos de testes. Agora vamos testar uma store Pinia que faz chamadas de API, trata erros e gerencia estado de carregamento.

---

## Passo 1: Revisar a Store de Produtos

A store que vamos testar esta em `src/stores/products.js`:

```javascript
import { defineStore } from 'pinia'
import api from '@/services/api'

export const useProductsStore = defineStore('products', {
  state: () => ({
    produtos: [],
    loading: false,
    erro: null
  }),
  
  getters: {
    produtosDisponiveis(state) {
      return state.produtos.filter(p => p.estoque > 0)
    },
    
    produtoPorId: (state) => (id) => {
      return state.produtos.find(p => p.id === id)
    },
    
    totalProdutos(state) {
      return state.produtos.length
    }
  },
  
  actions: {
    async buscarProdutos() {
      this.loading = true
      this.erro = null
      
      try {
        const response = await api.get('/produtos')
        this.produtos = response.data
      } catch (error) {
        this.erro = 'Erro ao buscar produtos'
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    
    async criarProduto(produto) {
      this.loading = true
      this.erro = null
      
      try {
        const response = await api.post('/produtos', produto)
        this.produtos.push(response.data)
        return { sucesso: true, produto: response.data }
      } catch (error) {
        this.erro = 'Erro ao criar produto'
        return { sucesso: false, erro: this.erro }
      } finally {
        this.loading = false
      }
    }
  }
})
```

---

## Passo 2: Criar Mock da API

Antes de testar, precisamos mockar o servico de API. Crie `src/services/api.js` se nao existir:

```javascript
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
})

export default api
```

---

## Passo 3: Criar Arquivo de Teste

Crie o arquivo `tests/unit/stores/products.spec.js`:

```javascript
import { setActivePinia, createPinia } from 'pinia'
import { useProductsStore } from '@/stores/products'
import api from '@/services/api'

// Mock da API
jest.mock('@/services/api')

describe('useProductsStore', () => {
  beforeEach(() => {
    // Cria nova instancia do Pinia antes de cada teste
    setActivePinia(createPinia())
    
    // Limpa mocks
    jest.clearAllMocks()
  })
  
  describe('estado inicial', () => {
    it('deve inicializar com produtos vazio', () => {
      const store = useProductsStore()
      
      expect(store.produtos).toEqual([])
      expect(store.loading).toBe(false)
      expect(store.erro).toBeNull()
    })
  })
  
  describe('getters', () => {
    it('produtosDisponiveis deve retornar apenas produtos com estoque', () => {
      const store = useProductsStore()
      
      store.produtos = [
        { id: 1, nome: 'Produto A', estoque: 10 },
        { id: 2, nome: 'Produto B', estoque: 0 },
        { id: 3, nome: 'Produto C', estoque: 5 }
      ]
      
      const disponiveis = store.produtosDisponiveis
      
      expect(disponiveis).toHaveLength(2)
      expect(disponiveis[0].id).toBe(1)
      expect(disponiveis[1].id).toBe(3)
    })
    
    it('produtosDisponiveis deve retornar array vazio se nenhum disponivel', () => {
      const store = useProductsStore()
      
      store.produtos = [
        { id: 1, nome: 'Produto A', estoque: 0 },
        { id: 2, nome: 'Produto B', estoque: 0 }
      ]
      
      expect(store.produtosDisponiveis).toEqual([])
    })
    
    it('produtoPorId deve retornar produto correto', () => {
      const store = useProductsStore()
      
      store.produtos = [
        { id: 1, nome: 'Produto A' },
        { id: 2, nome: 'Produto B' },
        { id: 3, nome: 'Produto C' }
      ]
      
      const produto = store.produtoPorId(2)
      
      expect(produto).toEqual({ id: 2, nome: 'Produto B' })
    })
    
    it('produtoPorId deve retornar undefined se produto nao existir', () => {
      const store = useProductsStore()
      
      store.produtos = [{ id: 1, nome: 'Produto A' }]
      
      const produto = store.produtoPorId(999)
      
      expect(produto).toBeUndefined()
    })
    
    it('totalProdutos deve retornar quantidade de produtos', () => {
      const store = useProductsStore()
      
      store.produtos = [
        { id: 1, nome: 'A' },
        { id: 2, nome: 'B' },
        { id: 3, nome: 'C' }
      ]
      
      expect(store.totalProdutos).toBe(3)
    })
  })
  
  describe('buscarProdutos', () => {
    it('deve buscar produtos com sucesso', async () => {
      const store = useProductsStore()
      const mockProdutos = [
        { id: 1, nome: 'Produto A', preco: 100, estoque: 10 },
        { id: 2, nome: 'Produto B', preco: 200, estoque: 5 }
      ]
      
      api.get.mockResolvedValue({ data: mockProdutos })
      
      await store.buscarProdutos()
      
      expect(store.produtos).toEqual(mockProdutos)
      expect(store.loading).toBe(false)
      expect(store.erro).toBeNull()
      expect(api.get).toHaveBeenCalledWith('/produtos')
    })
    
    it('deve definir loading como true durante busca', () => {
      const store = useProductsStore()
      
      api.get.mockImplementation(() => new Promise(() => {}))
      
      store.buscarProdutos()
      
      expect(store.loading).toBe(true)
    })
    
    it('deve definir loading como false apos busca', async () => {
      const store = useProductsStore()
      
      api.get.mockResolvedValue({ data: [] })
      
      await store.buscarProdutos()
      
      expect(store.loading).toBe(false)
    })
    
    it('deve tratar erro ao buscar produtos', async () => {
      const store = useProductsStore()
      const mockError = new Error('Erro de rede')
      
      api.get.mockRejectedValue(mockError)
      
      await store.buscarProdutos()
      
      expect(store.erro).toBe('Erro ao buscar produtos')
      expect(store.produtos).toEqual([])
      expect(store.loading).toBe(false)
    })
    
    it('deve limpar erro anterior ao fazer nova busca', async () => {
      const store = useProductsStore()
      
      store.erro = 'Erro antigo'
      api.get.mockResolvedValue({ data: [] })
      
      await store.buscarProdutos()
      
      expect(store.erro).toBeNull()
    })
  })
  
  describe('criarProduto', () => {
    it('deve criar produto com sucesso', async () => {
      const store = useProductsStore()
      const novoProduto = { nome: 'Produto Novo', preco: 150, estoque: 20 }
      const produtoCriado = { id: 10, ...novoProduto }
      
      api.post.mockResolvedValue({ data: produtoCriado })
      
      const result = await store.criarProduto(novoProduto)
      
      expect(result.sucesso).toBe(true)
      expect(result.produto).toEqual(produtoCriado)
      expect(store.produtos).toContainEqual(produtoCriado)
      expect(store.loading).toBe(false)
      expect(api.post).toHaveBeenCalledWith('/produtos', novoProduto)
    })
    
    it('deve definir loading como true durante criacao', () => {
      const store = useProductsStore()
      
      api.post.mockImplementation(() => new Promise(() => {}))
      
      store.criarProduto({ nome: 'Teste' })
      
      expect(store.loading).toBe(true)
    })
    
    it('deve tratar erro ao criar produto', async () => {
      const store = useProductsStore()
      const mockError = new Error('Erro ao salvar')
      
      api.post.mockRejectedValue(mockError)
      
      const result = await store.criarProduto({ nome: 'Teste' })
      
      expect(result.sucesso).toBe(false)
      expect(result.erro).toBe('Erro ao criar produto')
      expect(store.erro).toBe('Erro ao criar produto')
      expect(store.loading).toBe(false)
    })
    
    it('deve adicionar produto ao array de produtos', async () => {
      const store = useProductsStore()
      
      store.produtos = [
        { id: 1, nome: 'Produto A' }
      ]
      
      const novoProduto = { id: 2, nome: 'Produto B' }
      api.post.mockResolvedValue({ data: novoProduto })
      
      await store.criarProduto({ nome: 'Produto B' })
      
      expect(store.produtos).toHaveLength(2)
      expect(store.produtos[1]).toEqual(novoProduto)
    })
    
    it('deve limpar erro anterior ao criar produto', async () => {
      const store = useProductsStore()
      
      store.erro = 'Erro antigo'
      api.post.mockResolvedValue({ data: { id: 1, nome: 'Teste' } })
      
      await store.criarProduto({ nome: 'Teste' })
      
      expect(store.erro).toBeNull()
    })
  })
})
```

---

## Passo 4: Executar os Testes

No terminal:

```bash
npm test products.spec.js
```

Resultado esperado:

```
PASS  tests/unit/stores/products.spec.js
  useProductsStore
    estado inicial
      ✓ deve inicializar com produtos vazio
    getters
      ✓ produtosDisponiveis deve retornar apenas produtos com estoque
      ✓ produtosDisponiveis deve retornar array vazio se nenhum disponivel
      ✓ produtoPorId deve retornar produto correto
      ✓ produtoPorId deve retornar undefined se produto nao existir
      ✓ totalProdutos deve retornar quantidade de produtos
    buscarProdutos
      ✓ deve buscar produtos com sucesso
      ✓ deve definir loading como true durante busca
      ✓ deve definir loading como false apos busca
      ✓ deve tratar erro ao buscar produtos
      ✓ deve limpar erro anterior ao fazer nova busca
    criarProduto
      ✓ deve criar produto com sucesso
      ✓ deve definir loading como true durante criacao
      ✓ deve tratar erro ao criar produto
      ✓ deve adicionar produto ao array de produtos
      ✓ deve limpar erro anterior ao criar produto

Test Suites: 1 passed, 1 total
Tests:       16 passed, 16 total
```

---

## Passo 5: Verificar Cobertura

```bash
npm run test:coverage -- products.spec.js
```

A store deve ter 100% de cobertura em:
- Todas as linhas de codigo
- Todos os getters
- Todas as actions
- Tratamento de sucesso e erro

---

## O que Aprendemos

1. **Mockar API externa com Jest**
   - `jest.mock('@/services/api')`
   - `api.get.mockResolvedValue()`
   - `api.post.mockRejectedValue()`

2. **Testar estado inicial**
   - Verificar valores default

3. **Testar getters**
   - Com dados diversos
   - Com array vazio
   - Com filtros

4. **Testar actions assincronas**
   - Usar `async/await`
   - Verificar estado durante execucao
   - Testar sucesso e erro
   - Verificar chamadas de API

5. **Testar loading states**
   - Loading true durante execucao
   - Loading false apos conclusao

6. **Testar tratamento de erros**
   - Mensagens de erro
   - Estado apos erro
   - Limpeza de erros anteriores

