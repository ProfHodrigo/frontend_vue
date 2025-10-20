import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

// Configuração do axios
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptador: adiciona token JWT automaticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptador: trata erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirou ou inválido
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export class ProdutoService {
  
  /**
   * Lista todos os produtos
   */
  static async listarTodos() {
    try {
      const response = await api.get('/produtos')
      return {
        sucesso: true,
        dados: response.data,
        mensagem: 'Produtos carregados com sucesso'
      }
    } catch (error) {
      return {
        sucesso: false,
        dados: [],
        mensagem: this.tratarErro(error)
      }
    }
  }

  /**
   * Busca produto por ID
   */
  static async buscarPorId(id) {
    try {
      const response = await api.get(`/produtos/${id}`)
      return {
        sucesso: true,
        dados: response.data,
        mensagem: 'Produto encontrado'
      }
    } catch (error) {
      return {
        sucesso: false,
        dados: null,
        mensagem: this.tratarErro(error)
      }
    }
  }

  /**
   * Cria novo produto
   */
  static async criar(produto) {
    try {
      const response = await api.post('/produtos', produto)
      return {
        sucesso: true,
        dados: response.data,
        mensagem: 'Produto criado com sucesso!'
      }
    } catch (error) {
      return {
        sucesso: false,
        dados: null,
        mensagem: this.tratarErro(error)
      }
    }
  }

  /**
   * Atualiza produto existente
   */
  static async atualizar(id, produto) {
    try {
      const response = await api.put(`/produtos/${id}`, produto)
      return {
        sucesso: true,
        dados: response.data,
        mensagem: 'Produto atualizado com sucesso!'
      }
    } catch (error) {
      return {
        sucesso: false,
        dados: null,
        mensagem: this.tratarErro(error)
      }
    }
  }

  /**
   * Exclui produto
   */
  static async excluir(id) {
    try {
      await api.delete(`/produtos/${id}`)
      return {
        sucesso: true,
        dados: null,
        mensagem: 'Produto excluído com sucesso!'
      }
    } catch (error) {
      return {
        sucesso: false,
        dados: null,
        mensagem: this.tratarErro(error)
      }
    }
  }

  /**
   * Trata erros da API
   */
  static tratarErro(error) {
    if (error.response) {
      // Erro da API com resposta
      switch (error.response.status) {
        case 400:
          return error.response.data.message || 'Dados inválidos'
        case 401:
          return 'Não autorizado. Faça login novamente.'
        case 403:
          return 'Acesso negado'
        case 404:
          return 'Produto não encontrado'
        case 500:
          return 'Erro interno do servidor'
        default:
          return `Erro: ${error.response.status}`
      }
    } else if (error.request) {
      // Erro de rede (sem resposta do servidor)
      return 'Erro de conexão. Verifique se o backend está rodando.'
    } else {
      // Outro tipo de erro
      return 'Erro inesperado'
    }
  }
}
