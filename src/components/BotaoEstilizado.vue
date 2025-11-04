<template>
  <div class="botao-estilizado">
    <h4>Botões Estilizados</h4>
    <p class="text-muted">Exemplos de estilização com CSS Scoped e Classes Dinâmicas</p>
    
    <div class="botoes-exemplo">
      <!-- Botões com classes dinâmicas -->
      <button 
        v-for="variante in variantes" 
        :key="variante"
        :class="['btn-custom', `btn-${variante}`]"
        @click="botaoClicado(variante)"
      >
        {{ variante }}
      </button>
    </div>

    <!-- Botões com estados -->
    <div class="mt-4">
      <h5>Estados de Botão</h5>
      <button 
        :class="['btn-estado', { 'ativo': botaoAtivo }]"
        @click="botaoAtivo = !botaoAtivo"
      >
        {{ botaoAtivo ? 'Ativo' : 'Inativo' }}
      </button>
      
      <button 
        :class="['btn-estado', { 'carregando': carregando }]"
        @click="simularCarregamento"
        :disabled="carregando"
      >
        <span v-if="!carregando">Carregar</span>
        <span v-else class="spinner"></span>
      </button>
    </div>

    <!-- Botão com estilo inline dinâmico -->
    <div class="mt-4">
      <h5>Estilo Dinâmico com :style</h5>
      <input 
        v-model="corPersonalizada" 
        type="color" 
        class="form-control mb-2"
        style="width: 100px;"
      >
      <button 
        class="btn-dinamico"
        :style="{ 
          backgroundColor: corPersonalizada,
          color: corTexto
        }"
      >
        Botão com Cor Personalizada
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BotaoEstilizado',
  data() {
    return {
      variantes: ['primary', 'success', 'danger', 'warning', 'info'],
      botaoAtivo: false,
      carregando: false,
      corPersonalizada: '#42b983'
    }
  },
  computed: {
    corTexto() {
      // Calcula cor do texto baseado no brilho da cor de fundo
      const hex = this.corPersonalizada.replace('#', '')
      const r = parseInt(hex.substr(0, 2), 16)
      const g = parseInt(hex.substr(2, 2), 16)
      const b = parseInt(hex.substr(4, 2), 16)
      const brilho = (r * 299 + g * 587 + b * 114) / 1000
      return brilho > 128 ? '#000000' : '#ffffff'
    }
  },
  methods: {
    botaoClicado(variante) {
      console.log(`Botão ${variante} clicado!`)
    },
    async simularCarregamento() {
      this.carregando = true
      await new Promise(resolve => setTimeout(resolve, 2000))
      this.carregando = false
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.botao-estilizado {
  padding: $espacamento-lg;
  background: white;
  border-radius: $raio-borda-md;
  box-shadow: $sombra-md;
}

.botoes-exemplo {
  display: flex;
  flex-wrap: wrap;
  gap: $espacamento-md;
}

/* Botões customizados com SCSS */
.btn-custom {
  padding: $espacamento-sm $espacamento-lg;
  border: none;
  border-radius: $raio-borda-sm;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  font-size: $tamanho-texto-sm;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: $sombra-md;
  }
  
  &:active {
    transform: translateY(0);
  }
}

.btn-primary {
  background: $cor-primaria;
  color: white;
  
  &:hover {
    background: darken($cor-primaria, 10%);
  }
}

.btn-success {
  background: $cor-sucesso;
  color: white;
  
  &:hover {
    background: darken($cor-sucesso, 10%);
  }
}

.btn-danger {
  background: $cor-perigo;
  color: white;
  
  &:hover {
    background: darken($cor-perigo, 10%);
  }
}

.btn-warning {
  background: $cor-aviso;
  color: $cinza-900;
  
  &:hover {
    background: darken($cor-aviso, 10%);
  }
}

.btn-info {
  background: $cor-info;
  color: white;
  
  &:hover {
    background: darken($cor-info, 10%);
  }
}

/* Botões com estados */
.btn-estado {
  padding: $espacamento-sm $espacamento-lg;
  border: 2px solid $cinza-300;
  background: white;
  border-radius: $raio-borda-sm;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-right: $espacamento-md;
  
  &.ativo {
    background: $cor-primaria;
    color: white;
    border-color: $cor-primaria;
  }
  
  &.carregando {
    background: $cinza-200;
    cursor: not-allowed;
  }
}

.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid $cinza-400;
  border-top-color: $cor-primaria;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.btn-dinamico {
  padding: $espacamento-sm $espacamento-lg;
  border: none;
  border-radius: $raio-borda-sm;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    opacity: 0.9;
    transform: scale(1.05);
  }
}

/* Responsividade */
@include responde-para(md) {
  .botoes-exemplo {
    gap: $espacamento-lg;
  }
}
</style>
