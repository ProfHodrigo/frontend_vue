## Aula 1 — Introdução ao Vue.js## Aula 1 — Introdução ao Vue.js



### Objetivos### Objetivos

- Entender o que é Vue.js e suas vantagens- Entender o que é Vue.js e suas vantagens

- Configurar o ambiente de desenvolvimento- Configurar o ambiente de desenvolvimento

- Criar o primeiro componente Vue- Criar o primeiro componente Vue

- Dominar os conceitos fundamentais: reatividade, templates, data binding- Entender a estrutura básica de um projeto Vue

- Conceitos fundamentais: reatividade, templates, data binding

---

---

### O que é Vue.js?

### O que é Vue.js?

Vue.js é um framework JavaScript **progressivo** para construção de interfaces de usuário (UI).

Vue.js é um framework JavaScript progressivo para construção de interfaces de usuário (UI). É conhecido por:

**Principais características:**

- **Reatividade**: Atualizações automáticas da UI quando dados mudam- **Reatividade**: Atualizações automáticas da UI quando dados mudam

- **Componentes**: Estrutura modular e reutilizável- **Componentes**: Estrutura modular e reutilizável

- **Simplicidade**: Curva de aprendizado suave- **Simplicidade**: Curva de aprendizado suave

- **Flexibilidade**: Pode ser adotado incrementalmente- **Flexibilidade**: Pode ser adotado incrementalmente

- **Ecosystem**: Vue Router, Pinia, Vite, etc.

---

---

### Vue.js vs Flask Backend

### Comparação com o Backend Flask

| Aspecto | Flask (Backend) | Vue.js (Frontend) |

|---------|----------------|-------------------|| Aspecto | Flask (Backend) | Vue.js (Frontend) |

| **Função** | Servidor, API, lógica de negócio | Interface do usuário ||---------|----------------|-------------------|

| **Renderização** | Server-side (Jinja2) | Client-side (reativo) || **Função** | Servidor, API, lógica de negócio | Interface do usuário, experiência |

| **Estados** | Sessões, banco de dados | Estados locais e globais || **Renderização** | Server-side (templates Jinja2) | Client-side (reativo) |

| **Comunicação** | HTTP requests/responses | Consome APIs via HTTP || **Estados** | Sessões, banco de dados | Estados locais e globais |

| **Comunicação** | HTTP requests/responses | Consume APIs via HTTP |

---

---

### Instalação e Configuração

### Instalação e Configuração

#### Verificar pré-requisitos

```bash#### Pré-requisitos

node --version  # Necessário 16+```bash

npm --version# Verificar Node.js (necessário 16+)

```node --version

npm --version

#### Instalar dependências e rodar```

```bash

npm install#### Instalando Dependências

npm run dev```bash

# Acesse: http://localhost:5173 ou http://localhost:3000# No diretório do projeto

```npm install



---# Verificar se foi instalado

npm list vue

### Estrutura do Projeto```



```#### Executando o Projeto

frontend_vue/```bash

├── src/# Servidor de desenvolvimento

│   ├── components/     # Componentes reutilizáveisnpm run dev

│   ├── views/          # Páginas/telas

│   ├── App.vue         # Componente raiz# Acesse: http://localhost:3000

│   └── main.js         # Ponto de entrada```

├── public/             # Arquivos estáticos

├── index.html          # HTML principal---

└── package.json        # Configurações

```### Estrutura Básica de um Projeto Vue



---```

frontend_vue/

### Anatomia de um Componente Vue├── public/              # Arquivos estáticos

│   └── favicon.ico     

Um arquivo `.vue` possui **3 seções**:├── src/                # Código fonte

│   ├── components/     # Componentes reutilizáveis

```vue│   ├── views/          # Páginas/telas

<template>│   ├── assets/         # Recursos (CSS, imagens)

  <!-- 1. HTML do componente -->│   ├── App.vue         # Componente raiz

  <div class="hello">│   └── main.js         # Ponto de entrada

    <h1>{{ titulo }}</h1>├── index.html          # HTML principal

    <button @click="incrementar">Cliques: {{ contador }}</button>├── package.json        # Configurações e dependências

  </div>└── vite.config.js      # Configurações do Vite

</template>```



