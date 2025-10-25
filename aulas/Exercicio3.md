# Teste 3 - Testes End-to-End com Cypress

## Objetivo do Exercício


Implementar testes end-to-end (E2E) usando Cypress para validar fluxos completos de usuário na aplicação, incluindo navegação, interação com formulários e integração com backend.

**O que você vai aprender:**
- Configurar Cypress para testes E2E
- Criar testes que simulam comportamento real de usuários
- Testar fluxos completos de navegação
- Interceptar requisições HTTP
- Trabalhar com comandos customizados do Cypress
- Capturar screenshots e vídeos de testes

## Contexto

Testes E2E são fundamentais para garantir que toda a aplicação funcione corretamente do ponto de vista do usuário. Diferente dos testes unitários que testam partes isoladas, os testes E2E validam fluxos completos, incluindo a integração entre frontend e backend.

Neste exercício, você vai criar testes E2E para três fluxos importantes da aplicação:
1. Fluxo de login de usuário
2. Fluxo de gerenciamento de produtos
3. Fluxo de carrinho de compras

## Passo 1: Instalar e Configurar Cypress

Primeiro, instale o Cypress como dependência de desenvolvimento:

```bash
npm install --save-dev cypress
```

Adicione scripts no `package.json`:

```json
{
  "scripts": {
    "test": "vitest",
    "test:unit": "vitest",
    "test:coverage": "vitest --coverage",
    "cypress": "cypress open",
    "cypress:headless": "cypress run",
    "test:e2e": "start-server-and-test dev http://localhost:5173 cypress:headless"
  }
}
```

Inicialize o Cypress:

```bash
npx cypress open
```

Isso criará a estrutura de pastas do Cypress:
- `cypress/e2e/` - Testes E2E
- `cypress/fixtures/` - Dados mockados
- `cypress/support/` - Comandos customizados e configurações
- `cypress.config.js` - Configuração do Cypress

## Passo 2: Configurar Cypress

Crie o arquivo de configuração `cypress.config.js` na raiz do projeto:

```javascript
import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js',
    video: true,
    screenshotOnRunFailure: true,
    viewportWidth: 1280,
    viewportHeight: 720,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
})
```

Atualize o arquivo `cypress/support/e2e.js`:

```javascript
// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Prevent Cypress from failing tests on uncaught exceptions
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  return false
})
```

## Passo 3: Criar Comandos Customizados

Crie comandos reutilizáveis no arquivo `cypress/support/commands.js`:

```javascript
// Comando para fazer login
Cypress.Commands.add('login', (email = 'teste@email.com', senha = '123456') => {
  cy.visit('/')
  cy.get('[data-test="btn-login-tab"]').click()
  cy.get('[data-test="input-email"]').type(email)
  cy.get('[data-test="input-senha"]').type(senha)
  cy.get('[data-test="btn-submit-login"]').click()
})

// Comando para fazer logout
Cypress.Commands.add('logout', () => {
  cy.get('[data-test="btn-logout"]').click()
})

// Comando para adicionar produto ao carrinho
Cypress.Commands.add('adicionarProdutoAoCarrinho', (produtoId) => {
  cy.get(`[data-test="produto-${produtoId}"]`).within(() => {
    cy.get('[data-test="btn-adicionar-carrinho"]').click()
  })
})

// Comando para limpar banco de dados (se necessário)
Cypress.Commands.add('limparDados', () => {
  cy.window().then((win) => {
    win.localStorage.clear()
    win.sessionStorage.clear()
  })
})
```

## Passo 4: Criar Fixtures (Dados de Teste)

Crie o arquivo `cypress/fixtures/usuario.json`:

```json
{
  "valido": {
    "email": "teste@email.com",
    "senha": "123456",
    "nome": "Usuário Teste"
  },
  "invalido": {
    "email": "invalido@email.com",
    "senha": "senhaerrada"
  }
}
```

Crie o arquivo `cypress/fixtures/produtos.json`:

```json
{
  "produtos": [
    {
      "id": 1,
      "nome": "Notebook",
      "preco": 2500,
      "estoque": 10,
      "categoria": "Eletrônicos"
    },
    {
      "id": 2,
      "nome": "Mouse",
      "preco": 50,
      "estoque": 25,
      "categoria": "Acessórios"
    },
    {
      "id": 3,
      "nome": "Teclado",
      "preco": 150,
      "estoque": 15,
      "categoria": "Acessórios"
    }
  ]
}
```

## Passo 5: Teste E2E - Fluxo de Login

Crie o arquivo `cypress/e2e/login.cy.js`:

```javascript
describe('Fluxo de Login', () => {
  beforeEach(() => {
    cy.limparDados()
    cy.visit('/')
  })

  it('deve exibir formulário de login', () => {
    cy.get('[data-test="btn-login-tab"]').click()
    cy.get('[data-test="input-email"]').should('be.visible')
    cy.get('[data-test="input-senha"]').should('be.visible')
    cy.get('[data-test="btn-submit-login"]').should('be.visible')
  })

  it('deve fazer login com sucesso', () => {
    cy.fixture('usuario').then((usuario) => {
      cy.get('[data-test="btn-login-tab"]').click()
      cy.get('[data-test="input-email"]').type(usuario.valido.email)
      cy.get('[data-test="input-senha"]').type(usuario.valido.senha)
      cy.get('[data-test="btn-submit-login"]').click()

      // Verificar se usuário está logado
      cy.get('[data-test="user-name"]').should('contain', usuario.valido.nome)
      cy.get('[data-test="btn-logout"]').should('be.visible')
    })
  })

  it('deve mostrar erro com credenciais inválidas', () => {
    cy.fixture('usuario').then((usuario) => {
      cy.get('[data-test="btn-login-tab"]').click()
      cy.get('[data-test="input-email"]').type(usuario.invalido.email)
      cy.get('[data-test="input-senha"]').type(usuario.invalido.senha)
      cy.get('[data-test="btn-submit-login"]').click()

      // Verificar mensagem de erro
      cy.get('[data-test="login-error"]').should('be.visible')
      cy.get('[data-test="login-error"]').should('contain', 'Credenciais inválidas')
    })
  })

  it('deve validar campos obrigatórios', () => {
    cy.get('[data-test="btn-login-tab"]').click()
    cy.get('[data-test="btn-submit-login"]').click()

    // Verificar mensagens de validação
    cy.get('[data-test="email-error"]').should('contain', 'Email é obrigatório')
    cy.get('[data-test="senha-error"]').should('contain', 'Senha é obrigatória')
  })

  it('deve fazer logout com sucesso', () => {
    cy.login()
    
    // Verificar que está logado
    cy.get('[data-test="user-name"]').should('be.visible')
    
    // Fazer logout
    cy.logout()
    
    // Verificar que não está mais logado
    cy.get('[data-test="btn-login-tab"]').should('be.visible')
    cy.get('[data-test="user-name"]').should('not.exist')
  })

  it('deve manter sessão após reload', () => {
    cy.login()
    
    // Verificar que está logado
    cy.get('[data-test="user-name"]').should('be.visible')
    
    // Recarregar página
    cy.reload()
    
    // Verificar que ainda está logado
    cy.get('[data-test="user-name"]').should('be.visible')
    cy.get('[data-test="btn-logout"]').should('be.visible')
  })
})
```

## Passo 6: Teste E2E - Fluxo de Produtos

Crie o arquivo `cypress/e2e/produtos.cy.js`:

