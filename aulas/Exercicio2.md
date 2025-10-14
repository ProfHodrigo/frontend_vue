
# Exercício 2 — Carrinho de Compras (CarrinhoCompras.vue)

## Objetivo
Implementar um carrinho de compras funcional em Vue, integrado ao App.vue via um slider lateral, permitindo listar produtos, alterar quantidades, aplicar cupom e finalizar compra.

---

## Guia para Realização

### 1. Integração com App.vue
- O carrinho deve aparecer como um **slider lateral** (side panel) ao clicar no botão de carrinho no App.vue.
- Use um `<transition>` para animar a abertura/fechamento do carrinho.
- O componente `CarrinhoCompras.vue` será exibido dentro desse slider.

### 2. Estruture o Carrinho
- Crie `CarrinhoCompras.vue` para exibir os itens do carrinho.
- Cada item pode ser um componente filho (ex: `ItemCarrinho.vue`).
- O App.vue deve controlar a abertura/fechamento do slider e passar os dados necessários via props.

### 3. Modelo de Dados
- Cada produto no carrinho deve ter: `id`, `nome`, `preco`, `quantidade` (e opcionalmente `descricao`).
- Exemplo:
  ```js
  { id: 1, nome: 'Notebook', preco: 2500, quantidade: 2 }
  ```

### 4. Renderize a Lista de Itens
- Use `v-for` para exibir todos os produtos do carrinho.
- Use `v-bind` para passar dados para componentes filhos.

### 5. Alteração de Quantidade
- Permita aumentar/diminuir a quantidade de cada item.
- Use eventos para comunicar alterações ao componente pai.

### 6. Cálculo de Subtotal e Total
- Use propriedades computadas para calcular subtotal de cada item e o total geral.

### 7. Aplicação de Cupom de Desconto
- Adicione um campo para inserir cupom.
- Valide o cupom e aplique desconto ao total, se válido.

### 8. Finalizar Compra
- Adicione um botão para finalizar a compra.
- Mostre um resumo dos itens e valores.

### 9. Comunicação entre Componentes
- Use `props` e `emits` para interação entre `CarrinhoCompras` e itens.
- O App.vue pode escutar eventos como `finalizar-compra` ou `voltar-compras` para controlar o fluxo.

---

## Dicas Práticas
- Use `v-model` para inputs de cupom.
- Sempre valide quantidade mínima/máxima.
- Use `v-if` para mostrar mensagens de carrinho vazio.
- Separe lógica de cálculo em computed.
- Use transições para uma boa experiência de abertura/fechamento do slider.
- Pesquise exemplos de carrinho em Vue para ideias de UX.

---

## Recursos Úteis
- [Documentação Vue - Computed](https://vuejs.org/guide/essentials/computed.html)
- [Exemplo de Carrinho Vue](https://vuejs.org/examples/#shopping-cart)
