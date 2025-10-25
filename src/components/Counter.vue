<template>
  <div class="counter">
    <h2>Contador</h2>
    <p class="count">{{ count }}</p>
    <div class="buttons">
      <button @click="decrementar" :disabled="count === 0">
        -
      </button>
      <button @click="resetar">
        Reset
      </button>
      <button @click="incrementar">
        +
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const count = ref(0)

function incrementar() {
  count.value++
}

function decrementar() {
  if (count.value > 0) {
    count.value--
  }
}

function resetar() {
  count.value = 0
}
</script>

<style scoped>
.counter {
  max-width: 300px;
  margin: 2rem auto;
  padding: 2rem;
  border: 2px solid #42b983;
  border-radius: 8px;
  text-align: center;
}

h2 {
  margin-top: 0;
  color: #42b983;
}

.count {
  font-size: 3rem;
  font-weight: bold;
  margin: 1rem 0;
  color: #2c3e50;
}

.buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

button {
  padding: 0.75rem 1.5rem;
  font-size: 1.2rem;
  font-weight: bold;
  border: 2px solid #42b983;
  border-radius: 4px;
  background-color: white;
  color: #42b983;
  cursor: pointer;
  transition: all 0.3s;
}

button:hover:not(:disabled) {
  background-color: #42b983;
  color: white;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
