# Aula 3 — Comunicação com API (Axios)

## Objetivos

- Integrar frontend Vue.js com backend Flask
- Configurar Axios e interceptadores
- Gerenciar estados de loading e erro
- Implementar autenticação JWT

---

## Pré-requisitos

⚠️ **Antes de começar, configure o backend Flask!**

**Leia e siga:** `SETUP_BACKEND_AULA3.md` (raiz do projeto)

Passos essenciais:

1. Instalar Flask-CORS
2. Configurar CORS no backend
3. Criar endpoint público `/api/teste`
4. Verificar JWT configurado em `/api/dados`

**Sem isso, as requisições serão bloqueadas!**

---

## Instalando Axios

```bash
npm install axios
```

O Axios já está em `package.json`, mas certifique-se de ter instalado as dependências:

```bash
npm install
```

---

## Configuração do Axios

### 1. Criar Instância Configurada

**Veja implementação completa em:** `src/services/api.js`

**Conceitos principais:**

```javascript
// Instância base
const api = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 5000
})

// Interceptor de Requisição (adiciona token)
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor de Resposta (trata erros)
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      // Redirecionar para login
    }
    return Promise.reject(error)
  }
)
```

**O que são Interceptors?**

- **Request Interceptor**: Executa antes de cada requisição (adiciona token, logs)
- **Response Interceptor**: Executa após cada resposta (trata erros globalmente)

---

### 2. Criar Service (Camada de Serviço)

**Veja implementação completa em:** `src/services/DadosService.js`

**Exemplo simplificado:**

```javascript
import api from './api'

export default {
  async testarConexao() {
    try {
      const response = await api.get('/api/teste')
      return { sucesso: true, dados: response.data }
    } catch (erro) {
      return { sucesso: false, mensagem: erro.message }
    }
  },

  async buscarDados() {
    const response = await api.get('/api/dados')
    return { sucesso: true, dados: response.data }
  }
}
```

**Vantagens do Service:**

- Centraliza lógica de API
- Facilita manutenção
- Trata erros de forma consistente

---

## Usando no Componente

**Veja implementação completa em:** `src/components/TesteAPI.vue`

**Padrão básico:**

```vue
<template>
  <div>
    <button @click="buscar" :disabled="carregando">
      {{ carregando ? 'Carregando...' : 'Buscar' }}
    </button>
    
    <div v-if="dados">
      {{ dados }}
    </div>
    
    <div v-if="erro" class="erro">
      {{ erro }}
    </div>
  </div>
</template>

<script>
import DadosService from '../services/DadosService'

export default {
  data() {
    return {
      carregando: false,
      dados: null,
      erro: null
    }
  },
  methods: {
    async buscar() {
      this.carregando = true
      this.erro = null
      
      const resposta = await DadosService.buscarDados()
      
      if (resposta.sucesso) {
        this.dados = resposta.dados
      } else {
        this.erro = resposta.mensagem
      }
      
      this.carregando = false
    }
  }
}
</script>
```

---

## Padrão de Estados Assíncronos

Todo componente que faz requisições deve ter:

```javascript
data() {
  return {
    carregando: false,  // Estado de loading
    erro: null,         // Mensagem de erro
    dados: null         // Dados recebidos
  }
}
```

**Ciclo de vida de uma requisição:**

1. **Início**: `carregando = true`, `erro = null`
2. **Sucesso**: `dados = response.data`
3. **Erro**: `erro = error.message`
4. **Fim**: `carregando = false`

---

## Autenticação JWT

### Login

```javascript
// services/AuthService.js
async login(email, senha) {
  const response = await api.post('/api/login', { email, senha })
  const token = response.data.token
  
  // Salva token
  localStorage.setItem('token', token)
  
  return token
}
```

### Logout

```javascript
logout() {
  localStorage.removeItem('token')
  // Redirecionar para login
}
```

### Requisições Autenticadas

O **interceptor** já adiciona o token automaticamente!

```javascript
// Não precisa fazer nada, o interceptor faz:
// headers: { Authorization: 'Bearer TOKEN' }
```

---

## Endpoints do Backend

Segundo `SETUP_BACKEND_AULA3.md`:

| Método | Endpoint       | Autenticação | Descrição              |
|--------|----------------|--------------|------------------------|
| GET    | `/api/teste`   | ❌ Não       | Testar conexão         |
| GET    | `/api/dados`   | ✅ JWT       | Buscar dados protegidos|
| POST   | `/api/dados`   | ✅ JWT       | Enviar dados           |
| POST   | `/api/login`   | ❌ Não       | Login (retorna JWT)    |

---

## Checklist de Implementação

- [ ] Backend configurado (CORS + endpoints)
- [ ] Axios instalado
- [ ] `api.js` criado com interceptadores
- [ ] Services criados
- [ ] Estados assíncronos implementados
- [ ] Requisições GET/POST funcionando
- [ ] Autenticação JWT funcionando
- [ ] Erros sendo tratados

---

## Tratamento de Erros Comuns

### 1. CORS Error

```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solução:** Configure Flask-CORS no backend (ver `SETUP_BACKEND_AULA3.md`)

---

### 2. 401 Unauthorized

```json
{ "mensagem": "Token inválido ou ausente" }
```

**Solução:**

- Faça login primeiro
- Verifique se token está no localStorage
- Verifique se interceptor está adicionando o token

---

### 3. Network Error

**Soluções:**

- Backend está rodando? (`python app.py`)
- URL correta no `baseURL`?
- Firewall bloqueando?

---

## Arquivos da Aula 3

📁 **Arquivos criados:**

1. `src/services/api.js` - Configuração do Axios com interceptadores
2. `src/services/DadosService.js` - Métodos de requisição
3. `src/components/TesteAPI.vue` - Interface de teste
4. `SETUP_BACKEND_AULA3.md` - Instruções de configuração do backend

💡 **Dica:** Sempre teste endpoints com Postman/Insomnia primeiro!

---

## Conceitos-Chave

✅ **Axios:**

- Cliente HTTP baseado em Promises
- Suporta interceptadores
- Conversão automática JSON

✅ **Interceptadores:**

- Request: adiciona token, logs
- Response: trata erros globalmente

✅ **Services:**

- Camada de abstração para API
- Facilita manutenção
- Centraliza lógica de requisições

✅ **Estados Assíncronos:**

- Loading: mostra spinner
- Erro: mostra mensagem
- Sucesso: renderiza dados

✅ **JWT:**

- Token de autenticação
- Enviado no header `Authorization`
- Validado pelo backend

---

## Comandos Git

```bash
git checkout -b aula-03-api
git add .
git commit -m "Aula 3 - Comunicação com API"
git push -u origin aula-03-api
```

---

## Próxima Aula

**Aula 4 - State Management (Pinia):**

- Gerenciamento de estado global
- Stores
- Actions e Getters
- Compartilhar dados entre componentes

---

## Recursos

📚 **Documentação:**

- [Axios](https://axios-http.com/docs/intro)
- [Interceptors](https://axios-http.com/docs/interceptors)
- [Flask-CORS](https://flask-cors.readthedocs.io/)
- [JWT](https://jwt.io/)

🔧 **Ferramentas:**

- Postman: teste de APIs
- Vue DevTools: debug de requisições
- Browser Network Tab: inspecionar requests

💡 **Dica:** Use `console.log` nos interceptadores para debug!
