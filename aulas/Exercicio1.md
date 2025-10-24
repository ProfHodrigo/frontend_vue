# Test 1: Store de Configuracoes - Resolucao Passo a Passo

## Objetivo

Criar uma store Pinia para gerenciar preferencias do usuario (tema, idioma, notificacoes) com persistencia no localStorage.

---

## Passo 1: Criar a Store de Settings

Crie o arquivo `src/stores/settings.js`:

```javascript
import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    tema: 'claro',           // 'claro' ou 'escuro'
    idioma: 'pt',            // 'pt' ou 'en'
    notificacoes: true       // true ou false
  }),
  
  getters: {
    temaAtivo(state) {
      return state.tema
    },
    
    idiomaAtual(state) {
      return state.idioma
    },
    
    notificacoesHabilitadas(state) {
      return state.notificacoes
    }
  },
  
  actions: {
    alterarTema(novoTema) {
      if (novoTema === 'claro' || novoTema === 'escuro') {
        this.tema = novoTema
      }
    },
    
    alterarIdioma(novoIdioma) {
      if (novoIdioma === 'pt' || novoIdioma === 'en') {
        this.idioma = novoIdioma
      }
    },
    
    toggleNotificacoes() {
      this.notificacoes = !this.notificacoes
    }
  },
  
  // Adicionar persistencia
  persist: true
})
```

**O que fizemos**:
- State com 3 configuracoes: tema, idioma, notificacoes
- Getters para acessar cada configuracao
- Actions para modificar cada configuracao com validacao
- `persist: true` para salvar automaticamente no localStorage

---

## Passo 2: Criar Componente SettingsPanel

Crie o arquivo `src/components/SettingsPanel.vue`:

```vue
<template>
  <div class="settings-panel">
    <div class="card">
      <div class="card-header">
        <h4>
          <i class="fas fa-cog me-2"></i>
          Configuracoes
        </h4>
      </div>
      
      <div class="card-body">
        <!-- Tema -->
        <div class="setting-group">
          <label>
            <i class="fas fa-palette me-2"></i>
            Tema
          </label>
          <div class="btn-group" role="group">
            <button
              type="button"
              class="btn"
              :class="settingsStore.tema === 'claro' ? 'btn-primary' : 'btn-outline-primary'"
              @click="settingsStore.alterarTema('claro')"
            >
              <i class="fas fa-sun me-1"></i>
              Claro
            </button>
            <button
              type="button"
              class="btn"
              :class="settingsStore.tema === 'escuro' ? 'btn-primary' : 'btn-outline-primary'"
              @click="settingsStore.alterarTema('escuro')"
            >
              <i class="fas fa-moon me-1"></i>
              Escuro
            </button>
          </div>
        </div>

        <!-- Idioma -->
        <div class="setting-group">
          <label>
            <i class="fas fa-language me-2"></i>
            Idioma
          </label>
          <select
            class="form-select"
            v-model="settingsStore.idioma"
            @change="settingsStore.alterarIdioma(settingsStore.idioma)"
          >
            <option value="pt">Portugues</option>
            <option value="en">English</option>
          </select>
        </div>

        <!-- Notificacoes -->
        <div class="setting-group">
          <label>
            <i class="fas fa-bell me-2"></i>
            Notificacoes
          </label>
          <div class="form-check form-switch">
            <input
              class="form-check-input"
              type="checkbox"
              :checked="settingsStore.notificacoes"
              @change="settingsStore.toggleNotificacoes()"
            >
            <label class="form-check-label">
              {{ settingsStore.notificacoes ? 'Ativadas' : 'Desativadas' }}
            </label>
          </div>
        </div>

        <!-- Preview das configuracoes -->
        <div class="alert alert-info mt-3">
          <strong>Configuracoes atuais:</strong>
          <ul class="mb-0">
            <li>Tema: {{ settingsStore.temaAtivo }}</li>
            <li>Idioma: {{ settingsStore.idiomaAtual === 'pt' ? 'Portugues' : 'English' }}</li>
            <li>Notificacoes: {{ settingsStore.notificacoesHabilitadas ? 'Sim' : 'Nao' }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useSettingsStore } from '@/stores/settings'

export default {
  name: 'SettingsPanel',
  setup() {
    const settingsStore = useSettingsStore()
    return { settingsStore }
  }
}
</script>

<style scoped>
.settings-panel {
  max-width: 600px;
  margin: 20px auto;
}

.setting-group {
  margin-bottom: 20px;
}

.setting-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-check-input {
  cursor: pointer;
}

.form-check-label {
  cursor: pointer;
}
</style>
```

