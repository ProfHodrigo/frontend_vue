<template>
  <div class="lista-tarefas-card">
    <div class="card">
      <div class="card-header bg-success text-white">
        <h4 class="mb-0">
          <i class="fas fa-tasks me-2"></i>
          Exercício 2 - Lista de Tarefas Simples
        </h4>
      </div>
      <div class="card-body">
        <!-- Formulário de nova tarefa -->
        <form @submit.prevent="adicionarTarefa" class="mb-4">
          <div class="input-group">
            <input 
              v-model="novaTarefa"
              type="text"
              class="form-control"
              placeholder="Digite uma nova tarefa..."
              required
            >
            <button 
              type="submit"
              class="btn btn-success"
              :disabled="!novaTarefa.trim()"
            >
              <i class="fas fa-plus"></i> Adicionar
            </button>
          </div>
        </form>

        <!-- Contador de tarefas -->
        <div class="alert alert-info d-flex justify-content-between align-items-center">
          <div>
            <i class="fas fa-clipboard-list me-2"></i>
            <strong>Total de Tarefas:</strong> {{ totalTarefas }}
          </div>
          <div>
            <span class="badge bg-primary">{{ tarefasPendentes }} pendentes</span>
            <span class="badge bg-success ms-1">{{ tarefasConcluidas }} concluídas</span>
          </div>
        </div>

        <!-- Lista de tarefas -->
        <div v-if="tarefas.length > 0">
          <ul class="list-group">
            <li 
              v-for="(tarefa, index) in tarefas" 
              :key="index"
              class="list-group-item d-flex justify-content-between align-items-center"
              :class="{ 'tarefa-concluida': tarefa.concluida }"
            >
              <div class="form-check">
                <input 
                  v-model="tarefa.concluida"
                  type="checkbox"
                  class="form-check-input"
                  :id="'tarefa-' + index"
                >
                <label 
                  class="form-check-label"
                  :for="'tarefa-' + index"
                >
                  {{ tarefa.texto }}
                </label>
              </div>
              
              <button 
                @click="removerTarefa(index)"
                class="btn btn-sm btn-outline-danger"
              >
                <i class="fas fa-trash"></i>
              </button>
            </li>
          </ul>

          <!-- Botão para limpar concluídas -->
          <button 
            v-if="tarefasConcluidas > 0"
            @click="limparConcluidas"
            class="btn btn-outline-secondary btn-sm mt-3"
          >
            <i class="fas fa-broom me-1"></i>
            Limpar Tarefas Concluídas
          </button>
        </div>

        <!-- Mensagem quando não há tarefas -->
        <div v-else class="text-center py-4">
          <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
          <p class="text-muted">Nenhuma tarefa adicionada ainda.</p>
          <p class="text-muted small">Comece adicionando uma tarefa acima!</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ListaTarefas',
  data() {
    return {
      novaTarefa: '',
      tarefas: []
    }
  },
  computed: {
    totalTarefas() {
      return this.tarefas.length
    },
    tarefasPendentes() {
      return this.tarefas.filter(t => !t.concluida).length
    },
    tarefasConcluidas() {
      return this.tarefas.filter(t => t.concluida).length
    }
  },
  methods: {
    adicionarTarefa() {
      if (this.novaTarefa.trim()) {
        this.tarefas.push({
          texto: this.novaTarefa.trim(),
          concluida: false
        })
        this.novaTarefa = ''
      }
    },
    removerTarefa(index) {
      if (confirm('Deseja realmente remover esta tarefa?')) {
        this.tarefas.splice(index, 1)
      }
    },
    limparConcluidas() {
      if (confirm('Deseja remover todas as tarefas concluídas?')) {
        this.tarefas = this.tarefas.filter(t => !t.concluida)
      }
    }
  }
}
</script>

<style scoped>
.lista-tarefas-card {
  margin-bottom: 2rem;
}

.tarefa-concluida {
  background-color: #f8f9fa;
  opacity: 0.8;
}

.tarefa-concluida label {
  text-decoration: line-through;
  color: #6c757d;
}

.list-group-item {
  transition: all 0.3s ease;
}

.list-group-item:hover {
  background-color: #f8f9fa;
}
</style>
