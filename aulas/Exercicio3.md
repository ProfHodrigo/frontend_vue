# Exercício 3: Histórico de Acessos

## Objetivo

Criar um componente que registra e exibe um histórico de atividades do usuário durante a sessão.

---

## Contexto

Já existe uma funcionalidade parcial de log de atividades no `App.vue`. Vamos extrair essa lógica para um componente dedicado e adicionar persistência em localStorage para que o histórico sobreviva ao recarregar a página.

---

## Passo 1: Criar o componente HistoricoAcessos.vue

Crie o arquivo `src/components/HistoricoAcessos.vue`:

```vue
<template>
  <div class="historico-acessos">
    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="mb-0">
          <i class="fas fa-history me-2"></i>
          Histórico de Atividades
        </h5>
        <span class="badge bg-primary">{{ totalAtividades }}</span>
      </div>
      
      <div class="card-body p-0" style="max-height: 400px; overflow-y: auto;">
        <!-- Lista vazia -->
        <div v-if="atividades.length === 0" class="text-center text-muted py-5">
          <i class="fas fa-clipboard-list fa-3x mb-3"></i>
          <div>Nenhuma atividade registrada ainda</div>
          <small>As atividades aparecerão aqui conforme você usar o sistema</small>
        </div>

        <!-- Lista de atividades -->
        <div v-else class="list-group list-group-flush">
          <div
            v-for="(atividade, index) in atividadesRecentes"
            :key="index"
            class="list-group-item"
          >
            <div class="d-flex justify-content-between align-items-start">
              <div class="flex-grow-1">
                <div class="d-flex align-items-center mb-1">
                  <i :class="['fas', atividade.icone, 'me-2']"></i>
                  <strong>{{ atividade.titulo }}</strong>
                </div>
                <small class="text-muted">{{ atividade.detalhes }}</small>
              </div>
              <div class="text-end">
                <small class="text-muted">{{ formatarTempo(atividade.timestamp) }}</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card-footer d-flex justify-content-between">
        <small class="text-muted">
          Mostrando {{ atividadesVisiveis }} de {{ totalAtividades }} atividades
        </small>
        <button 
          class="btn btn-sm btn-outline-danger" 
          @click="limparHistorico"
          :disabled="atividades.length === 0"
        >
          <i class="fas fa-trash me-1"></i>
          Limpar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HistoricoAcessos',
  data() {
    return {
      atividades: [],
      limiteExibicao: 50
    }
  },
  computed: {
    totalAtividades() {
      return this.atividades.length
    },
    
    atividadesRecentes() {
      // Retornar em ordem reversa (mais recente primeiro)
      return [...this.atividades].reverse().slice(0, this.limiteExibicao)
    },
    
    atividadesVisiveis() {
      return Math.min(this.limiteExibicao, this.totalAtividades)
    }
  },
  mounted() {
    this.carregarHistorico()
  },
  methods: {
    carregarHistorico() {
      try {
        const historico = localStorage.getItem('historico_atividades')
        if (historico) {
          this.atividades = JSON.parse(historico)
        }
      } catch (error) {
        console.error('Erro ao carregar histórico:', error)
        this.atividades = []
      }
    },
    
    salvarHistorico() {
      try {
        localStorage.setItem('historico_atividades', JSON.stringify(this.atividades))
      } catch (error) {
        console.error('Erro ao salvar histórico:', error)
      }
    },
    
    adicionarAtividade(icone, titulo, detalhes) {
      const novaAtividade = {
        icone,
        titulo,
        detalhes,
        timestamp: Date.now()
      }
      
      this.atividades.push(novaAtividade)
      
      // Limitar tamanho do histórico (máximo 100 atividades)
      if (this.atividades.length > 100) {
        this.atividades = this.atividades.slice(-100)
      }
      
      this.salvarHistorico()
    },
    
    limparHistorico() {
      if (!confirm('Deseja realmente limpar todo o histórico?')) {
        return
      }
      
      this.atividades = []
      this.salvarHistorico()
    },
    
    formatarTempo(timestamp) {
      const data = new Date(timestamp)
      const agora = new Date()
      const diffMs = agora - data
      const diffSegundos = Math.floor(diffMs / 1000)
      const diffMinutos = Math.floor(diffSegundos / 60)
      const diffHoras = Math.floor(diffMinutos / 60)
      const diffDias = Math.floor(diffHoras / 24)
      
      // Formato relativo
      if (diffSegundos < 60) {
        return 'Agora mesmo'
      } else if (diffMinutos < 60) {
        return `${diffMinutos} min atrás`
      } else if (diffHoras < 24) {
        return `${diffHoras}h atrás`
      } else if (diffDias === 1) {
        return 'Ontem'
      } else if (diffDias < 7) {
        return `${diffDias} dias atrás`
      } else {
        // Formato absoluto para datas antigas
        return data.toLocaleString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      }
    }
  }
}
</script>

<style scoped>
.historico-acessos {
  margin-top: 20px;
}

.list-group-item {
  border-left: none;
  border-right: none;
  transition: background-color 0.2s;
}

.list-group-item:hover {
  background-color: #f8f9fa;
}

.list-group-item:first-child {
  border-top: none;
}

.list-group-item:last-child {
  border-bottom: none;
}
</style>
```

