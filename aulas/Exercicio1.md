# Exercício 1 — Sua Primeira Requisição com Axios (COMPLETO)

## Objetivo

Neste exercício você vai **aprender na prática** como fazer sua primeira requisição HTTP usando Axios. Vamos criar um componente simples que busca dados de uma API pública e exibe na tela.

**Este é um guia completo e detalhado!** Siga cada passo e você terá um componente funcionando ao final.

---

## 📋 O que vamos fazer?

Criar um componente chamado `BuscadorUsuario.vue` que:
- ✅ Busca informações de usuários de uma API pública
- ✅ Exibe os dados em um card bonito
- ✅ Mostra loading enquanto carrega
- ✅ Trata erros se algo der errado
- ✅ Tem um botão para buscar um novo usuário aleatório

---

## 🌐 API que vamos usar

**API Pública:** `https://randomuser.me/api/`

Esta API retorna dados de usuários fictícios. É perfeita para aprender!

**Exemplo de resposta:**
```json
{
  "results": [
    {
      "name": {
        "first": "João",
        "last": "Silva"
      },
      "email": "joao.silva@example.com",
      "phone": "(11) 98765-4321",
      "picture": {
        "large": "https://..."
      },
      "location": {
        "city": "São Paulo",
        "country": "Brazil"
      }
    }
  ]
}
```

---

## 🚀 Passo 1: Instalar o Axios

Primeiro, precisamos instalar o Axios no projeto.

Abra o terminal e execute:

```bash
npm install axios
```

Aguarde a instalação terminar. Você verá algo como:
```
added 1 package, and audited X packages in Xs
```

✅ **Pronto!** O Axios está instalado e pronto para usar.

---

## 📁 Passo 2: Criar o arquivo do componente

Crie um novo arquivo chamado `BuscadorUsuario.vue` dentro da pasta `src/components/`.

**Caminho completo:** `src/components/BuscadorUsuario.vue`

---

## 📝 Passo 3: Estrutura Básica do Template

Vamos começar pelo template (a parte visual do componente).

Cole este código no arquivo `BuscadorUsuario.vue`:

```vue
<template>
  <div class="buscador-usuario">
    <div class="card">
      <!-- Cabeçalho -->
      <div class="card-header">
        <h2>🔍 Buscador de Usuários</h2>
        <p class="subtitle">Buscando usuários aleatórios da API</p>
      </div>

      <div class="card-body">
        <!-- Botão para buscar -->
        <button 
          @click="buscarUsuario" 
          class="btn btn-primary"
          :disabled="carregando"
        >
          {{ carregando ? '⏳ Buscando...' : '🎲 Buscar Usuário Aleatório' }}
        </button>

        <!-- Estado: Carregando -->
        <div v-if="carregando" class="loading">
          <div class="spinner"></div>
          <p>Carregando dados do usuário...</p>
        </div>

        <!-- Estado: Erro -->
        <div v-else-if="erro" class="alert alert-danger">
          <h4>❌ Ops! Algo deu errado</h4>
          <p>{{ erro }}</p>
          <button @click="buscarUsuario" class="btn btn-secondary">
            🔄 Tentar Novamente
          </button>
        </div>

        <!-- Estado: Sucesso - Exibir Usuário -->
        <div v-else-if="usuario" class="usuario-card">
          <img :src="usuario.foto" :alt="usuario.nome" class="usuario-foto">
          
          <div class="usuario-info">
            <h3>{{ usuario.nome }}</h3>
            
            <div class="info-item">
              <span class="icon">📧</span>
              <span>{{ usuario.email }}</span>
            </div>
            
            <div class="info-item">
              <span class="icon">📱</span>
              <span>{{ usuario.telefone }}</span>
            </div>
            
            <div class="info-item">
              <span class="icon">📍</span>
              <span>{{ usuario.cidade }}, {{ usuario.pais }}</span>
            </div>
          </div>
        </div>

        <!-- Estado: Inicial (sem dados ainda) -->
        <div v-else class="inicial">
          <p>👆 Clique no botão acima para buscar um usuário!</p>
        </div>
      </div>
    </div>
  </div>
</template>
```

