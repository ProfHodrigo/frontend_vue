# Exercício 2: Edição de Perfil

## Objetivo

Implementar funcionalidade completa de edição de perfil do usuário com validação e atualização no backend.

---

## Contexto

Os usuários precisam poder atualizar suas informações pessoais (nome e email). Vamos criar:

1. Um componente de edição de perfil
2. Validação de formulário
3. Endpoint no backend para atualizar dados
4. Atualização do localStorage após edição

---

## Parte A: Backend (Flask)

### Passo 1: Adicionar endpoint PUT /api/perfil

Abra `backend/app.py` e adicione este endpoint após o `GET /api/perfil`:

```python
@app.route('/api/perfil', methods=['PUT'])
@jwt_required(locations=["headers"])
def atualizar_perfil():
    """
    Endpoint protegido para atualizar dados do perfil do usuario logado.
    Requer token JWT no header Authorization: Bearer <token>
    
    Request JSON:
    {
        "nome": "Novo Nome",
        "email": "novo@email.com"
    }
    
    Response (sucesso - 200):
    {
        "message": "Perfil atualizado com sucesso",
        "user": { id, nome, email, data_criacao }
    }
    
    Response (erro - 422):
    {
        "message": "Email ja registrado por outro usuario"
    }
    """
    try:
        usuario_id = get_jwt_identity()
        usuario = Usuario.query.get(int(usuario_id))
        
        if not usuario:
            return jsonify({'message': 'Usuario nao encontrado'}), 404
        
        dados = request.get_json()
        
        if not dados:
            return jsonify({'message': 'Dados invalidos'}), 400
        
        # Validar nome
        if 'nome' in dados:
            if not dados['nome'] or len(dados['nome']) < 2:
                return jsonify({'message': 'Nome deve ter pelo menos 2 caracteres'}), 400
            usuario.nome = dados['nome']
        
        # Validar email
        if 'email' in dados:
            if not dados['email']:
                return jsonify({'message': 'Email eh obrigatorio'}), 400
            
            # Verificar se email ja existe (exceto o proprio usuario)
            usuario_existente = Usuario.query.filter_by(email=dados['email']).first()
            if usuario_existente and usuario_existente.id != usuario.id:
                return jsonify({'message': 'Email ja registrado por outro usuario'}), 422
            
            usuario.email = dados['email']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Perfil atualizado com sucesso',
            'user': usuario.to_dict()
        }), 200
    
    except Exception as e:
        db.session.rollback()
        print(f'Erro ao atualizar perfil: {str(e)}')
        import traceback
        traceback.print_exc()
        return jsonify({'message': 'Erro ao atualizar perfil'}), 500
```

**O que este endpoint faz**:

- Extrai user_id do JWT token
- Busca usuário no banco
- Valida nome (mínimo 2 caracteres) e email (único)
- Atualiza campos e salva no banco
- Retorna dados atualizados

**Teste o endpoint**:
Reinicie o backend (`python app.py`) para aplicar as mudanças.

---

## Parte B: Frontend (Vue.js)

### Passo 2: Adicionar método no AuthService

Abra `src/services/AuthService.js` e adicione este método após `obterPerfil()`:

```javascript
static async atualizarPerfil(dados) {
  try {
    const response = await api.put('/api/perfil', dados)
    const usuario = response.data.user
    
    // Atualizar localStorage com novos dados
    localStorage.setItem('userData', JSON.stringify(usuario))
    
    return {
      sucesso: true,
      usuario: usuario,
      mensagem: response.data.message || 'Perfil atualizado com sucesso'
    }
  } catch (error) {
    return {
      sucesso: false,
      usuario: null,
      mensagem: this.tratarErroAuth(error)
    }
  }
}
```

---

### Passo 3: Criar componente EditarPerfil.vue

Crie o arquivo `src/components/EditarPerfil.vue`:

```vue
<template>
  <div class="editar-perfil">
    <div class="card">
      <div class="card-header bg-warning text-dark">
        <h5 class="mb-0">
          <i class="fas fa-user-edit me-2"></i>
          Editar Perfil
        </h5>
      </div>
      
      <div class="card-body">
        <div v-if="mensagem" class="alert" :class="alertClass" role="alert">
          <i class="fas" :class="mensagem.tipo === 'erro' ? 'fa-exclamation-triangle' : 'fa-check-circle'"></i>
          {{ mensagem.texto }}
        </div>

        <form @submit.prevent="salvarAlteracoes">
          <div class="mb-3">
            <label for="nome" class="form-label">
              <i class="fas fa-user me-2"></i>
              Nome Completo
            </label>
            <input
              id="nome"
              v-model.trim="form.nome"
              type="text"
              class="form-control"
              :class="{ 'is-invalid': erros.nome }"
              placeholder="Seu nome completo"
              required
              :disabled="salvando"
            >
            <div v-if="erros.nome" class="invalid-feedback">
              {{ erros.nome }}
            </div>
          </div>

          <div class="mb-3">
            <label for="email" class="form-label">
              <i class="fas fa-envelope me-2"></i>
              Email
            </label>
            <input
              id="email"
              v-model.trim="form.email"
              type="email"
              class="form-control"
              :class="{ 'is-invalid': erros.email }"
              placeholder="seu@email.com"
              required
              :disabled="salvando"
            >
            <div v-if="erros.email" class="invalid-feedback">
              {{ erros.email }}
            </div>
          </div>

          <div class="alert alert-info">
            <i class="fas fa-info-circle me-2"></i>
            <strong>Nota:</strong> A senha não pode ser alterada por aqui. 
            Use a opção "Esqueci minha senha" se precisar redefini-la.
          </div>

          <div class="d-flex justify-content-between">
            <button
              type="button"
              class="btn btn-secondary"
              @click="cancelar"
              :disabled="salvando"
            >
              <i class="fas fa-times me-2"></i>
              Cancelar
            </button>

            <button
              type="submit"
              class="btn btn-warning text-dark"
              :disabled="!formularioValido || !houveAlteracoes || salvando"
            >
              <span v-if="salvando" class="spinner-border spinner-border-sm me-2"></span>
              <i v-else class="fas fa-save me-2"></i>
              {{ salvando ? 'Salvando...' : 'Salvar Alterações' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import AuthService from '@/services/AuthService'

export default {
  name: 'EditarPerfil',
  emits: ['perfil-atualizado', 'cancelar'],
  data() {
    return {
      form: {
        nome: '',
        email: ''
      },
      dadosOriginais: {
        nome: '',
        email: ''
      },
      erros: {},
      mensagem: null,
      salvando: false
    }
  },
  computed: {
    formularioValido() {
      return this.form.nome && 
             this.form.email && 
             this.isValidEmail(this.form.email) &&
             this.form.nome.length >= 2 &&
             Object.keys(this.erros).length === 0
    },
    
    houveAlteracoes() {
      return this.form.nome !== this.dadosOriginais.nome ||
             this.form.email !== this.dadosOriginais.email
    },
    
    alertClass() {
      return {
        'alert-success': this.mensagem?.tipo === 'sucesso',
        'alert-danger': this.mensagem?.tipo === 'erro'
      }
    }
  },
  watch: {
    'form.nome'() { this.validarNome() },
    'form.email'() { this.validarEmail() }
  },
  mounted() {
    this.carregarDadosUsuario()
  },
  methods: {
    carregarDadosUsuario() {
      const usuario = AuthService.getCurrentUser()
      if (usuario) {
        this.form.nome = usuario.nome
        this.form.email = usuario.email
        
        // Guardar cópia dos dados originais
        this.dadosOriginais.nome = usuario.nome
        this.dadosOriginais.email = usuario.email
      }
    },
    
    async salvarAlteracoes() {
      this.validarFormulario()
      
      if (!this.formularioValido) {
        this.mostrarMensagem('erro', 'Corrija os erros no formulário')
        return
      }
      
      if (!this.houveAlteracoes) {
        this.mostrarMensagem('erro', 'Nenhuma alteração foi feita')
        return
      }
      
      this.salvando = true
      this.mensagem = null
      
      try {
        const resultado = await AuthService.atualizarPerfil({
          nome: this.form.nome,
          email: this.form.email
        })
        
        if (resultado.sucesso) {
          this.mostrarMensagem('sucesso', resultado.mensagem)
          
          // Atualizar dados originais
          this.dadosOriginais.nome = this.form.nome
          this.dadosOriginais.email = this.form.email
          
          // Emitir evento para o componente pai
          this.$emit('perfil-atualizado', resultado.usuario)
        } else {
          this.mostrarMensagem('erro', resultado.mensagem)
        }
      } catch (error) {
        console.error('Erro inesperado ao atualizar perfil:', error)
        this.mostrarMensagem('erro', 'Erro inesperado. Tente novamente.')
      } finally {
        this.salvando = false
      }
    },
    
    cancelar() {
      // Restaurar dados originais
      this.form.nome = this.dadosOriginais.nome
      this.form.email = this.dadosOriginais.email
      this.erros = {}
      this.mensagem = null
      
      this.$emit('cancelar')
    },
    
    validarFormulario() {
      this.erros = {}
      this.validarNome()
      this.validarEmail()
    },
    
    validarNome() {
      if (!this.form.nome) {
        this.erros.nome = 'Nome é obrigatório'
      } else if (this.form.nome.length < 2) {
        this.erros.nome = 'Nome deve ter pelo menos 2 caracteres'
      } else {
        delete this.erros.nome
      }
    },
    
    validarEmail() {
      if (!this.form.email) {
        this.erros.email = 'Email é obrigatório'
      } else if (!this.isValidEmail(this.form.email)) {
        this.erros.email = 'Email inválido'
      } else {
        delete this.erros.email
      }
    },
    
    isValidEmail(email) {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return regex.test(email)
    },
    
    mostrarMensagem(tipo, texto) {
      this.mensagem = { tipo, texto }
      setTimeout(() => { this.mensagem = null }, 5000)
    }
  }
}
</script>

<style scoped>
.editar-perfil {
  margin-top: 20px;
}

.invalid-feedback {
  display: block;
}

.btn-warning:disabled {
  opacity: 0.65;
}
</style>
```

