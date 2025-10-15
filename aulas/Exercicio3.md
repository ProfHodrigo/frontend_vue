# Exercício 3 — CRUD Completo de Produtos

## Objetivo

Criar uma aplicação completa de gerenciamento de produtos com as 4 operações CRUD:
- **C**reate (Criar)
- **R**ead (Ler/Listar)
- **U**pdate (Atualizar)
- **D**elete (Deletar)

---

## API a Utilizar

**Base URL:** `https://jsonplaceholder.typicode.com`

**Endpoints:**

| Método | Endpoint | Ação |
|--------|----------|------|
| GET | `/posts` | Listar todos |
| GET | `/posts/1` | Buscar por ID |
| POST | `/posts` | Criar novo |
| PUT | `/posts/1` | Atualizar completo |
| PATCH | `/posts/1` | Atualizar parcial |
| DELETE | `/posts/1` | Deletar |

**Nota:** JSONPlaceholder é uma API de teste, então as alterações não são realmente salvas no servidor, mas você receberá respostas simuladas.

---

## Estrutura do Componente

### Arquivos a Criar

1. **`src/services/api.js`** - Configuração do Axios
2. **`src/services/ProdutosService.js`** - Métodos de API
3. **`src/components/GerenciadorProdutos.vue`** - Componente principal

---

## Parte 1: Configurar Axios

### Arquivo: `src/services/api.js`

```javascript
import axios from 'axios'

const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

export default api
```

---

## Parte 2: Criar Service

### Arquivo: `src/services/ProdutosService.js`

**Dica:** Crie métodos para cada operação CRUD:

```javascript
import api from './api'

export default {
  // CREATE - Criar produto
  async criar(produto) {
    try {
      const response = await api.post('/posts', produto)
      return { sucesso: true, dados: response.data }
    } catch (erro) {
      return { sucesso: false, mensagem: erro.message }
    }
  },

  // READ - Listar todos
  async listar() {
    // Implemente aqui
    // Dica: use api.get('/posts')
  },

  // READ - Buscar por ID
  async buscarPorId(id) {
    // Implemente aqui
    // Dica: use api.get(`/posts/${id}`)
  },

  // UPDATE - Atualizar
  async atualizar(id, produto) {
    // Implemente aqui
    // Dica: use api.put(`/posts/${id}`, produto)
  },

  // DELETE - Deletar
  async deletar(id) {
    // Implemente aqui
    // Dica: use api.delete(`/posts/${id}`)
  }
}
```

---

## Parte 3: Componente Principal

### Estrutura de Dados

```javascript
data() {
  return {
    // Estados
    carregando: false,
    erro: null,
    
    // Lista de produtos
    produtos: [],
    
    // Formulário
    modoEdicao: false,
    produtoAtual: {
      id: null,
      title: '',
      body: '',
      userId: 1
    },
    
    // Modal
    mostrarModal: false
  }
}
```

### Métodos Necessários

#### 1. Listar Produtos

```javascript
async listarProdutos() {
  this.carregando = true
  this.erro = null
  
  const resposta = await ProdutosService.listar()
  
  if (resposta.sucesso) {
    this.produtos = resposta.dados
  } else {
    this.erro = resposta.mensagem
  }
  
  this.carregando = false
}
```

#### 2. Criar Produto

**Dicas:**
- Valide se os campos estão preenchidos
- Chame `ProdutosService.criar(this.produtoAtual)`
- Se sucesso, adicione o produto na lista local
- Limpe o formulário
- Mostre mensagem de sucesso

```javascript
async criarProduto() {
  // Validação
  if (!this.produtoAtual.title || !this.produtoAtual.body) {
    alert('Preencha todos os campos!')
    return
  }
  
  this.carregando = true
  
  // Chamar service
  const resposta = await ProdutosService.criar(this.produtoAtual)
  
  if (resposta.sucesso) {
    // Adicionar na lista local (início do array)
    this.produtos.unshift(resposta.dados)
    
    // Limpar formulário
    this.limparFormulario()
    
    // Fechar modal
    this.mostrarModal = false
    
    alert('Produto criado com sucesso!')
  } else {
    alert(`Erro: ${resposta.mensagem}`)
  }
  
  this.carregando = false
}
```