**Explicação do template:**
- `@click="buscarUsuario"`: Quando clicar no botão, chama a função `buscarUsuario()`
- `:disabled="carregando"`: Desabilita o botão enquanto está carregando
- `v-if="carregando"`: Mostra loading quando `carregando` for `true`
- `v-else-if="erro"`: Mostra erro se existir
- `v-else-if="usuario"`: Mostra os dados quando tiver usuário
- `v-else`: Mostra mensagem inicial

---

## 🔧 Passo 4: Script do Componente

Agora vamos adicionar a lógica JavaScript. Cole este código logo após o `</template>`:

```vue
<script>
import axios from 'axios'

export default {
  name: 'BuscadorUsuario',
  
  data() {
    return {
      // Estado de loading
      carregando: false,
      
      // Mensagem de erro (se houver)
      erro: null,
      
      // Dados do usuário
      usuario: null
    }
  },

  // Busca um usuário quando o componente é montado
  mounted() {
    this.buscarUsuario()
  },

  methods: {
    async buscarUsuario() {
      // 1. Inicia o estado de carregamento
      this.carregando = true
      this.erro = null
      this.usuario = null

      try {
        // 2. Faz a requisição para a API
        const response = await axios.get('https://randomuser.me/api/')
        
        // 3. Extrai os dados do primeiro usuário
        const dadosApi = response.data.results[0]
        
        // 4. Organiza os dados em um formato mais simples
        this.usuario = {
          nome: `${dadosApi.name.first} ${dadosApi.name.last}`,
          email: dadosApi.email,
          telefone: dadosApi.phone,
          cidade: dadosApi.location.city,
          pais: dadosApi.location.country,
          foto: dadosApi.picture.large
        }

        console.log('✅ Usuário carregado:', this.usuario)

      } catch (error) {
        // 5. Captura e trata erros
        console.error('❌ Erro ao buscar usuário:', error)
        
        if (error.response) {
          // Erro retornado pela API
          this.erro = `Erro ${error.response.status}: ${error.response.statusText}`
        } else if (error.request) {
          // Requisição foi feita mas não houve resposta
          this.erro = 'Não foi possível conectar à API. Verifique sua internet.'
        } else {
          // Outro tipo de erro
          this.erro = `Erro: ${error.message}`
        }

      } finally {
        // 6. Finaliza o estado de carregamento (sempre executa)
        this.carregando = false
      }
    }
  }
}
</script>
```

**Explicação do script:**

### Data (Dados Reativos)
```javascript
data() {
  return {
    carregando: false,  // Controla se está fazendo requisição
    erro: null,         // Armazena mensagem de erro
    usuario: null       // Armazena dados do usuário
  }
}
```

### Mounted (Hook de Ciclo de Vida)
```javascript
mounted() {
  this.buscarUsuario()  // Busca um usuário assim que o componente aparecer
}
```

### Método buscarUsuario()

**Passo a passo do que acontece:**

1. **Prepara o estado:**
   - `carregando = true` → Mostra loading
   - `erro = null` → Limpa erro anterior
   - `usuario = null` → Limpa usuário anterior

2. **Faz a requisição:**
   - `await axios.get(...)` → Busca dados da API
   - `await` espera a resposta chegar

3. **Processa a resposta:**
   - `response.data.results[0]` → Pega o primeiro usuário
   - Organiza os dados em um objeto mais simples

4. **Trata erros:**
   - `try/catch` captura qualquer erro
   - Diferentes tipos de erro recebem mensagens diferentes

5. **Finaliza:**
   - `finally` sempre executa
   - `carregando = false` → Esconde loading

---

## 🎨 Passo 5: Estilos

Agora vamos deixar bonito! Cole este CSS após o `</script>`:

