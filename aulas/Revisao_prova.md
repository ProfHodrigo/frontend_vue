# Revisão para Prova - Vue.js

Este material de revisão cobre os tópicos essenciais que você precisa dominar para a prova. Leia atentamente cada seção, pratique os exemplos e certifique-se de entender os conceitos fundamentais.

---

## 1. Reatividade no Vue.js

### O que é Reatividade?

A reatividade é o coração do Vue.js. É o mecanismo que permite que a interface do usuário se atualize automaticamente quando os dados mudam, sem necessidade de manipulação manual do DOM.

### Como funciona?

Quando você declara dados reativos no Vue usando `data()`, o framework cria um sistema de observação sobre esses dados. Sempre que você modifica uma propriedade reativa, o Vue detecta a mudança e atualiza automaticamente todas as partes da interface que dependem daquele dado.

```vue
<template>
  <div>
    <h1>{{ mensagem }}</h1>
    <button @click="mudarMensagem">Clique aqui</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mensagem: 'Olá Vue!'
    }
  },
  methods: {
    mudarMensagem() {
      this.mensagem = 'Mensagem alterada!'
      // O Vue detecta essa mudança e atualiza o DOM automaticamente
    }
  }
}
</script>
```

### Pontos importantes:

- **Automático**: Você não precisa chamar funções como `render()` ou `update()`
- **Eficiente**: O Vue só atualiza as partes específicas que mudaram, não a página inteira
- **Bidirecional**: Mudanças nos dados atualizam a interface, e vice-versa (com v-model)

### Diferença de outras abordagens:

Sem reatividade (JavaScript puro):
```javascript
// Você precisa fazer manualmente:
document.getElementById('mensagem').textContent = 'Nova mensagem'
```

Com reatividade (Vue):
```javascript
// Apenas mude o dado, o Vue cuida do resto:
this.mensagem = 'Nova mensagem'
```

---

## 2. Renderização de Listas com v-for

### A Diretiva v-for

O `v-for` permite renderizar uma lista de elementos baseada em um array ou objeto. É uma das diretivas mais utilizadas no Vue.

### Sintaxe básica:

```vue
<template>
  <ul>
    <li v-for="item in lista" :key="item.id">
      {{ item.nome }}
    </li>
  </ul>
</template>
```

### A Importância da Key

A propriedade `:key` é fundamental quando você usa `v-for`. Mas por quê?

#### Como o Vue atualiza listas?

Quando uma lista muda (adiciona, remove ou reordena itens), o Vue precisa saber quais elementos correspondem a quais dados. Sem a `:key`, o Vue usa uma estratégia de "remendo" que pode causar:

1. **Bugs de estado**: Componentes mantêm estado incorreto após reordenação
2. **Problemas de performance**: Vue pode re-renderizar elementos desnecessariamente
3. **Comportamento inesperado**: Inputs perdem valores, animações ficam quebradas

#### Exemplo do problema:

```vue
<!-- SEM key (problemático) -->
<div v-for="produto in produtos">
  <input v-model="produto.quantidade">
  <span>{{ produto.nome }}</span>
</div>
```

Se você reordenar a lista, os inputs podem ficar "grudados" aos elementos DOM errados.

#### Solução correta:

```vue
<!-- COM key (correto) -->
<div v-for="produto in produtos" :key="produto.id">
  <input v-model="produto.quantidade">
  <span>{{ produto.nome }}</span>
</div>
```

### Regras para usar :key

1. **Use valores únicos**: IDs são ideais
2. **Valores estáveis**: Não use índices se a lista pode mudar de ordem
3. **Nunca repita**: Cada key deve ser única na lista

```vue
<template>
  <!-- ✓ CORRETO - usando ID único -->
  <div v-for="user in users" :key="user.id">
    {{ user.nome }}
  </div>

  <!-- ✗ EVITAR - usando índice (só OK se lista nunca muda) -->
  <div v-for="(user, index) in users" :key="index">
    {{ user.nome }}
  </div>
</template>
```

---

## 3. Interceptadores Axios

### O que são Interceptadores?

Interceptadores (interceptors) são funções que o Axios executa **antes** de enviar uma requisição ou **depois** de receber uma resposta. Eles permitem modificar requisições/respostas globalmente.

### Tipos de Interceptadores

#### 1. Request Interceptor (Interceptador de Requisição)

Executado **antes** de cada requisição ser enviada ao servidor.

```javascript
api.interceptors.request.use(
  (config) => {
    // Este código roda ANTES de enviar a requisição
    
    // Exemplo: adicionar token de autenticação
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Exemplo: adicionar timestamp
    config.headers['X-Request-Time'] = new Date().toISOString()
    
    // IMPORTANTE: sempre retornar config
    return config
  },
  (error) => {
    // Trata erros que acontecem antes da requisição
    return Promise.reject(error)
  }
)
```

#### 2. Response Interceptor (Interceptador de Resposta)

Executado **depois** de receber resposta do servidor.

```javascript
api.interceptors.response.use(
  (response) => {
    // Requisição bem-sucedida (status 2xx)
    console.log('Resposta recebida:', response.data)
    return response
  },
  (error) => {
    // Requisição com erro (status 4xx, 5xx)
    if (error.response?.status === 401) {
      // Token expirado - redirecionar para login
      localStorage.removeItem('token')
      router.push('/login')
    }
    return Promise.reject(error)
  }
)
```

### Casos de Uso Comuns

#### Adicionar Token Automaticamente

