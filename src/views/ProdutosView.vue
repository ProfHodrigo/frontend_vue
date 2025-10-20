<template>
  <div class="produtos-view">
    <!-- Header da página -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2>Gerenciar Produtos</h2>
        <p class="text-muted mb-0">
          Total: {{ produtos.length }} produto(s)
        </p>
      </div>
      
      <div>
        <button 
          class="btn btn-success me-2"
          @click="abrirModal()"
          :disabled="carregando"
        >
          Novo Produto
        </button>
        
        <button 
          class="btn btn-outline-primary"
          @click="carregarProdutos"
          :disabled="carregando"
        >
          <span v-if="carregando" class="spinner-border spinner-border-sm me-2"></span>
          Atualizar
        </button>
      </div>
    </div>

    <!-- Filtros e pesquisa -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label">Pesquisar:</label>
            <input 
              v-model="filtros.pesquisa"
              type="text"
              class="form-control"
              placeholder="Nome do produto..."
            >
          </div>
          
          <div class="col-md-3">
            <label class="form-label">Preço mínimo:</label>
            <input 
              v-model.number="filtros.precoMin"
              type="number"
              class="form-control"
              step="0.01"
              min="0"
            >
          </div>
          
          <div class="col-md-3">
            <label class="form-label">Preço máximo:</label>
            <input 
              v-model.number="filtros.precoMax"
              type="number"
              class="form-control"
              step="0.01"
              min="0"
            >
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="carregando" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Carregando...</span>
      </div>
      <p class="mt-2 text-muted">Carregando produtos...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="erro" class="alert alert-danger">
      {{ erro }}
      <button class="btn btn-sm btn-outline-danger ms-3" @click="carregarProdutos">
        Tentar novamente
      </button>
    </div>

    <!-- Lista de produtos -->
    <div v-else>
      <!-- Produtos em grid -->
      <div class="row" v-if="produtosFiltrados.length > 0">
        <div 
          v-for="produto in produtosFiltrados" 
          :key="produto.id"
          class="col-lg-4 col-md-6 mb-4"
        >
          <div class="card h-100 produto-card">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <h5 class="card-title">{{ produto.nome }}</h5>
                <span 
                  class="badge"
                  :class="produto.estoque > 10 ? 'bg-success' : produto.estoque > 0 ? 'bg-warning' : 'bg-danger'"
                >
                  {{ produto.estoque > 0 ? `${produto.estoque} un.` : 'Esgotado' }}
                </span>
              </div>
              
              <div class="mb-3">
                <span class="h4 text-primary">R$ {{ produto.preco.toFixed(2) }}</span>
              </div>
              
              <div class="d-flex gap-2">
                <button 
                  class="btn btn-outline-primary btn-sm flex-fill"
                  @click="abrirModal(produto)"
                >
                  Editar
                </button>
                
                <button 
                  class="btn btn-outline-danger btn-sm"
                  @click="confirmarExclusao(produto)"
                  :disabled="excluindo === produto.id"
                >
                  <span v-if="excluindo !== produto.id">Excluir</span>
                  <span v-else>
                    <span class="spinner-border spinner-border-sm"></span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-5">
        <h4 class="text-muted">Nenhum produto encontrado</h4>
        <p class="text-muted">
          {{ produtos.length === 0 ? 'Clique em "Novo Produto" para começar' : 'Tente ajustar os filtros' }}
        </p>
      </div>
    </div>

    <!-- Modal de formulário -->
    <ModalProduto 
      v-if="modalAberto"
      :produto="produtoEditando"
      :salvando="salvando"
      @salvar="salvarProduto"
      @cancelar="fecharModal"
    />

    <!-- Toast de notificação -->
    <ToastNotificacao 
      v-if="toast.visivel"
      :tipo="toast.tipo"
      :mensagem="toast.mensagem"
      @fechar="toast.visivel = false"
    />
  </div>
</template>

<script>
import { ProdutoService } from '@/services/ProdutoService'
import ModalProduto from '@/components/ModalProduto.vue'
import ToastNotificacao from '@/components/ToastNotificacao.vue'

export default {
  name: 'ProdutosView',
  components: {
    ModalProduto,
    ToastNotificacao
  },
  data() {
    return {
      produtos: [],
      carregando: false,
      erro: null,
      salvando: false,
      excluindo: null,
      modalAberto: false,
      produtoEditando: null,
      filtros: {
        pesquisa: '',
        precoMin: null,
        precoMax: null
      },
      toast: {
        visivel: false,
        tipo: 'success',
        mensagem: ''
      }
    }
  },
  computed: {
    produtosFiltrados() {
      return this.produtos.filter(produto => {
        const matchPesquisa = produto.nome.toLowerCase()
          .includes(this.filtros.pesquisa.toLowerCase())
        
        const matchPrecoMin = !this.filtros.precoMin || 
          produto.preco >= this.filtros.precoMin
        
        const matchPrecoMax = !this.filtros.precoMax || 
          produto.preco <= this.filtros.precoMax
        
        return matchPesquisa && matchPrecoMin && matchPrecoMax
      })
    }
  },
  async mounted() {
    await this.carregarProdutos()
  },
  methods: {
    async carregarProdutos() {
      this.carregando = true
      this.erro = null
      
      const resultado = await ProdutoService.listarTodos()
      
      if (resultado.sucesso) {
        this.produtos = resultado.dados
      } else {
        this.erro = resultado.mensagem
      }
      
      this.carregando = false
    },

    abrirModal(produto = null) {
      this.produtoEditando = produto ? { ...produto } : {
        nome: '',
        preco: 0,
        estoque: 0
      }
      this.modalAberto = true
    },

    fecharModal() {
      this.modalAberto = false
      this.produtoEditando = null
    },

    async salvarProduto(produto) {
      this.salvando = true
      
      let resultado
      
      if (produto.id) {
        // Atualizar produto existente
        resultado = await ProdutoService.atualizar(produto.id, produto)
      } else {
        // Criar novo produto
        resultado = await ProdutoService.criar(produto)
      }
      
      if (resultado.sucesso) {
        this.mostrarToast('success', resultado.mensagem)
        this.fecharModal()
        await this.carregarProdutos()
      } else {
        this.mostrarToast('error', resultado.mensagem)
      }
      
      this.salvando = false
    },

    async confirmarExclusao(produto) {
      const confirmou = confirm(
        `Tem certeza que deseja excluir o produto "${produto.nome}"?`
      )
      
      if (confirmou) {
        await this.excluirProduto(produto.id)
      }
    },

    async excluirProduto(id) {
      this.excluindo = id
      
      const resultado = await ProdutoService.excluir(id)
      
      if (resultado.sucesso) {
        this.mostrarToast('success', resultado.mensagem)
        await this.carregarProdutos()
      } else {
        this.mostrarToast('error', resultado.mensagem)
      }
      
      this.excluindo = null
    },

    mostrarToast(tipo, mensagem) {
      this.toast = {
        visivel: true,
        tipo,
        mensagem
      }
      
      // Auto-hide após 5 segundos
      setTimeout(() => {
        this.toast.visivel = false
      }, 5000)
    }
  }
}
</script>

<style scoped>
.produto-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.produto-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}

.gap-2 {
  gap: 8px;
}
</style>