**O que este componente faz**:

- Carrega dados atuais do usuário do localStorage
- Permite editar nome e email com validação
- Detecta se houve alterações (botão "Salvar" só ativa se mudou algo)
- Chama `AuthService.atualizarPerfil()` ao submeter
- Emite eventos `perfil-atualizado` e `cancelar` para o componente pai

---

### Passo 4: Integrar EditarPerfil no App.vue

Abra `src/App.vue`:

**4.1. Importar o componente**:

```javascript
import EditarPerfil from '@/components/EditarPerfil.vue'

export default {
  name: 'App',
  components: { 
    LoginForm, 
    CadastroForm, 
    Dashboard,
    EditarPerfil  // ← adicionar aqui
  },
  // ... resto do código
}
```

**4.2. Adicionar estado para controlar exibição**:

No `data()`, adicione:

```javascript
data() {
  return {
    telaAtual: 'login',
    usuarioLogado: null,
    dataLogin: null,
    testandoAPI: false,
    atualizandoPerfil: false,
    logAtividades: [],
    mostrandoEdicaoPerfil: false  // ← adicionar esta linha
  }
}
```

**4.3. Adicionar métodos para controlar edição**:

Na seção `methods`, adicione:

```javascript
methods: {
  // ... métodos existentes ...
  
  abrirEdicaoPerfil() {
    this.mostrandoEdicaoPerfil = true
  },
  
  fecharEdicaoPerfil() {
    this.mostrandoEdicaoPerfil = false
  },
  
  handlePerfilAtualizado(usuario) {
    this.usuarioLogado = usuario
    this.adicionarLog('fa-user-edit text-success', 'Perfil atualizado', 'Suas informações foram atualizadas')
    this.mostrandoEdicaoPerfil = false
  }
}
```

**4.4. Adicionar botão "Editar Perfil" e o componente no template**:

Localize a seção do Dashboard e adicione o botão e o componente:

```vue
<main class="container my-4">
  <Dashboard />
  
  <!-- Botão para abrir edição de perfil -->
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
  
  <!-- Componente de edição de perfil -->
  <EditarPerfil
    v-if="mostrandoEdicaoPerfil"
    @perfil-atualizado="handlePerfilAtualizado"
    @cancelar="fecharEdicaoPerfil"
  />
  
  <!-- Resto do conteúdo existente -->
  <div class="row">
    <!-- ... cards existentes ... -->
  </div>
</main>
```

---

## Passo 5: Testar

1. Salve todos os arquivos
2. Certifique-se de que backend foi reiniciado (com novo endpoint PUT)
3. Faça login no frontend
4. Clique em "Editar Perfil"
5. Altere o nome e/ou email
6. Clique em "Salvar Alterações"
7. Verifique:
   - Mensagem de sucesso aparece
   - Dados são atualizados na interface (header, dashboard)
   - localStorage foi atualizado (inspecionar DevTools → Application → Local Storage)

**Teste de validação**:

- Tente salvar com nome vazio → deve mostrar erro
- Tente salvar com email inválido → deve mostrar erro
- Tente usar um email já existente (ex: `aluno@user.com`) → backend retorna erro 422

---


## Próximo Exercício

Continue para `Exercicio3.md` para implementar histórico de acessos!
