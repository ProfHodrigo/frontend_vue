<template>
  <div class="card h-100 shadow-sm">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-start mb-2">
        <h5 class="card-title">{{ produto.nome }}</h5>
        <span 
          class="badge"
          :class="badgeClass"
        >
          {{ statusTexto }}
        </span>
      </div>
      
      <p class="card-text text-muted">{{ produto.descricao }}</p>
      
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <span class="h4 text-primary">R$ {{ produto.preco.toFixed(2) }}</span>
          <small class="text-muted d-block">Em estoque: {{ produto.estoque }}</small>
        </div>
        
        <div>
          <button 
            class="btn btn-outline-primary btn-sm me-2"
            @click="$emit('visualizar', produto)"
          >
            <i class="fas fa-eye"></i>
          </button>
          
          <button 
            class="btn btn-primary btn-sm"
            :disabled="produto.estoque === 0"
            @click="adicionarCarrinho"
          >
            <i class="fas fa-cart-plus"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CartaoProduto',
  props: {
    produto: {
      type: Object,
      required: true,
      validator(produto) {
        return produto && produto.nome && produto.preco >= 0
      }
    }
  },
  emits: ['adicionar-carrinho', 'visualizar'],
  computed: {
    statusTexto() {
      if (this.produto.estoque === 0) return 'Esgotado'
      if (this.produto.estoque <= 5) return 'Últimas unidades'
      return 'Disponível'
    },
    badgeClass() {
      if (this.produto.estoque === 0) return 'bg-danger'
      if (this.produto.estoque <= 5) return 'bg-warning'
      return 'bg-success'
    }
  },
  methods: {
    adicionarCarrinho() {
      this.$emit('adicionar-carrinho', this.produto)
    }
  }
}
</script>

<style scoped>
.card {
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.card-text {
  font-size: 0.9rem;
  min-height: 40px;
}
</style>