Sem interceptador (repetitivo):
```javascript
// Você teria que fazer isso em TODA requisição:
axios.get('/api/produtos', {
  headers: { Authorization: `Bearer ${token}` }
})

axios.post('/api/produtos', dados, {
  headers: { Authorization: `Bearer ${token}` }
})
```

Com interceptador (uma vez só):
```javascript
// Configurar UMA VEZ:
api.interceptors.request.use(config => {
  config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
  return config
})

// Agora TODAS as requisições incluem o token:
api.get('/api/produtos')  // Token incluído automaticamente
api.post('/api/produtos', dados)  // Token incluído automaticamente
```

### Vantagens dos Interceptadores

1. **DRY (Don't Repeat Yourself)**: Configure uma vez, funciona em todas as requisições
2. **Centralização**: Lógica de autenticação, logging, tratamento de erros em um só lugar
3. **Manutenibilidade**: Mudar headers ou tratamento de erros afeta todo o app automaticamente
4. **Transparência**: Componentes não precisam saber sobre tokens, eles apenas fazem requisições

---

## 4. Vue Router - Navegação

### Tipos de Navegação

O Vue Router oferece duas formas principais de navegar entre páginas em uma SPA:

#### 1. Navegação Declarativa (Template)

Usando o componente `<router-link>` diretamente no template:

```vue
<template>
  <nav>
    <!-- Navegação simples -->
    <router-link to="/">Home</router-link>
    
    <!-- Navegação com nome de rota -->
    <router-link :to="{ name: 'Sobre' }">Sobre</router-link>
    
    <!-- Navegação com parâmetros -->
    <router-link :to="{ name: 'Produto', params: { id: 123 }}">
      Ver Produto
    </router-link>
    
    <!-- Navegação com query strings -->
    <router-link :to="{ path: '/busca', query: { termo: 'vue' }}">
      Buscar Vue
    </router-link>
  </nav>
</template>
```

**Características:**
- Componente visual (cria um `<a>` no HTML)
- Adiciona classes CSS automaticamente (ex: `router-link-active`)
- Suporta clique direito, arrastar, etc. (comportamento de link nativo)
- Ideal para menus e links fixos

#### 2. Navegação Programática (JavaScript)

Usando `this.$router` dentro de métodos:

```vue
<template>
  <div>
    <button @click="irParaProduto(42)">Ver Produto 42</button>
    <button @click="buscar">Buscar</button>
    <button @click="voltar">Voltar</button>
  </div>
</template>

<script>
export default {
  methods: {
    irParaProduto(id) {
      // Navegação com parâmetros
      this.$router.push({
        name: 'Produto',
        params: { id: id }
      })
    },
    
    buscar() {
      // Navegação com query
      this.$router.push({
        path: '/resultados',
        query: { 
          termo: this.termoBusca,
          categoria: 'livros'
        }
      })
    },
    
    voltar() {
      // Volta uma página no histórico
      this.$router.go(-1)
    },
    
    avancar() {
      // Avança uma página no histórico
      this.$router.go(1)
    }
  }
}
</script>
```

**Características:**
- Executada via código JavaScript
- Permite lógica condicional
- Ideal para ações, formulários, redirecionamentos

### Quando usar cada uma?

| Situação | Use |
|----------|-----|
| Menu de navegação | `<router-link>` |
| Breadcrumbs | `<router-link>` |
| Links em conteúdo | `<router-link>` |
| Após envio de formulário | `this.$router.push()` |
| Redirecionamento condicional | `this.$router.push()` |
| Botão de ação que navega | `this.$router.push()` |
| Login bem-sucedido | `this.$router.push()` |

### Exemplo Completo

```vue
<template>
  <div>
    <!-- Navegação Declarativa - Menu -->
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/produtos">Produtos</router-link>
    </nav>
    
    <!-- Navegação Programática - Formulário -->
    <form @submit.prevent="handleLogin">
      <input v-model="email" type="email">
      <input v-model="senha" type="password">
      <button type="submit">Entrar</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      senha: ''
    }
  },
  methods: {
    async handleLogin() {
      const sucesso = await this.autenticar()
      
      if (sucesso) {
        // Navegação programática após sucesso
        this.$router.push('/dashboard')
      } else {
        alert('Credenciais inválidas')
      }
    }
  }
}
</script>
```

---

## 5. Arquitetura de Validação de Formulários

### Por que Separar a Lógica de Validação?

Quando construímos formulários, temos duas responsabilidades principais:

1. **Apresentação**: mostrar campos, labels, mensagens de erro
2. **Validação**: verificar se os dados estão corretos

Misturar essas responsabilidades no mesmo arquivo cria problemas:

```vue
<!-- ✗ RUIM - Tudo no componente -->
<script>
export default {
  methods: {
    validarEmail(email) {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return regex.test(email)
    },
    validarCPF(cpf) {
      // 50 linhas de lógica de validação de CPF...
    },
    validarTelefone(tel) {
      // Lógica de validação...
    }
    // ... mais 10 métodos de validação
  }
}
</script>
```

### Princípio de Separação de Responsabilidades

A solução é criar uma **classe separada** para validação:

```
📁 projeto
├── 📁 components
│   └── FormularioCadastro.vue  ← Responsável pela UI
└── 📁 utils
    └── validators.js            ← Responsável pela validação
```

### Vantagens da Separação

#### 1. **Testabilidade**

Com validador separado:
```javascript
// validators.spec.js
import FormValidator from './validators.js'

test('valida email corretamente', () => {
  const validator = new FormValidator()
  expect(validator.validarEmail('teste@example.com')).toBe(true)
  expect(validator.validarEmail('email-invalido')).toBe(false)
})
```

Sem separação, você precisaria testar o componente inteiro, renderizar DOM, etc.

#### 2. **Reutilização**

O mesmo validador pode ser usado em múltiplos componentes:

```vue
<!-- FormularioCadastro.vue -->
<script>
import FormValidator from '@/utils/validators'

export default {
  data() {
    return {
      validator: new FormValidator()
    }
  }
}
</script>
```

```vue
<!-- FormularioEdicao.vue -->
<script>
import FormValidator from '@/utils/validators'

export default {
  data() {
    return {
      validator: new FormValidator()  // Mesma classe!
    }
  }
}
</script>
```

#### 3. **Manutenção**

Se você precisa mudar uma regra de validação, muda em **um lugar só**:

```javascript
// validators.js
class FormValidator {
  validarSenha(senha) {
    // Mudou de 6 para 8 caracteres mínimos
    // Todos os formulários que usam isso são atualizados automaticamente
    return senha.length >= 8
  }
}
```

#### 4. **Clareza no Componente**

O componente Vue fica focado apenas em apresentação:

```vue
<!-- FormularioCadastro.vue -->
<template>
  <form @submit.prevent="enviar">
    <input 
      v-model="email" 
      @blur="validarCampo('email')"
      :class="{ 'erro': validator.errors.email }"
    >
    <span v-if="validator.errors.email">
      {{ validator.errors.email }}
    </span>
  </form>
</template>

<script>
import FormValidator from '@/utils/validators'

export default {
  data() {
    return {
      email: '',
      validator: new FormValidator()
    }
  },
  methods: {
    validarCampo(campo) {
      // Delega a validação para a classe especializada
      this.validator.validateField(campo, this[campo])
    }
  }
}
</script>
```

### Estrutura da Classe FormValidator

```javascript
// utils/validators.js
export default class FormValidator {
  constructor() {
    this.errors = {}
    this.rules = {}
  }
  
  // Define quais regras aplicar a cada campo
  setRules(rules) {
    this.rules = rules
  }
  
  // Valida um campo específico
  validateField(field, value) {
    const fieldRules = this.rules[field] || []
    
    for (let rule of fieldRules) {
      if (rule === 'required' && !value) {
        this.errors[field] = 'Campo obrigatório'
        return false
      }
      
      if (rule === 'email' && !this.isValidEmail(value)) {
        this.errors[field] = 'Email inválido'
        return false
      }
    }
    
    delete this.errors[field]
    return true
  }
  
  // Métodos auxiliares de validação
  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }
}
```

### Comparação Final

| Aspecto | Validação no Componente | Classe Separada |
|---------|------------------------|-----------------|
| Testabilidade | Difícil | Fácil |
| Reutilização | Copiar código | Import simples |
| Manutenção | Múltiplos arquivos | Um arquivo |
| Clareza | Código misturado | Responsabilidades claras |
| Tamanho do componente | Grande | Pequeno |

---

## 6. Operações CRUD

### O que é CRUD?

CRUD é um acrônimo que representa as quatro operações básicas de persistência de dados:

- **C**reate (Criar)
- **R**ead (Ler)
- **U**pdate (Atualizar)
- **D**elete (Deletar)

Essas operações são a base de qualquer aplicação que gerencia dados.

### Mapeamento HTTP

Cada operação CRUD corresponde a um método HTTP:

| Operação | Método HTTP | Ação | Exemplo |
|----------|-------------|------|---------|
| **Create** | POST | Cria novo recurso | Cadastrar produto |
| **Read** | GET | Busca recursos existentes | Listar produtos |
| **Update** | PUT/PATCH | Modifica recurso existente | Editar produto |
| **Delete** | DELETE | Remove recurso | Excluir produto |

### Diferença entre PUT e PATCH

- **PUT**: Substitui o recurso **completamente**
- **PATCH**: Atualiza **apenas campos específicos**

```javascript
// PUT - envia TODOS os campos
await api.put('/produtos/1', {
  nome: 'Mouse',
  preco: 45.90,
  estoque: 100,
  categoria: 'Periféricos',
  descricao: 'Mouse óptico'
})

// PATCH - envia APENAS o que mudou
await api.patch('/produtos/1', {
  preco: 39.90  // Só atualiza o preço
})
```

### Implementação Completa no Vue

#### 1. Service (Camada de Comunicação)

```javascript
// services/ProdutoService.js
import api from './api'

export default {
  // CREATE - Criar produto
  async criar(produto) {
    try {
      const response = await api.post('/api/produtos', produto)
      return { sucesso: true, dados: response.data }
    } catch (erro) {
      return { sucesso: false, mensagem: erro.message }
    }
  },

  // READ - Listar todos
  async listar() {
    try {
      const response = await api.get('/api/produtos')
      return { sucesso: true, dados: response.data }
    } catch (erro) {
      return { sucesso: false, mensagem: erro.message }
    }
  },

  // READ - Buscar um específico
  async buscarPorId(id) {
    try {
      const response = await api.get(`/api/produtos/${id}`)
      return { sucesso: true, dados: response.data }
    } catch (erro) {
      return { sucesso: false, mensagem: erro.message }
    }
  },

  // UPDATE - Atualizar produto
  async atualizar(id, produto) {
    try {
      const response = await api.put(`/api/produtos/${id}`, produto)
      return { sucesso: true, dados: response.data }
    } catch (erro) {
      return { sucesso: false, mensagem: erro.message }
    }
  },

  // DELETE - Excluir produto
  async deletar(id) {
    try {
      await api.delete(`/api/produtos/${id}`)
      return { sucesso: true }
    } catch (erro) {
      return { sucesso: false, mensagem: erro.message }
    }
  }
}
```

#### 2. Componente Vue usando CRUD

```vue
<template>
  <div>
    <!-- READ - Listagem -->
    <div v-for="produto in produtos" :key="produto.id">
      <h3>{{ produto.nome }}</h3>
      <p>R$ {{ produto.preco }}</p>
      
      <!-- UPDATE - Botão editar -->
      <button @click="editarProduto(produto)">
        Editar
      </button>
      
      <!-- DELETE - Botão excluir -->
      <button @click="excluirProduto(produto.id)">
        Excluir
      </button>
    </div>
    
    <!-- CREATE - Formulário de criação -->
    <form @submit.prevent="criarProduto">
      <input v-model="novoProduto.nome" placeholder="Nome">
      <input v-model="novoProduto.preco" type="number">
      <button type="submit">Criar Produto</button>
    </form>
  </div>
</template>

<script>
import ProdutoService from '@/services/ProdutoService'

export default {
  data() {
    return {
      produtos: [],
      novoProduto: {
        nome: '',
        preco: 0
      }
    }
  },
  
  mounted() {
    this.carregarProdutos()
  },
  
  methods: {
    // READ
    async carregarProdutos() {
      const resposta = await ProdutoService.listar()
      if (resposta.sucesso) {
        this.produtos = resposta.dados
      }
    },
    
    // CREATE
    async criarProduto() {
      const resposta = await ProdutoService.criar(this.novoProduto)
      if (resposta.sucesso) {
        this.produtos.push(resposta.dados)
        this.novoProduto = { nome: '', preco: 0 }
      }
    },
    
    // UPDATE
    async editarProduto(produto) {
      // Abrir modal de edição, por exemplo
      const produtoEditado = { ...produto, preco: produto.preco + 10 }
      const resposta = await ProdutoService.atualizar(produto.id, produtoEditado)
      
      if (resposta.sucesso) {
        const index = this.produtos.findIndex(p => p.id === produto.id)
        this.produtos[index] = resposta.dados
      }
    },
    
    // DELETE
    async excluirProduto(id) {
      if (confirm('Confirma exclusão?')) {
        const resposta = await ProdutoService.deletar(id)
        
        if (resposta.sucesso) {
          this.produtos = this.produtos.filter(p => p.id !== id)
        }
      }
    }
  }
}
</script>
```

### Boas Práticas CRUD

1. **Sempre trate erros**: Mostre mensagens amigáveis ao usuário
2. **Confirme exclusões**: Use `confirm()` ou modais
3. **Atualize a lista local**: Não recarregue tudo após cada operação
4. **Loading states**: Mostre feedback durante requisições
5. **Validação**: Valide dados antes de enviar ao servidor

---

## 7. Armazenamento de Token JWT no Frontend

### O que é um Token JWT?

JWT (JSON Web Token) é uma string codificada que contém informações sobre o usuário autenticado. É usado para manter o usuário "logado" entre requisições.

Exemplo de JWT:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidGVzdGVAZXhhbXBsZS5jb20ifQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

### Onde Armazenar o Token?

No frontend, existem opções principais para armazenar tokens:

#### 1. localStorage

```javascript
// Salvar token
localStorage.setItem('token', 'eyJhbGci...')

// Recuperar token
const token = localStorage.getItem('token')

// Remover token (logout)
localStorage.removeItem('token')

// Limpar tudo
localStorage.clear()
```

**Características:**
- ✅ Persiste mesmo após fechar o navegador
- ✅ Fácil de usar
- ✅ Sincronizado entre abas do mesmo domínio
- ⚠️ Acessível via JavaScript (vulnerável a XSS)
- ⚠️ Não expira automaticamente

#### 2. sessionStorage

```javascript
// Salvar token
sessionStorage.setItem('token', 'eyJhbGci...')

// Recuperar token
const token = sessionStorage.getItem('token')

// Remover token
sessionStorage.removeItem('token')
```

**Características:**
- ✅ Fácil de usar
- ✅ Expira quando fecha a aba
- ⚠️ Não persiste entre abas
- ⚠️ Acessível via JavaScript (vulnerável a XSS)
- 🎯 Ideal para sessões temporárias

#### 3. Cookies (HTTP-Only)

```javascript
// Configurado pelo backend no header
Set-Cookie: token=eyJhbGci...; HttpOnly; Secure; SameSite=Strict
```

**Características:**
- ✅ Mais seguro (HttpOnly não permite acesso via JavaScript)
- ✅ Enviado automaticamente em requisições
- ⚠️ Requer configuração no backend
- ⚠️ Mais complexo de implementar
- ⚠️ Vulnerável a CSRF (mitigado com SameSite)

### Comparação

| Aspecto | localStorage | sessionStorage | Cookies HTTP-Only |
|---------|-------------|----------------|-------------------|
| Persiste após fechar | ✅ Sim | ❌ Não | ✅ Sim |
| Entre abas | ✅ Sim | ❌ Não | ✅ Sim |
| Segurança XSS | ⚠️ Vulnerável | ⚠️ Vulnerável | ✅ Protegido |
| Facilidade | ✅ Muito fácil | ✅ Muito fácil | ⚠️ Complexo |
| Tamanho | ~5-10MB | ~5-10MB | ~4KB |

### Implementação Recomendada (localStorage)

Para aplicações modernas, localStorage é a escolha mais comum:

```javascript
// auth.js - Módulo de autenticação
export default {
  // Salvar token após login
  salvarToken(token) {
    localStorage.setItem('authToken', token)
  },
  
  // Recuperar token
  obterToken() {
    return localStorage.getItem('authToken')
  },
  
  // Verificar se usuário está autenticado
  estaAutenticado() {
    return !!this.obterToken()
  },
  
  // Logout
  logout() {
    localStorage.removeItem('authToken')
  }
}
```

### Uso no Vue

```vue
<script>
import auth from '@/utils/auth'

export default {
  methods: {
    async login() {
      const resposta = await api.post('/login', {
        email: this.email,
        senha: this.senha
      })
      
      if (resposta.data.token) {
        // Armazenar token
        auth.salvarToken(resposta.data.token)
        
        // Redirecionar
        this.$router.push('/dashboard')
      }
    },
    
    logout() {
      auth.logout()
      this.$router.push('/login')
    }
  },
  
  created() {
    // Verificar autenticação ao carregar
    if (!auth.estaAutenticado()) {
      this.$router.push('/login')
    }
  }
}
</script>
```

### Segurança

⚠️ **Importante**: localStorage é vulnerável a ataques XSS (Cross-Site Scripting). Para mitigar:

1. **Sanitize inputs**: Nunca renderize HTML de usuários sem sanitizar
2. **Use HTTPS**: Sempre em produção
3. **Tokens com expiração**: Implemente refresh tokens
4. **Validação no backend**: Nunca confie apenas no frontend

---

## 8. Estado Global com Pinia

### O que é Estado Global?

Estado global são dados que precisam ser acessados e modificados por **múltiplos componentes** da aplicação, independente de onde estejam na árvore de componentes.

### Estado Local vs Estado Global

#### Estado Local (data no componente)

```vue
<script>
export default {
  data() {
    return {
      contador: 0  // Só este componente acessa
    }
  }
}
</script>
```

**Problema**: Se outro componente precisa desse contador, você tem que:
- Passar via props (prop drilling)
- Emitir eventos para cima
- Duplicar o estado

#### Estado Global (Pinia)

```javascript
// stores/counter.js
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({
    contador: 0  // QUALQUER componente pode acessar
  })
})
```

```vue
<!-- ComponenteA.vue -->
<script>
import { useCounterStore } from '@/stores/counter'

export default {
  setup() {
    const store = useCounterStore()
    return { store }
  }
}
</script>

<template>
  <div>{{ store.contador }}</div>
</template>
```

```vue
<!-- ComponenteB.vue (em outro lugar da app) -->
<script>
import { useCounterStore } from '@/stores/counter'

export default {
  setup() {
    const store = useCounterStore()
    return { store }
  }
}
</script>

<template>
  <button @click="store.contador++">
    Incrementar
  </button>
</template>
```

### Quando Usar Estado Global?

✅ **Use estado global quando:**

1. **Dados compartilhados entre componentes não-relacionados**
   ```
   Navbar (mostra nome do usuário)
   └── não é pai/filho de
   Sidebar (mostra avatar do usuário)
   ```

2. **Dados que persistem entre navegação**
   - Carrinho de compras
   - Preferências do usuário
   - Dados do usuário logado

3. **Evitar "prop drilling"**
   ```
   AppVue → LayoutVue → HeaderVue → UserMenuVue
      ↓         ↓           ↓            ↓
   Passar 'user' por 4 componentes só para chegar no UserMenu
   ```

4. **Estado complexo com lógica**
   - Autenticação
   - Notificações
   - Filtros globais

❌ **NÃO use estado global para:**

1. **Dados de um componente só**
   ```vue
   <script>
   export default {
     data() {
       return {
         menuAberto: false  // Só este componente usa
       }
     }
   }
   </script>
   ```

2. **Dados temporários de formulário**
   ```vue
   data() {
     return {
       nome: '',
       email: ''  // Só usado enquanto preenche o form
     }
   }
   ```

3. **Estado de UI local**
   - Modals abertos/fechados
   - Tabs ativas
   - Accordions expandidos

### Exemplo Prático

#### ❌ Sem Pinia (Problema)

```vue
<!-- App.vue -->
<template>
  <Navbar :usuario="usuarioLogado" />
  <RouterView :usuario="usuarioLogado" />
</template>

<script>
export default {
  data() {
    return {
      usuarioLogado: { nome: 'João', email: 'joao@example.com' }
    }
  }
}
</script>
```

```vue
<!-- DashboardView.vue -->
<template>
  <Sidebar :usuario="usuario" />
  <MainContent :usuario="usuario" />
</template>

<script>
export default {
  props: ['usuario']  // Recebeu só pra passar adiante
}
</script>
```

```vue
<!-- Sidebar.vue -->
<template>
  <div>Bem-vindo, {{ usuario.nome }}</div>
</template>

<script>
export default {
  props: ['usuario']  // Finalmente usa!
}
</script>
```

**Problema**: Passamos `usuario` por 3 componentes só pra chegar no Sidebar!

#### ✅ Com Pinia (Solução)

```javascript
// stores/auth.js
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    usuario: {
      nome: 'João',
      email: 'joao@example.com'
    }
  })
})
```

```vue
<!-- Navbar.vue -->
<script>
import { useAuthStore } from '@/stores/auth'

export default {
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  }
}
</script>

<template>
  <div>{{ authStore.usuario.nome }}</div>
</template>
```

```vue
<!-- Sidebar.vue -->
<script>
import { useAuthStore } from '@/stores/auth'

export default {
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  }
}
</script>

<template>
  <div>{{ authStore.usuario.email }}</div>
</template>
```

**Vantagem**: Cada componente acessa diretamente, sem props intermediárias!

### Resumo

Use estado global (Pinia) quando:
- ✅ Múltiplos componentes precisam dos mesmos dados
- ✅ Dados persistem entre navegação
- ✅ Evitar prop drilling
- ✅ Lógica complexa compartilhada

Use estado local (data) quando:
- ✅ Apenas um componente usa
- ✅ Dados temporários
- ✅ Estado de UI simples

---

## 9. Tipos de Testes

### Visão Geral

Existem três níveis principais de testes em aplicações frontend:

```
           ┌─────────────────────────┐
           │   Testes E2E (poucos)   │  ← Simulam usuário real
           └───────────┬─────────────┘
                       │
           ┌───────────┴─────────────┐
           │ Testes Integração       │  ← Testam partes juntas
           │     (alguns)            │
           └───────────┬─────────────┘
                       │
           ┌───────────┴─────────────┐
           │ Testes Unitários        │  ← Testam funções isoladas
           │     (muitos)            │
           └─────────────────────────┘
```

Isso é chamado de "pirâmide de testes": muitos testes unitários, alguns de integração, poucos E2E.

### 1. Testes Unitários

**O que são?** Testam **uma função ou componente isolado**, sem dependências externas.

**Características:**
- ✅ Muito rápidos (milissegundos)
- ✅ Fáceis de escrever
- ✅ Fáceis de debugar
- ✅ Executam milhares em segundos
- ⚠️ Não garantem que partes funcionam juntas

**Exemplos:**

```javascript
// validators.spec.js
import { validarEmail } from './validators'

test('valida email correto', () => {
  expect(validarEmail('teste@example.com')).toBe(true)
})

test('rejeita email sem @', () => {
  expect(validarEmail('teste.com')).toBe(false)
})

test('rejeita email sem domínio', () => {
  expect(validarEmail('teste@')).toBe(false)
})
```

```javascript
// Counter.spec.js
import { mount } from '@vue/test-utils'
import Counter from './Counter.vue'

test('inicia com contador em 0', () => {
  const wrapper = mount(Counter)
  expect(wrapper.text()).toContain('0')
})

test('incrementa ao clicar no botão', async () => {
  const wrapper = mount(Counter)
  await wrapper.find('button').trigger('click')
  expect(wrapper.text()).toContain('1')
})
```

**Quando usar:**
- Funções utilitárias
- Validadores
- Formatadores
- Lógica de negócio
- Componentes simples

### 2. Testes de Integração

**O que são?** Testam como **múltiplas partes funcionam juntas**.

**Características:**
- ⚠️ Mais lentos que unitários
- ⚠️ Mais complexos de escrever
- ✅ Mais confiança que unitários
- ✅ Detectam problemas de integração

**Exemplos:**

```javascript
// ProdutosList.spec.js
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import ProdutosList from './ProdutosList.vue'
import { useProdutosStore } from '@/stores/produtos'

test('carrega e exibe produtos da store', async () => {
  const pinia = createPinia()
  const wrapper = mount(ProdutosList, {
    global: {
      plugins: [pinia]
    }
  })
  
  const store = useProdutosStore()
  store.produtos = [
    { id: 1, nome: 'Mouse' },
    { id: 2, nome: 'Teclado' }
  ]
  
  await wrapper.vm.$nextTick()
  
  expect(wrapper.text()).toContain('Mouse')
  expect(wrapper.text()).toContain('Teclado')
})
```

```javascript
// LoginFlow.spec.js
import { mount } from '@vue/test-utils'
import LoginForm from './LoginForm.vue'
import api from '@/services/api'

// Mock da API
vi.mock('@/services/api')

test('login bem-sucedido redireciona para dashboard', async () => {
  api.post.mockResolvedValue({
    data: { token: 'abc123' }
  })
  
  const wrapper = mount(LoginForm)
  
  await wrapper.find('[type="email"]').setValue('user@test.com')
  await wrapper.find('[type="password"]').setValue('senha123')
  await wrapper.find('form').trigger('submit')
  
  expect(api.post).toHaveBeenCalledWith('/login', {
    email: 'user@test.com',
    senha: 'senha123'
  })
})
```

**Quando usar:**
- Componente + Store
- Componente + API
- Fluxo de formulário
- Navegação entre rotas
- Autenticação

### 3. Testes End-to-End (E2E)

**O que são?** Testam a **aplicação completa**, simulando um usuário real no navegador.

**Características:**
- ⚠️ Muito lentos (segundos/minutos)
- ⚠️ Complexos de escrever e manter
- ⚠️ Podem falhar por motivos não relacionados ao código (rede, timing)
- ✅ Máxima confiança
- ✅ Testam fluxo completo real

**Exemplos com Cypress:**

```javascript
// login.cy.js
describe('Fluxo de Login', () => {
  it('usuário consegue fazer login completo', () => {
    // 1. Visita página
    cy.visit('http://localhost:3000/login')
    
    // 2. Preenche formulário
    cy.get('[data-test="email"]').type('admin@example.com')
    cy.get('[data-test="senha"]').type('senha123')
    
    // 3. Clica em entrar
    cy.get('[data-test="btn-entrar"]').click()
    
    // 4. Verifica redirecionamento
    cy.url().should('include', '/dashboard')
    
    // 5. Verifica que usuário está logado
    cy.contains('Bem-vindo, Admin').should('be.visible')
  })
  
  it('mostra erro com credenciais inválidas', () => {
    cy.visit('http://localhost:3000/login')
    cy.get('[data-test="email"]').type('errado@example.com')
    cy.get('[data-test="senha"]').type('senhaerrada')
    cy.get('[data-test="btn-entrar"]').click()
    
    cy.contains('Credenciais inválidas').should('be.visible')
  })
})
```

```javascript
// ecommerce.cy.js
describe('Fluxo de Compra', () => {
  it('usuário consegue comprar produto', () => {
    // Login
    cy.visit('/login')
    cy.get('[data-test="email"]').type('user@test.com')
    cy.get('[data-test="senha"]').type('senha123')
    cy.get('[data-test="btn-entrar"]').click()
    
    // Navegar para produtos
    cy.visit('/produtos')
    
    // Adicionar ao carrinho
    cy.contains('Mouse Gamer').parent().find('[data-test="btn-adicionar"]').click()
    cy.contains('Teclado Mecânico').parent().find('[data-test="btn-adicionar"]').click()
    
    // Ir para carrinho
    cy.get('[data-test="icone-carrinho"]').click()
    
    // Verificar itens
    cy.contains('Mouse Gamer').should('be.visible')
    cy.contains('Teclado Mecânico').should('be.visible')
    
    // Finalizar compra
    cy.get('[data-test="btn-finalizar"]').click()
    
    // Confirmar
    cy.contains('Pedido realizado com sucesso').should('be.visible')
  })
})
```

**Quando usar:**
- Fluxos críticos (login, checkout)
- Jornada completa do usuário
- Testes de regressão
- Validação de deploy

### Comparação

| Aspecto | Unitário | Integração | E2E |
|---------|----------|------------|-----|
| **Velocidade** | ⚡ Muito rápido | ⚠️ Moderado | 🐌 Lento |
| **Confiança** | ⚠️ Baixa | ✅ Média | ✅✅ Alta |
| **Custo manutenção** | ✅ Baixo | ⚠️ Médio | ⚠️⚠️ Alto |
| **Facilidade debug** | ✅✅ Fácil | ✅ Médio | ⚠️ Difícil |
| **Quantidade** | 🔢 Muitos | 🔢 Alguns | 🔢 Poucos |

### Estratégia Recomendada

1. **70% Unitários**: Funções, componentes simples, validadores
2. **20% Integração**: Componente + store, formulários, API
3. **10% E2E**: Fluxos críticos, jornadas principais

### Diferença Principal

**Testes Unitários:**
```javascript
// Testa APENAS a função
function somar(a, b) {
  return a + b
}
test('soma corretamente', () => {
  expect(somar(2, 3)).toBe(5)
})
```

**Testes E2E:**
```javascript
// Testa TODO o fluxo no navegador
cy.visit('/calculadora')
cy.get('[data-test="numero-2"]').click()
cy.get('[data-test="btn-mais"]').click()
cy.get('[data-test="numero-3"]').click()
cy.get('[data-test="btn-igual"]').click()
cy.get('[data-test="resultado"]').should('contain', '5')
```

A diferença fundamental:
- **Unitários**: Testam código isolado (funções, lógica)
- **E2E**: Testam experiência do usuário (fluxo completo, navegador real)

---

## 10. Pré-processadores CSS (SCSS/Sass)

### O que são Pré-processadores?

Pré-processadores CSS são linguagens que **estendem o CSS** com funcionalidades de programação, sendo depois compiladas para CSS padrão que o navegador entende.

```
SCSS (código que você escreve)
          ↓ (compilação)
CSS (código que o navegador lê)
```

### Por que usar SCSS/Sass?

CSS puro tem limitações:

```css
/* ❌ CSS puro - Repetitivo */
.botao-primario {
  background-color: #42b983;
  color: white;
  padding: 10px 20px;
  border: none;
}

.botao-secundario {
  background-color: #35495e;
  color: white;
  padding: 10px 20px;
  border: none;
}

.botao-primario:hover {
  background-color: #35a372;
}

.botao-secundario:hover {
  background-color: #2c3e50;
}
```

Com SCSS você pode usar variáveis, aninhamento, funções, etc.

### Principais Recursos do SCSS

#### 1. Variáveis

```scss
// ✅ SCSS - DRY (Don't Repeat Yourself)
$cor-primaria: #42b983;
$cor-secundaria: #35495e;
$espacamento: 10px 20px;

.botao-primario {
  background-color: $cor-primaria;
  padding: $espacamento;
}

.botao-secundario {
  background-color: $cor-secundaria;
  padding: $espacamento;
}
```

**Vantagem**: Mudar `$cor-primaria` atualiza todos os botões automaticamente!

#### 2. Aninhamento (Nesting)

```scss
// ✅ SCSS - Estrutura clara
.card {
  padding: 20px;
  border: 1px solid #ddd;
  
  .card-title {
    font-size: 1.5rem;
    margin-bottom: 10px;
  }
  
  .card-content {
    line-height: 1.6;
    
    p {
      margin-bottom: 10px;
    }
  }
  
  &:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
}
```

Compila para:
```css
.card { padding: 20px; border: 1px solid #ddd; }
.card .card-title { font-size: 1.5rem; margin-bottom: 10px; }
.card .card-content { line-height: 1.6; }
.card .card-content p { margin-bottom: 10px; }
.card:hover { box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
```

#### 3. Mixins (Funções Reutilizáveis)

```scss
// ✅ SCSS - Mixin para centralização
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  @include flex-center;
  height: 100vh;
}

.botao {
  @include flex-center;
  padding: 10px;
}
```

Mixin com parâmetros:
```scss
@mixin card-sombra($intensidade) {
  box-shadow: 0 4px 8px rgba(0, 0, 0, $intensidade);
}

.card-suave {
  @include card-sombra(0.1);
}

.card-forte {
  @include card-sombra(0.3);
}
```

#### 4. Funções de Cor

```scss
@use 'sass:color';

$cor-base: #42b983;

.botao {
  background-color: $cor-base;
  
  &:hover {
    // Escurece 15%
    background-color: color.adjust($cor-base, $lightness: -15%);
  }
  
  &:active {
    // Escurece 30%
    background-color: color.adjust($cor-base, $lightness: -30%);
  }
}

.badge {
  // Clareia 20%
  background-color: color.adjust($cor-base, $lightness: 20%);
}
```

#### 5. Importação de Arquivos

```scss
// variables.scss
$cor-primaria: #42b983;
$espacamento-base: 1rem;

// componentes.scss
@import 'variables';

.card {
  padding: $espacamento-base;
  border: 1px solid $cor-primaria;
}
```

#### 6. Operações Matemáticas

```scss
$largura-base: 100px;
$espacamento: 20px;

.container {
  width: $largura-base * 10; // 1000px
  padding: $espacamento / 2; // 10px
  margin: $espacamento * 1.5; // 30px
}
```

### Exemplo Completo no Vue

```vue
<template>
  <div class="produto-card">
    <div class="produto-header">
      <h3 class="produto-titulo">{{ produto.nome }}</h3>
      <span class="produto-badge">Novo</span>
    </div>
    
    <div class="produto-body">
      <p class="produto-preco">R$ {{ produto.preco }}</p>
      <button class="produto-btn produto-btn--primario">
        Comprar
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['produto']
}
</script>

<style scoped lang="scss">
// Importar variáveis globais
@import '@/styles/variables.scss';

// Variáveis locais
$card-padding: 1.5rem;
$border-radius: 8px;

.produto-card {
  background: white;
  border-radius: $border-radius;
  padding: $card-padding;
  box-shadow: $sombra-base;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: $sombra-elevada;
  }
  
  .produto-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    
    .produto-titulo {
      font-size: 1.25rem;
      color: $cor-texto-principal;
      margin: 0;
    }
    
    .produto-badge {
      background-color: $cor-primaria;
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: $border-radius / 2;
      font-size: 0.75rem;
    }
  }
  
  .produto-body {
    .produto-preco {
      font-size: 1.5rem;
      font-weight: bold;
      color: $cor-primaria;
      margin-bottom: 1rem;
    }
    
    .produto-btn {
      width: 100%;
      padding: 0.75rem;
      border: none;
      border-radius: $border-radius;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s;
      
      &--primario {
        background-color: $cor-primaria;
        color: white;
        
        &:hover {
          background-color: color.adjust($cor-primaria, $lightness: -10%);
        }
        
        &:active {
          transform: scale(0.98);
        }
      }
    }
  }
}
</style>
```

### Vantagens do SCSS

| Recurso | Sem SCSS | Com SCSS |
|---------|----------|----------|
| **Cores** | Repetir #42b983 | `$cor-primaria` |
| **Hierarquia** | `.card .card-title` | Aninhamento claro |
| **Reutilização** | Copiar código | Mixins |
| **Manutenção** | Mudar em 50 lugares | Mudar 1 variável |
| **Matemática** | Calculadora | `$base * 2` |
| **Organização** | 1 arquivo gigante | Múltiplos imports |

### Por que Facilita Manutenção?

#### Exemplo: Mudança de tema

**Sem SCSS:**
```css
/* Você precisa mudar em 50 lugares */
.botao { background-color: #42b983; }
.titulo { color: #42b983; }
.badge { border: 1px solid #42b983; }
/* ... mais 47 lugares */
```

**Com SCSS:**
```scss
/* Muda 1 linha, atualiza tudo */
$cor-primaria: #e74c3c; // Era #42b983

.botao { background-color: $cor-primaria; }
.titulo { color: $cor-primaria; }
.badge { border: 1px solid $cor-primaria; }
/* Todos atualizam automaticamente! */
```

### Resumo

SCSS permite:
- ✅ **Variáveis**: Reutilizar valores
- ✅ **Aninhamento**: Estrutura clara
- ✅ **Mixins**: Código reutilizável
- ✅ **Funções**: Manipular cores, cálculos
- ✅ **Importação**: Organizar código
- ✅ **Operações**: Matemática no CSS

Principal vantagem: **Manutenção muito mais fácil** em projetos grandes!

---

**Boa sorte na prova!**

Lembre-se: O objetivo não é apenas passar, mas **entender** os conceitos para aplicá-los em projetos reais.
