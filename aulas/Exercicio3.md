# Exercício 3: Formulário Dinâmico
Criar formulário que se adapta:
- Campos condicionais
- Validações dinâmicas
- Seções que aparecem/desaparecem
- Schema-driven forms

## Objetivo

Criar um formulário dividido em múltiplas etapas (wizard) que guie o usuário através de um processo de cadastro complexo.

## Requisitos

### Estrutura do Formulário

Divida o formulário em etapas lógicas:

- Dados Pessoais
- Endereço
- Dados Profissionais
- Revisão e Confirmação

### Navegação

Implemente controles de navegação:

- Botões Anterior/Próximo
- Indicador de progresso
- Validação por etapa
- Salvar progresso parcial

### Funcionalidades

Adicione as seguintes funcionalidades:

- Validação específica por etapa
- Persistência de dados entre etapas
- Confirmação antes de sair
- Resumo final antes do envio

## Dicas de Implementação

1. **Gerenciamento de Estado**:
   - Centralize dados do formulário
   - Mantenha estado de validação
   - Controle navegação entre etapas

2. **Validações**:
   - Valide cada etapa individualmente
   - Permita avançar apenas se válido
   - Mantenha feedback consistente

3. **UX/UI**:
   - Mostre progresso claramente
   - Forneça instruções contextuais
   - Mantenha navegação intuitiva

## Desafios Extras

1. Adicionar rotas para cada etapa
2. Implementar salvamento automático
3. Criar modo de edição rápida
4. Adicionar suporte a diferentes fluxos

## Avaliação

Seu projeto será avaliado considerando:

- Fluidez da navegação
- Gerenciamento de estado
- Tratamento de erros
- Experiência do usuário