```vue
<style scoped>
.buscador-usuario {
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
}

.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  text-align: center;
}

.card-header h2 {
  margin: 0;
  font-size: 1.8rem;
}

.subtitle {
  margin: 0.5rem 0 0 0;
  opacity: 0.9;
  font-size: 0.9rem;
}

.card-body {
  padding: 2rem;
}

/* Botão */
.btn {
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 1.5rem;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #6c757d;
  color: white;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  width: auto;
}

.btn-secondary:hover {
  background: #5a6268;
}

/* Loading */
.loading {
  text-align: center;
  padding: 2rem;
}

.spinner {
  width: 50px;
  height: 50px;
  margin: 0 auto 1rem;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Estado de Erro */
.alert {
  padding: 1.5rem;
  border-radius: 8px;
  margin-top: 1rem;
}

.alert-danger {
  background: #f8d7da;
  border: 1px solid #f5c2c7;
  color: #842029;
}

.alert h4 {
  margin: 0 0 0.5rem 0;
}

.alert p {
  margin: 0 0 1rem 0;
}

/* Card do Usuário */
.usuario-card {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
}

.usuario-foto {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 5px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin-bottom: 1.5rem;
}

.usuario-info h3 {
  margin: 0 0 1.5rem 0;
  color: #333;
  font-size: 1.8rem;
}

.info-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: white;
  border-radius: 8px;
  margin-bottom: 0.75rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.icon {
  font-size: 1.2rem;
}

.info-item span:last-child {
  color: #555;
  font-size: 1rem;
}

/* Estado Inicial */
.inicial {
  text-align: center;
  padding: 3rem 1rem;
  color: #666;
  font-size: 1.1rem;
}
</style>
```

---

## 🎯 Passo 6: Usar o Componente

Agora precisamos adicionar o componente no `App.vue` para vê-lo funcionando.

Abra o arquivo `src/App.vue` e substitua todo o conteúdo por:

```vue
<template>
  <div id="app">
    <BuscadorUsuario />
  </div>
</template>

<script>
import BuscadorUsuario from './components/BuscadorUsuario.vue'

export default {
  name: 'App',
  components: {
    BuscadorUsuario
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 2rem 0;
}

#app {
  width: 100%;
}
</style>
```

---

## ▶️ Passo 7: Executar o Projeto

Agora vamos ver tudo funcionando!

No terminal, execute:

```bash
npm run dev
```

Abra o navegador em `http://localhost:5173` (ou a URL que aparecer no terminal).

---

## ✅ O que você deve ver

1. **Ao carregar a página:**
   - Um card roxo bonito com título
   - Um spinner de loading aparecendo brevemente
   - Os dados de um usuário aleatório sendo exibidos

2. **Ao clicar em "Buscar Usuário Aleatório":**
   - O botão fica desabilitado
   - Aparece um loading
   - Um novo usuário é carregado e exibido

3. **Cada usuário mostra:**
   - Foto
   - Nome completo
   - Email
   - Telefone
   - Cidade e país

---

## 🧪 Testes para Fazer

### Teste 1: Funcionamento Normal
1. Abra a página
2. Clique no botão várias vezes
3. Cada vez deve mostrar um usuário diferente

### Teste 2: Ver o Loading
1. Abra o DevTools (F12)
2. Vá em Network > Throttling
3. Selecione "Slow 3G"
4. Clique no botão
5. Você verá o spinner por mais tempo

### Teste 3: Console do Navegador
1. Abra o DevTools (F12)
2. Vá na aba Console
3. Clique no botão
4. Você verá: `✅ Usuário carregado: {...}`

### Teste 4: Ver a Requisição
1. Abra o DevTools (F12)
2. Vá na aba Network
3. Clique no botão
4. Você verá a requisição para `randomuser.me`
5. Clique nela e veja a resposta JSON

### Teste 5: Simular Erro
1. No código, troque a URL para: `'https://api-invalida.com'`
2. Salve o arquivo
3. Recarregue a página
4. Você verá a mensagem de erro
5. Clique em "Tentar Novamente"

---

## 🎓 O que você aprendeu

### ✅ Conceitos de Vue.js
- Como criar um componente completo
- Usar `data()` para dados reativos
- Hook `mounted()` para executar código ao iniciar
- Métodos com `async/await`
- Renderização condicional com `v-if`, `v-else-if`, `v-else`
- Binding de atributos com `:`
- Event handling com `@click`

