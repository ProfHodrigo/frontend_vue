# Test 2: Testar Componente de Formulario

## Objetivo

Criar testes completos para um componente de formulario com validacoes, incluindo renderizacao, interacoes do usuario, mensagens de erro e submit.

---

## Contexto

Testes de formularios verificam se campos sao validados corretamente, mensagens de erro aparecem e o submit funciona. Este e um dos testes mais importantes em aplicacoes.

---

## Passo 1: Revisar o Componente de Formulario

Arquivo `src/components/FormularioProduto.vue`:

```vue
<template>
  <form @submit.prevent="handleSubmit" class="formulario-produto">
    <h2>Cadastrar Produto</h2>
    
    <div class="campo">
      <label for="nome">Nome do Produto</label>
      <input 
        id="nome"
        v-model="form.nome" 
        @blur="validateField('nome')"
        :class="{ erro: erros.nome }"
      >
      <span v-if="erros.nome" class="mensagem-erro">{{ erros.nome }}</span>
    </div>
    
    <div class="campo">
      <label for="preco">Preco</label>
      <input 
        id="preco"
        v-model.number="form.preco" 
        type="number"
        step="0.01"
        @blur="validateField('preco')"
        :class="{ erro: erros.preco }"
      >
      <span v-if="erros.preco" class="mensagem-erro">{{ erros.preco }}</span>
    </div>
    
    <div class="campo">
      <label for="estoque">Estoque</label>
      <input 
        id="estoque"
        v-model.number="form.estoque" 
        type="number"
        @blur="validateField('estoque')"
        :class="{ erro: erros.estoque }"
      >
      <span v-if="erros.estoque" class="mensagem-erro">{{ erros.estoque }}</span>
    </div>
    
    <div class="campo">
      <label for="categoria">Categoria</label>
      <select 
        id="categoria"
        v-model="form.categoria"
        @blur="validateField('categoria')"
        :class="{ erro: erros.categoria }"
      >
        <option value="">Selecione...</option>
        <option value="eletronicos">Eletronicos</option>
        <option value="livros">Livros</option>
        <option value="roupas">Roupas</option>
      </select>
      <span v-if="erros.categoria" class="mensagem-erro">{{ erros.categoria }}</span>
    </div>
    
    <div class="acoes">
      <button type="submit" :disabled="enviando || !formularioValido">
        {{ enviando ? 'Salvando...' : 'Salvar Produto' }}
      </button>
      <button type="button" @click="limparFormulario">Limpar</button>
    </div>
    
    <div v-if="mensagemSucesso" class="sucesso">
      {{ mensagemSucesso }}
    </div>
  </form>
</template>

<script>
export default {
  name: 'FormularioProduto',
  data() {
    return {
      form: {
        nome: '',
        preco: null,
        estoque: null,
        categoria: ''
      },
      erros: {
        nome: '',
        preco: '',
        estoque: '',
        categoria: ''
      },
      enviando: false,
      mensagemSucesso: ''
    }
  },
  computed: {
    formularioValido() {
      return this.form.nome && 
             this.form.preco && 
             this.form.estoque !== null && 
             this.form.categoria &&
             !this.erros.nome &&
             !this.erros.preco &&
             !this.erros.estoque &&
             !this.erros.categoria
    }
  },
  methods: {
    validateField(campo) {
      this.erros[campo] = ''
      
      if (campo === 'nome') {
        if (!this.form.nome) {
          this.erros.nome = 'Nome é obrigatorio'
        } else if (this.form.nome.length < 3) {
          this.erros.nome = 'Nome deve ter no minimo 3 caracteres'
        }
      }
      
      if (campo === 'preco') {
        if (!this.form.preco) {
          this.erros.preco = 'Preco é obrigatorio'
        } else if (this.form.preco <= 0) {
          this.erros.preco = 'Preco deve ser maior que zero'
        }
      }
      
      if (campo === 'estoque') {
        if (this.form.estoque === null || this.form.estoque === '') {
          this.erros.estoque = 'Estoque é obrigatorio'
        } else if (this.form.estoque < 0) {
          this.erros.estoque = 'Estoque nao pode ser negativo'
        }
      }
      
      if (campo === 'categoria') {
        if (!this.form.categoria) {
          this.erros.categoria = 'Categoria é obrigatoria'
        }
      }
    },
    
    async handleSubmit() {
      // Valida todos os campos
      Object.keys(this.form).forEach(campo => {
        this.validateField(campo)
      })
      
      if (!this.formularioValido) {
        return
      }
      
      this.enviando = true
      this.mensagemSucesso = ''
      
      try {
        // Simula envio para API
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        this.$emit('produto-cadastrado', { ...this.form })
        this.mensagemSucesso = 'Produto cadastrado com sucesso!'
        this.limparFormulario()
      } catch (error) {
        console.error(error)
      } finally {
        this.enviando = false
      }
    },
    
    limparFormulario() {
      this.form = {
        nome: '',
        preco: null,
        estoque: null,
        categoria: ''
      }
      this.erros = {
        nome: '',
        preco: '',
        estoque: '',
        categoria: ''
      }
      this.mensagemSucesso = ''
    }
  }
}
</script>
```

