<template>
  <div class="card-responsivo">
    <h4>Cards Responsivos</h4>
    <p class="text-muted">Grid responsivo usando Bootstrap 5</p>
    
    <div class="row g-3">
      <div 
        v-for="card in cards" 
        :key="card.id"
        class="col-12 col-sm-6 col-md-4 col-lg-3"
      >
        <div class="card h-100">
          <div class="card-imagem" :style="{ backgroundColor: card.cor }">
            <i :class="card.icone" class="icone-card"></i>
          </div>
          <div class="card-body">
            <h5 class="card-title">{{ card.titulo }}</h5>
            <p class="card-descricao">{{ card.descricao }}</p>
            <div class="card-footer-custom">
              <span class="badge">{{ card.categoria }}</span>
              <button class="btn-pequeno">Ver mais</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Demonstração de Flexbox -->
    <div class="mt-5">
      <h5>Layout com Flexbox</h5>
      <div class="flex-container">
        <div class="flex-item">Item 1</div>
        <div class="flex-item">Item 2</div>
        <div class="flex-item">Item 3</div>
      </div>
    </div>

    <!-- Demonstração de Grid CSS -->
    <div class="mt-4">
      <h5>Layout com CSS Grid</h5>
      <div class="grid-container">
        <div class="grid-item header">Header</div>
        <div class="grid-item sidebar">Sidebar</div>
        <div class="grid-item content">Content</div>
        <div class="grid-item footer">Footer</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CardResponsivo',
  data() {
    return {
      cards: [
        {
          id: 1,
          titulo: 'Design',
          descricao: 'Crie interfaces incríveis',
          icone: 'bi bi-palette-fill',
          cor: '#FF6B6B',
          categoria: 'UI/UX'
        },
        {
          id: 2,
          titulo: 'Desenvolvimento',
          descricao: 'Código limpo e eficiente',
          icone: 'bi bi-code-slash',
          cor: '#4ECDC4',
          categoria: 'Frontend'
        },
        {
          id: 3,
          titulo: 'Performance',
          descricao: 'Otimização avançada',
          icone: 'bi bi-speedometer2',
          cor: '#45B7D1',
          categoria: 'DevOps'
        },
        {
          id: 4,
          titulo: 'Segurança',
          descricao: 'Proteção de dados',
          icone: 'bi bi-shield-check',
          cor: '#96CEB4',
          categoria: 'Security'
        }
      ]
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.card-responsivo {
  padding: $espacamento-lg;
}

/* Cards customizados */
.card {
  border: none;
  border-radius: $raio-borda-md;
  overflow: hidden;
  @include card-hover;
  
  .card-imagem {
    height: 150px;
    @include flex-center;
    
    .icone-card {
      font-size: 3rem;
      color: white;
    }
  }
  
  .card-body {
    padding: $espacamento-lg;
    display: flex;
    flex-direction: column;
  }
  
  .card-title {
    color: $cinza-900;
    font-weight: 700;
    margin-bottom: $espacamento-sm;
  }
  
  .card-descricao {
    color: $cinza-600;
    font-size: $tamanho-texto-sm;
    flex: 1;
    margin-bottom: $espacamento-md;
  }
  
  .card-footer-custom {
    @include flex-between;
    margin-top: auto;
    
    .badge {
      background: $cinza-200;
      color: $cinza-700;
      padding: $espacamento-xs $espacamento-sm;
      border-radius: $raio-borda-sm;
      font-size: 0.7rem;
      font-weight: 600;
    }
    
    .btn-pequeno {
      background: transparent;
      border: 1px solid $cinza-300;
      padding: $espacamento-xs $espacamento-sm;
      border-radius: $raio-borda-sm;
      font-size: $tamanho-texto-xs;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover {
        background: $cor-primaria;
        color: white;
        border-color: $cor-primaria;
      }
    }
  }
}

/* Flexbox Demo */
.flex-container {
  display: flex;
  gap: $espacamento-md;
  padding: $espacamento-md;
  background: $cinza-100;
  border-radius: $raio-borda-md;
  
  /* Responsivo: empilha em telas pequenas */
  flex-wrap: wrap;
  
  @include responde-para(md) {
    flex-wrap: nowrap;
  }
}

.flex-item {
  flex: 1;
  min-width: 150px;
  padding: $espacamento-lg;
  background: white;
  border-radius: $raio-borda-sm;
  text-align: center;
  font-weight: 600;
  box-shadow: $sombra-sm;
}

/* Grid CSS Demo */
.grid-container {
  display: grid;
  gap: $espacamento-md;
  padding: $espacamento-md;
  background: $cinza-100;
  border-radius: $raio-borda-md;
  
  /* Mobile: 1 coluna */
  grid-template-columns: 1fr;
  grid-template-areas:
    "header"
    "sidebar"
    "content"
    "footer";
  
  /* Tablet: 2 colunas */
  @include responde-para(md) {
    grid-template-columns: 200px 1fr;
    grid-template-areas:
      "header header"
      "sidebar content"
      "footer footer";
  }
  
  /* Desktop: mantém layout */
  @include responde-para(lg) {
    grid-template-columns: 250px 1fr;
  }
}

.grid-item {
  padding: $espacamento-lg;
  background: white;
  border-radius: $raio-borda-sm;
  font-weight: 600;
  text-align: center;
  box-shadow: $sombra-sm;
  
  &.header { 
    grid-area: header;
    background: $cor-primaria;
    color: white;
  }
  &.sidebar { 
    grid-area: sidebar;
    background: $cinza-200;
  }
  &.content { 
    grid-area: content;
    min-height: 150px;
  }
  &.footer { 
    grid-area: footer;
    background: $cinza-800;
    color: white;
  }
}
</style>