<script>---

// 2. Lógica JavaScript

export default {### Anatomia de um Componente Vue

  name: 'HelloWorld',

  data() {Um arquivo `.vue` contém três seções:

    return {

      titulo: 'Minha Primeira Aula Vue!',```vue

      contador: 0<template>

    }  <!-- HTML do componente -->

  },  <div class="hello">

  methods: {    <h1>{{ titulo }}</h1>

    incrementar() {    <button @click="incrementar">Cliques: {{ contador }}</button>

      this.contador++  </div>

    }</template>

  }

}<script>

</script>// Lógica JavaScript

export default {

<style scoped>  name: 'HelloWorld',

/* 3. CSS específico deste componente */  data() {

.hello {    return {

  text-align: center;      titulo: 'Minha Primeira Aula Vue!',

  padding: 20px;      contador: 0

}    }

</style>  },

```  methods: {

    incrementar() {

**Explicação:**      this.contador++

- `<template>`: HTML do componente com sintaxe Vue    }

- `<script>`: Lógica JavaScript (data, methods, computed)  }

- `<style scoped>`: CSS isolado ao componente}

</script>

---

<style scoped>

### Conceitos Fundamentais/* CSS específico deste componente */

.hello {

#### 1. Data Binding (Vinculação de Dados)  text-align: center;

  padding: 20px;

**Interpolação de texto:**}

```vue

<template>button {

  <p>{{ mensagem }}</p>  margin-top: 10px;

  <!-- Renderiza: <p>Hello Vue!</p> -->  padding: 10px 20px;

</template>  font-size: 16px;

}

<script></style>

export default {```

  data() {

    return {---

      mensagem: 'Hello Vue!'

    }### Conceitos Fundamentais

  }

}#### 1. **Data Binding**

</script>```vue

```<template>

  <!-- Interpolação de texto -->

**Binding de atributos:**  <p>{{ mensagem }}</p>

```vue  

<template>  <!-- Binding de atributo -->

  <!-- v-bind ou : -->  <img :src="imagemUrl" :alt="descricao">

  <img :src="imagemUrl" :alt="descricao">  

</template>  <!-- Two-way binding -->

```  <input v-model="nome" placeholder="Digite seu nome">

  <p>Olá, {{ nome }}!</p>

**Two-way binding (v-model):**</template>

```vue

<template><script>

  <input v-model="nome" placeholder="Digite seu nome">export default {

  <p>Olá, {{ nome }}!</p>  data() {

</template>    return {

      mensagem: 'Hello Vue!',

<script>      imagemUrl: '/logo.png',

export default {      descricao: 'Logo Vue',

  data() {      nome: ''

    return { nome: '' }    }

  }  }

}}

</script></script>

``````



---#### 2. **Event Handling**

```vue

#### 2. Event Handling (Manipulação de Eventos)<template>

  <div>

```vue    <button @click="saudar">Dizer Olá</button>

<template>    <button @click="saudar('Vue.js')">Dizer Olá Vue</button>

  <div>    

    <!-- Sintaxe: @evento="metodo" ou v-on:evento="metodo" -->    <form @submit.prevent="enviarFormulario">

    <button @click="saudar">Dizer Olá</button>      <input v-model="email" type="email" required>

    <button @click="saudar('Vue.js')">Olá com parâmetro</button>      <button type="submit">Enviar</button>

        </form>

    <!-- Modificador .prevent = preventDefault() -->  </div>

    <form @submit.prevent="enviarFormulario"></template>

      <input v-model="email" type="email" required>

      <button type="submit">Enviar</button><script>

    </form>export default {

  </div>  data() {

</template>    return {

      email: ''

<script>    }

export default {  },

  data() {  methods: {

    return { email: '' }    saudar(nome = 'Mundo') {

  },      alert(`Olá, ${nome}!`)

  methods: {    },

    saudar(nome = 'Mundo') {    enviarFormulario() {

      alert(`Olá, ${nome}!`)      console.log('Email enviado:', this.email)

    },    }

    enviarFormulario() {  }

      console.log('Email enviado:', this.email)}

    }</script>

  }```

}

