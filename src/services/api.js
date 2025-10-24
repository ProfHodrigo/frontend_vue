import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000', // ajustem de acordo com o link do backend de vocês
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para adicionar token JWT no header Authorization
api.interceptors.request.use(config => {
  try {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
  } catch (e) {
    // no-op
  }
  return config
}, error => Promise.reject(error))

export default api
