# Exercício 1 - Formulário de Cadastro Multi-Componente

## Objetivo

Criar um formulário de cadastro modular usando componentes Vue.js, implementando validações e feedback visual para melhor experiência do usuário.

## Estrutura de Arquivos

```
src/
  components/
    cadastro/
      DadosPessoaisForm.vue
      EnderecoForm.vue
      SenhaForm.vue
      TermosForm.vue
  views/
    CadastroView.vue
  utils/
    validators.js
```

## Explicação de cada arquivo

### 1️ `src/utils/validators.js` - Biblioteca de Validações

**O que é:** Um arquivo com funções reutilizáveis para validar dados

**Por que precisa:** 
- Evita repetir código de validação
- Facilita manutenção (alterar uma validação em um só lugar)
- Permite reutilizar em qualquer componente

**Exemplo de uso:**
```javascript
// Usar em qualquer componente
validators.required('João') // retorna: true
validators.required('') // retorna: 'Campo obrigatório'
```

### 2️ `src/components/cadastro/DadosPessoaisForm.vue` - Dados Pessoais

**O que faz:**
- Gerencia um formulário com 4 campos
- Valida cada campo individualmente
- Mostra mensagens de erro

**Campos:**
1. Nome (mínimo 3 caracteres)
2. Email (deve ter formato válido: nome@email.com)
3. CPF (exatamente 11 dígitos)
4. Data de Nascimento (pessoa deve ter 18+ anos)

**Como funciona:**
```
User digita algo → Ao sair do campo (blur) → Valida → 
Se válido: sem mensagem de erro
Se inválido: mostra mensagem em vermelho
```

### 3️ `src/components/cadastro/EnderecoForm.vue` - Endereço

**O que faz:**
- Gerencia um formulário de endereço
- Tem 6 campos

**Campos:**
1. CEP (obrigatório)
2. Logradouro/Rua (obrigatório)
3. Número (obrigatório)
4. Complemento (opcional - pode deixar em branco)
5. Cidade (obrigatório)
6. Estado (obrigatório - escolher de uma lista)

**Detalhe importante:** 
O componente vem com lista de 27 estados brasileiros pré-preenchida

### 4️ `src/components/cadastro/SenhaForm.vue` - Senha com Indicador

**O que faz:**
- Gerencia criação e confirmação de senha
- Mostra força da senha em tempo real

**Funcionalidades extras:**
- Botão para mostrar/esconder a senha digitada
- Barra de progresso mostrando força (Fraca/Média/Forte)
- Valida se as 2 senhas são iguais

**Quanto a força:**
- Fraca: menos de 8 caracteres ou sem complexidade
- Média: 8+ caracteres com maiúsculas e minúsculas
- Forte: tem tudo + números e símbolos

### 5️ `src/components/cadastro/TermosForm.vue` - Termos e Condições

**O que faz:**
- Mostra texto dos termos de uso
- Tem um checkbox que user deve marcar
- Impede envio se não estiver marcado

**Simples mas importante:** Sem aceitar termos, não pode cadastrar

### 6 `src/views/CadastroView.vue` - Página Principal do Cadastro

**O que faz:**
- Junta todos os componentes acima em um único formulário
- Coordena a validação de todos (não deixa enviar se algum estiver inválido)
- Mostra barra de progresso
- Controla envio dos dados

**Estrutura:**
```
Barra de Progresso (0% a 100%)
    ↓
Dados Pessoais Form (componente 1)
    ↓
Endereço Form (componente 2)
    ↓
Senha Form (componente 3)
    ↓
Termos Form (componente 4)
    ↓
Botões: [Limpar] [Cadastrar]
```

## Passo a Passo - Implementação

### Passo 1: Criar arquivo de validações

**Arquivo:** `src/utils/validators.js`

Este arquivo é uma biblioteca com funções de validação reutilizáveis.

Cada validador:
- Recebe um valor
- Retorna `true` se válido
- Retorna uma mensagem de erro se inválido

### Passo 2: Criar os 4 componentes de formulário

Cada componente:
- Tem seu próprio `data()` com form e errors
- Tem método `validate(field)` para validar um campo
- Tem método `validateAll()` para validar todos os campos
- Tem método `getData()` para retornar seus dados

### Passo 3: Criar View Principal

A view:
- Importa todos os 4 componentes
- Coleta dados de todos eles
- Valida todos antes de enviar
- Mostra barra de progresso

### Passo 4: Configurar Rotas e Links

Adicione rota em `router/index.js` e link em `App.vue`

## Como Executar

```bash
npm install
npm run dev
# Acesse http://localhost:5173/cadastro
```