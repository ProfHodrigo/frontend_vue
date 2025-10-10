<template>
  <div class="avaliacao-produto card">
    <div class="card-header bg-warning text-dark">
      <h4 class="mb-0">
        <i class="fas fa-star me-2"></i>
        Exercício 1 - Sistema de Avaliações
      </h4>
    </div>
    <div class="card-body">
      <!-- Informações do Produto -->
      <div class="produto-info mb-4">
        <h5>{{ produto.nome }}</h5>
        <p class="text-muted">{{ produto.descricao }}</p>
      </div>

      <!-- Avaliação Atual -->
      <div class="avaliacao-atual mb-4 p-3 bg-light rounded">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h6 class="mb-1">Avaliação Média</h6>
            <div class="estrelas-display">
              <i 
                v-for="n in 5" 
                :key="n"
                class="fas fa-star"
                :class="n <= mediaAvaliacoes ? 'text-warning' : 'text-muted'"
              ></i>
              <span class="ms-2 h5 mb-0">{{ mediaAvaliacoes.toFixed(1) }}</span>
            </div>
          </div>
          <div class="text-end">
            <small class="text-muted">{{ totalAvaliacoes }} avaliações</small>
          </div>
        </div>
      </div>

      <!-- Formulário de Nova Avaliação -->
      <div class="nova-avaliacao mb-4">
        <h6 class="mb-3">Deixe sua avaliação</h6>
        
        <div class="mb-3">
          <label class="form-label">Estrelas:</label>
          <div class="estrelas-input">
            <i 
              v-for="n in 5" 
              :key="n"
              class="fas fa-star fa-2x"
              :class="n <= novaAvaliacao.nota ? 'text-warning' : 'text-muted'"
              @click="novaAvaliacao.nota = n"
              @mouseenter="notaHover = n"
              @mouseleave="notaHover = 0"
              style="cursor: pointer;"
            ></i>
          </div>
          <small class="text-muted d-block mt-1">
            {{ notaTexto }}
          </small>
        </div>

        <div class="mb-3">
          <label class="form-label">Nome:</label>
          <input 
            v-model="novaAvaliacao.nome"
            type="text"
            class="form-control"
            placeholder="Seu nome"
            required
          >
        </div>

        <div class="mb-3">
          <label class="form-label">Comentário (opcional):</label>
          <textarea 
            v-model="novaAvaliacao.comentario"
            class="form-control"
            rows="3"
            placeholder="Conte-nos sobre sua experiência..."
          ></textarea>
        </div>

        <button 
          @click="adicionarAvaliacao"
          class="btn btn-warning w-100"
          :disabled="!novaAvaliacao.nota || !novaAvaliacao.nome"
        >
          <i class="fas fa-paper-plane me-2"></i>
          Enviar Avaliação
        </button>
      </div>

      <!-- Lista de Avaliações -->
      <div class="lista-avaliacoes">
        <h6 class="mb-3">
          Avaliações ({{ avaliacoes.length }})
        </h6>

        <div v-if="avaliacoes.length === 0" class="text-center py-4">
          <i class="fas fa-comment-slash fa-3x text-muted mb-3"></i>
          <p class="text-muted">Ainda não há avaliações. Seja o primeiro!</p>
        </div>

        <div 
          v-for="(avaliacao, index) in avaliacoes" 
          :key="index"
          class="avaliacao-item mb-3 p-3 border rounded"
        >
          <div class="d-flex justify-content-between align-items-start mb-2">
            <div>
              <strong>{{ avaliacao.nome }}</strong>
              <div class="estrelas-pequenas">
                <i 
                  v-for="n in 5" 
                  :key="n"
                  class="fas fa-star fa-sm"
                  :class="n <= avaliacao.nota ? 'text-warning' : 'text-muted'"
                ></i>
              </div>
            </div>
            <small class="text-muted">{{ formatarData(avaliacao.data) }}</small>
          </div>
          <p class="mb-0" v-if="avaliacao.comentario">{{ avaliacao.comentario }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AvaliacaoProduto',
  props: {
    produto: {
      type: Object,
      required: true,
      default: () => ({
        nome: 'Produto Exemplo',
        descricao: 'Descrição do produto'
      })
    }
  },
  emits: ['avaliacao-adicionada'],
  data() {
    return {
      avaliacoes: [],
      novaAvaliacao: {
        nota: 0,
        nome: '',
        comentario: ''
      },
      notaHover: 0
    }
  },
  computed: {
    totalAvaliacoes() {
      return this.avaliacoes.length
    },
    mediaAvaliacoes() {
      if (this.totalAvaliacoes === 0) return 0
      const soma = this.avaliacoes.reduce((acc, av) => acc + av.nota, 0)
      return soma / this.totalAvaliacoes
    },
    notaTexto() {
      const nota = this.notaHover || this.novaAvaliacao.nota
      const textos = {
        0: 'Selecione uma nota',
        1: 'Muito ruim',
        2: 'Ruim',
        3: 'Regular',
        4: 'Bom',
        5: 'Excelente'
      }
      return textos[nota] || 'Selecione uma nota'
    }
  },
  methods: {
    adicionarAvaliacao() {
      if (this.novaAvaliacao.nota > 0 && this.novaAvaliacao.nome.trim()) {
        const avaliacao = {
          ...this.novaAvaliacao,
          data: new Date(),
          produto: this.produto.nome
        }
        
        this.avaliacoes.unshift(avaliacao)
        this.$emit('avaliacao-adicionada', avaliacao)
        
        // Resetar formulário
        this.novaAvaliacao = {
          nota: 0,
          nome: '',
          comentario: ''
        }
        
        alert('✅ Avaliação enviada com sucesso!')
      }
    },
    formatarData(data) {
      const agora = new Date()
      const diff = Math.floor((agora - data) / 1000) // diferença em segundos
      
      if (diff < 60) return 'Agora mesmo'
      if (diff < 3600) return `${Math.floor(diff / 60)} minutos atrás`
      if (diff < 86400) return `${Math.floor(diff / 3600)} horas atrás`
      return `${Math.floor(diff / 86400)} dias atrás`
    }
  }
}
</script>

<style scoped>
.avaliacao-produto {
  margin-bottom: 2rem;
}

.estrelas-display i,
.estrelas-pequenas i {
  margin-right: 2px;
}

.estrelas-input i {
  margin-right: 8px;
  transition: all 0.2s ease;
}

.estrelas-input i:hover {
  transform: scale(1.2);
}

.avaliacao-item {
  background-color: #f8f9fa;
  transition: all 0.3s ease;
}

.avaliacao-item:hover {
  background-color: #e9ecef;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
