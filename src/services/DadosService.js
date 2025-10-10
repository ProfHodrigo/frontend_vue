import api from './api'

export class DadosService {
  /**
   * Testa conectividade com o backend (endpoint público)
   */
  static async testarConexao() {
    try {
      const response = await api.get('/api/teste', { 
        timeout: 3000 // Timeout menor para teste rápido
      })
      return {
        sucesso: true,
        conectado: true,
        status: response.status,
        dados: response.data,
        mensagem: 'Backend conectado e funcionando'
      }
    } catch (error) {
      return {
        sucesso: false,
        conectado: false,
        status: error.response?.status || 0,
        mensagem: error.code === 'ECONNREFUSED' ? 
          'Backend não está rodando' : 
          'Erro de conectividade'
      }
    }
  }

  /**
   * Busca dados básicos da API (requer autenticação JWT)
   */
  static async obterDados() {
    try {
      const response = await api.get('/api/dados')
      return {
        sucesso: true,
        dados: response.data,
        mensagem: 'Dados carregados com sucesso'
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
   * Simula requisição com delay (para demonstração)
   */
  static async dadosComDelay(delayMs = 2000) {
    try {
      // Simular loading state
      await new Promise(resolve => setTimeout(resolve, delayMs))
      
      const response = await api.get('/api/teste')
      return {
        sucesso: true,
        dados: response.data,
        mensagem: `Dados carregados após ${delayMs}ms`
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
   * Trata erros de forma padronizada
   */
  static tratarErro(error) {
    if (error.response) {
      // Erro da API
      const status = error.response.status
      const message = error.response.data?.message || 
                     error.response.data?.error || 
                     'Erro desconhecido'
      
      switch (status) {
        case 400: return `Erro de validação: ${message}`
        case 401: return 'Não autorizado - Faça login'
        case 403: return 'Acesso negado'
        case 404: return 'Endpoint não encontrado'
        case 500: return 'Erro interno do servidor'
        default: return `Erro HTTP ${status}: ${message}`
      }
    } else if (error.request) {
      // Erro de rede
      if (error.code === 'ECONNREFUSED') {
        return 'Conexão recusada - Backend não está rodando'
      } else if (error.code === 'ECONNABORTED') {
        return 'Timeout - Servidor demorou para responder'
      } else {
        return 'Erro de conexão - Verifique sua internet'
      }
    } else {
      return `Erro inesperado: ${error.message}`
    }
  }
}

// Exportar também a instância do api para uso direto
export { api }