---

## Passo 2: Criar Arquivo de Teste

Crie `tests/unit/components/FormularioProduto.spec.js`:

```javascript
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import FormularioProduto from '@/components/FormularioProduto.vue'

describe('FormularioProduto.vue', () => {
  let wrapper
  
  beforeEach(() => {
    wrapper = mount(FormularioProduto)
  })
  
  describe('renderizacao inicial', () => {
    it('deve renderizar formulario com todos os campos', () => {
      expect(wrapper.find('#nome').exists()).toBe(true)
      expect(wrapper.find('#preco').exists()).toBe(true)
      expect(wrapper.find('#estoque').exists()).toBe(true)
      expect(wrapper.find('#categoria').exists()).toBe(true)
    })
    
    it('deve renderizar botao de submit', () => {
      const submitBtn = wrapper.find('button[type="submit"]')
      expect(submitBtn.text()).toBe('Salvar Produto')
    })
    
    it('deve renderizar botao de limpar', () => {
      const clearBtn = wrapper.find('button[type="button"]')
      expect(clearBtn.text()).toBe('Limpar')
    })
    
    it('deve inicializar campos vazios', () => {
      expect(wrapper.find('#nome').element.value).toBe('')
      expect(wrapper.find('#preco').element.value).toBe('')
      expect(wrapper.find('#estoque').element.value).toBe('')
      expect(wrapper.find('#categoria').element.value).toBe('')
    })
    
    it('deve desabilitar botao submit inicialmente', () => {
      const submitBtn = wrapper.find('button[type="submit"]')
      expect(submitBtn.attributes('disabled')).toBeDefined()
    })
  })
  
  describe('validacao de nome', () => {
    it('deve mostrar erro quando nome vazio', async () => {
      const input = wrapper.find('#nome')
      await input.setValue('')
      await input.trigger('blur')
      
      expect(wrapper.text()).toContain('Nome é obrigatorio')
    })
    
    it('deve mostrar erro quando nome tem menos de 3 caracteres', async () => {
      const input = wrapper.find('#nome')
      await input.setValue('Ab')
      await input.trigger('blur')
      
      expect(wrapper.text()).toContain('Nome deve ter no minimo 3 caracteres')
    })
    
    it('deve aceitar nome valido', async () => {
      const input = wrapper.find('#nome')
      await input.setValue('Produto Valido')
      await input.trigger('blur')
      
      expect(wrapper.find('.mensagem-erro').exists()).toBe(false)
    })
    
    it('deve adicionar classe erro no input quando invalido', async () => {
      const input = wrapper.find('#nome')
      await input.setValue('')
      await input.trigger('blur')
      
      expect(input.classes()).toContain('erro')
    })
  })
  
  describe('validacao de preco', () => {
    it('deve mostrar erro quando preco vazio', async () => {
      const input = wrapper.find('#preco')
      await input.setValue('')
      await input.trigger('blur')
      
      expect(wrapper.text()).toContain('Preco é obrigatorio')
    })
    
    it('deve mostrar erro quando preco menor ou igual a zero', async () => {
      const input = wrapper.find('#preco')
      await input.setValue(0)
      await input.trigger('blur')
      
      expect(wrapper.text()).toContain('Preco deve ser maior que zero')
    })
    
    it('deve aceitar preco valido', async () => {
      const input = wrapper.find('#preco')
      await input.setValue(99.99)
      await input.trigger('blur')
      
      const erros = wrapper.findAll('.mensagem-erro')
      const erroPreco = erros.find(el => el.text().includes('Preco'))
      expect(erroPreco).toBeUndefined()
    })
  })
  
  describe('validacao de estoque', () => {
    it('deve mostrar erro quando estoque vazio', async () => {
      const input = wrapper.find('#estoque')
      await input.setValue('')
      await input.trigger('blur')
      
      expect(wrapper.text()).toContain('Estoque é obrigatorio')
    })
    
    it('deve mostrar erro quando estoque negativo', async () => {
      const input = wrapper.find('#estoque')
      await input.setValue(-1)
      await input.trigger('blur')
      
      expect(wrapper.text()).toContain('Estoque nao pode ser negativo')
    })
    
    it('deve aceitar estoque zero', async () => {
      const input = wrapper.find('#estoque')
      await input.setValue(0)
      await input.trigger('blur')
      
      const erros = wrapper.findAll('.mensagem-erro')
      const erroEstoque = erros.find(el => el.text().includes('Estoque'))
      expect(erroEstoque).toBeUndefined()
    })
  })
  
  describe('validacao de categoria', () => {
    it('deve mostrar erro quando categoria nao selecionada', async () => {
      const select = wrapper.find('#categoria')
      await select.setValue('')
      await select.trigger('blur')
      
      expect(wrapper.text()).toContain('Categoria é obrigatoria')
    })
    
    it('deve aceitar categoria valida', async () => {
      const select = wrapper.find('#categoria')
      await select.setValue('eletronicos')
      await select.trigger('blur')
      
      const erros = wrapper.findAll('.mensagem-erro')
      const erroCategoria = erros.find(el => el.text().includes('Categoria'))
      expect(erroCategoria).toBeUndefined()
    })
    
    it('deve ter opcoes de categoria', () => {
      const select = wrapper.find('#categoria')
      const options = select.findAll('option')
      
      expect(options).toHaveLength(4) // 1 vazia + 3 categorias
      expect(options[1].text()).toBe('Eletronicos')
      expect(options[2].text()).toBe('Livros')
      expect(options[3].text()).toBe('Roupas')
    })
  })
  
  describe('submit do formulario', () => {
    it('nao deve submeter formulario invalido', async () => {
      const form = wrapper.find('form')
      await form.trigger('submit.prevent')
      
      expect(wrapper.emitted('produto-cadastrado')).toBeUndefined()
    })
    
    it('deve submeter formulario valido', async () => {
      await wrapper.find('#nome').setValue('Notebook')
      await wrapper.find('#preco').setValue(2500)
      await wrapper.find('#estoque').setValue(10)
      await wrapper.find('#categoria').setValue('eletronicos')
      
      const form = wrapper.find('form')
      await form.trigger('submit.prevent')
      
      // Aguarda processamento assincrono
      await nextTick()
      await nextTick()
      
      expect(wrapper.emitted('produto-cadastrado')).toBeTruthy()
    })
    
    it('deve emitir dados corretos ao submeter', async () => {
      const produtoData = {
        nome: 'Mouse Gamer',
        preco: 150,
        estoque: 50,
        categoria: 'eletronicos'
      }
      
      await wrapper.find('#nome').setValue(produtoData.nome)
      await wrapper.find('#preco').setValue(produtoData.preco)
      await wrapper.find('#estoque').setValue(produtoData.estoque)
      await wrapper.find('#categoria').setValue(produtoData.categoria)
      
      const form = wrapper.find('form')
      await form.trigger('submit.prevent')
      
      await nextTick()
      await nextTick()
      
      const emitted = wrapper.emitted('produto-cadastrado')
      expect(emitted[0][0]).toEqual(produtoData)
    })
    
    it('deve mostrar loading durante submit', async () => {
      await wrapper.find('#nome').setValue('Teste')
      await wrapper.find('#preco').setValue(100)
      await wrapper.find('#estoque').setValue(5)
      await wrapper.find('#categoria').setValue('livros')
      
      const form = wrapper.find('form')
      form.trigger('submit.prevent')
      
      await nextTick()
      
      const submitBtn = wrapper.find('button[type="submit"]')
      expect(submitBtn.text()).toBe('Salvando...')
      expect(submitBtn.attributes('disabled')).toBeDefined()
    })
    
    it('deve mostrar mensagem de sucesso apos submit', async () => {
      await wrapper.find('#nome').setValue('Teste')
      await wrapper.find('#preco').setValue(100)
      await wrapper.find('#estoque').setValue(5)
      await wrapper.find('#categoria').setValue('livros')
      
      const form = wrapper.find('form')
      await form.trigger('submit.prevent')
      
      // Aguarda processamento e timeout do simula envio
      await new Promise(resolve => setTimeout(resolve, 1100))
      await nextTick()
      
      expect(wrapper.find('.sucesso').text()).toBe('Produto cadastrado com sucesso!')
    })
    
    it('deve limpar formulario apos submit com sucesso', async () => {
      await wrapper.find('#nome').setValue('Teste')
      await wrapper.find('#preco').setValue(100)
      await wrapper.find('#estoque').setValue(5)
      await wrapper.find('#categoria').setValue('livros')
      
      const form = wrapper.find('form')
      await form.trigger('submit.prevent')
      
      await new Promise(resolve => setTimeout(resolve, 1100))
      await nextTick()
      
      expect(wrapper.find('#nome').element.value).toBe('')
      expect(wrapper.find('#preco').element.value).toBe('')
      expect(wrapper.find('#estoque').element.value).toBe('')
      expect(wrapper.find('#categoria').element.value).toBe('')
    })
  })
  
  describe('botao limpar', () => {
    it('deve limpar todos os campos', async () => {
      await wrapper.find('#nome').setValue('Teste')
      await wrapper.find('#preco').setValue(100)
      await wrapper.find('#estoque').setValue(5)
      await wrapper.find('#categoria').setValue('livros')
      
      const clearBtn = wrapper.find('button[type="button"]')
      await clearBtn.trigger('click')
      
      expect(wrapper.find('#nome').element.value).toBe('')
      expect(wrapper.find('#preco').element.value).toBe('')
      expect(wrapper.find('#estoque').element.value).toBe('')
      expect(wrapper.find('#categoria').element.value).toBe('')
    })
    
    it('deve limpar mensagens de erro', async () => {
      await wrapper.find('#nome').setValue('')
      await wrapper.find('#nome').trigger('blur')
      
      expect(wrapper.text()).toContain('Nome é obrigatorio')
      
      const clearBtn = wrapper.find('button[type="button"]')
      await clearBtn.trigger('click')
      
      expect(wrapper.find('.mensagem-erro').exists()).toBe(false)
    })
    
    it('deve limpar mensagem de sucesso', async () => {
      wrapper.vm.mensagemSucesso = 'Sucesso!'
      await nextTick()
      
      const clearBtn = wrapper.find('button[type="button"]')
      await clearBtn.trigger('click')
      
      expect(wrapper.find('.sucesso').exists()).toBe(false)
    })
  })
  
  describe('computed formularioValido', () => {
    it('deve retornar false quando formulario vazio', () => {
      expect(wrapper.vm.formularioValido).toBe(false)
    })
    
    it('deve retornar false quando tem erros de validacao', async () => {
      await wrapper.find('#nome').setValue('Ab') // Nome muito curto
      await wrapper.find('#nome').trigger('blur')
      await wrapper.find('#preco').setValue(100)
      await wrapper.find('#estoque').setValue(5)
      await wrapper.find('#categoria').setValue('livros')
      
      expect(wrapper.vm.formularioValido).toBe(false)
    })
    
    it('deve retornar true quando formulario valido', async () => {
      await wrapper.find('#nome').setValue('Produto Teste')
      await wrapper.find('#preco').setValue(100)
      await wrapper.find('#estoque').setValue(5)
      await wrapper.find('#categoria').setValue('livros')
      
      expect(wrapper.vm.formularioValido).toBe(true)
    })
  })
})
```

---

## Passo 3: Executar Testes

```bash
npm test FormularioProduto.spec.js
```

Resultado esperado: todos os 35+ testes devem passar.

---

## Passo 4: Verificar Cobertura

```bash
npm run test:coverage -- FormularioProduto.spec.js
```

O componente deve ter alta cobertura em:
- Renderizacao de elementos
- Validacoes de campos
- Interacoes do usuario
- Submit do formulario

---

## O que Aprendemos

1. **Testar renderizacao inicial**
   - Verificar existencia de elementos
   - Verificar valores iniciais
   - Verificar estados de botoes

2. **Testar validacoes de campos**
   - Mensagens de erro
   - Classes CSS condicionais
   - Diferentes tipos de validacao

3. **Testar interacoes do usuario**
   - `setValue()` para inputs
   - `trigger('blur')` para validacao
   - `trigger('click')` para botoes

4. **Testar submit de formulario**
   - Prevenir submit invalido
   - Emitir eventos com dados
   - Estados de loading
   - Mensagens de sucesso

5. **Usar `nextTick()`**
   - Aguardar atualizacoes do DOM
   - Lidar com operacoes assincronas

6. **Testar computed properties**
   - Acessar `wrapper.vm.propriedade`
   - Verificar logica computada
