# Aula 3 — Comunicação com API (Axios)## Aula 3 — Comunicação com API (Axios)## Aula 3 — Comunicação com API (Integrando com Flask)



### Objetivos



- Integrar frontend Vue.js com backend Flask### Objetivos### Objetivos

- Configurar Axios e interceptadores

- Gerenciar estados de loading e erro- Integrar frontend Vue.js com backend Flask- Compreender requisições HTTP no frontend

- Implementar autenticação JWT

- Configurar Axios e interceptadores- Configurar Axios para comunicação com APIs

---

- Gerenciar estados de loading e erro- Implementar interceptadores para tratamento global

### Pré-requisitos

- Implementar autenticação JWT- Conectar com os endpoints do Flask backend

⚠️ **Antes de começar, configure o backend Flask!**

- Gerenciar estados de loading, sucesso e erro

**Leia e siga:** `SETUP_BACKEND_AULA3.md` (raiz do projeto)

---- Trabalhar com dados assíncronos de forma reativa

Passos essenciais:



1. Instalar Flask-CORS

2. Configurar CORS no backend### Pré-requisitos---

3. Criar endpoint público `/api/teste`

4. Verificar JWT configurado em `/api/dados`



**Sem isso, as requisições serão bloqueadas!**⚠️ **Antes de começar, configure o backend Flask!**### Introdução às APIs REST



---



### Instalando Axios**Leia e siga:** `SETUP_BACKEND_AULA3.md` (raiz do projeto)#### Conceitos Fundamentais



```bash

npm install axios

```Passos essenciais:**REST (Representational State Transfer)** é um estilo arquitetural para APIs web:



O Axios já está em `package.json`, mas certifique-se de ter instalado as dependências:1. Instalar Flask-CORS



```bash2. Configurar CORS no backend| Método HTTP | Propósito | Exemplo |

npm install

```3. Criar endpoint público `/api/teste`|-------------|-----------|---------|



---4. Verificar JWT configurado em `/api/dados`| **GET** | Buscar dados | `GET /api/produtos` |



### Configuração do Axios| **POST** | Criar recurso | `POST /api/produtos` |



#### 1. Criar Instância Configurada**Sem isso, as requisições serão bloqueadas!**| **PUT** | Atualizar completo | `PUT /api/produtos/1` |



**Veja implementação completa em:** `src/services/api.js`| **PATCH** | Atualização parcial | `PATCH /api/produtos/1` |



**Conceitos principais:**---| **DELETE** | Remover recurso | `DELETE /api/produtos/1` |



```javascript

// Instância base

const api = axios.create({### Instalando Axios#### Status HTTP Importantes

  baseURL: 'http://localhost:5000',

  timeout: 5000- **200**: Sucesso

})

```bash- **201**: Criado com sucesso  

// Interceptor de Requisição (adiciona token)