### ✅ Conceitos de Axios
- Instalar e importar Axios
- Fazer requisição GET com `axios.get()`
- Usar `await` para esperar resposta
- Acessar dados da resposta com `response.data`
- Tratar erros com `try/catch`

### ✅ Boas Práticas
- Sempre ter 3 estados: loading, erro e sucesso
- Tratar diferentes tipos de erros
- Usar `finally` para código que sempre deve executar
- Desabilitar botões durante loading
- Mensagens de erro amigáveis para o usuário
- Console.log para debug

### ✅ Estados Assíncronos
```javascript
// 1. Antes da requisição
carregando = true
erro = null

// 2. Durante a requisição
await axios.get(...)

// 3a. Se der certo
usuario = dados

// 3b. Se der erro
erro = mensagem

// 4. Sempre no final
carregando = false
```

---

## 🚀 Desafios Extras

Agora que você entendeu o básico, tente implementar:

### Desafio 1: Escolher Gênero
Adicione dois botões: "Homem" e "Mulher"
- API aceita `?gender=male` ou `?gender=female`

### Desafio 2: Buscar Vários Usuários
- Mude para buscar 5 usuários: `?results=5`
- Exiba todos em uma lista

### Desafio 3: Favoritos
- Adicione um botão "❤️ Favoritar"
- Armazene usuários favoritos em um array
- Mostre a lista de favoritos

### Desafio 4: Escolher Nacionalidade
- Adicione um select com países
- API aceita `?nat=BR` (BR, US, FR, etc)

### Desafio 5: Animações
- Instale: `npm install animate.css`
- Adicione animações ao card do usuário

---

## 📚 Código Completo

Se tiver dúvidas, aqui está o código completo do componente:

<details>
<summary>👉 Clique para ver o código completo</summary>

