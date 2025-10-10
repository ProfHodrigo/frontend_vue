## Aula 2 — Componentes e Diretivas

### Objetivos
- Dominar as diretivas essenciais do Vue.js
- Criar componentes reutilizáveis
- Entender comunicação entre componentes (props e emits)
- Trabalhar com listas e renderização condicional

---

### Diretivas Fundamentais

#### 1. **v-if / v-else-if / v-else**
Renderização **condicional** - adiciona/remove elementos do DOM.

```vue
<template>
  <div v-if="usuario.tipo === 'admin'">
    Bem-vindo, Administrador!
  </div>
  <div v-else-if="usuario.tipo === 'moderador'">
    Bem-vindo, Moderador!
  </div>
  <div v-else>
    Bem-vindo, Usuário!
  </div>
</template>
```

**Quando usar:** Quando o elemento raramente muda ou não será exibido

---

#### 2. **v-show**
Controla a **visibilidade** (CSS `display`) sem remover do DOM.

```vue
<template>
  <button @click="menuVisivel = !menuVisivel">
    {{ menuVisivel ? 'Ocultar' : 'Mostrar' }} Menu
  </button>
  
  <nav v-show="menuVisivel">
    <!-- Menu aqui -->
  </nav>
</template>
```

**Quando usar:** Para alternar visibilidade frequentemente (melhor performance)

**Diferença v-if vs v-show:**
- `v-if`: Remove do DOM (mais pesado, mas economiza memória)
- `v-show`: Apenas CSS display:none (mais leve para toggles frequentes)

---

#### 3. **v-for**
Renderização de **listas**.

```vue
<template>
  <!-- Lista simples -->
  <ul>
    <li v-for="(fruta, index) in frutas" :key="index">
      {{ index + 1 }}. {{ fruta }}
    </li>
  </ul>

  <!-- Lista de objetos -->
  <div v-for="produto in produtos" :key="produto.id">
    <h5>{{ produto.nome }}</h5>
    <p>R$ {{ produto.preco.toFixed(2) }}</p>
  </div>

  <!-- Iteração sobre objeto -->
  <table>
    <tr v-for="(valor, chave) in infoSistema" :key="chave">
      <td>{{ chave }}</td>
      <td>{{ valor }}</td>
    </tr>
  </table>
</template>

<script>
export default {
  data() {
    return {
      frutas: ['Maçã', 'Banana', 'Laranja'],
      produtos: [
        { id: 1, nome: 'Notebook', preco: 2500.00 },
        { id: 2, nome: 'Mouse', preco: 45.90 }
      ],
      infoSistema: {
        'Versão': '1.0.0',
        'Framework': 'Vue.js 3'
      }
    }
  }
}
</script>
```

**⚠️ Importante:** Sempre use `:key` com valor único!

---

### Componentes Reutilizáveis

#### Estrutura Básica de um Componente Filho

**CartaoProduto.vue** - Componente que recebe dados via props:

```vue
<template>
  <div class="card">
    <h5>{{ produto.nome }}</h5>
    <p>R$ {{ produto.preco.toFixed(2) }}</p>
    <span :class="badgeClass">{{ statusTexto }}</span>
    
    <button 
      :disabled="produto.estoque === 0"
      @click="$emit('adicionar-carrinho', produto)"
    >
      Adicionar
    </button>
  </div>
</template>

<script>
export default {
  name: 'CartaoProduto',
  props: {
    produto: {
      type: Object,
      required: true,
      validator(produto) {
        return produto.nome && produto.preco >= 0
      }
    }
  },
  emits: ['adicionar-carrinho'],
  computed: {
    statusTexto() {
      if (this.produto.estoque === 0) return 'Esgotado'
      if (this.produto.estoque <= 5) return 'Últimas unidades'
      return 'Disponível'
    },
    badgeClass() {
      if (this.produto.estoque === 0) return 'badge-danger'
      if (this.produto.estoque <= 5) return 'badge-warning'
      return 'badge-success'
    }
  }
}
</script>
```

**Explicação:**
- **Props**: Dados que o componente pai passa para o filho
- **Emits**: Eventos que o filho emite para o pai
- **Validator**: Valida os dados recebidos via props

---

#### Usando o Componente (Pai)

**ListaProdutos.vue**:

```vue
<template>
  <div>
    <!-- Filtros -->
    <select v-model="filtroCategoria">
      <option value="">Todas</option>
      <option value="eletronicos">Eletrônicos</option>
    </select>
    
    <input v-model="pesquisa" placeholder="Pesquisar...">

    <!-- Renderizando componentes filhos -->
    <div v-for="produto in produtosFiltrados" :key="produto.id">
      <CartaoProduto 
        :produto="produto"
        @adicionar-carrinho="adicionarAoCarrinho"
      />
    </div>
  </div>
</template>

<script>
import CartaoProduto from './CartaoProduto.vue'

export default {
  components: { CartaoProduto },
  data() {
    return {
      pesquisa: '',
      filtroCategoria: '',
      produtos: [
        { id: 1, nome: 'Notebook', preco: 2500, estoque: 5, categoria: 'eletronicos' },
        { id: 2, nome: 'Mouse', preco: 45.90, estoque: 0, categoria: 'eletronicos' }
      ]
    }
  },
  computed: {
    produtosFiltrados() {
      return this.produtos.filter(p => {
        const matchPesquisa = p.nome.toLowerCase().includes(this.pesquisa.toLowerCase())
        const matchCategoria = !this.filtroCategoria || p.categoria === this.filtroCategoria
        return matchPesquisa && matchCategoria
      })
    }
  },
  methods: {
    adicionarAoCarrinho(produto) {
      if (produto.estoque > 0) {
        produto.estoque--
        alert(`${produto.nome} adicionado!`)
      }
    }
  }
}
</script>
```