api.interceptors.request.use(config => {npm install axios- **400**: Erro de validação

  const token = localStorage.getItem('token')

  if (token) {```- **401**: Não autorizado

    config.headers.Authorization = `Bearer ${token}`

  }- **404**: Não encontrado

  return config

})O Axios já está em `package.json`, mas certifique-se de ter instalado as dependências:- **500**: Erro interno do servidor



// Interceptor de Resposta (trata erros)

api.interceptors.response.use(

  response => response,```bash---

  error => {

    if (error.response?.status === 401) {npm install

      localStorage.removeItem('token')

      // Redirecionar para login```### Configuração do Backend Flask (CORS)

    }

    return Promise.reject(error)

  }

)---Antes de começar, precisamos habilitar CORS no Flask para permitir requisições do frontend.

```



**O que são Interceptors?**

### Configuração do Axios**Instalar Flask-CORS:**

- **Request Interceptor**: Executa antes de cada requisição (adiciona token, logs)

- **Response Interceptor**: Executa após cada resposta (trata erros globalmente)```bash



---#### 1. Criar Instância Configuradacd backend_flask



#### 2. Criar Service (Camada de Serviço)pip install flask-cors



**Veja implementação completa em:** `src/services/DadosService.js`**`src/services/api.js`:**```



**Exemplo simplificado:**



```javascript```javascript**Atualizar `app/__init__.py`:**

import api from './api'

import axios from 'axios'```python

export default {

  async testarConexao() {from flask_cors import CORS

    try {

      const response = await api.get('/api/teste')// Instância base do Axios

      return { sucesso: true, dados: response.data }

    } catch (erro) {const api = axios.create({# Após criar a app

      return { sucesso: false, mensagem: erro.message }

    }  baseURL: 'http://localhost:5000',app = Flask(__name__, template_folder="templates", static_folder="static")

  },

  timeout: 5000,CORS(app)  # Habilitar CORS para todas as rotas

  async buscarDados() {

    const response = await api.get('/api/dados')  headers: {```

    return { sucesso: true, dados: response.data }

  }    'Content-Type': 'application/json'

}

```  }---



**Vantagens do Service:**})



- Centraliza lógica de API### Configuração do Axios

- Facilita manutenção

- Trata erros de forma consistente// Interceptor de Requisição (adiciona token)



---api.interceptors.request.use(#### Instalação e Configuração Base



### Usando no Componente  config => {



**Veja implementação completa em:** `src/components/TesteAPI.vue`    const token = localStorage.getItem('token')**Instalar Axios no frontend:**



**Padrão básico:**    if (token) {```bash



```vue      config.headers.Authorization = `Bearer ${token}`npm install axios

<template>

  <div>    }```

    <button @click="buscar" :disabled="carregando">

      {{ carregando ? 'Carregando...' : 'Buscar' }}    console.log('→ Requisição:', config.method.toUpperCase(), config.url)

    </button>

        return config```javascript

    <div v-if="dados">

      {{ dados }}  },// src/services/api.js

    </div>

      error => {import axios from 'axios'

    <div v-if="erro" class="erro">

      {{ erro }}    console.error('✗ Erro na requisição:', error)

    </div>

  </div>    return Promise.reject(error)const API_BASE_URL = 'http://localhost:5000'

</template>

  }

<script>

import DadosService from '../services/DadosService')// Instância base do Axios



export default {const api = axios.create({

  data() {

    return {// Interceptor de Resposta (trata erros globalmente)  baseURL: API_BASE_URL,

      carregando: false,

      dados: null,api.interceptors.response.use(  timeout: 10000, // 10 segundos

      erro: null

    }  response => {  headers: {

  },

  methods: {    console.log('✓ Resposta recebida:', response.status)    'Content-Type': 'application/json'

    async buscar() {

      this.carregando = true    return response  }

      this.erro = null

        },})

      const resposta = await DadosService.buscarDados()

        error => {

      if (resposta.sucesso) {

        this.dados = resposta.dados    console.error('✗ Erro na resposta:', error.response?.status)// Interceptador de requisições

      } else {

        this.erro = resposta.mensagem    api.interceptors.request.use(

      }

          // Trata erros específicos  (config) => {

      this.carregando = false

    }    if (error.response?.status === 401) {    console.log('🚀 Fazendo requisição:', config.method?.toUpperCase(), config.url)

  }

}      console.warn('Token inválido ou expirado')    

</script>

```      localStorage.removeItem('token')    // Adicionar token JWT se existir



---      // Redirecionar para login aqui    const token = localStorage.getItem('authToken')



### Padrão de Estados Assíncronos    }    if (token) {



Todo componente que faz requisições deve ter:          config.headers.Authorization = `Bearer ${token}`



```javascript    if (error.response?.status === 500) {    }

data() {

  return {      console.error('Erro interno do servidor')    

    carregando: false,  // Estado de loading

    erro: null,         // Mensagem de erro    }    // Adicionar timestamp para debug

    dados: null         // Dados recebidos

  }        config.metadata = { startTime: new Date() }

}

```    return Promise.reject(error)    



**Ciclo de vida de uma requisição:**  }    return config



1. **Início**: `carregando = true`, `erro = null`)  },

2. **Sucesso**: `dados = response.data`

3. **Erro**: `erro = error.message`  (error) => {

4. **Fim**: `carregando = false`

export default api    console.error('❌ Erro na configuração da requisição:', error)

---

```    return Promise.reject(error)

### Autenticação JWT

  }

#### Login

**Conceitos:**)

```javascript

// services/AuthService.js- **Interceptors**: Funções executadas antes/depois de cada requisição

async login(email, senha) {

  const response = await api.post('/api/login', { email, senha })- **Request Interceptor**: Adiciona token automaticamente// Interceptador de respostas

  const token = response.data.token

  - **Response Interceptor**: Trata erros globalmente (401, 500, etc.)api.interceptors.response.use(

  // Salva token

  localStorage.setItem('token', token)  (response) => {

  

  return token---    const duration = new Date() - response.config.metadata.startTime

}

```    console.log(



#### Logout#### 2. Criar Service (Camada de Serviço)      '✅ Resposta recebida:', 



```javascript      response.status, 

logout() {

  localStorage.removeItem('token')**`src/services/DadosService.js`:**      response.config.url,

  // Redirecionar para login

}      `(${duration}ms)`

```

```javascript    )

#### Requisições Autenticadas

import api from './api'    return response

O **interceptor** já adiciona o token automaticamente!

  },

```javascript

// Não precisa fazer nada, o interceptor faz:export default {  (error) => {

// headers: { Authorization: 'Bearer TOKEN' }

```  // GET: Testar conexão (endpoint público)    const duration = error.config?.metadata ? 



---  async testarConexao() {      new Date() - error.config.metadata.startTime : 0



### Endpoints do Backend    try {    



Segundo `SETUP_BACKEND_AULA3.md`:      const response = await api.get('/api/teste')    console.error(



| Método | Endpoint       | Autenticação | Descrição              |      return { sucesso: true, dados: response.data }      '❌ Erro na resposta:', 

|--------|----------------|--------------|------------------------|

| GET    | `/api/teste`   | ❌ Não       | Testar conexão         |    } catch (erro) {      error.response?.status || 'Network Error',

| GET    | `/api/dados`   | ✅ JWT       | Buscar dados protegidos|

| POST   | `/api/dados`   | ✅ JWT       | Enviar dados           |      return {       error.config?.url,

| POST   | `/api/login`   | ❌ Não       | Login (retorna JWT)    |

        sucesso: false,       `(${duration}ms)`

---

        mensagem: erro.response?.data?.mensagem || erro.message     )

### Checklist de Implementação

      }    

- [ ] Backend configurado (CORS + endpoints)

- [ ] Axios instalado    }    // Tratamento global de erros

- [ ] `api.js` criado com interceptadores

- [ ] Services criados  },    if (error.response?.status === 401) {

- [ ] Estados assíncronos implementados

- [ ] Requisições GET/POST funcionando      // Token expirado ou inválido

- [ ] Autenticação JWT funcionando

- [ ] Erros sendo tratados  // GET: Buscar dados (requer autenticação)      localStorage.removeItem('authToken')



---  async buscarDados() {      window.location.href = '/login'



### Tratamento de Erros Comuns    try {    }



#### 1. CORS Error      const response = await api.get('/api/dados')    



```      return { sucesso: true, dados: response.data }    return Promise.reject(error)

Access to XMLHttpRequest has been blocked by CORS policy

```    } catch (erro) {  }



**Solução:** Configure Flask-CORS no backend (ver `SETUP_BACKEND_AULA3.md`)      return { )



---        sucesso: false, 



#### 2. 401 Unauthorized        mensagem: erro.response?.data?.mensagem || 'Erro ao buscar dados'export default api



```json      }```

{ "mensagem": "Token inválido ou ausente" }

```    }



**Solução:**  },---



- Faça login primeiro

- Verifique se token está no localStorage

- Verifique se interceptor está adicionando o token  // POST: Enviar dados### Serviço para Dados Básicos



---  async enviarDados(payload) {



#### 3. Network Error    try {**IMPORTANTE:** O endpoint `/api/dados` no Flask requer autenticação JWT. Para esta aula introdutória, vamos:



**Soluções:**      const response = await api.post('/api/dados', payload)1. Criar um endpoint público para testes iniciais



- Backend está rodando? (`python app.py`)      return { sucesso: true, dados: response.data }2. Demonstrar requisições com e sem autenticação

- URL correta no `baseURL`?

- Firewall bloqueando?    } catch (erro) {



---      return { #### Adicionar endpoint público no Flask



### Arquivos da Aula 3        sucesso: false, 



📁 **Arquivos criados:**        mensagem: erro.response?.data?.mensagem || 'Erro ao enviar dados'**Em `backend_flask/app/routes.py`, adicione:**



1. `src/services/api.js` - Configuração do Axios com interceptadores      }

2. `src/services/DadosService.js` - Métodos de requisição

3. `src/components/TesteAPI.vue` - Interface de teste    }```python

4. `SETUP_BACKEND_AULA3.md` - Instruções de configuração do backend

  }# Endpoint público para teste (sem autenticação)

💡 **Dica:** Sempre teste endpoints com Postman/Insomnia primeiro!

}@app.route("/api/teste")

---

```def api_teste():

### Conceitos-Chave

    return jsonify({

✅ **Axios:**

**Vantagens do Service:**        "mensagem": "Conexão estabelecida com sucesso!",

- Cliente HTTP baseado em Promises

- Suporta interceptadores- Centraliza lógica de API        "servidor": "Flask Backend",

- Conversão automática JSON

- Facilita manutenção        "versao": "1.0.0"

✅ **Interceptadores:**

- Trata erros de forma consistente    })

- Request: adiciona token, logs

- Response: trata erros globalmente```



✅ **Services:**---



- Camada de abstração para API#### `src/services/DadosService.js`

- Facilita manutenção

- Centraliza lógica de requisições### Usando no Componente



✅ **Estados Assíncronos:**```javascript



- Loading: mostra spinner**`src/components/TesteAPI.vue` (versão simplificada):**import api from './api'

- Erro: mostra mensagem

- Sucesso: renderiza dados



✅ **JWT:**```vueexport class DadosService {



- Token de autenticação<template>  /**

- Enviado no header `Authorization`

- Validado pelo backend  <div class="container">   * Testa conectividade com o backend (endpoint público)



---    <h2>Teste de API</h2>   */



### Comandos Git  static async testarConexao() {



```bash    <!-- Testar Conexão -->    try {

git checkout -b aula-03-api

git add .    <section>      const response = await api.get('/api/teste', { 

git commit -m "Aula 3 - Comunicação com API"

git push -u origin aula-03-api      <button @click="testarConexao" :disabled="carregando.teste">        timeout: 3000 // Timeout menor para teste rápido

```

        {{ carregando.teste ? 'Testando...' : 'Testar Conexão' }}      })

---

      </button>      return {

### Próxima Aula

              sucesso: true,

**Aula 4 - State Management (Pinia):**

      <div v-if="resultado.teste" class="resultado">        conectado: true,

- Gerenciamento de estado global

- Stores        <strong>✓ Conectado!</strong>        status: response.status,

- Actions e Getters

- Compartilhar dados entre componentes        <pre>{{ resultado.teste }}</pre>        dados: response.data,



---      </div>        mensagem: 'Backend conectado e funcionando'



### Recursos    </section>      }



📚 **Documentação:**    } catch (error) {



- [Axios](https://axios-http.com/docs/intro)    <!-- Buscar Dados (requer JWT) -->      return {

- [Interceptors](https://axios-http.com/docs/interceptors)

- [Flask-CORS](https://flask-cors.readthedocs.io/)    <section>        sucesso: false,

- [JWT](https://jwt.io/)

      <button @click="buscarDados" :disabled="carregando.dados">        conectado: false,

🔧 **Ferramentas:**

        {{ carregando.dados ? 'Carregando...' : 'Buscar Dados' }}        status: error.response?.status || 0,

- Postman: teste de APIs

- Vue DevTools: debug de requisições      </button>        mensagem: error.code === 'ECONNREFUSED' ? 

- Browser Network Tab: inspecionar requests

                'Backend não está rodando' : 

💡 **Dica:** Use `console.log` nos interceptadores para debug!

      <div v-if="resultado.dados" class="resultado">          'Erro de conectividade'

        <pre>{{ resultado.dados }}</pre>      }

      </div>    }

    </section>  }



    <!-- Enviar Dados (POST) -->  /**

    <section>   * Busca dados básicos da API (requer autenticação JWT)

      <input v-model="dadosEnvio.nome" placeholder="Nome">   */

      <input v-model="dadosEnvio.email" placeholder="Email">  static async obterDados() {

          try {

      <button @click="enviarDados" :disabled="carregando.envio">      const response = await api.get('/api/dados')

        {{ carregando.envio ? 'Enviando...' : 'Enviar' }}      return {

      </button>        sucesso: true,

    </section>        dados: response.data,

        mensagem: 'Dados carregados com sucesso'

    <!-- Erros -->      }

    <div v-if="erro" class="erro">    } catch (error) {

      ⚠️ {{ erro }}      return {

    </div>        sucesso: false,

  </div>        dados: [],

</template>        mensagem: this.tratarErro(error)

      }

<script>    }

import DadosService from '../services/DadosService'  }



export default {  /**

  name: 'TesteAPI',   * Simula requisição com delay (para demonstração)

  data() {   */

    return {  static async dadosComDelay(delayMs = 2000) {

      carregando: {    try {

        teste: false,      // Simular loading state

        dados: false,      await new Promise(resolve => setTimeout(resolve, delayMs))

        envio: false      

      },      const response = await api.get('/api/dados')

      resultado: {      return {

        teste: null,        sucesso: true,

        dados: null        dados: response.data,

      },        mensagem: `Dados carregados após ${delayMs}ms`

      dadosEnvio: {      }

        nome: '',    } catch (error) {

        email: ''      return {

      },        sucesso: false,

      erro: null        dados: [],

    }        mensagem: this.tratarErro(error)

  },      }

  methods: {    }

    async testarConexao() {  }

      this.carregando.teste = true

      this.erro = null  /**

         * Trata erros de forma padronizada

      const resposta = await DadosService.testarConexao()   */

        static tratarErro(error) {

      if (resposta.sucesso) {    if (error.response) {

        this.resultado.teste = resposta.dados      // Erro da API

      } else {      const status = error.response.status

        this.erro = resposta.mensagem      const message = error.response.data?.message || 

      }                     error.response.data?.error || 

                           'Erro desconhecido'

      this.carregando.teste = false      

    },      switch (status) {

        case 400: return `Erro de validação: ${message}`

    async buscarDados() {        case 401: return 'Não autorizado - Faça login'

      this.carregando.dados = true        case 403: return 'Acesso negado'

      this.erro = null        case 404: return 'Endpoint não encontrado'

              case 500: return 'Erro interno do servidor'

      const resposta = await DadosService.buscarDados()        default: return `Erro HTTP ${status}: ${message}`

            }

      if (resposta.sucesso) {    } else if (error.request) {

        this.resultado.dados = resposta.dados      // Erro de rede

      } else {      if (error.code === 'ECONNREFUSED') {

        this.erro = resposta.mensagem        return 'Conexão recusada - Backend não está rodando'

      }      } else if (error.code === 'TIMEOUT') {

              return 'Timeout - Servidor demorou para responder'

      this.carregando.dados = false      } else {

    },        return 'Erro de conexão - Verifique sua internet'

      }

    async enviarDados() {    } else {

      if (!this.dadosEnvio.nome || !this.dadosEnvio.email) {      return `Erro inesperado: ${error.message}`

        this.erro = 'Preencha todos os campos'    }

        return  }

      }}

```

      this.carregando.envio = true

      this.erro = null---

      

      const resposta = await DadosService.enviarDados(this.dadosEnvio)### Componente de Demonstração

      

      if (resposta.sucesso) {#### `src/components/TesteAPI.vue`

        alert('Dados enviados com sucesso!')

        this.dadosEnvio = { nome: '', email: '' }```vue

      } else {<template>

        this.erro = resposta.mensagem  <div class="teste-api">

      }    <!-- Header -->

          <div class="card mb-4">

      this.carregando.envio = false      <div class="card-header bg-primary text-white">

    }        <h4 class="mb-0">

  }          <i class="fas fa-plug me-2"></i>

}          Teste de Comunicação com API Flask

</script>        </h4>

      </div>

<style scoped>      <div class="card-body">

.container {        <p class="mb-0">

  max-width: 600px;          Esta seção demonstra como o Vue.js se comunica com o backend Flask

  margin: 2rem auto;        </p>

  padding: 2rem;      </div>

}    </div>



section {    <!-- Status da Conexão -->

  margin-bottom: 2rem;    <div class="row mb-4">

  padding: 1rem;      <div class="col-md-6">

  border: 1px solid #ddd;        <div class="card">

  border-radius: 8px;          <div class="card-header">

}            <h5 class="mb-0">

              <i class="fas fa-wifi me-2"></i>

button {              Status da Conexão

  padding: 0.5rem 1rem;            </h5>

  background: #42b983;          </div>

  color: white;          <div class="card-body">

  border: none;            <div class="d-flex align-items-center gap-3">

  border-radius: 4px;              <div 

  cursor: pointer;                class="status-indicator"

}                :class="conexao.conectado ? 'online' : 'offline'"

              ></div>

button:disabled {              <div>

  opacity: 0.5;                <strong>{{ conexao.conectado ? 'Conectado' : 'Desconectado' }}</strong>

  cursor: not-allowed;                <br>

}                <small class="text-muted">{{ conexao.mensagem }}</small>

              </div>

.resultado {            </div>

  margin-top: 1rem;            

  padding: 1rem;            <button 

  background: #f0f9ff;              class="btn btn-outline-primary btn-sm mt-3"

  border-radius: 4px;              @click="testarConexao"

}              :disabled="testando"

            >

.erro {              <i class="fas fa-sync-alt" :class="{ 'fa-spin': testando }"></i>

  padding: 1rem;              {{ testando ? 'Testando...' : 'Testar Conexão' }}

  background: #fee;            </button>

  color: #c00;          </div>

  border-radius: 4px;        </div>

}      </div>



input {      <div class="col-md-6">

  margin-right: 0.5rem;        <div class="card">

  padding: 0.5rem;          <div class="card-header">

  border: 1px solid #ddd;            <h5 class="mb-0">

  border-radius: 4px;              <i class="fas fa-chart-line me-2"></i>

}              Estatísticas de Requisições

</style>            </h5>

```          </div>

          <div class="card-body">

**Veja implementação completa em:** `src/components/TesteAPI.vue`            <div class="row text-center">

              <div class="col-4">

---                <div class="h4 text-success">{{ stats.sucesso }}</div>

                <small class="text-muted">Sucessos</small>

### Padrão de Estados Assíncronos              </div>

              <div class="col-4">

```javascript                <div class="h4 text-danger">{{ stats.erro }}</div>

data() {                <small class="text-muted">Erros</small>

  return {              </div>

    carregando: false,              <div class="col-4">

    erro: null,                <div class="h4 text-info">{{ stats.total }}</div>

    dados: null                <small class="text-muted">Total</small>

  }              </div>

}            </div>

          </div>

async buscar() {        </div>

  this.carregando = true      </div>

  this.erro = null    </div>

  

  try {    <!-- Ações de Teste -->

    const resposta = await Service.buscar()    <div class="card mb-4">

    this.dados = resposta.dados      <div class="card-header">

  } catch (erro) {        <h5 class="mb-0">

    this.erro = erro.message          <i class="fas fa-flask me-2"></i>

  } finally {          Testes de Requisições

    this.carregando = false        </h5>

  }      </div>

}      <div class="card-body">

```        <div class="row g-3">

          <div class="col-md-4">

**Estados:**            <button 

1. **Carregando**: `carregando = true` → desabilita botões, mostra spinner              class="btn btn-primary w-100"

2. **Sucesso**: `dados = response.data` → renderiza resultado              @click="carregarDados"

3. **Erro**: `erro = message` → mostra mensagem de erro              :disabled="carregandoDados"

            >

---              <i class="fas fa-download" v-if="!carregandoDados"></i>

              <i class="fas fa-spinner fa-spin" v-else></i>

### Autenticação JWT              {{ carregandoDados ? 'Carregando...' : 'Carregar Dados' }}

            </button>

#### Login          </div>

          

```javascript          <div class="col-md-4">

// services/AuthService.js            <button 

async login(email, senha) {              class="btn btn-warning w-100"

  const response = await api.post('/api/login', { email, senha })              @click="carregarComDelay"

  const token = response.data.token              :disabled="carregandoComDelay"

              >

  // Salva token              <i class="fas fa-clock" v-if="!carregandoComDelay"></i>

  localStorage.setItem('token', token)              <i class="fas fa-spinner fa-spin" v-else></i>

                {{ carregandoComDelay ? 'Carregando...' : 'Com Delay (2s)' }}

  return token            </button>

}          </div>

```          

          <div class="col-md-4">

#### Logout            <button 

              class="btn btn-danger w-100"

```javascript              @click="simularErro"

logout() {              :disabled="simulandoErro"

  localStorage.removeItem('token')            >

  // Redirecionar para login              <i class="fas fa-exclamation-triangle" v-if="!simulandoErro"></i>

}              <i class="fas fa-spinner fa-spin" v-else></i>

```              {{ simulandoErro ? 'Testando...' : 'Simular Erro' }}

            </button>

#### Requisições Autenticadas          </div>

        </div>

O **interceptor** já adiciona o token automaticamente!      </div>

    </div>

```javascript

// Não precisa fazer nada, o interceptor faz:    <!-- Resultado das Requisições -->

// headers: { Authorization: 'Bearer TOKEN' }    <div class="card">

```      <div class="card-header d-flex justify-content-between align-items-center">

        <h5 class="mb-0">

---          <i class="fas fa-terminal me-2"></i>

          Log de Requisições

### Endpoints do Backend        </h5>

        <button 

Segundo `SETUP_BACKEND_AULA3.md`:          class="btn btn-sm btn-outline-secondary"

          @click="limparLog"

| Método | Endpoint       | Autenticação | Descrição              |        >

|--------|----------------|--------------|------------------------|          <i class="fas fa-trash"></i> Limpar

| GET    | `/api/teste`   | ❌ Não       | Testar conexão         |        </button>

| GET    | `/api/dados`   | ✅ JWT       | Buscar dados protegidos|      </div>

| POST   | `/api/dados`   | ✅ JWT       | Enviar dados           |      <div class="card-body">

| POST   | `/api/login`   | ❌ Não       | Login (retorna JWT)    |        <!-- Loading State -->

        <div v-if="carregandoDados || carregandoComDelay || simulandoErro" class="text-center py-4">

---          <div class="spinner-border text-primary mb-3" role="status"></div>

          <p class="text-muted">Processando requisição...</p>

### Checklist de Implementação        </div>



- [ ] Backend configurado (CORS + endpoints)        <!-- Log de Requisições -->

- [ ] Axios instalado (`npm install axios`)        <div v-else-if="logRequisicoes.length > 0" class="log-container">

- [ ] `api.js` criado com interceptadores          <div 

- [ ] Services criados (DadosService, AuthService)            v-for="(log, index) in logRequisicoes.slice().reverse()" 

- [ ] Estados assíncronos implementados (loading/erro/sucesso)            :key="index"

- [ ] Requisições GET/POST funcionando            class="log-entry"

- [ ] Autenticação JWT funcionando            :class="log.tipo"

- [ ] Erros sendo tratados corretamente          >

            <div class="log-header">

---              <i class="fas" :class="{

                'fa-check-circle text-success': log.tipo === 'sucesso',

### Tratamento de Erros Comuns                'fa-exclamation-circle text-danger': log.tipo === 'erro',

                'fa-info-circle text-info': log.tipo === 'info'

#### 1. CORS Error              }"></i>

              <strong>{{ log.titulo }}</strong>

```              <small class="text-muted ms-auto">{{ formatarTempo(log.timestamp) }}</small>

Access to XMLHttpRequest at 'http://localhost:5000' from origin 'http://localhost:5173' has been blocked by CORS policy            </div>

```            <div class="log-body">

              <p class="mb-1">{{ log.mensagem }}</p>

**Solução:** Configure Flask-CORS no backend (ver `SETUP_BACKEND_AULA3.md`)              <div v-if="log.dados && log.dados.length > 0" class="mt-2">

                <small class="text-muted">Dados recebidos ({{ log.dados.length }} itens):</small>

---                <div class="dados-preview">

                  <div 

#### 2. 401 Unauthorized                    v-for="(pessoa, i) in log.dados.slice(0, 3)" 

                    :key="i"

```json                    class="badge bg-secondary me-1 mb-1"

{ "mensagem": "Token inválido ou ausente" }                  >

```                    {{ pessoa.nome }}

                  </div>

**Solução:**                   <span v-if="log.dados.length > 3" class="text-muted small">

- Faça login primeiro                    +{{ log.dados.length - 3 }} mais...

- Verifique se token está no localStorage                  </span>

- Verifique se interceptor está adicionando o token                </div>

              </div>

---              <div v-if="log.detalhes" class="mt-2">

                <details>

#### 3. Network Error                  <summary class="text-muted small">Detalhes técnicos</summary>

                  <pre class="small text-muted mt-1">{{ JSON.stringify(log.detalhes, null, 2) }}</pre>

```                </details>

Network Error              </div>

```            </div>

          </div>

**Soluções:**        </div>

- Backend está rodando? (`python app.py`)

- URL correta no `baseURL`?        <!-- Estado vazio -->

- Firewall bloqueando?        <div v-else class="text-center py-4 text-muted">

          <i class="fas fa-clipboard-list fa-3x mb-3"></i>

---          <p>Nenhuma requisição feita ainda.</p>

          <p class="small">Use os botões acima para testar a comunicação com a API.</p>

### Arquivos da Aula 3        </div>

      </div>

📁 **Arquivos criados:**    </div>

1. `src/services/api.js` - Configuração do Axios com interceptadores  </div>

2. `src/services/DadosService.js` - Métodos de requisição</template>

3. `src/components/TesteAPI.vue` - Interface de teste

4. `SETUP_BACKEND_AULA3.md` - Instruções de configuração do backend<script>

import { DadosService } from '@/services/DadosService'

💡 **Dica:** Sempre teste endpoints com Postman/Insomnia primeiro!

export default {

---  name: 'TesteAPI',

  data() {

### Conceitos-Chave    return {

      // Estados de loading

✅ **Axios:**      testando: false,

- Cliente HTTP baseado em Promises      carregandoDados: false,

- Suporta interceptadores      carregandoComDelay: false,

- Conversão automática JSON      simulandoErro: false,

      

✅ **Interceptadores:**      // Conexão

- Request: adiciona token, logs      conexao: {

- Response: trata erros globalmente        conectado: false,

        mensagem: 'Status não verificado'

✅ **Services:**      },

- Camada de abstração para API      

- Facilita manutenção      // Estatísticas

- Centraliza lógica de requisições      stats: {

        sucesso: 0,

✅ **Estados Assíncronos:**        erro: 0,

- Loading: mostra spinner        total: 0

- Erro: mostra mensagem      },

- Sucesso: renderiza dados      

      // Log de requisições

✅ **JWT:**      logRequisicoes: []

- Token de autenticação    }

- Enviado no header `Authorization`  },

- Validado pelo backend  async mounted() {

    await this.testarConexao()

---  },

  methods: {

### Comandos Git    async testarConexao() {

      this.testando = true

```bash      

git checkout -b aula-03-api      const resultado = await DadosService.testarConexao()

git add .      

git commit -m "Aula 3 - Comunicação com API"      this.conexao = {

git push -u origin aula-03-api        conectado: resultado.conectado,

```        mensagem: resultado.mensagem

      }

---      

      this.adicionarLog(

### Próxima Aula        resultado.sucesso ? 'sucesso' : 'erro',

        'Teste de Conexão',

**Aula 4 - State Management (Pinia):**        resultado.mensagem,

- Gerenciamento de estado global        null,

- Stores        { status: resultado.status }

- Actions e Getters      )

- Compartilhar dados entre componentes      

      this.testando = false

---    },



### Recursos    async carregarDados() {

      this.carregandoDados = true

📚 **Documentação:**      

- [Axios](https://axios-http.com/docs/intro)      const resultado = await DadosService.obterDados()

- [Interceptors](https://axios-http.com/docs/interceptors)      

- [Flask-CORS](https://flask-cors.readthedocs.io/)      this.adicionarLog(

- [JWT](https://jwt.io/)        resultado.sucesso ? 'sucesso' : 'erro',

        'Carregar Dados',

🔧 **Ferramentas:**        resultado.mensagem,

- Postman: teste de APIs        resultado.dados

- Vue DevTools: debug de requisições      )

- Browser Network Tab: inspecionar requests      

      this.carregandoDados = false

💡 **Dica:** Use `console.log` nos interceptadores para debug!    },


    async carregarComDelay() {
      this.carregandoComDelay = true
      
      const inicio = Date.now()
      const resultado = await DadosService.dadosComDelay(2000)
      const duracao = Date.now() - inicio
      
      this.adicionarLog(
        resultado.sucesso ? 'sucesso' : 'erro',
        'Carregar com Delay',
        `${resultado.mensagem} (duração real: ${duracao}ms)`,
        resultado.dados
      )
      
      this.carregandoComDelay = false
    },

    async simularErro() {
      this.simulandoErro = true
      
      try {
        // Tentar acessar endpoint inexistente
        await DadosService.api.get('/api/endpoint-inexistente')
      } catch (error) {
        this.adicionarLog(
          'erro',
          'Simular Erro 404',
          'Endpoint não encontrado (esperado)',
          null,
          { 
            status: error.response?.status,
            mensagem: error.response?.data?.message || error.message
          }
        )
      }
      
      this.simulandoErro = false
    },

    adicionarLog(tipo, titulo, mensagem, dados = null, detalhes = null) {
      this.logRequisicoes.push({
        tipo,
        titulo,
        mensagem,
        dados,
        detalhes,
        timestamp: Date.now()
      })
      
      // Atualizar estatísticas
      this.stats.total++
      if (tipo === 'sucesso') {
        this.stats.sucesso++
      } else if (tipo === 'erro') {
        this.stats.erro++
      }
      
      // Manter apenas os últimos 50 logs
      if (this.logRequisicoes.length > 50) {
        this.logRequisicoes = this.logRequisicoes.slice(-50)
      }
    },

    limparLog() {
      this.logRequisicoes = []
      this.stats = { sucesso: 0, erro: 0, total: 0 }
    },

    formatarTempo(timestamp) {
      return new Date(timestamp).toLocaleTimeString()
    }
  }
}
</script>

<style scoped>
.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-indicator.online {
  background-color: #28a745;
  box-shadow: 0 0 8px rgba(40, 167, 69, 0.5);
}

.status-indicator.offline {
  background-color: #dc3545;
  box-shadow: 0 0 8px rgba(220, 53, 69, 0.5);
}

.log-container {
  max-height: 400px;
  overflow-y: auto;
}

.log-entry {
  border: 1px solid #dee2e6;
  border-radius: 6px;
  margin-bottom: 10px;
  padding: 12px;
  background: #f8f9fa;
}

.log-entry.sucesso {
  border-left: 4px solid #28a745;
}

.log-entry.erro {
  border-left: 4px solid #dc3545;
}

.log-entry.info {
  border-left: 4px solid #17a2b8;
}

.log-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.log-body p {
  margin: 0;
}

.dados-preview {
  margin-top: 6px;
}

pre {
  max-height: 200px;
  overflow-y: auto;
  background: #f1f3f4;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 8px;
}

/* Animações */
.log-entry {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
```

---

### Atualização do App.vue para Aula 3

#### `src/App.vue` (versão Aula 3)

```vue
<template>
  <div id="app">
    <!-- Header da aplicação -->
    <header class="bg-primary text-white py-3 mb-4">
      <div class="container">
        <h1 class="mb-0">
          <i class="fas fa-graduation-cap me-2"></i>
          Frontend Vue.js - Aula 3
        </h1>
        <p class="mb-0 opacity-75">Comunicação com API Flask</p>
      </div>
    </header>

    <!-- Conteúdo principal -->
    <div class="container">
      <TesteAPI />
    </div>

    <!-- Footer -->
    <footer class="bg-light text-center py-3 mt-5">
      <div class="container">
        <p class="text-muted mb-0">
          Aula 3 - Comunicação com API | 
          <a href="https://axios-http.com/" target="_blank" class="text-decoration-none">
            Documentação Axios
          </a>
        </p>
      </div>
    </footer>
  </div>
</template>

<script>
import TesteAPI from './components/TesteAPI.vue'

export default {
  name: 'App',
  components: {
    TesteAPI
  }
}
</script>

<style>
/* Reutilizar estilos da aula anterior */
</style>
```

---

### Exercícios Práticos da Aula 3

#### Exercício 1: Cache de Requisições
Implementar um sistema simples de cache:
- Armazenar respostas em memória por 5 minutos
- Mostrar indicador quando dados vêm do cache
- Botão para limpar cache manualmente

#### Exercício 2: Retry Automático
Criar sistema de retry para falhas:
- Tentar novamente até 3 vezes em caso de erro de rede
- Backoff exponencial (1s, 2s, 4s)
- Mostrar progresso do retry na UI

#### Exercício 3: WebSocket (Opcional)
Para alunos avançados, implementar comunicação em tempo real:
- Conectar via WebSocket com Flask-SocketIO
- Notificações em tempo real
- Status de conexão WebSocket

---

### Comandos e Verificação

#### Testando com Backend Flask
```bash
# Certifique-se que o Flask está rodando
cd ../backend_flask
python run.py

# Em outro terminal, rode o frontend
cd ../frontend_vue
npm run dev
```

#### Debug de Requisições
```javascript
// No console do navegador
console.log('Token atual:', localStorage.getItem('authToken'))

// Limpar token para teste
localStorage.removeItem('authToken')
```

---

### Branch Git
```bash
# Criar e configurar branch da aula 3
git checkout master
git checkout -b aula-03-api

# Implementar componentes da aula 3
# ...

git add .
git commit -m "Aula 3 - Comunicação com API Flask implementada"
git push -u origin aula-03-api
```

---

### Checklist de Verificação

- [ ] Axios configurado com interceptadores
- [ ] Serviço DadosService funcionando
- [ ] Componente TesteAPI implementado
- [ ] Estados de loading funcionando
- [ ] Tratamento de erro implementado
- [ ] Log de requisições funcionando
- [ ] Conexão com Flask testada
- [ ] Estatísticas de requisições exibidas

---

### Próxima Aula

Na **Aula 4** veremos:
- Vue Router para navegação SPA
- Rotas dinâmicas e parâmetros
- Guards de navegação
- Lazy loading de componentes
- Estrutura de múltiplas páginas

### Conceitos Importantes

1. **Interceptadores**: Fundamentais para tratamento global
2. **Estados Assíncronos**: Loading, sucesso, erro sempre visíveis
3. **Feedback Visual**: Usuário sempre sabe o que está acontecendo
4. **Tratamento de Erro**: Mensagens claras e ações de recuperação
5. **Debug**: Console logs para desenvolvimento