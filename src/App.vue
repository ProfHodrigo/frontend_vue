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

    <!-- Exercício 1: Sistema de Avaliações -->
    <div class="container position-relative">
      <!-- Botão flutuante do carrinho -->
      <button 
        class="btn btn-warning position-fixed" 
        style="top: 90px; right: 30px; z-index: 1050; border-radius: 50%; width: 56px; height: 56px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);"
        @click="abrirCarrinho"
        title="Abrir carrinho"
      >
        <i class="fas fa-shopping-cart"></i>
      </button>

      <ListaProdutos @produto-adicionado="handleProdutoAdicionado" @visualizar-produto="handleVisualizarProduto" />
      <AvaliacaoProduto 
        v-if="produtoSelecionado"
        :produto="produtoSelecionado"
        @avaliacao-adicionada="handleAvaliacaoAdicionada"
        @fechar="produtoSelecionado = null"
      />

      <!-- Slider lateral do carrinho (placeholder) -->
      <transition name="slide-cart">
        <div v-if="carrinhoAberto" class="cart-slider bg-white shadow position-fixed" style="top:0; right:0; height:100vh; width:350px; z-index:1100;">
          <div class="d-flex justify-content-between align-items-center p-3 border-bottom">
            <h5 class="mb-0"><i class="fas fa-shopping-cart me-2"></i>Carrinho</h5>
            <button class="btn btn-sm btn-outline-secondary" @click="fecharCarrinho" title="Fechar">&times;</button>
          </div>
          <div class="p-4 text-center text-muted">
            <i class="fas fa-box-open fa-3x mb-3"></i>
            <p>O carrinho será implementado na Atividade 2.</p>
          </div>
        </div>
      </transition>
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

export default {
  name: 'App',
  components: {
    ListaProdutos,
    AvaliacaoProduto
  },
  data() {
    return {
      produtoSelecionado: null,
      carrinhoAberto: false
    }
  },
  methods: {
    abrirCarrinho() {
      this.carrinhoAberto = true
    },
    fecharCarrinho() {
      this.carrinhoAberto = false
    },
    handleProdutoAdicionado(produto) {
      // Aqui vocês podem implementar a lógica de adição ao carrinho
    },
    handleVisualizarProduto(produto) {
      this.produtoSelecionado = produto
    },
    handleAvaliacaoAdicionada(avaliacao) {
      console.log('Nova avaliação:', avaliacao)
    }
  }
}
</script>

<style>
/* Slider do carrinho */
.cart-slider {
  box-shadow: 0 0 16px rgba(0,0,0,0.15);
  transition: transform 0.3s cubic-bezier(.4,0,.2,1);
}
.slide-cart-enter-active, .slide-cart-leave-active {
  transition: transform 0.3s cubic-bezier(.4,0,.2,1);
}
.slide-cart-enter-from, .slide-cart-leave-to {
  transform: translateX(100%);
}
.slide-cart-enter-to, .slide-cart-leave-from {
  transform: translateX(0);
}
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