#### 3. Editar Produto

**Dicas:**
- Ao clicar em "Editar", preencha o formulário com os dados do produto
- Ative `modoEdicao = true`
- Ao salvar, use PUT ou PATCH
- Atualize o produto na lista local

```javascript
editarProduto(produto) {
  // Copia os dados para o formulário
  this.produtoAtual = { ...produto }
  this.modoEdicao = true
  this.mostrarModal = true
}

async salvarEdicao() {
  this.carregando = true
  
  const resposta = await ProdutosService.atualizar(
    this.produtoAtual.id, 
    this.produtoAtual
  )
  
  if (resposta.sucesso) {
    // Encontrar e atualizar na lista
    const index = this.produtos.findIndex(p => p.id === this.produtoAtual.id)
    if (index !== -1) {
      this.produtos[index] = resposta.dados
    }
    
    this.limparFormulario()
    this.mostrarModal = false
    alert('Produto atualizado!')
  }
  
  this.carregando = false
}
```

#### 4. Deletar Produto

**Dicas:**
- Peça confirmação antes de deletar
- Remova da lista local após sucesso

```javascript
async deletarProduto(id) {
  if (!confirm('Tem certeza que deseja deletar este produto?')) {
    return
  }
  
  this.carregando = true
  
  const resposta = await ProdutosService.deletar(id)
  
  if (resposta.sucesso) {
    // Remover da lista
    this.produtos = this.produtos.filter(p => p.id !== id)
    alert('Produto deletado!')
  } else {
    alert(`Erro: ${resposta.mensagem}`)
  }
  
  this.carregando = false
}
```

#### 5. Métodos Auxiliares

```javascript
limparFormulario() {
  this.produtoAtual = {
    id: null,
    title: '',
    body: '',
    userId: 1
  }
  this.modoEdicao = false
}

abrirModalNovo() {
  this.limparFormulario()
  this.mostrarModal = true
}
```

---

## Parte 4: Template

### Estrutura Sugerida

```vue
<template>
  <div class="gerenciador-produtos">
    <!-- Cabeçalho -->
    <div class="card">
      <div class="card-header">
        <h3>Gerenciador de Produtos</h3>
        <button @click="abrirModalNovo" class="btn btn-success">
          <i class="fas fa-plus"></i> Novo Produto
        </button>
      </div>
      
      <div class="card-body">
        <!-- Loading -->
        <div v-if="carregando && produtos.length === 0">
          <!-- Spinner -->
        </div>
        
        <!-- Lista de Produtos -->
        <div v-else>
          <table class="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Título</th>
                <th>Descrição</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="produto in produtos" :key="produto.id">
                <td>{{ produto.id }}</td>
                <td>{{ produto.title }}</td>
                <td>{{ produto.body.substring(0, 50) }}...</td>
                <td>
                  <button @click="editarProduto(produto)" class="btn btn-sm btn-primary">
                    Editar
                  </button>
                  <button @click="deletarProduto(produto.id)" class="btn btn-sm btn-danger">
                    Deletar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
    <!-- Modal de Formulário -->
    <div v-if="mostrarModal" class="modal" @click.self="mostrarModal = false">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5>{{ modoEdicao ? 'Editar' : 'Novo' }} Produto</h5>
            <button @click="mostrarModal = false">&times;</button>
          </div>
          
          <div class="modal-body">
            <form @submit.prevent="modoEdicao ? salvarEdicao() : criarProduto()">
              <div class="mb-3">
                <label>Título</label>
                <input 
                  v-model="produtoAtual.title"
                  type="text"
                  class="form-control"
                  required
                >
              </div>
              
              <div class="mb-3">
                <label>Descrição</label>
                <textarea 
                  v-model="produtoAtual.body"
                  class="form-control"
                  rows="4"
                  required
                ></textarea>
              </div>
              
              <div class="d-flex gap-2">
                <button type="submit" class="btn btn-success" :disabled="carregando">
                  {{ carregando ? 'Salvando...' : 'Salvar' }}
                </button>
                <button type="button" @click="mostrarModal = false" class="btn btn-secondary">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
```

