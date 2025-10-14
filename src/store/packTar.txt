<template>
  <li 
    class="list-group-item item-tarefa"
    :class="{ 
      'tarefa-concluida': tarefa.concluida,
      'editando': editando
    }"
    draggable="true"
    @dragstart="$emit('drag-start', $event)"
    @dragend="$emit('drag-end', $event)"
  >
    <div class="d-flex align-items-center gap-2">
      <!-- Drag Handle -->
      <i class="fas fa-grip-vertical text-muted drag-handle" style="cursor: move;"></i>
      
      <!-- Checkbox -->
      <div class="form-check">
        <input 
          v-model="tarefa.concluida"
          type="checkbox"
          class="form-check-input"
          :id="'tarefa-' + tarefa.id"
          @change="$emit('toggle-concluida', tarefa)"
        >
      </div>

      <!-- Conteúdo da Tarefa -->
      <div class="flex-grow-1" v-if="!editando">
        <label 
          class="form-check-label mb-0"
          :for="'tarefa-' + tarefa.id"
          style="cursor: pointer;"
        >
          {{ tarefa.texto }}
        </label>
        <div v-if="tarefa.prioridade" class="mt-1">
          <span 
            class="badge"
            :class="prioridadeClass"
          >
            {{ tarefa.prioridade }}
          </span>
        </div>
      </div>

      <!-- Modo de Edição -->
      <div class="flex-grow-1" v-else>
        <input 
          v-model="textoEditado"
          type="text"
          class="form-control form-control-sm"
          @keyup.enter="salvarEdicao"
          @keyup.esc="cancelarEdicao"
          ref="inputEdicao"
        >
      </div>

      <!-- Botões de Ação -->
      <div class="acoes-tarefa d-flex gap-1">
        <template v-if="!editando">
          <button 
            @click="iniciarEdicao"
            class="btn btn-sm btn-outline-primary"
            title="Editar"
          >
            <i class="fas fa-edit"></i>
          </button>
          
          <button 
            @click="$emit('remover', tarefa)"
            class="btn btn-sm btn-outline-danger"
            title="Remover"
          >
            <i class="fas fa-trash"></i>
          </button>
        </template>
        
        <template v-else>
          <button 
            @click="salvarEdicao"
            class="btn btn-sm btn-success"
            title="Salvar"
          >
            <i class="fas fa-check"></i>
          </button>
          
          <button 
            @click="cancelarEdicao"
            class="btn btn-sm btn-secondary"
            title="Cancelar"
          >
            <i class="fas fa-times"></i>
          </button>
        </template>
      </div>
    </div>
  </li>
</template>

<script>
export default {
  name: 'ItemTarefa',
  props: {
    tarefa: {
      type: Object,
      required: true
    }
  },
  emits: ['toggle-concluida', 'remover', 'editar', 'drag-start', 'drag-end'],
  data() {
    return {
      editando: false,
      textoEditado: ''
    }
  },
  computed: {
    prioridadeClass() {
      const classes = {
        'alta': 'bg-danger',
        'média': 'bg-warning',
        'baixa': 'bg-info'
      }
      return classes[this.tarefa.prioridade?.toLowerCase()] || 'bg-secondary'
    }
  },
  methods: {
    iniciarEdicao() {
      this.editando = true
      this.textoEditado = this.tarefa.texto
      this.$nextTick(() => {
        this.$refs.inputEdicao?.focus()
      })
    },
    salvarEdicao() {
      if (this.textoEditado.trim()) {
        this.$emit('editar', {
          ...this.tarefa,
          texto: this.textoEditado.trim()
        })
        this.editando = false
      } else {
        alert('O texto da tarefa não pode estar vazio!')
      }
    },
    cancelarEdicao() {
      this.editando = false
      this.textoEditado = ''
    }
  }
}
</script>

<style scoped>
.item-tarefa {
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
}

.item-tarefa:hover {
  background-color: #f8f9fa;
  border-left-color: #0d6efd;
}

.tarefa-concluida label {
  text-decoration: line-through;
  color: #6c757d;
  opacity: 0.7;
}

.editando {
  background-color: #fff3cd;
}

.acoes-tarefa {
  opacity: 0;
  transition: opacity 0.2s ease;
}

.item-tarefa:hover .acoes-tarefa {
  opacity: 1;
}

.drag-handle {
  font-size: 0.9rem;
}

.item-tarefa.dragging {
  opacity: 0.5;
}
</style>
