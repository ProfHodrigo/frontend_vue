# Exercício 2 - Formulário de Pesquisa Dinâmica

## Objetivo

Desenvolver um formulário de pesquisa avançada com filtros dinâmicos e atualização em tempo real dos resultados.

## Estrutura de Arquivos

```
src/
  components/
    busca/
      SearchInput.vue
      FilterCategory.vue
      PriceRange.vue
      SortOptions.vue
      ResultsList.vue
  views/
    PesquisaView.vue
  utils/
    searchFilters.js
```

## O que cada arquivo faz

### `src/utils/searchFilters.js` - Lógica de Filtros

**Responsabilidade:** Funções para filtrar e ordenar produtos

**Contém:**
- Função para filtrar por categoria
- Função para filtrar por preço
- Função para ordenar por diferentes critérios

### `src/components/busca/SearchInput.vue` - Campo de Busca

**O que faz:**
- Campo de texto para buscar por nome
- Atualiza resultados enquanto digita (com debounce)
- Mostra número de resultados encontrados

### `src/components/busca/FilterCategory.vue` - Filtro de Categorias

**O que faz:**
- Checkboxes com lista de categorias
- Permite múltipla seleção
- Atualiza resultados em tempo real

### `src/components/busca/PriceRange.vue` - Filtro de Preço

**O que faz:**
- Range slider com preço mínimo e máximo
- Mostra o intervalo selecionado
- Filtra produtos por faixa de preço

### `src/components/busca/SortOptions.vue` - Ordenação

**O que faz:**
- Dropdown com opções de ordenação
- Opções: Preço (menor/maior), Nome (A-Z), Mais Recentes

### `src/components/busca/ResultsList.vue` - Lista de Resultados

**O que faz:**
- Exibe produtos filtrados em cards
- Mostra imagem, nome, preço
- Botão para ver detalhes

### `src/views/PesquisaView.vue` - Página Principal de Busca

**O que faz:**
- Junta todos os componentes de filtro
- Coordena os filtros
- Mostra resultados atualizados
- Gerencia estado de busca

## Funcionalidades

1. **Busca por texto:**
   - Digita no campo
   - Resultados atualizam automaticamente

2. **Filtros por categoria:**
   - Marca/desmarca categorias
   - Apenas produtos selecionados aparecem

3. **Filtro por preço:**
   - Arrasta slider para selecionar faixa
   - Mostra somente produtos naquela faixa

4. **Ordenação:**
   - Escolhe critério de ordenação
   - Lista reordena

5. **Combinação de filtros:**
   - Todos os filtros funcionam juntos
   - Resultados respeitam TODOS simultaneamente

## Exemplo de Fluxo

```
1. User abre página
   ↓
2. Vê lista completa de produtos
   ↓
3. Digita "camiseta" na busca
   ↓
4. Lista filtra para mostrar apenas camisetas
   ↓
5. Marca categoria "Azul"
   ↓
6. Lista mostra apenas camisetas azuis
   ↓
7. Arrasta preço para "50-100"
   ↓
8. Lista mostra apenas camisetas azuis entre 50-100
   ↓
9. Seleciona "Ordenar por Preço (menor)"
   ↓
10. Lista mostra camisetas azuis 50-100 ordenadas por preço
```

## Como Implementar

1. Criar arquivo `searchFilters.js` com funções de filtro
2. Criar 5 componentes de filtro/busca
3. Criar view que junta tudo
4. Adicionar rota e link em App.vue

## Como Executar

```bash
npm run dev
# Acesse http://localhost:5173/pesquisa
```
