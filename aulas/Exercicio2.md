# Teste 2 - Sistema de Temas

## Objetivo do Exercício


Implementar um sistema completo de temas (claro/escuro) com múltiplas paletas de cores, salvando preferências do usuário no localStorage e permitindo troca dinâmica de temas em tempo real.

**O que você vai praticar:**
- Criação de temas com variáveis CSS
- Composable para gerenciamento de estado de tema
- Persistência de dados no localStorage
- Transições suaves entre temas
- Múltiplas paletas de cores
- Toggle e seletor de temas

## Passo 1: Criar o Composable de Temas

Crie `src/composables/useTema.js`:

```javascript
import { ref, watch, onMounted } from 'vue'

const temaAtual = ref('claro')
const paletaAtual = ref('verde')

const temas = {
  claro: {
    nome: 'Claro',
    icone: '☀️'
  },
  escuro: {
    nome: 'Escuro',
    icone: '🌙'
  }
}

const paletas = {
  verde: {
    nome: 'Verde',
    cores: {
      primaria: '#42b983',
      secundaria: '#35495e'
    }
  },
  azul: {
    nome: 'Azul',
    cores: {
      primaria: '#3498db',
      secundaria: '#2c3e50'
    }
  },
  roxo: {
    nome: 'Roxo',
    cores: {
      primaria: '#9b59b6',
      secundaria: '#34495e'
    }
  },
  laranja: {
    nome: 'Laranja',
    cores: {
      primaria: '#e67e22',
      secundaria: #2c3e50'
    }
  }
}

export function useTema() {
  function aplicarTema() {
    const tema = temaAtual.value
    const paleta = paletas[paletaAtual.value]
    
    document.documentElement.setAttribute('data-theme', tema)
    document.documentElement.setAttribute('data-paleta', paletaAtual.value)
    
    // Aplicar cores da paleta
    if (paleta) {
      document.documentElement.style.setProperty('--cor-primaria-custom', paleta.cores.primaria)
      document.documentElement.style.setProperty('--cor-secundaria-custom', paleta.cores.secundaria)
    }
  }
  
  function alternarTema() {
    temaAtual.value = temaAtual.value === 'claro' ? 'escuro' : 'claro'
  }
  
  function setTema(tema) {
    if (temas[tema]) {
      temaAtual.value = tema
    }
  }
  
  function setPaleta(paleta) {
    if (paletas[paleta]) {
      paletaAtual.value = paleta
    }
  }
  
  function carregarPreferencias() {
    const temaSalvo = localStorage.getItem('tema')
    const paletaSalva = localStorage.getItem('paleta')
    
    if (temaSalvo && temas[temaSalvo]) {
      temaAtual.value = temaSalvo
    }
    
    if (paletaSalva && paletas[paletaSalva]) {
      paletaAtual.value = paletaSalva
    }
    
    aplicarTema()
  }
  
  function salvarPreferencias() {
    localStorage.setItem('tema', temaAtual.value)
    localStorage.setItem('paleta', paletaAtual.value)
  }
  
  // Watchers
  watch([temaAtual, paletaAtual], () => {
    aplicarTema()
    salvarPreferencias()
  })
  
  // Inicializar
  onMounted(() => {
    carregarPreferencias()
  })
  
  return {
    temaAtual,
    paletaAtual,
    temas,
    paletas,
    alternarTema,
    setTema,
    setPaleta,
    carregarPreferencias
  }
}
```

## Passo 2: Criar Componente de Controle de Tema

Crie `src/components/ThemeControl.vue`:

