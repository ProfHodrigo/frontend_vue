<template>
  <div class="env-display">
    <h4>Informacoes do Ambiente</h4>
    <p class="text-muted">Demonstracao de variaveis de ambiente e configuracao</p>
    
    <div class="info-grid">
      <div class="info-card">
        <div class="info-label">Ambiente Atual</div>
        <div class="info-value" :class="envClass">
          {{ ENV.APP_ENV }}
        </div>
      </div>
      
      <div class="info-card">
        <div class="info-label">Titulo da App</div>
        <div class="info-value">{{ ENV.APP_TITLE }}</div>
      </div>
      
      <div class="info-card">
        <div class="info-label">API Base URL</div>
        <div class="info-value code">{{ ENV.API_BASE_URL }}</div>
      </div>
      
      <div class="info-card">
        <div class="info-label">DevTools</div>
        <div class="info-value">
          <span :class="ENV.ENABLE_DEVTOOLS ? 'badge-success' : 'badge-danger'">
            {{ ENV.ENABLE_DEVTOOLS ? 'Habilitado' : 'Desabilitado' }}
          </span>
        </div>
      </div>
      
      <div class="info-card">
        <div class="info-label">Log Level</div>
        <div class="info-value">{{ ENV.LOG_LEVEL }}</div>
      </div>
      
      <div class="info-card">
        <div class="info-label">Build Time</div>
        <div class="info-value code">{{ buildTime }}</div>
      </div>
    </div>

    <!-- Codigo de exemplo -->
    <div class="code-example mt-4">
      <h5>Como usar:</h5>
      <pre><code>import ENV from '@/config/environment'

// Verificar ambiente
if (ENV.isDevelopment) {
  console.log('Modo desenvolvimento')
}

// Usar variaveis
axios.defaults.baseURL = ENV.API_BASE_URL</code></pre>
    </div>
  </div>
</template>

<script>
import ENV from '@/config/environment'

export default {
  name: 'EnvironmentInfo',
  data() {
    return {
      ENV
    }
  },
  computed: {
    envClass() {
      const classes = {
        'development': 'env-dev',
        'staging': 'env-staging',
        'production': 'env-prod'
      }
      return classes[this.ENV.APP_ENV] || 'env-default'
    },
    buildTime() {
      return new Date().toLocaleString('pt-BR')
    }
  }
}
</script>

<style scoped>
.env-display {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
}

.info-card {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 6px;
  border-left: 4px solid #007bff;
}

.info-label {
  font-size: 0.875rem;
  color: #6c757d;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.info-value {
  font-size: 1.125rem;
  color: #212529;
  font-weight: 500;
}

.info-value.code {
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  word-break: break-all;
}

.env-dev {
  color: #28a745;
  font-weight: 700;
}

.env-staging {
  color: #ffc107;
  font-weight: 700;
}

.env-prod {
  color: #dc3545;
  font-weight: 700;
}

.badge-success {
  background: #28a745;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.875rem;
}

.badge-danger {
  background: #dc3545;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.875rem;
}

.code-example {
  background: #2d3748;
  padding: 1.5rem;
  border-radius: 6px;
  color: white;
}

.code-example h5 {
  margin-bottom: 1rem;
  color: #a0aec0;
}

.code-example pre {
  margin: 0;
  overflow-x: auto;
}

.code-example code {
  color: #68d391;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  line-height: 1.6;
}
</style>
