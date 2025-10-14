<template>
  <div class="lista-produtos">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>
        <i class="fas fa-shopping-bag me-2"></i>
        Produtos ({{ produtosFiltrados.length }})
      </h2>
      
      <div class="d-flex gap-2">
        <select v-model="filtroCategoria" class="form-select">
          <option value="">Todas as categorias</option>
          <option value="eletronicos">Eletrônicos</option>
          <option value="escritorio">Escritório</option>
          <option value="casa">Casa</option>
        </select>
        
        <input 
          v-model="pesquisa"
          type="text"
          class="form-control"
          placeholder="Pesquisar produtos..."
        >
      </div>
    </div>

    <div class="row">
      <div 
        v-for="produto in produtosFiltrados" 
        :key="produto.id"
        class="col-lg-4 col-md-6 mb-4"
      >
        <CartaoProduto 
          :produto="produto"
          @adicionar-carrinho="adicionarAoCarrinho"
          @visualizar="visualizarProduto"
        />
      </div>
    </div>

    <div v-if="produtosFiltrados.length === 0" class="text-center py-5">
      <i class="fas fa-search fa-3x text-muted mb-3"></i>
      <h4 class="text-muted">Nenhum produto encontrado</h4>
      <p class="text-muted">Tente ajustar os filtros de busca</p>
    </div>

    <!-- Modal de visualização -->
    <div v-if="produtoSelecionado" class="modal fade show d-block" style="background: rgba(0,0,0,0.5)" @click.self="fecharModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ produtoSelecionado.nome }}</h5>
            <button @click="fecharModal" class="btn-close"></button>
          </div>
          <div class="modal-body">
            <p>{{ produtoSelecionado.descricao }}</p>
            <div class="row">
              <div class="col-6">
                <strong>Preço:</strong><br>
                R$ {{ produtoSelecionado.preco.toFixed(2) }}
              </div>
              <div class="col-6">
                <strong>Estoque:</strong><br>
                {{ produtoSelecionado.estoque }} unidades
              </div>
            </div>
            <div class="col-12 mt-3">
              <strong>Categoria:</strong><br>
              <span class="badge bg-secondary">{{ categoriaLabel(produtoSelecionado.categoria) }}</span>
            </div>
          </div>
          <div class="modal-footer">
            <button @click="fecharModal" class="btn btn-secondary">Fechar</button>
            <button 
              @click="adicionarAoCarrinho(produtoSelecionado)"
              class="btn btn-primary"
              :disabled="produtoSelecionado.estoque === 0"
            >
              <i class="fas fa-cart-plus me-2"></i>
              Adicionar ao Carrinho
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CartaoProduto from './CartaoProduto.vue'

export default {
  name: 'ListaProdutos',
  components: {
    CartaoProduto
  },
  data() {
    return {
      pesquisa: '',
      filtroCategoria: '',
  produtoSelecionado: null,
      produtos: [
        { id: 1, nome: 'Notebook Dell', descricao: 'Notebook para trabalho', preco: 2500.00, estoque: 5, categoria: 'eletronicos' },
        { id: 2, nome: 'Mouse Logitech', descricao: 'Mouse sem fio', preco: 45.90, estoque: 0, categoria: 'eletronicos' },
        { id: 3, nome: 'Cadeira Gamer', descricao: 'Cadeira ergonômica', preco: 850.00, estoque: 3, categoria: 'escritorio' },
        { id: 4, nome: 'Mesa de Escritório', descricao: 'Mesa em MDF', preco: 320.50, estoque: 8, categoria: 'escritorio' },
        { id: 5, nome: 'Luminária LED', descricao: 'Luminária de mesa', preco: 125.90, estoque: 2, categoria: 'casa' },
        { id: 6, nome: 'Teclado Mecânico', descricao: 'Teclado RGB', preco: 450.00, estoque: 7, categoria: 'eletronicos' },
        { id: 7, nome: 'Monitor 27"', descricao: 'Monitor Full HD', preco: 1200.00, estoque: 4, categoria: 'eletronicos' },
        { id: 8, nome: 'Tapete', descricao: 'Tapete decorativo', preco: 89.90, estoque: 10, categoria: 'casa' }
      ]
    }
  },
  computed: {
    produtosFiltrados() {
      return this.produtos.filter(produto => {
        const matchPesquisa = produto.nome.toLowerCase().includes(this.pesquisa.toLowerCase())
        const matchCategoria = !this.filtroCategoria || produto.categoria === this.filtroCategoria
        return matchPesquisa && matchCategoria
      })
    }
  },
  methods: {
    adicionarAoCarrinho(produto) {
      if (produto.estoque > 0) {
        produto.estoque--
        this.$emit('produto-adicionado', produto)
        alert(`${produto.nome} adicionado ao carrinho!`)
        this.produtoSelecionado = null
      }
    },
    visualizarProduto(produto) {
      this.produtoSelecionado = produto
      this.$emit('visualizar-produto', produto)
    },
    fecharModal() {
      this.produtoSelecionado = null
    },
    categoriaLabel(categoria) {
      const categorias = {
        'eletronicos': 'Eletrônicos',
        'escritorio': 'Escritório',
        'casa': 'Casa'
      }
      return categorias[categoria] || categoria
    }
  }
}
</script>

<style scoped>
.lista-produtos {
  padding: 1rem 0;
}

.form-select,
.form-control {
  max-width: 200px;
}

.modal.show {
  display: block;
}

@media (max-width: 768px) {
  .d-flex.gap-2 {
    flex-direction: column;
  }
  
  .form-select,
  .form-control {
    max-width: 100%;
  }
}
</style>
