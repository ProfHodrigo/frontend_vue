import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000'

// Instância base do Axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 segundos
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptador de requisições
api.interceptors.request.use(
  (config) => {
    console.log('🚀 Fazendo requisição:', config.method?.toUpperCase(), config.url)
    
    // Adicionar token JWT se existir
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Adicionar timestamp para debug
    config.metadata = { startTime: new Date() }
    
    return config
  },
  (error) => {
    console.error('❌ Erro na configuração da requisição:', error)
    return Promise.reject(error)
  }
)

// Interceptador de respostas
api.interceptors.response.use(
  (response) => {
    const duration = new Date() - response.config.metadata.startTime
    console.log(
      '✅ Resposta recebida:', 
      response.status, 
      response.config.url,
      `(${duration}ms)`
    )
    return response
  },
  (error) => {
    const duration = error.config?.metadata ? 
      new Date() - error.config.metadata.startTime : 0
    
    console.error(
      '❌ Erro na resposta:', 
      error.response?.status || 'Network Error',
      error.config?.url,
      `(${duration}ms)`
    )
    
    // Tratamento global de erros
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('authToken')
      // window.location.href = '/login' // Descomentado na Aula 7
      console.warn('⚠️ Token inválido ou expirado')
    }
    
    return Promise.reject(error)
  }
)

export default api
