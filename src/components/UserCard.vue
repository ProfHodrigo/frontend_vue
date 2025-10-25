<template>
  <div class="user-card">
    <div class="user-avatar">
      <img v-if="user.avatar" :src="user.avatar" :alt="user.nome" />
      <div v-else class="avatar-placeholder">
        {{ iniciais }}
      </div>
    </div>
    
    <div class="user-info">
      <h3>{{ user.nome }}</h3>
      <p class="user-email">{{ user.email }}</p>
      <p v-if="user.cargo" class="user-cargo">{{ user.cargo }}</p>
    </div>
    
    <div class="user-actions">
      <button 
        v-if="showEditButton" 
        @click="handleEdit" 
        class="btn-edit"
      >
        Editar
      </button>
      <button 
        v-if="showDeleteButton" 
        @click="handleDelete" 
        class="btn-delete"
      >
        Excluir
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  user: {
    type: Object,
    required: true,
    validator: (value) => {
      return value.nome && value.email
    }
  },
  showEditButton: {
    type: Boolean,
    default: true
  },
  showDeleteButton: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['edit', 'delete'])

const iniciais = computed(() => {
  if (!props.user.nome) return '?'
  const nomes = props.user.nome.split(' ')
  if (nomes.length === 1) {
    return nomes[0].charAt(0).toUpperCase()
  }
  return (nomes[0].charAt(0) + nomes[nomes.length - 1].charAt(0)).toUpperCase()
})

function handleEdit() {
  emit('edit', props.user)
}

function handleDelete() {
  emit('delete', props.user.id || props.user.email)
}
</script>

<style scoped>
.user-card {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: white;
  transition: box-shadow 0.3s;
}

.user-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.user-avatar img,
.avatar-placeholder {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #42b983;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
}

.user-info {
  flex: 1;
}

.user-info h3 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
}

.user-email {
  margin: 0 0 0.25rem 0;
  color: #666;
  font-size: 0.9rem;
}

.user-cargo {
  margin: 0;
  color: #42b983;
  font-size: 0.85rem;
  font-weight: 500;
}

.user-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  justify-content: center;
}

button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: opacity 0.3s;
}

button:hover {
  opacity: 0.8;
}

.btn-edit {
  background-color: #42b983;
  color: white;
}

.btn-delete {
  background-color: #e74c3c;
  color: white;
}
</style>