```vue
<template>
  <div class="theme-control">
    <div class="card">
      <div class="card-header">
        <h5 class="mb-0">
          <i class="bi bi-palette"></i>
          Personalizar Tema
        </h5>
      </div>
      
      <div class="card-body">
        <!-- Toggle Claro/Escuro -->
        <div class="control-section">
          <label class="form-label">Modo de Visualização</label>
          <div class="theme-toggle">
            <button 
              v-for="(tema, key) in temas"
              :key="key"
              class="btn-theme"
              :class="{ active: temaAtual === key }"
              @click="setTema(key)"
            >
              <span class="icone">{{ tema.icone }}</span>
              <span class="nome">{{ tema.nome }}</span>
            </button>
          </div>
        </div>
        
        <!-- Seletor de Paleta -->
        <div class="control-section">
          <label class="form-label">Paleta de Cores</label>
          <div class="paleta-grid">
            <button
              v-for="(paleta, key) in paletas"
              :key="key"
              class="btn-paleta"
              :class="{ active: paletaAtual === key }"
              :style="{
                '--paleta-primaria': paleta.cores.primaria,
                '--paleta-secundaria': paleta.cores.secundaria
              }"
              @click="setPaleta(key)"
            >
              <div class="preview-cores">
                <div class="cor-primaria" :style="{ backgroundColor: paleta.cores.primaria }"></div>
                <div class="cor-secundaria" :style="{ backgroundColor: paleta.cores.secundaria }"></div>
              </div>
              <span class="nome-paleta">{{ paleta.nome }}</span>
            </button>
          </div>
        </div>
        
        <!-- Preview -->
        <div class="control-section">
          <label class="form-label">Prévia</label>
          <div class="preview-card">
            <h6>Exemplo de Card</h6>
            <p>Este é um exemplo de como o tema ficará aplicado</p>
            <button class="btn btn-primary btn-sm">Botão Primário</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTema } from '@/composables/useTema'

const { temaAtual, paletaAtual, temas, paletas, setTema, setPaleta } = useTema()
</script>

<style lang="scss" scoped>
.theme-control {
  max-width: 600px;
  margin: 0 auto;
}

.card {
  border: 1px solid var(--cor-borda);
  border-radius: 12px;
  overflow: hidden;
  background-color: var(--cor-card);
  transition: all 0.3s ease;
}

.card-header {
  background-color: var(--cor-header);
  padding: 1.5rem;
  border-bottom: 1px solid var(--cor-borda);
  
  h5 {
    color: var(--cor-texto);
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    
    i {
      font-size: 1.5rem;
    }
  }
}

.card-body {
  padding: 1.5rem;
}

.control-section {
  margin-bottom: 2rem;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.form-label {
  display: block;
  margin-bottom: 1rem;
  font-weight: 600;
  color: var(--cor-texto);
  font-size: 0.95rem;
}

// Toggle de tema
.theme-toggle {
  display: flex;
  gap: 1rem;
}

.btn-theme {
  flex: 1;
  padding: 1rem;
  border: 2px solid var(--cor-borda);
  border-radius: 8px;
  background-color: var(--cor-fundo-secundario);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    border-color: var(--cor-primaria);
    transform: translateY(-2px);
  }
  
  &.active {
    border-color: var(--cor-primaria);
    background-color: var(--cor-primaria);
    
    .icone,
    .nome {
      color: white;
    }
  }
  
  .icone {
    font-size: 2rem;
  }
  
  .nome {
    font-weight: 600;
    color: var(--cor-texto);
    transition: color 0.3s;
  }
}

// Grid de paletas
.paleta-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.btn-paleta {
  padding: 1rem;
  border: 2px solid var(--cor-borda);
  border-radius: 8px;
  background-color: var(--cor-fundo-secundario);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  
  &:hover {
    border-color: var(--paleta-primaria);
    transform: translateY(-2px);
  }
  
  &.active {
    border-color: var(--paleta-primaria);
    box-shadow: 0 0 0 3px rgba(var(--paleta-primaria-rgb), 0.2);
  }
  
  .preview-cores {
    display: flex;
    gap: 0.5rem;
    width: 100%;
  }
  
  .cor-primaria,
  .cor-secundaria {
    flex: 1;
    height: 40px;
    border-radius: 6px;
    transition: transform 0.3s;
  }
  
  &:hover .cor-primaria,
  &:hover .cor-secundaria {
    transform: scale(1.05);
  }
  
  .nome-paleta {
    font-weight: 600;
    color: var(--cor-texto);
    font-size: 0.9rem;
  }
}

// Preview card
.preview-card {
  padding: 1.5rem;
  border: 1px solid var(--cor-borda);
  border-radius: 8px;
  background-color: var(--cor-fundo-secundario);
  
  h6 {
    color: var(--cor-texto);
    margin-bottom: 0.75rem;
  }
  
  p {
    color: var(--cor-texto-secundario);
    margin-bottom: 1rem;
  }
  
  .btn-primary {
    background-color: var(--cor-primaria);
    border-color: var(--cor-primaria);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.3s;
    
    &:hover {
      opacity: 0.9;
    }
  }
}

// Responsivo
@media (max-width: 576px) {
  .theme-toggle {
    flex-direction: column;
  }
  
  .paleta-grid {
    grid-template-columns: 1fr;
  }
}
</style>
```

## Passo 3: Criar Estilos Globais de Tema

Crie `src/styles/theme.css`:

```css
:root {
  /* Transição suave */
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* TEMA CLARO */
[data-theme="claro"] {
  --cor-fundo: #ffffff;
  --cor-fundo-secundario: #f8f9fa;
  --cor-texto: #2c3e50;
  --cor-texto-secundario: #6c757d;
  --cor-borda: #dee2e6;
  --cor-card: #ffffff;
  --cor-header: #f8f9fa;
  --cor-primaria: var(--cor-primaria-custom, #42b983);
  --cor-secundaria: var(--cor-secundaria-custom, #35495e);
}

/* TEMA ESCURO */
[data-theme="escuro"] {
  --cor-fundo: #1a1a1a;
  --cor-fundo-secundario: #2d2d2d;
  --cor-texto: #e0e0e0;
  --cor-texto-secundario: #b0b0b0;
  --cor-borda: #404040;
  --cor-card: #252525;
  --cor-header: #2d2d2d;
  --cor-primaria: var(--cor-primaria-custom, #42b983);
  --cor-secundaria: var(--cor-secundaria-custom, #35495e);
}

/* Aplicar cores ao body */
body {
  background-color: var(--cor-fundo);
  color: var(--cor-texto);
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* Utilitários de tema */
.text-theme {
  color: var(--cor-texto);
}

.text-theme-secondary {
  color: var(--cor-texto-secundario);
}

.bg-theme {
  background-color: var(--cor-fundo);
}

.bg-theme-secondary {
  background-color: var(--cor-fundo-secundario);
}

.border-theme {
  border-color: var(--cor-borda);
}
```

## Passo 4: Integrar no main.js

```javascript
import { createApp } from 'vue'
import App from './App.vue'

// Importar estilos de tema
import './styles/theme.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

createApp(App).mount('#app')
```

## Passo 5: Criar Página de Demonstração

Crie `src/views/TemasView.vue`:

```vue
<template>
  <div class="temas-view">
    <div class="container py-5">
      <div class="text-center mb-5">
        <h1>Sistema de Temas</h1>
        <p class="lead">Personalize a aparência da aplicação</p>
        
        <!-- Toggle rápido -->
        <button 
          class="btn-toggle-rapido"
          @click="alternarTema"
        >
          {{ temaAtual === 'claro' ? '🌙' : '☀️' }}
        </button>
      </div>
      
      <!-- Controle de temas -->
      <ThemeControl />
      
      <!-- Demonstração -->
      <div class="mt-5">
        <h3 class="text-center mb-4">Demonstração dos Componentes</h3>
        <div class="row g-4">
          <div class="col-md-4">
            <div class="demo-card">
              <h5>Card de Exemplo</h5>
              <p>Este card usa as cores do tema atual</p>
              <button class="btn btn-primary btn-sm">Ação</button>
            </div>
          </div>
          <div class="col-md-4">
            <div class="demo-card">
              <h5>Outro Card</h5>
              <p>Todas as cores se adaptam automaticamente</p>
              <button class="btn btn-primary btn-sm">Ação</button>
            </div>
          </div>
          <div class="col-md-4">
            <div class="demo-card">
              <h5>Mais um Card</h5>
              <p>Experimente trocar entre os temas!</p>
              <button class="btn btn-primary btn-sm">Ação</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ThemeControl from '@/components/ThemeControl.vue'
import { useTema } from '@/composables/useTema'

const { temaAtual, alternarTema } = useTema()
</script>

<style scoped>
.temas-view {
  min-height: 100vh;
  background-color: var(--cor-fundo);
  transition: background-color 0.3s ease;
}

h1 {
  color: var(--cor-texto);
}

.lead {
  color: var(--cor-texto-secundario);
}

.btn-toggle-rapido {
  font-size: 2rem;
  padding: 1rem;
  border: none;
  background: none;
  cursor: pointer;
  transition: transform 0.3s;
}

.btn-toggle-rapido:hover {
  transform: scale(1.2) rotate(20deg);
}

.demo-card {
  padding: 2rem;
  border: 1px solid var(--cor-borda);
  border-radius: 8px;
  background-color: var(--cor-card);
  transition: all 0.3s ease;
}

.demo-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.demo-card h5 {
  color: var(--cor-texto);
  margin-bottom: 1rem;
}

.demo-card p {
  color: var(--cor-texto-secundario);
  margin-bottom: 1rem;
}

.btn-primary {
  background-color: var(--cor-primaria);
  border-color: var(--cor-primaria);
  color: white;
}
</style>
```

## Passo 6: Testar o Sistema

Execute a aplicação e teste:

```bash
npm run dev
```

Verifique:

1. **Toggle de tema:** Alterna entre claro/escuro suavemente
2. **Seletor de paletas:** Troca cores primária/secundária
3. **Persistência:** Recarregue a página e o tema permanece
4. **Transições:** Mudanças suaves sem quebras visuais
5. **Responsividade:** Funciona em todos os tamanhos de tela