```javascript
describe('Fluxo de Produtos', () => {
  beforeEach(() => {
    cy.limparDados()
    cy.login()
  })

  it('deve listar produtos', () => {
    cy.get('[data-test="btn-produtos-tab"]').click()
    
    // Verificar que produtos são exibidos
    cy.get('[data-test^="produto-"]').should('have.length.at.least', 1)
  })

  it('deve exibir detalhes do produto', () => {
    cy.get('[data-test="btn-produtos-tab"]').click()
    
    cy.get('[data-test="produto-1"]').within(() => {
      cy.get('[data-test="produto-nome"]').should('be.visible')
      cy.get('[data-test="produto-preco"]').should('be.visible')
      cy.get('[data-test="produto-estoque"]').should('be.visible')
      cy.get('[data-test="produto-categoria"]').should('be.visible')
    })
  })

  it('deve criar novo produto', () => {
    cy.get('[data-test="btn-produtos-tab"]').click()
    cy.get('[data-test="btn-novo-produto"]').click()
    
    // Preencher formulário
    cy.get('[data-test="input-nome"]').type('Produto Teste')
    cy.get('[data-test="input-preco"]').type('99.90')
    cy.get('[data-test="input-estoque"]').type('5')
    cy.get('[data-test="select-categoria"]').select('Eletrônicos')
    
    // Submeter formulário
    cy.get('[data-test="btn-submit-produto"]').click()
    
    // Verificar mensagem de sucesso
    cy.get('[data-test="success-message"]').should('contain', 'Produto criado com sucesso')
    
    // Verificar que produto aparece na lista
    cy.get('[data-test="produto-nome"]').contains('Produto Teste').should('be.visible')
  })

  it('deve validar campos do formulário de produto', () => {
    cy.get('[data-test="btn-produtos-tab"]').click()
    cy.get('[data-test="btn-novo-produto"]').click()
    
    // Tentar submeter sem preencher
    cy.get('[data-test="btn-submit-produto"]').click()
    
    // Verificar mensagens de erro
    cy.get('[data-test="nome-error"]').should('contain', 'Nome é obrigatório')
    cy.get('[data-test="preco-error"]').should('contain', 'Preço é obrigatório')
    cy.get('[data-test="estoque-error"]').should('contain', 'Estoque é obrigatório')
  })

  it('deve validar preço mínimo', () => {
    cy.get('[data-test="btn-produtos-tab"]').click()
    cy.get('[data-test="btn-novo-produto"]').click()
    
    cy.get('[data-test="input-nome"]').type('Produto Teste')
    cy.get('[data-test="input-preco"]').type('0')
    cy.get('[data-test="input-estoque"]').type('5')
    cy.get('[data-test="select-categoria"]').select('Eletrônicos')
    
    cy.get('[data-test="btn-submit-produto"]').click()
    
    cy.get('[data-test="preco-error"]').should('contain', 'Preço deve ser maior que 0')
  })

  it('deve filtrar produtos por categoria', () => {
    cy.get('[data-test="btn-produtos-tab"]').click()
    
    // Aplicar filtro
    cy.get('[data-test="select-filtro-categoria"]').select('Eletrônicos')
    
    // Verificar que apenas produtos da categoria aparecem
    cy.get('[data-test^="produto-"]').each(($produto) => {
      cy.wrap($produto).find('[data-test="produto-categoria"]').should('contain', 'Eletrônicos')
    })
  })

  it('deve interceptar requisição de produtos', () => {
    // Interceptar chamada à API
    cy.intercept('GET', '/api/produtos', {
      statusCode: 200,
      body: {
        produtos: [
          { id: 1, nome: 'Produto Mock', preco: 100, estoque: 5, categoria: 'Teste' }
        ]
      }
    }).as('getProdutos')
    
    cy.get('[data-test="btn-produtos-tab"]').click()
    
    // Aguardar requisição
    cy.wait('@getProdutos')
    
    // Verificar que produto mockado aparece
    cy.get('[data-test="produto-nome"]').should('contain', 'Produto Mock')
  })
})
```

## Passo 7: Teste E2E - Fluxo de Carrinho

Crie o arquivo `cypress/e2e/carrinho.cy.js`:

