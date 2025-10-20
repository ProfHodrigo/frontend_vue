<template>
  <div class="toast-container position-fixed top-0 end-0 p-3">
    <div class="alert" :class="classe" role="alert">
      <div class="d-flex justify-content-between align-items-center">
        <span>{{ mensagem }}</span>
        <button 
          type="button" 
          class="btn-close" 
          @click="$emit('fechar')"
          aria-label="Close"
        ></button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ToastNotificacao',
  props: {
    tipo: {
      type: String,
      default: 'success'
    },
    mensagem: {
      type: String,
      required: true
    }
  },
  emits: ['fechar'],
  computed: {
    classe() {
      return this.tipo === 'success' 
        ? 'alert-success' 
        : 'alert-danger'
    }
  }
}
</script>

<style scoped>
.toast-container {
  z-index: 1000;
}

.alert {
  min-width: 300px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  animation: slideInRight 0.3s ease-out;
}

@keyframes slideInRight {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
