# Exercício 3 — Lista de Tarefas Avançada (ItemTarefa.vue)

## Objetivo
Criar uma lista de tarefas avançada utilizando componentes Vue, com filtros, edição inline e (opcionalmente) drag and drop.

---

## Guia para Realização

### 1. Planeje a Estrutura dos Componentes
- Crie um componente `ItemTarefa.vue` para representar cada tarefa individual.
- O componente pai (ex: `ListaTarefas.vue`) será responsável por gerenciar a lista e os filtros.

### 2. Defina o Modelo de Dados
- Cada tarefa pode ter: `id`, `titulo`, `concluida` (boolean), `editando` (boolean).
- Exemplo:
  ```js
  { id: 1, titulo: 'Estudar Vue', concluida: false, editando: false }
  ```

### 3. Implemente Filtros
- Permita filtrar tarefas por: Todas, Pendentes, Concluídas.
- Use `v-for` para renderizar a lista filtrada.
- Use `v-model` para controlar o filtro selecionado.

### 4. Edição Inline
- Permita editar o título da tarefa ao clicar em um botão ou dar duplo clique.
- Use `v-if`/`v-else` para alternar entre o modo de exibição e o modo de edição.
- Use `v-model` para editar o texto.

### 5. Marcar como Concluída
- Adicione um checkbox ou botão para marcar/desmarcar a tarefa como concluída.
- Use `v-bind:class` para estilizar tarefas concluídas (ex: texto riscado).

### 6. (Opcional) Drag and Drop
- Pesquise sobre a diretiva `v-drag` ou bibliotecas como `vue-draggable` para reordenar tarefas.

### 7. Comunicação entre Componentes
- Use `props` para passar dados para `ItemTarefa`.
- Use `emits` para notificar o pai sobre alterações (ex: tarefa editada, removida, concluída).

---

## Dicas
- Use `key` único no `v-for`.
- Separe bem a lógica de cada componente.
- Use computed para filtrar tarefas.
- Valide entradas do usuário.
- Pesquise exemplos de ToDo List com Vue para inspiração.

---

## Recursos Úteis
- [Documentação Vue - Lista de Tarefas](https://vuejs.org/examples/#todo-list)
- [Vue Draggable](https://github.com/SortableJS/vue.draggable.next)
- [Diretivas Vue](https://vuejs.org/guide/essentials/template-syntax.html#directives)
