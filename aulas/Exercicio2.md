# Exercício 2: Validação Assíncrona
Implementar validações com API:
- Verificar email único
- Validar CPF em base de dados
- Busca de endereço por CEP
- Debounce nas requisições

## Objetivo

Desenvolver um formulário de pesquisa avançada com filtros dinâmicos e atualização em tempo real dos resultados.

## Requisitos

### Campos de Pesquisa

O formulário deve incluir:

- Campo de busca principal (texto livre)
- Filtros por categoria (múltipla seleção)
- Range de preços (mínimo e máximo)
- Ordenação (diferentes critérios)
- Filtros avançados expansíveis

### Funcionalidades

Implemente as seguintes funcionalidades:

- Atualização automática dos resultados
- Limpar filtros individuais ou todos
- Salvar pesquisas favoritas
- Histórico de pesquisas recentes

### Interface

Desenvolva uma interface que apresente:

- Layout responsivo
- Feedback visual durante a busca
- Contador de resultados
- Preview dos filtros ativos

## Dicas de Implementação

1. **Gerenciamento de Estado**:
   - Use computed properties para filtros
   - Mantenha estado dos filtros organizado
   - Implemente debounce para buscas

2. **Performance**:
   - Otimize atualizações de lista
   - Cache resultados quando apropriado
   - Implemente paginação se necessário

3. **UX/UI**:
   - Mantenha interface intuitiva
   - Forneça feedback claro
   - Permita desfazer ações

## Desafios Extras

1. Adicionar suporte a filtros personalizados
2. Implementar visualização em grid/lista
3. Criar sistema de tags para pesquisas
4. Adicionar exportação de resultados

## Avaliação

Seu projeto será avaliado considerando:

- Responsividade da interface
- Performance das buscas
- Qualidade do código
- Experiência do usuário