**O que o componente faz**:
- Importa e usa a settingsStore
- Botoes para alternar entre tema claro/escuro
- Select para escolher idioma
- Switch para ativar/desativar notificacoes
- Preview das configuracoes atuais

---

## Passo 3: Aplicar Tema Dinamicamente no App.vue

Abra `src/App.vue` e modifique:

```vue
<template>
  <div id="app" :class="['app-container', temaClass]">
    <header class="app-header">
      <h1>Minha Aplicacao</h1>
      <!-- Botao rapido para alternar tema -->
      <button @click="toggleTema" class="btn btn-sm btn-outline-secondary">
        <i :class="settingsStore.tema === 'claro' ? 'fas fa-moon' : 'fas fa-sun'"></i>
      </button>
    </header>

    <main class="container py-4">
      <SettingsPanel />
      <!-- Resto do conteudo -->
    </main>
  </div>
</template>

<script>
import { useSettingsStore } from '@/stores/settings'
import SettingsPanel from '@/components/SettingsPanel.vue'

export default {
  name: 'App',
  components: {
    SettingsPanel
  },
  setup() {
    const settingsStore = useSettingsStore()
    return { settingsStore }
  },
  computed: {
    temaClass() {
      return `tema-${this.settingsStore.tema}`
    }
  },
  methods: {
    toggleTema() {
      const novoTema = this.settingsStore.tema === 'claro' ? 'escuro' : 'claro'
      this.settingsStore.alterarTema(novoTema)
    }
  }
}
</script>

<style>
/* Tema Claro (padrao) */
.app-container.tema-claro {
  background-color: #ffffff;
  color: #333333;
}

.app-container.tema-claro .app-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}

.app-container.tema-claro .card {
  background-color: #ffffff;
  border: 1px solid #dee2e6;
}

/* Tema Escuro */
.app-container.tema-escuro {
  background-color: #1a1a1a;
  color: #e0e0e0;
  min-height: 100vh;
}

.app-container.tema-escuro .app-header {
  background-color: #2d2d2d;
  border-bottom: 1px solid #404040;
}

.app-container.tema-escuro .card {
  background-color: #2d2d2d;
  border: 1px solid #404040;
  color: #e0e0e0;
}

.app-container.tema-escuro .form-control,
.app-container.tema-escuro .form-select {
  background-color: #3d3d3d;
  border-color: #555555;
  color: #e0e0e0;
}

.app-container.tema-escuro .btn-outline-primary {
  color: #6c9bcf;
  border-color: #6c9bcf;
}

.app-container.tema-escuro .btn-outline-primary:hover {
  background-color: #6c9bcf;
  color: #ffffff;
}

.app-header {
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.app-header h1 {
  margin: 0;
  font-size: 1.5rem;
}
</style>
```

**O que fizemos**:
- Adicionamos classe dinamica baseada no tema: `:class="temaClass"`
- Computed property `temaClass` retorna `tema-claro` ou `tema-escuro`
- Estilos CSS para cada tema
- Botao rapido no header para alternar tema

---

## Passo 4: Testar a Aplicacao

1. **Certifique-se de ter o Pinia instalado**:
```bash
npm install pinia pinia-plugin-persistedstate
```

2. **Configure o Pinia no main.js** (se ainda nao fez):
```javascript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.mount('#app')
```

3. **Execute a aplicacao**:
```bash
npm run dev
```

4. **Teste as funcionalidades**:
   - Clique em "Tema Escuro" → fundo deve ficar escuro
   - Clique em "Tema Claro" → fundo deve voltar ao claro
   - Alterne o idioma no select
   - Ative/desative notificacoes
   - **Recarregue a pagina (F5)** → configuracoes devem permanecer!

---

## Passo 5: Verificar Persistencia no DevTools

1. Abra DevTools (F12)
2. Va em **Application** → **Local Storage**
3. Procure a chave `settings` (ou nome gerado automaticamente)
4. Voce deve ver algo como:
```json
{
  "tema": "escuro",
  "idioma": "pt",
  "notificacoes": true
}
```
