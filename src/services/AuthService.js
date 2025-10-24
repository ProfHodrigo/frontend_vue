import api from './api'

export class AuthService {
  static async login(credentials) {
    try {
      const response = await api.post('/login', credentials)
      const { access_token, user } = response.data
      localStorage.setItem('authToken', access_token)
      localStorage.setItem('userData', JSON.stringify(user))
      return {
        sucesso: true,
        token: access_token,
        usuario: user,
        mensagem: 'Login realizado com sucesso!'
      }
    } catch (error) {
      return {
        sucesso: false,
        token: null,
        usuario: null,
        mensagem: this.tratarErroAuth(error)
      }
    }
  }

  static async cadastrar(dadosUsuario) {
    try {
      const response = await api.post('/form', dadosUsuario)
      return {
        sucesso: true,
        dados: response.data,
        mensagem: 'Cadastro realizado com sucesso! Faça login para continuar.'
      }
    } catch (error) {
      return {
        sucesso: false,
        dados: null,
        mensagem: this.tratarErroAuth(error)
      }
    }
  }

  static logout() {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userData')
    window.location.href = '/'
    return {
      sucesso: true,
      mensagem: 'Logout realizado com sucesso!'
    }
  }

  static isAuthenticated() {
    const token = localStorage.getItem('authToken')
    if (!token) return false
    try {
      const payload = this.parseJWT(token)
      const now = Date.now() / 1000
      return payload.exp > now
    } catch (error) {
      console.error('Erro ao verificar token:', error)
      return false
    }
  }

  static getCurrentUser() {
    const userData = localStorage.getItem('userData')
    if (!userData) return null
    try {
      return JSON.parse(userData)
    } catch (error) {
      console.error('Erro ao parsear dados do usuário:', error)
      return null
    }
  }

  static getToken() {
    return localStorage.getItem('authToken')
  }

  static async obterPerfil() {
    try {
      const response = await api.get('/api/perfil')
      localStorage.setItem('userData', JSON.stringify(response.data))
      return {
        sucesso: true,
        usuario: response.data,
        mensagem: 'Perfil carregado com sucesso'
      }
    } catch (error) {
      return {
        sucesso: false,
        usuario: null,
        mensagem: this.tratarErroAuth(error)
      }
    }
  }

  static parseJWT(token) {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  }

  static tratarErroAuth(error) {
    if (error?.response) {
      const status = error.response.status
      const data = error.response.data
      switch (status) {
        case 400:
          return data.message || 'Dados inválidos. Verifique os campos.'
        case 401:
          return data.message || 'Não autorizado. Faça login novamente.'
        case 403:
          return 'Acesso negado. Verifique suas permissões.'
        case 422:
          return data.message || 'Dados de cadastro inválidos.'
        case 429:
          return 'Muitas tentativas. Tente novamente em alguns minutos.'
        default:
          return `Erro no servidor (${status}). Tente novamente.`
      }
    } else if (error?.request) {
      return 'Erro de conexão. Verifique se o servidor está rodando.'
    } else {
      return `Erro inesperado: ${error?.message}`
    }
  }

  static async refreshUserData() {
    if (!this.isAuthenticated()) {
      return { sucesso: false, mensagem: 'Usuário não autenticado' }
    }
    return await this.obterPerfil()
  }
}

export default AuthService
