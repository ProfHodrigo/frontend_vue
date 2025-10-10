<template>
  <div class="teste-api">
    <!-- Header -->
    <div class="card mb-4">
      <div class="card-header bg-primary text-white">
        <h4 class="mb-0">
          <i class="fas fa-plug me-2"></i>
          Teste de Comunicação com API Flask
        </h4>
      </div>
      <div class="card-body">
        <p class="mb-0">
          Esta seção demonstra como o Vue.js se comunica com o backend Flask
        </p>
      </div>
    </div>

    <!-- Status da Conexão -->
    <div class="row mb-4">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="fas fa-wifi me-2"></i>
              Status da Conexão
            </h5>
          </div>
          <div class="card-body">
            <div class="d-flex align-items-center gap-3">
              <div 
                class="status-indicator"
                :class="conexao.conectado ? 'online' : 'offline'"
              ></div>
              <div>
                <strong>{{ conexao.conectado ? 'Conectado' : 'Desconectado' }}</strong>
                <br>
                <small class="text-muted">{{ conexao.mensagem }}</small>
              </div>
            </div>
            
            <button 
              class="btn btn-outline-primary btn-sm mt-3"
              @click="testarConexao"
              :disabled="testando"
            >
              <i class="fas fa-sync-alt" :class="{ 'fa-spin': testando }"></i>
              {{ testando ? 'Testando...' : 'Testar Conexão' }}
            </button>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="fas fa-chart-line me-2"></i>
              Estatísticas de Requisições
            </h5>
          </div>
          <div class="card-body">
            <div class="row text-center">
              <div class="col-4">
                <div class="h4 text-success">{{ stats.sucesso }}</div>
                <small class="text-muted">Sucessos</small>
              </div>
              <div class="col-4">
                <div class="h4 text-danger">{{ stats.erro }}</div>
                <small class="text-muted">Erros</small>
              </div>
              <div class="col-4">
                <div class="h4 text-info">{{ stats.total }}</div>
                <small class="text-muted">Total</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Ações de Teste -->
    <div class="card mb-4">
      <div class="card-header">
        <h5 class="mb-0">
          <i class="fas fa-flask me-2"></i>
          Testes de Requisições
        </h5>
      </div>
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-4">
            <button 
              class="btn btn-primary w-100"
              @click="carregarDados"
              :disabled="carregandoDados"
            >
              <i class="fas fa-download" v-if="!carregandoDados"></i>
              <i class="fas fa-spinner fa-spin" v-else></i>
              {{ carregandoDados ? 'Carregando...' : 'Carregar Dados' }}
            </button>
          </div>
          
          <div class="col-md-4">
            <button 
              class="btn btn-warning w-100"
              @click="carregarComDelay"
              :disabled="carregandoComDelay"
            >
              <i class="fas fa-clock" v-if="!carregandoComDelay"></i>
              <i class="fas fa-spinner fa-spin" v-else></i>
              {{ carregandoComDelay ? 'Carregando...' : 'Com Delay (2s)' }}
            </button>
          </div>
          
          <div class="col-md-4">
            <button 
              class="btn btn-danger w-100"
              @click="simularErro"
              :disabled="simulandoErro"
            >
              <i class="fas fa-exclamation-triangle" v-if="!simulandoErro"></i>
              <i class="fas fa-spinner fa-spin" v-else></i>
              {{ simulandoErro ? 'Testando...' : 'Simular Erro' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Resultado das Requisições -->
    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="mb-0">
          <i class="fas fa-terminal me-2"></i>
          Log de Requisições
        </h5>
        <button 
          class="btn btn-sm btn-outline-secondary"
          @click="limparLog"
          v-if="logRequisicoes.length > 0"
        >
          <i class="fas fa-trash"></i> Limpar
        </button>
      </div>
      <div class="card-body">
        <!-- Loading State -->
        <div v-if="carregandoDados || carregandoComDelay || simulandoErro" class="text-center py-4">
          <div class="spinner-border text-primary mb-3" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="text-muted">Processando requisição...</p>
        </div>

        <!-- Log de Requisições -->
        <div v-else-if="logRequisicoes.length > 0" class="log-container">
          <div 
            v-for="(log, index) in logRequisicoes.slice().reverse()" 
            :key="index"
            class="log-entry"
            :class="log.tipo"
          >
            <div class="log-header">
              <i class="fas" :class="{
                'fa-check-circle text-success': log.tipo === 'sucesso',
                'fa-exclamation-circle text-danger': log.tipo === 'erro',
                'fa-info-circle text-info': log.tipo === 'info'
              }"></i>
              <strong>{{ log.titulo }}</strong>
              <small class="text-muted ms-auto">{{ formatarTempo(log.timestamp) }}</small>
            </div>
            <div class="log-body">
              <p class="mb-1">{{ log.mensagem }}</p>
              <div v-if="log.dados" class="mt-2">
                <small class="text-muted">Dados recebidos:</small>
                <div class="dados-preview">
                  <pre class="small">{{ JSON.stringify(log.dados, null, 2) }}</pre>
                </div>
              </div>
              <div v-if="log.detalhes" class="mt-2">
                <details>
                  <summary class="text-muted small" style="cursor: pointer;">Detalhes técnicos</summary>
                  <pre class="small text-muted mt-1">{{ JSON.stringify(log.detalhes, null, 2) }}</pre>
                </details>
              </div>
            </div>
          </div>
        </div>

        <!-- Estado vazio -->
        <div v-else class="text-center py-4 text-muted">
          <i class="fas fa-clipboard-list fa-3x mb-3"></i>
          <p>Nenhuma requisição feita ainda.</p>
          <p class="small">Use os botões acima para testar a comunicação com a API.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { DadosService, api } from '@/services/DadosService'

export default {
  name: 'TesteAPI',
  data() {
    return {
      // Estados de loading
      testando: false,
      carregandoDados: false,
      carregandoComDelay: false,
      simulandoErro: false,
      
      // Conexão
      conexao: {
        conectado: false,
        mensagem: 'Status não verificado'
      },
      
      // Estatísticas
      stats: {
        sucesso: 0,
        erro: 0,
        total: 0
      },
      
      // Log de requisições
      logRequisicoes: []
    }
  },
  async mounted() {
    await this.testarConexao()
  },
  methods: {
    async testarConexao() {
      this.testando = true
      
      const resultado = await DadosService.testarConexao()
      
      this.conexao = {
        conectado: resultado.conectado,
        mensagem: resultado.mensagem
      }
      
      this.adicionarLog(
        resultado.sucesso ? 'sucesso' : 'erro',
        'Teste de Conexão',
        resultado.mensagem,
        resultado.dados || null,
        { status: resultado.status }
      )
      
      this.testando = false
    },

    async carregarDados() {
      this.carregandoDados = true
      
      const resultado = await DadosService.obterDados()
      
      this.adicionarLog(
        resultado.sucesso ? 'sucesso' : 'erro',
        'Carregar Dados',
        resultado.mensagem,
        resultado.dados
      )
      
      this.carregandoDados = false
    },

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
        await api.get('/api/endpoint-inexistente')
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
      return new Date(timestamp).toLocaleTimeString('pt-BR')
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
  animation: pulse 2s infinite;
}

.status-indicator.offline {
  background-color: #dc3545;
  box-shadow: 0 0 8px rgba(220, 53, 69, 0.5);
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.log-container {
  max-height: 500px;
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

.dados-preview pre,
details pre {
  max-height: 200px;
  overflow-y: auto;
  background: #f1f3f4;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 8px;
  margin: 0;
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

.gap-3 {
  gap: 1rem;
}
</style>