</script>#### 3. **Reatividade**

``````vue

<template>

**Modificadores úteis:**  <div>

- `.prevent` - preventDefault()    <h2>Carrinho de Compras</h2>

- `.stop` - stopPropagation()    <p>Total de itens: {{ totalItens }}</p>

- `.enter` - detecta tecla Enter    <p>Valor total: R$ {{ valorTotal.toFixed(2) }}</p>

    

---    <button @click="adicionarItem">Adicionar Item</button>

  </div>

#### 3. Computed Properties (Propriedades Computadas)</template>



```vue<script>

<template>export default {

  <div>  data() {

    <h2>Carrinho de Compras</h2>    return {

    <p>Total de itens: {{ totalItens }}</p>      itens: [

    <p>Valor total: R$ {{ valorTotal.toFixed(2) }}</p>        { nome: 'Produto A', preco: 10.50 },

    <button @click="adicionarItem">Adicionar Item</button>        { nome: 'Produto B', preco: 25.00 }

  </div>      ]

</template>    }

  },

<script>  computed: {

export default {    totalItens() {

  data() {      return this.itens.length

    return {    },

      itens: [    valorTotal() {

        { nome: 'Produto A', preco: 10.50 },      return this.itens.reduce((total, item) => total + item.preco, 0)

        { nome: 'Produto B', preco: 25.00 }    }

      ]  },

    }  methods: {

  },    adicionarItem() {

  computed: {      this.itens.push({

    // Recalculado automaticamente quando 'itens' mudar        nome: `Produto ${this.itens.length + 1}`,

    totalItens() {        preco: Math.random() * 50

      return this.itens.length      })

    },    }

    valorTotal() {  }

      return this.itens.reduce((total, item) => total + item.preco, 0)}

    }</script>

  },```

  methods: {

    adicionarItem() {---

      this.itens.push({

        nome: `Produto ${this.itens.length + 1}`,### Exercícios Práticos

        preco: Math.random() * 50

      })#### Exercício 1: Contador Personalizado

    }Crie um componente que:

  }- Tenha um contador que inicia em 0

}- Botões para +1, -1, +5, -5

</script>- Não permita valores negativos

```- Mostre uma mensagem quando chegar a 10



**Por que usar computed?**#### Exercício 2: Lista de Tarefas Simples

- Cacheadas baseadas em dependênciasCrie um componente que:

- Melhor performance que methods- Tenha um input para nova tarefa

- Código mais limpo e organizado- Lista de tarefas adicionadas

- Contador de tarefas total

---

#### Exercício 3: Calculadora IMC

### Exercícios PráticosCrie um componente que:

- Inputs para peso e altura

#### Exercício 1: Contador Personalizado- Calcule o IMC automaticamente

Crie `src/components/Contador.vue` que:- Mostre a classificação (baixo peso, normal, sobrepeso, etc.)

- Inicia em 0

- Botões: +1, -1, +5, -5---

- Não permite valores negativos

- Mostra mensagem ao chegar em 10### Conectando com o Backend Flask



**Dica:** Use `v-if` para a mensagem condicionalPara esta aula, vamos fazer uma conexão simples:



---```vue

<template>

#### Exercício 2: Lista de Tarefas  <div>

Crie `src/components/ListaTarefas.vue` que:    <h2>Dados do Backend</h2>

- Input para nova tarefa    <div v-if="carregando">Carregando...</div>

- Lista de tarefas adicionadas    <ul v-else>

- Contador de tarefas total      <li v-for="pessoa in pessoas" :key="pessoa.id">

        {{ pessoa.nome }}

**Dica:** Use array em `data()` e `v-for` no template      </li>

    </ul>

---  </div>

</template>

#### Exercício 3: Calculadora IMC

Crie `src/components/CalculadoraIMC.vue` que:<script>

