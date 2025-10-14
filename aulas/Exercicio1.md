# Exercício 1 — Sistema de Avaliações (AvaliacaoProduto.vue)

## Objetivo
Criar um componente Vue chamado `AvaliacaoProduto.vue` que permita ao usuário avaliar um produto de 1 a 5 estrelas, calcule a média das avaliações e emita um evento ao avaliar.

---

## Passo a Passo Detalhado

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

## Explicação dos Requisitos

### 1. Receber produto como prop
- O componente espera um objeto `produto` como prop obrigatória.
- Exemplo de uso:
  ```vue
  <AvaliacaoProduto :produto="{ id: 1, nome: 'Notebook' }" @avaliado="onAvaliado" />
  ```

### 2. Permitir avaliar de 1 a 5 estrelas
- Usa um `v-for` para renderizar 5 estrelas.
- O clique em uma estrela chama o método `avaliar(estrela)`.
- O usuário pode clicar em qualquer estrela para dar a nota correspondente.
- O estado `hover` permite efeito visual ao passar o mouse.

### 3. Calcular média com computed
- A propriedade computada `media` calcula a média das notas do array `avaliacoes`.
- Exibe a média e o número de avaliações.

### 4. Emitir evento ao avaliar
- O método `avaliar` emite o evento `avaliado` com o produto e a nota:
  ```js
  this.$emit('avaliado', { produto: this.produto, nota })
  ```
- O componente pai pode escutar esse evento para registrar avaliações.

### 5. Remover avaliação do usuário (extra)
- O botão "Remover minha avaliação" permite desfazer a última avaliação do usuário.

---

## Dicas e Boas Práticas
- Use `scoped` no `<style>` para evitar conflitos de CSS.
- Sempre valide as props recebidas.
- O array `avaliacoes` pode ser compartilhado via prop ou store para avaliações globais.
- Para produção, armazene avaliações em backend ou localStorage.

---

## Exemplo de Uso em App.vue
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

## Veja implementação completa em:
`src/components/AvaliacaoProduto.vue`
