# Exercício 1 — Sistema de Avaliações (AvaliacaoProduto.vue)

## Objetivo
Criar um componente Vue chamado `AvaliacaoProduto.vue` que permita ao usuário avaliar um produto de 1 a 5 estrelas, calcule a média das avaliações e emita um evento ao avaliar.

---

## Explicação dos Requisitos e das Diretivas Vue

### 1. Receber produto como prop e reutilização de componentes
- O componente `AvaliacaoProduto` é **reutilizável**: pode ser usado para qualquer produto, pois recebe o objeto `produto` como prop obrigatória.
- Exemplo de uso com **v-bind** (dois pontos):
  ```vue
  <AvaliacaoProduto :produto="{ id: 1, nome: 'Notebook' }" @avaliado="onAvaliado" />
  ```
  Aqui, `:produto` é um atalho para `v-bind:produto`, que faz o binding dinâmico do objeto.

### 2. Renderizar estrelas dinamicamente com v-for
- O `v-for` é usado para **renderizar 5 estrelas**:
  ```vue
  <span v-for="estrela in 5" :key="estrela">★</span>
  ```
  Isso cria 5 elementos de estrela, um para cada valor de 1 a 5.

### 3. Mostrar/ocultar elementos com v-if
- O `v-if` é usado para **mostrar a média** apenas se houver avaliações:
  ```vue
  <p v-if="media > 0">Média: ...</p>
  ```
- Também é usado para exibir o botão de remover avaliação apenas se o usuário já avaliou:
  ```vue
  <button v-if="avaliacaoUsuario > 0">Remover minha avaliação</button>
  ```

### 4. Controle de input com v-model
- O `v-model` faz o **two-way binding** entre campos de formulário e o estado do componente.
- No exemplo, se você quiser adicionar um campo de comentário, usaria:
  ```vue
  <input v-model="novoComentario" />
  ```
  Assim, o valor do input e da variável `novoComentario` ficam sempre sincronizados.

### 5. v-bind para atributos dinâmicos
- O `v-bind` (ou `:`) é usado para **atributos dinâmicos**:
  ```vue
  <span :class="['estrela', { ativa: estrela <= avaliacaoUsuario }]">★</span>
  ```
  Aqui, a classe `ativa` só aparece se a estrela for menor ou igual à nota do usuário.

### 6. Componentes reutilizáveis
- O `AvaliacaoProduto` pode ser usado em qualquer lugar do app para qualquer produto.
- Você pode criar outros componentes reutilizáveis, como um cartão de produto:
  ```vue
  <CartaoProduto :produto="produto" />
  ```
  E uma lista de produtos:
  ```vue
  <ListaProdutos :produtos="produtos" />
  ```

### 7. Emitir evento ao avaliar
- O método `avaliar` emite o evento `avaliado` com o produto e a nota:
  ```js
  this.$emit('avaliado', { produto: this.produto, nota })
  ```
- O componente pai pode escutar esse evento para registrar avaliações.

---


### 1. Estrutura do Componente
Crie o arquivo `src/components/AvaliacaoProduto.vue`.

```vue
<template>
  <div class="avaliacao-produto">
    <h4>{{ produto.nome }}</h4>
    <div class="estrelas">
      <span
        v-for="estrela in 5"
        :key="estrela"
        :class="['estrela', { ativa: estrela <= avaliacaoUsuario }]"
        @click="avaliar(estrela)"
        @mouseover="hover = estrela"
        @mouseleave="hover = 0"
      >
        ★
      </span>
    </div>
    <p v-if="media > 0">Média: {{ media.toFixed(2) }} ({{ avaliacoes.length }} avaliações)</p>
    <button v-if="avaliacaoUsuario > 0" @click="removerAvaliacao">Remover minha avaliação</button>
  </div>
</template>

<script>
export default {
  name: 'AvaliacaoProduto',
  props: {
    produto: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      avaliacoes: [], // array de números (1 a 5)
      avaliacaoUsuario: 0, // avaliação atual do usuário
      hover: 0
    }
  },
  computed: {
    media() {
      if (this.avaliacoes.length === 0) return 0
      return this.avaliacoes.reduce((a, b) => a + b, 0) / this.avaliacoes.length
    }
  },
  methods: {
    avaliar(nota) {
      this.avaliacaoUsuario = nota
      this.avaliacoes.push(nota)
      this.$emit('avaliado', { produto: this.produto, nota })
    },
    removerAvaliacao() {
      if (this.avaliacaoUsuario > 0) {
        const idx = this.avaliacoes.lastIndexOf(this.avaliacaoUsuario)
        if (idx !== -1) this.avaliacoes.splice(idx, 1)
        this.avaliacaoUsuario = 0
      }
    }
  }
}
</script>

<style scoped>
.avaliacao-produto { margin-bottom: 1.5rem; }
.estrelas { font-size: 2rem; color: #ccc; cursor: pointer; }
.estrela.ativa, .estrela:hover, .estrela:hover ~ .estrela { color: #FFD700; }
button { margin-top: 0.5rem; }
</style>
```

---

## Boas Práticas
- Use `scoped` no `<style>` para evitar conflitos de CSS.
- Sempre valide as props recebidas.
- O array `avaliacoes` pode ser compartilhado via prop ou store para avaliações globais.
- Para produção, armazene avaliações em backend ou localStorage.

---

## Exemplo de implementação no App.vue
```vue
<AvaliacaoProduto :produto="produto" @avaliado="registrarAvaliacao" />
```

```js
methods: {
  registrarAvaliacao({ produto, nota }) {
    alert(`Produto ${produto.nome} avaliado com nota ${nota}`)
  }
}
```

---
