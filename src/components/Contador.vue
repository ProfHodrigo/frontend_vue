<template>
  <div class="contador-card">
    <div class="card">
      <div class="card-header bg-primary text-white">
        <h4 class="mb-0">
          <i class="fas fa-calculator me-2"></i>
          Exercício 1 - Contador Personalizado
        </h4>
      </div>
      <div class="card-body text-center">
        <!-- Display do contador -->
        <div class="contador-display mb-4">
          <h1 class="display-1 fw-bold" :class="contadorClass">
            {{ contador }}
          </h1>
          <p class="lead text-muted">{{ mensagem }}</p>
        </div>

        <!-- Botões de controle -->
        <div class="d-flex justify-content-center gap-2 flex-wrap">
          <button 
            class="btn btn-danger"
            @click="diminuir(5)"
            :disabled="contador < 5"
          >
            <i class="fas fa-minus-circle"></i> -5
          </button>
          
          <button 
            class="btn btn-warning"
            @click="diminuir(1)"
            :disabled="contador === 0"
          >
            <i class="fas fa-minus"></i> -1
          </button>
          
          <button 
            class="btn btn-secondary"
            @click="resetar"
          >
            <i class="fas fa-undo"></i> Reset
          </button>
          
          <button 
            class="btn btn-success"
            @click="aumentar(1)"
          >
            <i class="fas fa-plus"></i> +1
          </button>
          
          <button 
            class="btn btn-primary"
            @click="aumentar(5)"
          >
            <i class="fas fa-plus-circle"></i> +5
          </button>
        </div>

        <!-- Mensagem especial ao chegar em 10 -->
        <div 
          v-if="contador >= 10" 
          class="alert alert-success mt-4 animate-bounce"
        >
          <i class="fas fa-trophy me-2"></i>
          <strong>Parabéns!</strong> Você chegou a {{ contador }}! 🎉
        </div>

        <!-- Informações adicionais -->
        <div class="mt-4">
          <small class="text-muted">
            <i class="fas fa-info-circle me-1"></i>
            O contador não permite valores negativos
          </small>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Contador',
  data() {
    return {
      contador: 0
    }
  },
  computed: {
    mensagem() {
      if (this.contador === 0) {
        return 'Comece incrementando o contador!'
      } else if (this.contador < 5) {
        return 'Continue assim!'
      } else if (this.contador < 10) {
        return 'Quase lá...'
      } else if (this.contador === 10) {
        return 'Perfeito! Você chegou a 10!'
      } else {
        return 'Incrível! Você passou de 10!'
      }
    },
    contadorClass() {
      if (this.contador === 0) {
        return 'text-secondary'
      } else if (this.contador < 10) {
        return 'text-primary'
      } else {
        return 'text-success'
      }
    }
  },
  methods: {
    aumentar(valor) {
      this.contador += valor
    },
    diminuir(valor) {
      // Não permite valores negativos
      if (this.contador - valor >= 0) {
        this.contador -= valor
      } else {
        this.contador = 0
        alert('⚠️ O contador não pode ser negativo!')
      }
    },
    resetar() {
      this.contador = 0
    }
  }
}
</script>

<style scoped>
.contador-card {
  margin-bottom: 2rem;
}

.contador-display {
  padding: 2rem 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 10px;
}

.animate-bounce {
  animation: bounce 0.5s ease infinite alternate;
}

@keyframes bounce {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-5px);
  }
}

.btn {
  min-width: 80px;
}
</style>