```javascript
describe('Fluxo de Carrinho de Compras', () => {
  beforeEach(() => {
    cy.limparDados()
    cy.login()
  })

  it('deve iniciar com carrinho vazio', () => {
    cy.get('[data-test="btn-carrinho-tab"]').click()
    cy.get('[data-test="carrinho-vazio"]').should('be.visible')
    cy.get('[data-test="carrinho-total"]').should('contain', 'R$ 0,00')
  })

  it('deve adicionar produto ao carrinho', () => {
    cy.get('[data-test="btn-produtos-tab"]').click()
    
    // Adicionar produto
    cy.get('[data-test="produto-1"]').within(() => {
      cy.get('[data-test="btn-adicionar-carrinho"]').click()
    })
    
    // Ir para carrinho
    cy.get('[data-test="btn-carrinho-tab"]').click()
    
    // Verificar que produto está no carrinho
    cy.get('[data-test^="item-carrinho-"]').should('have.length', 1)
    cy.get('[data-test="carrinho-total"]').should('not.contain', 'R$ 0,00')
  })

  it('deve incrementar quantidade de produto no carrinho', () => {
    cy.adicionarProdutoAoCarrinho(1)
    cy.get('[data-test="btn-carrinho-tab"]').click()
    
    // Pegar quantidade inicial
    cy.get('[data-test="item-carrinho-1"]').within(() => {
      cy.get('[data-test="item-quantidade"]').invoke('text').then((qtdInicial) => {
        // Incrementar
        cy.get('[data-test="btn-incrementar"]').click()
        
        // Verificar que quantidade aumentou
        cy.get('[data-test="item-quantidade"]').should('contain', parseInt(qtdInicial) + 1)
      })
    })
  })

  it('deve decrementar quantidade de produto no carrinho', () => {
    cy.adicionarProdutoAoCarrinho(1)
    cy.get('[data-test="btn-carrinho-tab"]').click()
    
    // Incrementar para ter quantidade > 1
    cy.get('[data-test="item-carrinho-1"]').within(() => {
      cy.get('[data-test="btn-incrementar"]').click()
      
      cy.get('[data-test="item-quantidade"]').invoke('text').then((qtdInicial) => {
        // Decrementar
        cy.get('[data-test="btn-decrementar"]').click()
        
        // Verificar que quantidade diminuiu
        cy.get('[data-test="item-quantidade"]').should('contain', parseInt(qtdInicial) - 1)
      })
    })
  })

  it('deve remover produto do carrinho ao decrementar para zero', () => {
    cy.adicionarProdutoAoCarrinho(1)
    cy.get('[data-test="btn-carrinho-tab"]').click()
    
    // Decrementar até zero
    cy.get('[data-test="item-carrinho-1"]').within(() => {
      cy.get('[data-test="btn-decrementar"]').click()
    })
    
    // Verificar que carrinho está vazio
    cy.get('[data-test="carrinho-vazio"]').should('be.visible')
  })

  it('deve calcular total corretamente', () => {
    cy.fixture('produtos').then((data) => {
      const produto1 = data.produtos[0]
      const produto2 = data.produtos[1]
      
      // Adicionar produtos
      cy.adicionarProdutoAoCarrinho(produto1.id)
      cy.adicionarProdutoAoCarrinho(produto2.id)
      
      cy.get('[data-test="btn-carrinho-tab"]').click()
      
      // Calcular total esperado
      const totalEsperado = produto1.preco + produto2.preco
      const totalFormatado = `R$ ${totalEsperado.toFixed(2).replace('.', ',')}`
      
      // Verificar total
      cy.get('[data-test="carrinho-total"]').should('contain', totalFormatado)
    })
  })

  it('deve limpar carrinho completamente', () => {
    cy.adicionarProdutoAoCarrinho(1)
    cy.adicionarProdutoAoCarrinho(2)
    cy.get('[data-test="btn-carrinho-tab"]').click()
    
    // Verificar que tem produtos
    cy.get('[data-test^="item-carrinho-"]').should('have.length', 2)
    
    // Limpar carrinho
    cy.get('[data-test="btn-limpar-carrinho"]').click()
    
    // Confirmar no modal
    cy.get('[data-test="btn-confirmar-limpar"]').click()
    
    // Verificar que carrinho está vazio
    cy.get('[data-test="carrinho-vazio"]').should('be.visible')
    cy.get('[data-test="carrinho-total"]').should('contain', 'R$ 0,00')
  })

  it('deve finalizar compra', () => {
    cy.adicionarProdutoAoCarrinho(1)
    cy.get('[data-test="btn-carrinho-tab"]').click()
    
    // Finalizar compra
    cy.get('[data-test="btn-finalizar-compra"]').click()
    
    // Verificar mensagem de sucesso
    cy.get('[data-test="success-message"]').should('contain', 'Compra finalizada com sucesso')
    
    // Verificar que carrinho foi limpo
    cy.get('[data-test="carrinho-vazio"]').should('be.visible')
  })

  it('deve persistir carrinho após reload', () => {
    cy.adicionarProdutoAoCarrinho(1)
    cy.get('[data-test="btn-carrinho-tab"]').click()
    
    // Verificar quantidade de itens
    cy.get('[data-test^="item-carrinho-"]').should('have.length', 1)
    
    // Recarregar página
    cy.reload()
    
    cy.get('[data-test="btn-carrinho-tab"]').click()
    
    // Verificar que carrinho foi mantido
    cy.get('[data-test^="item-carrinho-"]').should('have.length', 1)
  })
})
```