---

###  Comunicação entre Componentes

#### Props (Pai → Filho)

```vue
<!-- Componente Pai -->
<template>
  <ComponenteFilho 
    :usuario="usuarioAtual"
    mensagem="Bem-vindo!"
  />
</template>

<!-- Componente Filho -->
<script>
export default {
  props: {
    usuario: {
      type: Object,
      required: true
    },
    mensagem: {
      type: String,
      default: 'Olá!'
    }
  }
}
</script>
```

**Tipos de Props:**
- `String`, `Number`, `Boolean`, `Array`, `Object`, `Function`
- `required`: prop obrigatória
- `default`: valor padrão
- `validator`: função de validação customizada

---

#### Emits (Filho → Pai)

```vue
<!-- Componente Filho -->
<template>
  <button @click="notificar">Clique</button>
</template>

<script>
export default {
  emits: ['botao-clicado'],
  methods: {
    notificar() {
      this.$emit('botao-clicado', {
        timestamp: Date.now()
      })
    }
  }
}
</script>

<!-- Componente Pai -->
<template>
  <ComponenteFilho @botao-clicado="handleClick" />
</template>

<script>
export default {
  methods: {
    handleClick(dados) {
      console.log('Evento recebido:', dados)
    }
  }
}
</script>
```

---

### Exercícios Práticos

#### Exercício 1: Sistema de Avaliações
Crie `AvaliacaoProduto.vue`:
- Receba produto como prop
- Permita avaliar de 1 a 5 estrelas
- Calcule média com computed
- Emita evento ao avaliar

**Veja implementação completa em:** `src/components/AvaliacaoProduto.vue`

---

#### Exercício 2: Lista de Tarefas Avançada
Crie `ItemTarefa.vue`:
- Componente separado para cada tarefa
- Filtros: Todas, Pendentes, Concluídas
- Edição inline
- Drag and drop (opcional)

**Veja implementação completa em:** `src/components/ItemTarefa.vue`

---

#### Exercício 3: Carrinho de Compras
Crie `CarrinhoCompras.vue`:
- Liste produtos adicionados
- Calcule subtotais e total
- Altere quantidades
- Cupom de desconto
- Botão finalizar compra

**Veja implementação completa em:** `src/components/CarrinhoCompras.vue`

---

### Componentes da Aula 2

📁 **Arquivos criados:**
1. `src/components/CartaoProduto.vue` - Componente de produto reutilizável
2. `src/components/ListaProdutos.vue` - Lista com filtros
3. `src/components/AvaliacaoProduto.vue` - Sistema de avaliações (Ex. 1)
4. `src/components/ItemTarefa.vue` - Item de tarefa reutilizável (Ex. 2)
5. `src/components/CarrinhoCompras.vue` - Carrinho completo (Ex. 3)

💡 **Dica:** Abra os arquivos `.vue` para ver a implementação completa com estilos CSS!

---

### Conceitos-Chave

✅ **v-if vs v-show:**
- v-if: remove do DOM
- v-show: display: none

✅ **v-for com :key:**
- Sempre use key única
- Ajuda o Vue a otimizar renderização

✅ **Props:**
- Dados fluem do pai para filho
- Tipagem e validação
- Não modifique props diretamente

✅ **Emits:**
- Eventos fluem do filho para pai
- Use nomes kebab-case (ex: `adicionar-item`)
- Declare no array `emits`

---

### Checklist

- [ ] v-if, v-else, v-show funcionando
- [ ] v-for com arrays e objetos
- [ ] Props validados corretamente
- [ ] Emits configurados
- [ ] Computed properties para filtros
- [ ] Componentes reutilizáveis criados
- [ ] Exercícios concluídos

---

### Comandos Git

```bash
git checkout -b aula-02-componentes
git add .
git commit -m "Aula 2 - Componentes e Diretivas"
git push -u origin aula-02-componentes
```

---

### Próxima Aula

**Aula 3 - Comunicação com API:**
- Axios e requisições HTTP
- Interceptadores
- Loading states
- Error handling
- Consumo da API Flask

---

### Recursos

📚 **Documentação:**
- [Vue Directives](https://vuejs.org/api/built-in-directives.html)
- [Components](https://vuejs.org/guide/essentials/component-basics.html)
- [Props](https://vuejs.org/guide/components/props.html)
- [Events](https://vuejs.org/guide/components/events.html)

💡 **Dica:** Use Vue DevTools para inspecionar props e events!