```vue
<template>
  <div class="buscador-usuario">
    <div class="card">
      <div class="card-header">
        <h2>🔍 Buscador de Usuários</h2>
        <p class="subtitle">Buscando usuários aleatórios da API</p>
      </div>

      <div class="card-body">
        <button 
          @click="buscarUsuario" 
          class="btn btn-primary"
          :disabled="carregando"
        >
          {{ carregando ? '⏳ Buscando...' : '🎲 Buscar Usuário Aleatório' }}
        </button>

        <div v-if="carregando" class="loading">
          <div class="spinner"></div>
          <p>Carregando dados do usuário...</p>
        </div>

        <div v-else-if="erro" class="alert alert-danger">
          <h4>❌ Ops! Algo deu errado</h4>
          <p>{{ erro }}</p>
          <button @click="buscarUsuario" class="btn btn-secondary">
            🔄 Tentar Novamente
          </button>
        </div>

        <div v-else-if="usuario" class="usuario-card">
          <img :src="usuario.foto" :alt="usuario.nome" class="usuario-foto">
          
          <div class="usuario-info">
            <h3>{{ usuario.nome }}</h3>
            
            <div class="info-item">
              <span class="icon">📧</span>
              <span>{{ usuario.email }}</span>
            </div>
            
            <div class="info-item">
              <span class="icon">📱</span>
              <span>{{ usuario.telefone }}</span>
            </div>
            
            <div class="info-item">
              <span class="icon">📍</span>
              <span>{{ usuario.cidade }}, {{ usuario.pais }}</span>
            </div>
          </div>
        </div>

        <div v-else class="inicial">
          <p>👆 Clique no botão acima para buscar um usuário!</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'BuscadorUsuario',
  
  data() {
    return {
      carregando: false,
      erro: null,
      usuario: null
    }
  },

  mounted() {
    this.buscarUsuario()
  },

  methods: {
    async buscarUsuario() {
      this.carregando = true
      this.erro = null
      this.usuario = null

      try {
        const response = await axios.get('https://randomuser.me/api/')
        const dadosApi = response.data.results[0]
        
        this.usuario = {
          nome: `${dadosApi.name.first} ${dadosApi.name.last}`,
          email: dadosApi.email,
          telefone: dadosApi.phone,
          cidade: dadosApi.location.city,
          pais: dadosApi.location.country,
          foto: dadosApi.picture.large
        }

        console.log('✅ Usuário carregado:', this.usuario)

      } catch (error) {
        console.error('❌ Erro ao buscar usuário:', error)
        
        if (error.response) {
          this.erro = `Erro ${error.response.status}: ${error.response.statusText}`
        } else if (error.request) {
          this.erro = 'Não foi possível conectar à API. Verifique sua internet.'
        } else {
          this.erro = `Erro: ${error.message}`
        }

      } finally {
        this.carregando = false
      }
    }
  }
}
</script>

<style scoped>
.buscador-usuario {
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
}

.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  text-align: center;
}

.card-header h2 {
  margin: 0;
  font-size: 1.8rem;
}

.subtitle {
  margin: 0.5rem 0 0 0;
  opacity: 0.9;
  font-size: 0.9rem;
}

.card-body {
  padding: 2rem;
}

.btn {
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 1.5rem;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #6c757d;
  color: white;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  width: auto;
}

.btn-secondary:hover {
  background: #5a6268;
}

.loading {
  text-align: center;
  padding: 2rem;
}

.spinner {
  width: 50px;
  height: 50px;
  margin: 0 auto 1rem;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.alert {
  padding: 1.5rem;
  border-radius: 8px;
  margin-top: 1rem;
}

.alert-danger {
  background: #f8d7da;
  border: 1px solid #f5c2c7;
  color: #842029;
}

.alert h4 {
  margin: 0 0 0.5rem 0;
}

.alert p {
  margin: 0 0 1rem 0;
}

.usuario-card {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
}

.usuario-foto {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 5px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin-bottom: 1.5rem;
}

.usuario-info h3 {
  margin: 0 0 1.5rem 0;
  color: #333;
  font-size: 1.8rem;
}

.info-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: white;
  border-radius: 8px;
  margin-bottom: 0.75rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.icon {
  font-size: 1.2rem;
}

.info-item span:last-child {
  color: #555;
  font-size: 1rem;
}

.inicial {
  text-align: center;
  padding: 3rem 1rem;
  color: #666;
  font-size: 1.1rem;
}
</style>
```

</details>

---

## 🆘 Problemas Comuns

### Erro: "Cannot find module 'axios'"
**Solução:** Execute `npm install axios`

### Erro: "localhost refused to connect"
**Solução:** Execute `npm run dev` para iniciar o servidor

### Componente não aparece
**Solução:** Verifique se importou corretamente no `App.vue`

### Dados não aparecem
**Solução:** Abra o Console (F12) e veja se tem erros

### CORS Error
**Não é problema!** A API Random User já tem CORS habilitado.

---

## 📖 Próximos Passos

Agora que você domina o básico de requisições com Axios:

1. **Exercício 2:** Buscar lista de posts e implementar filtros
   - Arquivo: `Exercicio2.md`

2. **Exercício 3:** Criar CRUD completo
   - Arquivo: `Exercicio3.md`

---

## 🎉 Parabéns!

Você acabou de criar sua primeira aplicação Vue.js que se comunica com uma API!

Você aprendeu:
- ✅ Como instalar e usar Axios
- ✅ Fazer requisições GET
- ✅ Trabalhar com dados assíncronos
- ✅ Gerenciar estados de loading e erro
- ✅ Exibir dados dinamicamente
- ✅ Boas práticas de UX

Continue praticando e explore os exercícios 2 e 3! 🚀

---

## 📚 Recursos Úteis

- [Documentação do Axios](https://axios-http.com/)
- [Random User API](https://randomuser.me/)
- [Vue.js - Lifecycle Hooks](https://vuejs.org/guide/essentials/lifecycle.html)
- [MDN - Async/Await](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Statements/async_function)

💡 **Dica:** Quando tiver dúvidas, leia novamente este exercício. Ele tem tudo explicado passo a passo!
