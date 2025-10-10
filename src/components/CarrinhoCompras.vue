<template>
  <div class="carrinho-compras card">
    <div class="card-header bg-success text-white">
      <h4 class="mb-0">
        <i class="fas fa-shopping-cart me-2"></i>
        Exercício 3 - Carrinho de Compras
      </h4>
    </div>
    <div class="card-body">
      <!-- Lista de Produtos no Carrinho -->
      <div v-if="itens.length > 0">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>Produto</th>
                <th class="text-center">Preço Unit.</th>
                <th class="text-center">Quantidade</th>
                <th class="text-end">Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in itens" :key="item.id">
                <td>
                  <strong>{{ item.nome }}</strong>
                  <br>
                  <small class="text-muted">{{ item.descricao }}</small>
                </td>
                <td class="text-center align-middle">
                  R$ {{ item.preco.toFixed(2) }}
                </td>
                <td class="text-center align-middle">
                  <div class="input-group input-group-sm quantidade-control">
                    <button 
                      class="btn btn-outline-secondary"
                      @click="diminuirQuantidade(item)"
                      :disabled="item.quantidade <= 1"
                    >
                      <i class="fas fa-minus"></i>
                    </button>
                    <input 
                      type="number"
                      class="form-control text-center"
                      v-model.number="item.quantidade"
                      @change="validarQuantidade(item)"
                      min="1"
                      max="99"
                    >
                    <button 
                      class="btn btn-outline-secondary"
                      @click="aumentarQuantidade(item)"
                      :disabled="item.quantidade >= 99"
                    >
                      <i class="fas fa-plus"></i>
                    </button>
                  </div>
                </td>
                <td class="text-end align-middle">
                  <strong class="text-primary">
                    R$ {{ calcularSubtotal(item).toFixed(2) }}
                  </strong>
                </td>
                <td class="text-center align-middle">
                  <button 
                    @click="removerItem(item)"
                    class="btn btn-sm btn-outline-danger"
                    title="Remover do carrinho"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Resumo do Carrinho -->
        <div class="resumo-carrinho mt-4 p-3 bg-light rounded">
          <div class="row">
            <div class="col-md-8">
              <div class="d-flex flex-column gap-2">
                <div class="d-flex justify-content-between">
                  <span>Total de itens:</span>
                  <strong>{{ totalItens }}</strong>
                </div>
                <div class="d-flex justify-content-between">
                  <span>Subtotal:</span>
                  <strong>R$ {{ subtotal.toFixed(2) }}</strong>
                </div>
                <div class="d-flex justify-content-between">
                  <span>Desconto ({{ descontoPercentual }}%):</span>
                  <strong class="text-success">- R$ {{ valorDesconto.toFixed(2) }}</strong>
                </div>
                <div class="d-flex justify-content-between">
                  <span>Frete:</span>
                  <strong>{{ frete === 0 ? 'GRÁTIS' : 'R$ ' + frete.toFixed(2) }}</strong>
                </div>
              </div>
            </div>
            <div class="col-md-4 d-flex flex-column justify-content-center align-items-end">
              <h5 class="mb-1">Total:</h5>
              <h3 class="text-success mb-0">R$ {{ total.toFixed(2) }}</h3>
            </div>
          </div>

          <!-- Cupom de Desconto -->
          <div class="mt-3">
            <div class="input-group">
              <input 
                v-model="cupom"
                type="text"
                class="form-control"
                placeholder="Cupom de desconto"
                :disabled="cupomAplicado"
              >
              <button 
                class="btn btn-outline-secondary"
                @click="aplicarCupom"
                :disabled="!cupom || cupomAplicado"
              >
                {{ cupomAplicado ? 'Aplicado' : 'Aplicar' }}
              </button>
            </div>
            <small v-if="mensagemCupom" class="text-muted d-block mt-1">
              {{ mensagemCupom }}
            </small>
          </div>

          <!-- Botões de Ação -->
          <div class="d-flex gap-2 mt-4">
            <button 
              @click="limparCarrinho"
              class="btn btn-outline-danger"
            >
              <i class="fas fa-trash me-2"></i>
              Limpar Carrinho
            </button>
            <button 
              @click="finalizarCompra"
              class="btn btn-success flex-grow-1"
            >
              <i class="fas fa-check me-2"></i>
              Finalizar Compra
            </button>
          </div>
        </div>
      </div>

      <!-- Carrinho Vazio -->
      <div v-else class="text-center py-5">
        <i class="fas fa-shopping-cart fa-4x text-muted mb-3"></i>
        <h5 class="text-muted">Seu carrinho está vazio</h5>
        <p class="text-muted">Adicione produtos para começar suas compras!</p>
        <button class="btn btn-primary mt-3" @click="$emit('voltar-compras')">
          <i class="fas fa-shopping-bag me-2"></i>
          Continuar Comprando
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CarrinhoCompras',
  emits: ['finalizar-compra', 'voltar-compras'],
  data() {
    return {
      itens: [
        { id: 1, nome: 'Notebook Dell', descricao: 'Notebook para trabalho', preco: 2500.00, quantidade: 1 },
        { id: 2, nome: 'Mouse Logitech', descricao: 'Mouse sem fio', preco: 45.90, quantidade: 2 },
        { id: 3, nome: 'Teclado Mecânico', descricao: 'Teclado RGB', preco: 450.00, quantidade: 1 }
      ],
      cupom: '',
      cupomAplicado: false,
      mensagemCupom: '',
      cuponsValidos: {
        'DESC10': 10,
        'DESC20': 20,
        'PRIMEIRACOMPRA': 15
      }
    }
  },
  computed: {
    totalItens() {
      return this.itens.reduce((total, item) => total + item.quantidade, 0)
    },
    subtotal() {
      return this.itens.reduce((total, item) => total + this.calcularSubtotal(item), 0)
    },
    descontoPercentual() {
      if (this.cupomAplicado && this.cuponsValidos[this.cupom.toUpperCase()]) {
        return this.cuponsValidos[this.cupom.toUpperCase()]
      }
      return 0
    },
    valorDesconto() {
      return (this.subtotal * this.descontoPercentual) / 100
    },
    frete() {
      // Frete grátis acima de R$ 200
      return this.subtotal >= 200 ? 0 : 15.00
    },
    total() {
      return this.subtotal - this.valorDesconto + this.frete
    }
  },
  methods: {
    calcularSubtotal(item) {
      return item.preco * item.quantidade
    },
    aumentarQuantidade(item) {
      if (item.quantidade < 99) {
        item.quantidade++
      }
    },
    diminuirQuantidade(item) {
      if (item.quantidade > 1) {
        item.quantidade--
      }
    },
    validarQuantidade(item) {
      if (item.quantidade < 1) {
        item.quantidade = 1
      } else if (item.quantidade > 99) {
        item.quantidade = 99
      }
    },
    removerItem(item) {
      if (confirm(`Deseja remover "${item.nome}" do carrinho?`)) {
        const index = this.itens.findIndex(i => i.id === item.id)
        if (index > -1) {
          this.itens.splice(index, 1)
        }
      }
    },
    limparCarrinho() {
      if (confirm('Deseja realmente limpar o carrinho?')) {
        this.itens = []
        this.cupom = ''
        this.cupomAplicado = false
        this.mensagemCupom = ''
      }
    },
    aplicarCupom() {
      const cupomUpper = this.cupom.toUpperCase()
      if (this.cuponsValidos[cupomUpper]) {
        this.cupomAplicado = true
        this.mensagemCupom = `✅ Cupom aplicado! Você ganhou ${this.cuponsValidos[cupomUpper]}% de desconto.`
      } else {
        this.mensagemCupom = '❌ Cupom inválido. Tente: DESC10, DESC20 ou PRIMEIRACOMPRA'
      }
    },
    finalizarCompra() {
      if (this.itens.length === 0) {
        alert('Seu carrinho está vazio!')
        return
      }

      const resumo = {
        itens: this.itens,
        subtotal: this.subtotal,
        desconto: this.valorDesconto,
        frete: this.frete,
        total: this.total,
        cupom: this.cupomAplicado ? this.cupom : null
      }

      this.$emit('finalizar-compra', resumo)
      
      alert(`
        ✅ Compra finalizada com sucesso!
        
        Total de itens: ${this.totalItens}
        Valor total: R$ ${this.total.toFixed(2)}
        
        Obrigado pela sua compra!
      `)

      // Limpar carrinho após finalizar
      this.itens = []
      this.cupom = ''
      this.cupomAplicado = false
      this.mensagemCupom = ''
    },
    adicionarProduto(produto, quantidade = 1) {
      const itemExistente = this.itens.find(item => item.id === produto.id)
      
      if (itemExistente) {
        itemExistente.quantidade += quantidade
      } else {
        this.itens.push({
          ...produto,
          quantidade
        })
      }
    }
  }
}
</script>

<style scoped>
.carrinho-compras {
  margin-bottom: 2rem;
}

.quantidade-control {
  width: 130px;
  margin: 0 auto;
}

.quantidade-control input {
  width: 50px;
  padding: 0.25rem;
}

.resumo-carrinho {
  border: 1px solid #dee2e6;
}

.table td,
.table th {
  vertical-align: middle;
}

.table tbody tr:hover {
  background-color: #f8f9fa;
}

@media (max-width: 768px) {
  .table {
    font-size: 0.85rem;
  }
  
  .quantidade-control {
    width: 100px;
  }
}
</style>
