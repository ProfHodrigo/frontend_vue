<template>
  <div id="app">
    <!-- Header da aplicação -->
    <header class="bg-primary text-white py-3 mb-4">
      <div class="container">
        <h1 class="mb-0">
          <i class="fas fa-graduation-cap me-2"></i>
          Frontend Vue.js - Aula 2
        </h1>
        <p class="mb-0 opacity-75">Componentes e Diretivas</p>
      </div>
    </header>

    <!-- Conteúdo principal -->
    <div class="container">
      <!-- Navegação entre seções -->
      <div class="mb-4">
        <div class="btn-group w-100" role="group">
          <button 
            @click="secaoAtiva = 'lista'"
            class="btn"
            :class="secaoAtiva === 'lista' ? 'btn-primary' : 'btn-outline-primary'"
          >
            <i class="fas fa-shopping-bag me-2"></i>
            Lista de Produtos
          </button>
          <button 
            @click="secaoAtiva = 'avaliacao'"
            class="btn"
            :class="secaoAtiva === 'avaliacao' ? 'btn-primary' : 'btn-outline-primary'"
          >
            <i class="fas fa-star me-2"></i>
            Avaliações
          </button>
          <button 
            @click="secaoAtiva = 'carrinho'"
            class="btn"
            :class="secaoAtiva === 'carrinho' ? 'btn-primary' : 'btn-outline-primary'"
          >
            <i class="fas fa-shopping-cart me-2"></i>
            Carrinho
          </button>
        </div>
      </div>

      <!-- Seção: Lista de Produtos -->
      <div v-show="secaoAtiva === 'lista'">
        <ListaProdutos @produto-adicionado="handleProdutoAdicionado" />
      </div>

      <!-- Seção: Avaliação de Produto -->
      <div v-show="secaoAtiva === 'avaliacao'">
        <AvaliacaoProduto 
          :produto="produtoExemplo"
          @avaliacao-adicionada="handleAvaliacaoAdicionada"
        />
      </div>

      <!-- Seção: Carrinho de Compras -->
      <div v-show="secaoAtiva === 'carrinho'">
        <CarrinhoCompras 
          @finalizar-compra="handleFinalizarCompra"
          @voltar-compras="secaoAtiva = 'lista'"
        />
      </div>

      <!-- Sidebar com informações -->
      <div class="row mt-4">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="fas fa-info-circle me-2"></i>
                Aula 2 - Conceitos
              </h5>
            </div>
            <div class="card-body">
              <ul class="list-unstyled">
                <li><i class="fas fa-check text-success me-2"></i>Diretivas (v-if, v-for, v-show)</li>
                <li><i class="fas fa-check text-success me-2"></i>Componentes Reutilizáveis</li>
                <li><i class="fas fa-check text-success me-2"></i>Props e Emits</li>
                <li><i class="fas fa-check text-success me-2"></i>Comunicação entre Componentes</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h6 class="mb-0">
                <i class="fas fa-list-check me-2"></i>
                Componentes Criados
              </h6>
            </div>
            <div class="card-body">
              <ul class="list-unstyled small">
                <li><i class="fas fa-puzzle-piece text-primary me-2"></i>CartaoProduto.vue</li>
                <li><i class="fas fa-puzzle-piece text-primary me-2"></i>ListaProdutos.vue</li>
                <li><i class="fas fa-puzzle-piece text-primary me-2"></i>AvaliacaoProduto.vue</li>
                <li><i class="fas fa-puzzle-piece text-primary me-2"></i>ItemTarefa.vue</li>
                <li><i class="fas fa-puzzle-piece text-primary me-2"></i>CarrinhoCompras.vue</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="bg-light text-center py-3 mt-5">
      <div class="container">
        <p class="text-muted mb-0">
          Curso Vue.js - Prof. Rodrigo | 
          <a href="https://vuejs.org/" target="_blank" class="text-decoration-none">
            Documentação Vue.js
          </a>
        </p>
      </div>
    </footer>
  </div>
</template>

<script>
import ListaProdutos from './components/ListaProdutos.vue'
import AvaliacaoProduto from './components/AvaliacaoProduto.vue'
import CarrinhoCompras from './components/CarrinhoCompras.vue'

export default {
  name: 'App',
  components: {
    ListaProdutos,
    AvaliacaoProduto,
    CarrinhoCompras
  },
  data() {
    return {
      secaoAtiva: 'lista',
      produtoExemplo: {
        nome: 'Notebook Dell Inspiron',
        descricao: 'Notebook de alta performance para trabalho e estudos'
      }
    }
  },
  methods: {
    handleProdutoAdicionado(produto) {
      console.log('Produto adicionado ao carrinho:', produto)
    },
    handleAvaliacaoAdicionada(avaliacao) {
      console.log('Nova avaliação:', avaliacao)
    },
    handleFinalizarCompra(resumo) {
      console.log('Compra finalizada:', resumo)
    }
  }
}
</script>

<style>
/* Estilos globais da aplicação */
body {
  margin: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.container {
  flex: 1;
}

/* Animações suaves */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Estilos customizados */
.card {
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  border: none;
}

.bg-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
}
</style>