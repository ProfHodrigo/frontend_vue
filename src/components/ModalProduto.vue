<template>
  <div class="modal fade show d-block" style="background-color: rgba(0,0,0,0.5)">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <form @submit.prevent="handleSubmit">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ produto.id ? 'Editar Produto' : 'Novo Produto' }}
            </h5>
            <button 
              type="button" 
              class="btn-close" 
              @click="$emit('cancelar')"
              :disabled="salvando"
            ></button>
          </div>
          
          <div class="modal-body">
            <div class="row g-3">
              <!-- Nome do produto -->
              <div class="col-12">
                <label class="form-label">
                  Nome do Produto <span class="text-danger">*</span>
                </label>
                <input 
                  v-model.trim="form.nome"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': erros.nome }"
                  placeholder="Digite o nome do produto"
                  maxlength="100"
                  required
                >
                <div class="invalid-feedback" v-if="erros.nome">
                  {{ erros.nome }}
                </div>
              </div>

              <!-- Preço -->
              <div class="col-md-6">
                <label class="form-label">
                  Preço <span class="text-danger">*</span>
                </label>
                <div class="input-group">
                  <span class="input-group-text">R$</span>
                  <input 
                    v-model.number="form.preco"
                    type="number"
                    class="form-control"
                    :class="{ 'is-invalid': erros.preco }"
                    step="0.01"
                    min="0"
                    placeholder="0,00"
                    required
                  >
                </div>
                <div class="invalid-feedback" v-if="erros.preco">
                  {{ erros.preco }}
                </div>
              </div>

              <!-- Estoque -->
              <div class="col-md-6">
                <label class="form-label">
                  Quantidade em Estoque <span class="text-danger">*</span>
                </label>
                <input 
                  v-model.number="form.estoque"
                  type="number"
                  class="form-control"
                  :class="{ 'is-invalid': erros.estoque }"
                  min="0"
                  placeholder="0"
                  required
                >
                <div class="invalid-feedback" v-if="erros.estoque">
                  {{ erros.estoque }}
                </div>
              </div>
            </div>

            <!-- Preview -->
            <div class="mt-4">
              <h6>Preview:</h6>
              <div class="card">
                <div class="card-body">
                  <div class="d-flex justify-content-between align-items-start">
                    <div>
                      <h6 class="card-title">{{ form.nome || 'Nome do produto' }}</h6>
                      <span class="h5 text-primary">R$ {{ form.preco?.toFixed(2) || '0.00' }}</span>
                    </div>
                    <span 
                      class="badge"
                      :class="form.estoque > 10 ? 'bg-success' : form.estoque > 0 ? 'bg-warning' : 'bg-danger'"
                    >
                      {{ form.estoque || 0 }} un.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="modal-footer">
            <button 
              type="button" 
              class="btn btn-secondary"
              @click="$emit('cancelar')"
              :disabled="salvando"
            >
              Cancelar
            </button>
            
            <button 
              type="submit"
              class="btn btn-primary"
              :disabled="!formularioValido || salvando"
            >
              <span v-if="salvando" class="spinner-border spinner-border-sm me-2"></span>
              {{ salvando ? 'Salvando...' : 'Salvar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModalProduto',
  props: {
    produto: {
      type: Object,
      required: true
    },
    salvando: {
      type: Boolean,
      default: false
    }
  },
  emits: ['salvar', 'cancelar'],
  data() {
    return {
      form: {
        nome: '',
        preco: 0,
        estoque: 0
      },
      erros: {}
    }
  },
  computed: {
    formularioValido() {
      return this.form.nome.trim().length > 0 && 
             this.form.preco > 0 && 
             this.form.estoque >= 0 &&
             Object.keys(this.erros).length === 0
    }
  },
  watch: {
    produto: {
      immediate: true,
      handler(novoProduto) {
        this.form = {
          id: novoProduto.id,
          nome: novoProduto.nome || '',
          preco: novoProduto.preco || 0,
          estoque: novoProduto.estoque || 0
        }
        this.erros = {}
      }
    },
    'form.nome'() {
      this.validarNome()
    },
    'form.preco'() {
      this.validarPreco()
    },
    'form.estoque'() {
      this.validarEstoque()
    }
  },
  methods: {
    validarNome() {
      if (!this.form.nome.trim()) {
        this.erros.nome = 'Nome é obrigatório'
      } else if (this.form.nome.trim().length < 2) {
        this.erros.nome = 'Nome deve ter pelo menos 2 caracteres'
      } else {
        delete this.erros.nome
      }
    },

    validarPreco() {
      if (this.form.preco < 0) {
        this.erros.preco = 'Preço não pode ser negativo'
      } else if (this.form.preco === 0) {
        this.erros.preco = 'Preço deve ser maior que zero'
      } else {
        delete this.erros.preco
      }
    },

    validarEstoque() {
      if (this.form.estoque < 0) {
        this.erros.estoque = 'Estoque não pode ser negativo'
      } else {
        delete this.erros.estoque
      }
    },

    handleSubmit() {
      // Validar tudo antes de enviar
      this.validarNome()
      this.validarPreco()
      this.validarEstoque()

      if (this.formularioValido) {
        this.$emit('salvar', { ...this.form })
      }
    }
  }
}
</script>

<style scoped>
.modal {
  animation: fadeIn 0.15s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-dialog {
  animation: slideIn 0.15s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateY(-50px);
  }
  to {
    transform: translateY(0);
  }
}
</style>
