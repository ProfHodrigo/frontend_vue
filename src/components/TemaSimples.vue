<template>
  <div class="tema-simples" :class="tema">
    <div class="controle-tema">
      <h4>Sistema de Temas com CSS Variables</h4>
      <div class="tema-botoes">
        <button 
          v-for="t in temas" 
          :key="t"
          @click="alterarTema(t)"
          :class="['btn-tema', { ativo: tema === t }]"
        >
          {{ t }}
        </button>
      </div>
    </div>

    <div class="conteudo-exemplo">
      <div class="card-tema">
        <h3>Card Temático</h3>
        <p>
          Este card muda de aparência automaticamente baseado no tema selecionado.
          As cores são controladas por CSS Custom Properties (variáveis CSS).
        </p>
        <div class="acoes">
          <button class="btn-primario">Ação Primária</button>
          <button class="btn-secundario">Ação Secundária</button>
        </div>
      </div>

      <div class="estatisticas">
        <div class="stat-card">
          <i class="bi bi-people-fill"></i>
          <span class="stat-valor">1,234</span>
          <span class="stat-label">Usuários</span>
        </div>
        <div class="stat-card">
          <i class="bi bi-graph-up"></i>
          <span class="stat-valor">89%</span>
          <span class="stat-label">Crescimento</span>
        </div>
        <div class="stat-card">
          <i class="bi bi-star-fill"></i>
          <span class="stat-valor">4.8</span>
          <span class="stat-label">Avaliação</span>
        </div>
      </div>
    </div>

    <div class="demonstracao-variaveis">
      <h5>Variáveis CSS Ativas:</h5>
      <div class="variaveis-lista">
        <div class="variavel-item">
          <span class="variavel-nome">--cor-primaria</span>
          <span class="variavel-valor" :style="{ background: 'var(--cor-primaria)' }"></span>
        </div>
        <div class="variavel-item">
          <span class="variavel-nome">--cor-secundaria</span>
          <span class="variavel-valor" :style="{ background: 'var(--cor-secundaria)' }"></span>
        </div>
        <div class="variavel-item">
          <span class="variavel-nome">--cor-fundo</span>
          <span class="variavel-valor" :style="{ background: 'var(--cor-fundo)' }"></span>
        </div>
        <div class="variavel-item">
          <span class="variavel-nome">--cor-texto</span>
          <span class="variavel-valor" :style="{ background: 'var(--cor-texto)' }"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TemaSimples',
  data() {
    return {
      tema: 'light',
      temas: ['light', 'dark', 'ocean', 'forest']
    }
  },
  mounted() {
    // Recupera tema salvo
    const temaSalvo = localStorage.getItem('tema')
    if (temaSalvo && this.temas.includes(temaSalvo)) {
      this.tema = temaSalvo
    }
  },
  methods: {
    alterarTema(novoTema) {
      this.tema = novoTema
      localStorage.setItem('tema', novoTema)
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

/* Temas usando CSS Custom Properties */
.tema-simples {
  padding: $espacamento-lg;
  border-radius: $raio-borda-md;
  transition: all 0.3s ease;
  
  /* Tema Light (padrão) */
  &.light {
    --cor-primaria: #42b983;
    --cor-secundaria: #2c3e50;
    --cor-fundo: #ffffff;
    --cor-fundo-alt: #f8f9fa;
    --cor-texto: #2c3e50;
    --cor-texto-secundario: #6c757d;
    --cor-borda: #dee2e6;
  }
  
  /* Tema Dark */
  &.dark {
    --cor-primaria: #64ffda;
    --cor-secundaria: #7c4dff;
    --cor-fundo: #1a1a2e;
    --cor-fundo-alt: #16213e;
    --cor-texto: #eaeaea;
    --cor-texto-secundario: #a8a8a8;
    --cor-borda: #2d3748;
  }
  
  /* Tema Ocean */
  &.ocean {
    --cor-primaria: #0077be;
    --cor-secundaria: #00a8e8;
    --cor-fundo: #e8f4f8;
    --cor-fundo-alt: #d4ebf2;
    --cor-texto: #003459;
    --cor-texto-secundario: #00608a;
    --cor-borda: #90caf9;
  }
  
  /* Tema Forest */
  &.forest {
    --cor-primaria: #2d6a4f;
    --cor-secundaria: #52b788;
    --cor-fundo: #f1f8f4;
    --cor-fundo-alt: #d8f3dc;
    --cor-texto: #1b4332;
    --cor-texto-secundario: #40916c;
    --cor-borda: #95d5b2;
  }
  
  background: var(--cor-fundo);
  color: var(--cor-texto);
}

.controle-tema {
  margin-bottom: $espacamento-xl;
  
  h4 {
    color: var(--cor-texto);
    margin-bottom: $espacamento-md;
  }
}

.tema-botoes {
  display: flex;
  gap: $espacamento-sm;
  flex-wrap: wrap;
}

.btn-tema {
  padding: $espacamento-sm $espacamento-lg;
  background: var(--cor-fundo-alt);
  color: var(--cor-texto);
  border: 2px solid var(--cor-borda);
  border-radius: $raio-borda-sm;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  text-transform: capitalize;
  
  &:hover {
    background: var(--cor-primaria);
    color: white;
    border-color: var(--cor-primaria);
    transform: translateY(-2px);
  }
  
  &.ativo {
    background: var(--cor-primaria);
    color: white;
    border-color: var(--cor-primaria);
  }
}

.conteudo-exemplo {
  margin-bottom: $espacamento-xl;
}

.card-tema {
  background: var(--cor-fundo-alt);
  border: 1px solid var(--cor-borda);
  border-radius: $raio-borda-md;
  padding: $espacamento-xl;
  margin-bottom: $espacamento-lg;
  
  h3 {
    color: var(--cor-texto);
    margin-bottom: $espacamento-md;
  }
  
  p {
    color: var(--cor-texto-secundario);
    margin-bottom: $espacamento-lg;
  }
}

.acoes {
  display: flex;
  gap: $espacamento-md;
  flex-wrap: wrap;
}

.btn-primario, .btn-secundario {
  padding: $espacamento-sm $espacamento-lg;
  border: none;
  border-radius: $raio-borda-sm;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: $sombra-md;
  }
}

.btn-primario {
  background: var(--cor-primaria);
  color: white;
}

.btn-secundario {
  background: transparent;
  color: var(--cor-texto);
  border: 2px solid var(--cor-borda);
  
  &:hover {
    background: var(--cor-secundaria);
    color: white;
    border-color: var(--cor-secundaria);
  }
}

.estatisticas {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: $espacamento-md;
  margin-bottom: $espacamento-lg;
}

.stat-card {
  background: var(--cor-fundo-alt);
  border: 1px solid var(--cor-borda);
  border-radius: $raio-borda-md;
  padding: $espacamento-lg;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: $sombra-lg;
  }
  
  i {
    font-size: 2rem;
    color: var(--cor-primaria);
    display: block;
    margin-bottom: $espacamento-sm;
  }
  
  .stat-valor {
    display: block;
    font-size: $tamanho-texto-xxl;
    font-weight: 700;
    color: var(--cor-texto);
    margin-bottom: $espacamento-xs;
  }
  
  .stat-label {
    display: block;
    font-size: $tamanho-texto-sm;
    color: var(--cor-texto-secundario);
  }
}

.demonstracao-variaveis {
  background: var(--cor-fundo-alt);
  border: 1px solid var(--cor-borda);
  border-radius: $raio-borda-md;
  padding: $espacamento-lg;
  
  h5 {
    color: var(--cor-texto);
    margin-bottom: $espacamento-md;
  }
}

.variaveis-lista {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: $espacamento-md;
}

.variavel-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $espacamento-sm;
  background: var(--cor-fundo);
  border-radius: $raio-borda-sm;
  
  .variavel-nome {
    font-family: $fonte-mono;
    font-size: $tamanho-texto-xs;
    color: var(--cor-texto-secundario);
  }
  
  .variavel-valor {
    width: 40px;
    height: 24px;
    border-radius: $raio-borda-sm;
    border: 1px solid var(--cor-borda);
  }
}

/* Responsividade */
@include responde-para(sm) {
  .estatisticas {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