**O que este componente faz**:

- Carrega histórico do localStorage ao montar
- Exibe atividades em ordem reversa (mais recente primeiro)
- Formata timestamps de forma relativa ("5 min atrás", "2h atrás")
- Permite limpar histórico
- Limita exibição a 50 atividades mais recentes
- Limita armazenamento a 100 atividades no total

---

## Passo 2: Integrar HistoricoAcessos no App.vue

Abra `src/App.vue`:

**2.1. Importar o componente**:

```javascript
import HistoricoAcessos from '@/components/HistoricoAcessos.vue'

export default {
  name: 'App',
  components: { 
    LoginForm, 
    CadastroForm, 
    Dashboard,
    EditarPerfil,
    HistoricoAcessos  // ← adicionar aqui
  },
  // ... resto do código
}
```

**2.2. Adicionar referência ao componente**:

No `data()`, mantenha:

```javascript
data() {
  return {
    telaAtual: 'login',
    usuarioLogado: null,
    dataLogin: null,
    testandoAPI: false,
    atualizandoPerfil: false,
    mostrandoEdicaoPerfil: false,
    logAtividades: []  // ← manter para compatibilidade, mas vamos migrar para HistoricoAcessos
  }
}
```

**2.3. Modificar método adicionarLog**:

Na seção `methods`, modifique o método `adicionarLog`:

```javascript
methods: {
  // ... métodos existentes ...
  
  adicionarLog(icone, titulo, detalhes) {
    // Chamar método do componente HistoricoAcessos
    if (this.$refs.historicoAcessos) {
      this.$refs.historicoAcessos.adicionarAtividade(icone, titulo, detalhes)
    }
  }
}
```

**2.4. Adicionar componente no template**:

Localize a seção após o Dashboard e adicione:

```vue
<main class="container my-4">
  <Dashboard />
  
  <!-- Botão editar perfil -->
  <div class="text-center my-3">
    <button 
      v-if="!mostrandoEdicaoPerfil" 
      class="btn btn-warning"
      @click="abrirEdicaoPerfil"
    >
      <i class="fas fa-user-edit me-2"></i>
      Editar Perfil
    </button>
  </div>
  
  <!-- EditarPerfil -->
  <EditarPerfil
    v-if="mostrandoEdicaoPerfil"
    @perfil-atualizado="handlePerfilAtualizado"
    @cancelar="fecharEdicaoPerfil"
  />
  
  <!-- Histórico de Acessos -->
  <HistoricoAcessos ref="historicoAcessos" />
  
  <!-- Resto do conteúdo existente -->
  <div class="row">
    <!-- ... cards existentes ... -->
  </div>
</main>
```