- Inputs para peso e alturaexport default {

- Calcula IMC automaticamente (use `computed`)  data() {

- Mostra classificação (baixo peso, normal, sobrepeso, etc.)    return {

      pessoas: [],

**Fórmula:** IMC = peso / (altura²)      carregando: true

    }

---  },

  async mounted() {

### Preview: Conectando com Flask    try {

      // Simulando chamada à API Flask

Exemplo simples de consumo de API (aprofundaremos na Aula 3):      // Na Aula 3 veremos como fazer isso direito

      const response = await fetch('http://localhost:5000/api/dados')

```vue      this.pessoas = await response.json()

<template>    } catch (error) {

  <div>      console.error('Erro ao carregar dados:', error)

    <h2>Dados do Backend</h2>      this.pessoas = []

    <div v-if="carregando">Carregando...</div>    } finally {

    <ul v-else>      this.carregando = false

      <li v-for="pessoa in pessoas" :key="pessoa.id">    }

        {{ pessoa.nome }}  }

      </li>}

    </ul></script>

  </div>```

</template>

---

<script>

export default {### Arquivos Criados Nesta Aula

  data() {

    return {Após completar esta aula, você terá:

      pessoas: [],

      carregando: true1. `src/main.js` - Ponto de entrada da aplicação

    }2. `src/App.vue` - Componente raiz

  },3. `src/components/HelloWorld.vue` - Primeiro componente

  async mounted() {4. `src/components/Contador.vue` - Exercício 1

    try {5. `src/components/ListaTarefas.vue` - Exercício 2

      const response = await fetch('http://localhost:5000/api/dados')6. `src/components/CalculadoraIMC.vue` - Exercício 3

      this.pessoas = await response.json()

    } catch (error) {---

      console.error('Erro:', error)

    } finally {### Comandos Git para Esta Aula

      this.carregando = false

    }```bash

  }# Adicionar arquivos ao git

}git add .

</script>git commit -m "Aula 1 - Introdução ao Vue.js"

```

# Criar branch da aula 1

---git checkout -b aula-01-introducao

git push -u origin aula-01-introducao

### Arquivos da Aula 1

# Voltar para main

✅ Componentes criados:git checkout main

1. `src/main.js` - Ponto de entrada```

2. `src/App.vue` - Componente raiz

3. `src/components/HelloWorld.vue` - Demonstração---

4. `src/components/Contador.vue` - Exercício 1

5. `src/components/ListaTarefas.vue` - Exercício 2### Checklist de Verificação

6. `src/components/CalculadoraIMC.vue` - Exercício 3

- [ ] Projeto Vue rodando sem erros

---- [ ] Entendimento de template, script e style

- [ ] Data binding funcionando

### Comandos Git- [ ] Event handling implementado

- [ ] Exercícios práticos concluídos

```bash- [ ] Teste básico de conexão com Flask (opcional)

git checkout -b aula-01-introducao

git add .---

git commit -m "Aula 1 - Introdução ao Vue.js"

git push -u origin aula-01-introducao### Próxima Aula

```

Na **Aula 2** veremos:

---- Diretivas condicionais (v-if, v-show)

- Loops com v-for

### Checklist- Criação de componentes reutilizáveis

- Comunicação entre componentes

- [ ] Projeto rodando sem erros- Props e emissão de eventos

- [ ] Entendimento de template, script e style

- [ ] Data binding funcionando### Dicas Adicionais

- [ ] Event handling implementado

- [ ] Computed properties compreendidas- Use as **Vue DevTools** no navegador para debug

- [ ] Exercícios concluídos- O **Vite** oferece hot-reload automático

- Explore a documentação oficial: https://vuejs.org/

---- Pratique os conceitos de reatividade - é fundamental!

### Próxima Aula

**Aula 2 - Componentes e Diretivas:**
- v-if, v-else, v-show
- v-for com arrays e objetos
- Props e Emits
- Comunicação entre componentes

---

### Dicas

💡 **Vue DevTools**: Instale a extensão no navegador para debug  
💡 **Hot Reload**: O Vite recarrega automaticamente ao salvar  
💡 **Documentação**: https://vuejs.org/  
💡 **Pratique**: Reatividade é o coração do Vue!