## Passo 8: Teste E2E - Fluxo Completo

Crie o arquivo `cypress/e2e/fluxo-completo.cy.js`:

```javascript
describe('Fluxo Completo de Usuário', () => {
  beforeEach(() => {
    cy.limparDados()
  })

  it('deve completar jornada completa: login -> produtos -> carrinho -> compra', () => {
    // 1. Login
    cy.login()
    cy.get('[data-test="user-name"]').should('be.visible')
    
    // 2. Navegar para produtos
    cy.get('[data-test="btn-produtos-tab"]').click()
    cy.get('[data-test^="produto-"]').should('have.length.at.least', 1)
    
    // 3. Adicionar produtos ao carrinho
    cy.get('[data-test="produto-1"]').within(() => {
      cy.get('[data-test="btn-adicionar-carrinho"]').click()
    })
    cy.get('[data-test="produto-2"]').within(() => {
      cy.get('[data-test="btn-adicionar-carrinho"]').click()
    })
    
    // 4. Verificar carrinho
    cy.get('[data-test="btn-carrinho-tab"]').click()
    cy.get('[data-test^="item-carrinho-"]').should('have.length', 2)
    
    // 5. Ajustar quantidades
    cy.get('[data-test="item-carrinho-1"]').within(() => {
      cy.get('[data-test="btn-incrementar"]').click()
    })
    
    // 6. Verificar total atualizado
    cy.get('[data-test="carrinho-total"]').should('not.contain', 'R$ 0,00')
    
    // 7. Finalizar compra
    cy.get('[data-test="btn-finalizar-compra"]').click()
    cy.get('[data-test="success-message"]').should('be.visible')
    
    // 8. Verificar carrinho vazio
    cy.get('[data-test="carrinho-vazio"]').should('be.visible')
    
    // 9. Logout
    cy.logout()
    cy.get('[data-test="btn-login-tab"]').should('be.visible')
  })

  it('deve navegar entre todas as páginas', () => {
    cy.login()
    
    // Navegar por todas as páginas
    cy.get('[data-test="btn-produtos-tab"]').click()
    cy.url().should('include', '/produtos')
    
    cy.get('[data-test="btn-carrinho-tab"]').click()
    cy.url().should('include', '/carrinho')
    
    cy.get('[data-test="btn-perfil-tab"]').click()
    cy.url().should('include', '/perfil')
    
    cy.get('[data-test="btn-home-tab"]').click()
    cy.url().should('eq', 'http://localhost:5173/')
  })

  it('deve tratar erros de rede graciosamente', () => {
    // Simular erro de rede
    cy.intercept('GET', '/api/produtos', {
      statusCode: 500,
      body: {
        erro: 'Erro no servidor'
      }
    }).as('getProdutosErro')
    
    cy.login()
    cy.get('[data-test="btn-produtos-tab"]').click()
    
    cy.wait('@getProdutosErro')
    
    // Verificar mensagem de erro
    cy.get('[data-test="error-message"]').should('contain', 'Erro ao carregar produtos')
  })

  it('deve capturar screenshot em caso de falha', () => {
    cy.login()
    
    // Ação que deve falhar (exemplo)
    cy.get('[data-test="elemento-inexistente"]', { timeout: 1000 }).should('exist')
  })
})
```