**Nota importante**: O `ref="historicoAcessos"` permite que `App.vue` chame métodos do componente filho usando `this.$refs.historicoAcessos.adicionarAtividade()`.

---

## Passo 3: Registrar atividades automaticamente

Agora que o componente está integrado, vamos adicionar registros de atividades nos momentos-chave.

**3.1. No login**:

Localize o método `handleLoginSucesso` em `App.vue` e certifique-se de que chama `adicionarLog`:

```javascript
handleLoginSucesso(usuario) {
  this.usuarioLogado = usuario
  this.dataLogin = new Date().toLocaleString()
  this.adicionarLog('fa-sign-in-alt text-success', 'Login realizado', `Bem-vindo, ${usuario.nome}`)
}
```

**3.2. Ao testar API protegida**:

No método `testarAPIProtegida`:

```javascript
async testarAPIProtegida() {
  this.testandoAPI = true
  try {
    const res = await AuthService.obterPerfil()
    if (res.sucesso) {
      this.adicionarLog('fa-shield-alt text-success', 'API protegida testada', 'Token validado com sucesso')
      alert('API protegida acessível. Perfil atualizado.')
    } else {
      this.adicionarLog('fa-shield-alt text-danger', 'Erro ao testar API', res.mensagem || 'Erro desconhecido')
      alert('Erro: ' + (res.mensagem || 'Resposta inválida'))
    }
  } catch (err) {
    this.adicionarLog('fa-shield-alt text-danger', 'Exceção ao testar API', err.message)
    alert('Erro inesperado: ' + err.message)
  } finally {
    this.testandoAPI = false
  }
}
```

**3.3. Ao atualizar perfil**:

Já está chamando em `handlePerfilAtualizado`:

```javascript
handlePerfilAtualizado(usuario) {
  this.usuarioLogado = usuario
  this.adicionarLog('fa-user-edit text-success', 'Perfil atualizado', 'Suas informações foram atualizadas')
  this.mostrandoEdicaoPerfil = false
}
```

**3.4. Ao fazer logout**:

No método `fazerLogout`, antes de redirecionar:

```javascript
async fazerLogout() {
  const ok = confirm('Deseja realmente sair?')
  if (!ok) return
  
  this.adicionarLog('fa-sign-out-alt text-warning', 'Logout realizado', 'Até logo!')
  
  // Aguardar um pouco para registrar a atividade
  setTimeout(() => {
    AuthService.logout()
    window.location.href = '/'
  }, 500)
}
```

---

## Passo 4: Limpar código antigo

Como agora o `HistoricoAcessos` é um componente dedicado, você pode remover o card antigo de "Log de Atividades" do `App.vue` se ainda estiver lá.

Procure por este trecho e remova (ou comente):

```vue
<!-- Pode remover este card antigo -->
<div class="card">
  <div class="card-header">Log de Atividades</div>
  <div class="card-body p-2">
    <!-- ... código do log antigo ... -->
  </div>
</div>
```

---

## Passo 5: Testar

1. Salve todos os arquivos
2. Recarregue o frontend
3. Faça login
4. Você deve ver:
   - Histórico de Acessos exibido abaixo do Dashboard
   - "Login realizado" na lista
5. Clique em "Testar API Protegida" → nova atividade adicionada
6. Clique em "Editar Perfil", altere algo e salve → nova atividade adicionada
7. Recarregue a página (F5) → histórico permanece (persistido no localStorage)
8. Clique em "Limpar" → histórico é zerado

**Teste de formatação de tempo**:

- Atividades recentes devem mostrar "Agora mesmo" ou "5 min atrás"
- Atividades antigas devem mostrar data/hora completa

---

**Próximos passos**:

- Revisar o código criado
- Experimentar com os desafios extras
- Aplicar esses conceitos em seus próprios projetos
- Preparar-se para Aula 8 (Pinia para gerenciamento de estado global)
