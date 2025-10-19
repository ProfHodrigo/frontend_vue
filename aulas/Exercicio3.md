# Exercício 3 - Formulário Multi-Etapas (Wizard)

## Objetivo

Criar um formulário em múltiplas etapas que guia o usuário através de um processo de cadastro complexo.

## Estrutura de Arquivos

```
src/
  components/
    wizard/
      Step1Personal.vue
      Step2Address.vue
      Step3Professional.vue
      Step4Review.vue
      StepIndicator.vue
  views/
    WizardView.vue
  utils/
    wizardValidation.js
```

## O que cada arquivo faz

### `src/utils/wizardValidation.js` - Validações por Etapa

**Responsabilidade:** Regras de validação específicas de cada etapa

**Contém:**
- Validadores para dados pessoais
- Validadores para endereço
- Validadores para dados profissionais
- Cada etapa tem seu próprio conjunto

### `src/components/wizard/Step1Personal.vue` - Etapa 1: Dados Pessoais

**O que faz:**
- Coleta nome, email, CPF
- Valida informações pessoais
- Permite avançar apenas se válido

**Campos:** Nome, Email, CPF

### `src/components/wizard/Step2Address.vue` - Etapa 2: Endereço

**O que faz:**
- Coleta CEP, logradouro, número, cidade, estado
- Valida endereço
- Permite avançar apenas se válido

**Campos:** CEP, Rua, Número, Cidade, Estado

### `src/components/wizard/Step3Professional.vue` - Etapa 3: Dados Profissionais

**O que faz:**
- Coleta profissão, empresa, salário
- Valida informações de trabalho
- Permite avançar apenas se válido

**Campos:** Profissão, Empresa, Salário

### `src/components/wizard/Step4Review.vue` - Etapa 4: Revisão

**O que faz:**
- Mostra TODOS os dados preenchidos
- Permite editar voltando para etapas anteriores
- Permite confirmar e enviar

**Não tem validação:** Apenas revisão dos dados

### `src/components/wizard/StepIndicator.vue` - Indicador de Progresso

**O que faz:**
- Mostra em qual etapa está (1/2/3/4)
- Mostra barras de progresso visual
- Permite clicar nas etapas (opcional)

### `src/views/WizardView.vue` - Página Principal do Wizard

**O que faz:**
- Gerencia qual etapa está ativa
- Controla navegação (Anterior/Próximo)
- Armazena dados de todas as etapas
- Coordena validações

## Fluxo do Wizard

```
Etapa 1: Dados Pessoais
├─ [Anterior (desativado)] [Próximo]
└─ Valida quando Próximo é clicado

Etapa 2: Endereço
├─ [Anterior] [Próximo]
└─ Valida quando Próximo é clicado

Etapa 3: Dados Profissionais
├─ [Anterior] [Próximo]
└─ Valida quando Próximo é clicado

Etapa 4: Revisão
├─ [Anterior] [Confirmar]
└─ Mostra todos os dados
   Se Anterior: volta para etapas
   Se Confirmar: envia dados
```

## Características Principais

1. **Validação por etapa:**
   - Não deixa avançar se etapa atual inválida
   - Mas deixa voltar sempre

2. **Persistência de dados:**
   - Se user volta para etapa anterior
   - Seus dados ainda estão lá

3. **Revisão antes de enviar:**
   - Mostra tudo antes de confirmar
   - Permite editar antes de enviar

4. **Indicador de progresso:**
   - User sempre sabe em qual etapa está
   - Mostra 1/4, 2/4, 3/4, 4/4

## Como Implementar

1. Criar `wizardValidation.js` com validadores
2. Criar 4 componentes de step
3. Criar componente de indicador
4. Criar view que controla o wizard
5. Adicionar rota e link em App.vue

## Estrutura da View Principal

```vue
StepIndicator (mostra 1/4, 2/4, etc)
    ↓
Component dinâmico baseado na etapa
(mostra Step1 OU Step2 OU Step3 OU Step4)
    ↓
Botões: [Anterior] [Próximo/Confirmar]
```

## Como Executar

```bash
npm run dev
# Acesse http://localhost:5173/wizard
```

## Dicas de Desenvolvimento

1. **Use v-show ou v-if:**
   - Para mostrar/esconder etapas dinamicamente

2. **Armazene dados:**
   - Em um objeto único na view pai
   - Cada step modifica o mesmo objeto

3. **Valide antes de avançar:**
   - Chame validação do step atual
   - Só avança se válido

4. **Permita voltar sempre:**
   - Não valida ao voltar
   - Apenas ao avançar

5. **Mostre review claro:**
   - Último passo mostra todos os dados
   - Permite editar ou confirmar