## Passo 9: Adicionar Atributos data-test nos Componentes

Para que os testes funcionem corretamente, adicione atributos `data-test` nos seus componentes Vue. Exemplo no `UserProfile.vue`:

```vue
<template>
  <div class="user-profile">
    <div v-if="!userStore.isLoggedIn">
      <h2>Login</h2>
      <form @submit.prevent="handleLogin">
        <div>
          <label>Email:</label>
          <input 
            v-model="form.email" 
            type="email"
            data-test="input-email"
          />
          <span v-if="erros.email" data-test="email-error">
            {{ erros.email }}
          </span>
        </div>
        <div>
          <label>Senha:</label>
          <input 
            v-model="form.senha" 
            type="password"
            data-test="input-senha"
          />
          <span v-if="erros.senha" data-test="senha-error">
            {{ erros.senha }}
          </span>
        </div>
        <button type="submit" data-test="btn-submit-login">
          Entrar
        </button>
        <div v-if="loginError" data-test="login-error">
          {{ loginError }}
        </div>
      </form>
    </div>
    
    <div v-else>
      <h2>Perfil</h2>
      <p data-test="user-name">{{ userStore.nome }}</p>
      <button @click="userStore.logout()" data-test="btn-logout">
        Sair
      </button>
    </div>
  </div>
</template>
```

## Passo 10: Executar os Testes

Para executar os testes em modo interativo:

```bash
npm run cypress
```

Isso abrirá a interface do Cypress onde você pode:
- Escolher qual navegador usar
- Selecionar quais testes executar
- Ver os testes em execução em tempo real
- Inspecionar cada etapa do teste

Para executar todos os testes em modo headless (sem interface gráfica):

```bash
npm run cypress:headless
```

Para executar um teste específico:

```bash
npx cypress run --spec "cypress/e2e/login.cy.js"
```

Para executar com navegador específico:

```bash
npx cypress run --browser chrome
```

## Passo 11: Analisar Resultados

Após executar os testes, você terá:

**Vídeos:**
Os vídeos de cada teste ficam em `cypress/videos/`

**Screenshots:**
Screenshots de testes que falharam ficam em `cypress/screenshots/`

**Relatório no Terminal:**
```
  Fluxo de Login
    ✓ deve exibir formulário de login (234ms)
    ✓ deve fazer login com sucesso (567ms)
    ✓ deve mostrar erro com credenciais inválidas (345ms)
    ✓ deve validar campos obrigatórios (123ms)
    ✓ deve fazer logout com sucesso (456ms)
    ✓ deve manter sessão após reload (234ms)

  Fluxo de Produtos
    ✓ deve listar produtos (345ms)
    ✓ deve exibir detalhes do produto (234ms)
    ✓ deve criar novo produto (678ms)
    ✓ deve validar campos do formulário (234ms)
    ✓ deve validar preço mínimo (123ms)
    ✓ deve filtrar produtos por categoria (456ms)
    ✓ deve interceptar requisição de produtos (234ms)

  Fluxo de Carrinho
    ✓ deve iniciar com carrinho vazio (123ms)
    ✓ deve adicionar produto ao carrinho (456ms)
    ✓ deve incrementar quantidade (234ms)
    ✓ deve decrementar quantidade (234ms)
    ✓ deve remover produto ao decrementar para zero (345ms)
    ✓ deve calcular total corretamente (456ms)
    ✓ deve limpar carrinho completamente (567ms)
    ✓ deve finalizar compra (456ms)
    ✓ deve persistir carrinho após reload (234ms)

  Fluxo Completo
    ✓ deve completar jornada completa (1234ms)
    ✓ deve navegar entre todas as páginas (456ms)
    ✓ deve tratar erros de rede (234ms)
    ✓ deve capturar screenshot em falha (123ms)

  26 passing (8s)
```