---

## Estilos para o Modal

```vue
<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-dialog {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #ddd;
}

.modal-body {
  padding: 1rem;
}

table {
  width: 100%;
}

.btn {
  margin-right: 0.5rem;
}
</style>
```

---

## Checklist de Implementação

- [ ] `api.js` criado e configurado
- [ ] `ProdutosService.js` com todos os métodos CRUD
- [ ] Componente `GerenciadorProdutos.vue` criado
- [ ] Hook `mounted()` busca produtos iniciais
- [ ] Botão "Novo Produto" abre modal
- [ ] Formulário no modal funciona
- [ ] Criar produto adiciona na lista
- [ ] Editar produto atualiza na lista
- [ ] Deletar produto remove da lista
- [ ] Confirmação antes de deletar
- [ ] Loading states implementados
- [ ] Validação de formulário
- [ ] Mensagens de sucesso/erro

---

## Desafios Extras

### 1. Busca e Filtros

Adicione:
- Campo de busca por título
- Filtro por userId
- Ordenação (mais recentes, alfabético)

### 2. Paginação

Mostre apenas 10 produtos por página com navegação.

### 3. Toast Notifications

Substitua `alert()` por notificações mais elegantes.

### 4. Validação Avançada

- Título mínimo de 5 caracteres
- Descrição mínima de 10 caracteres
- Mostrar mensagens de erro no formulário

### 5. Confirmação Visual

Ao deletar, mostrar modal de confirmação estilizado ao invés de `confirm()`.

---

## Testando

### Teste 1: Criar Produto

1. Clique em "Novo Produto"
2. Preencha o formulário
3. Clique em "Salvar"
4. Verifique se aparece no topo da lista

### Teste 2: Editar Produto

1. Clique em "Editar" em um produto
2. Altere os dados
3. Salve
4. Verifique se foi atualizado na lista

### Teste 3: Deletar Produto

1. Clique em "Deletar"
2. Confirme
3. Verifique se foi removido da lista

### Teste 4: Validação

1. Tente salvar com campos vazios
2. Deve mostrar mensagem de erro

---

## Conceitos Praticados

✅ CRUD completo (Create, Read, Update, Delete)  
✅ Service Layer (ProdutosService)  
✅ Axios com todos os métodos HTTP  
✅ Modal programático  
✅ Formulário com v-model  
✅ Modo edição vs criação  
✅ Confirmações  
✅ Manipulação de arrays (push, filter, findIndex)  
✅ Spread operator (`...`)  

---

## Dicas Importantes

💡 **JSONPlaceholder não persiste dados:** As alterações são simuladas, mas ao recarregar a página, volta ao estado inicial.

💡 **IDs podem se repetir:** Ao criar, o servidor retorna sempre ID 101. Em produção real, o backend gera IDs únicos.

💡 **Use DevTools:** Abra a aba Network (F12) para ver as requisições e respostas.

💡 **Trate erros:** Sempre use try/catch e mostre mensagens amigáveis ao usuário.

---

## Próximos Passos

Após completar este exercício, você estará pronto para:

1. Conectar com backend real (Flask, Express, etc)
2. Adicionar autenticação (JWT)
3. Usar Vuex/Pinia para gerenciar estado global
4. Implementar upload de imagens
5. Criar rotas com Vue Router

---

## Recursos

- [JSONPlaceholder](https://jsonplaceholder.typicode.com/)
- [Axios Methods](https://axios-http.com/docs/api_intro)
- [HTTP Status Codes](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Status)
- [REST API Best Practices](https://restfulapi.net/)

💡 **Dica Final:** Este é o exercício mais completo! Se conseguir fazer sozinho, já domina comunicação com API em Vue.js!
