/**
 * Configuracao de Ambiente
 * Centraliza acesso as variaveis de ambiente
 */

export const ENV = {
  APP_TITLE: import.meta.env.VITE_APP_TITLE || 'Vue App',
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',
  APP_ENV: import.meta.env.VITE_APP_ENV || 'development',
  ENABLE_DEVTOOLS: import.meta.env.VITE_ENABLE_DEVTOOLS === 'true',
  LOG_LEVEL: import.meta.env.VITE_LOG_LEVEL || 'info',
  SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
  GTM_ID: import.meta.env.VITE_GTM_ID,
  
  // Propriedades computadas
  get isDevelopment() {
    return this.APP_ENV === 'development'
  },
  
  get isProduction() {
    return this.APP_ENV === 'production'
  },
  
  get isStaging() {
    return this.APP_ENV === 'staging'
  }
}

// Validar variaveis obrigatorias em producao
if (ENV.isProduction) {
  const required = ['VITE_API_BASE_URL']
  const missing = required.filter(key => !import.meta.env[key])
  
  if (missing.length > 0) {
    console.error('Variaveis de ambiente faltando:', missing)
  }
}

export default ENV
