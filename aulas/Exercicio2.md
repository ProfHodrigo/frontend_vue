# Exercício 2: Testar Validações com Vitest

## Objetivo

Criar testes completos para funções de validação, praticando testes unitários simples e efetivos com Vitest.

---

## Contexto

Você já viu exemplos de testes para componentes (Counter.vue e UserCard.vue). Agora vamos praticar testando funções utilitárias de validação que são fundamentais em qualquer aplicação.

---

## Passo 1: Revisar as Funções de Validação

O arquivo `src/utils/validators.js` possui várias funções de validação. Vamos testar as funções **simples** (não a classe FormValidator):

```javascript
// Funções que vamos testar:
export function validarEmail(email) { ... }
export function validarCPF(cpf) { ... }
export function validarTelefone(telefone) { ... }
```

**Dica**: Abra o arquivo `src/utils/validators.js` para ver a implementação completa.

---

## Passo 2: Criar Arquivo de Teste

Crie o arquivo `tests/unit/utils/validators.spec.js` (se não existir).

### Estrutura Básica

```javascript
import { describe, it, expect } from 'vitest'
import { validarEmail, validarCPF, validarTelefone } from '@/utils/validators'

describe('Validators', () => {
  // Seus testes aqui
})
```

---

## Passo 3: Implementar Testes para validarEmail

### Casos de teste a implementar:

1. **Deve validar email correto**
   - Testar: `'teste@exemplo.com'`, `'user@dominio.com.br'`
   - Esperar: `true`

2. **Deve rejeitar email sem @**
   - Testar: `'teste.exemplo.com'`
   - Esperar: `false`

3. **Deve rejeitar email sem domínio**
   - Testar: `'teste@'`, `'teste@.'`
   - Esperar: `false`

4. **Deve rejeitar string vazia**
   - Testar: `''`
   - Esperar: `false`

5. **Deve rejeitar email com espaços**
   - Testar: `'teste @exemplo.com'`, `'teste@exemplo .com'`
   - Esperar: `false`

### Exemplo de implementação:

```javascript
describe('validarEmail', () => {
  it('deve validar email correto', () => {
    expect(validarEmail('teste@exemplo.com')).toBe(true)
    expect(validarEmail('user@dominio.com.br')).toBe(true)
  })
  
  // Implemente os outros testes...
})
```

---

## Passo 4: Implementar Testes para validarCPF

### Casos de teste a implementar:

1. **Deve validar CPF correto**
   - Testar: `'11144477735'` (CPF válido sem formatação)
   - Esperar: `true`

2. **Deve validar CPF com formatação**
   - Testar: `'111.444.777-35'`
   - Esperar: `true`

3. **Deve rejeitar CPF inválido**
   - Testar: `'12345678901'`
   - Esperar: `false`

4. **Deve rejeitar CPF com todos dígitos iguais**
   - Testar: `'11111111111'`, `'00000000000'`, `'99999999999'`
   - Esperar: `false`

5. **Deve rejeitar CPF com tamanho incorreto**
   - Testar: `'123'`, `'123456789012'`
   - Esperar: `false`

### Estrutura:

```javascript
describe('validarCPF', () => {
  it('deve validar CPF correto', () => {
    // Seu código aqui
  })
  
  // Implemente os outros testes...
})
```

---

## Passo 5: Implementar Testes para validarTelefone

### Casos de teste a implementar:

1. **Deve validar telefone fixo (10 dígitos)**
   - Testar: `'1133334444'`
   - Esperar: `true`

2. **Deve validar celular (11 dígitos)**
   - Testar: `'11999998888'`
   - Esperar: `true`

3. **Deve validar com formatação**
   - Testar: `'(11) 3333-4444'`, `'(11) 99999-8888'`
   - Esperar: `true`

4. **Deve rejeitar telefone com tamanho incorreto**
   - Testar: `'123'`, `'123456789012'`
   - Esperar: `false`

5. **Deve rejeitar string vazia**
   - Testar: `''`
   - Esperar: `false`

### Estrutura:

```javascript
describe('validarTelefone', () => {
  it('deve validar telefone fixo', () => {
    // Seu código aqui
  })
  
  // Implemente os outros testes...
})
```

---

## Passo 6: Executar os Testes

Rode os testes com:

```bash
npm test validators.spec.js
```

**Resultado esperado**: Todos os testes devem passar ✅

---

## Passo 7: Verificar Cobertura

Execute os testes com cobertura:

```bash
npm run test:coverage -- validators.spec.js
```

**Meta**:

- ✅ 100% de cobertura nas funções validarEmail, validarCPF e validarTelefone
- ⚠️ A classe FormValidator não precisa ter 100% (é mais complexa)

---

## Desafio Extra (Opcional)

### 1. Adicionar mais validações

Crie e teste novas funções de validação:

```javascript
// Em validators.js
export function validarSenha(senha) {
  // Mínimo 8 caracteres, 1 maiúscula, 1 minúscula, 1 número
}

export function validarCEP(cep) {
  // Formato: 12345-678 ou 12345678
}
```

### 2. Testar mensagens de erro customizadas

Modifique as funções para retornar objetos:

```javascript
// Retornar: { valido: boolean, mensagem: string }
export function validarEmailComMensagem(email) {
  if (!email) return { valido: false, mensagem: 'Email é obrigatório' }
  // ...
}
```

### 3. Testar casos extremos (Edge Cases)

- Strings com caracteres especiais
- Valores `null` e `undefined`
- Números ao invés de strings
- Objetos ou arrays

---

## Conceitos Importantes

### 1. Arrange-Act-Assert (AAA)

```javascript
it('deve validar email', () => {
  // Arrange (preparar)
  const email = 'teste@exemplo.com'
  
  // Act (agir)
  const resultado = validarEmail(email)
  
  // Assert (verificar)
  expect(resultado).toBe(true)
})
```

### 2. Testes múltiplos no mesmo `it`

```javascript
it('deve validar emails corretos', () => {
  expect(validarEmail('teste@exemplo.com')).toBe(true)
  expect(validarEmail('user@dominio.com.br')).toBe(true)
  expect(validarEmail('email@sub.dominio.com')).toBe(true)
})
```

### 3. Nomenclatura descritiva

```javascript
// ❌ Ruim
it('test 1', () => {})

// ✅ Bom
it('deve validar email correto', () => {})
it('deve rejeitar email sem @', () => {})
```

---

## O que Você Vai Aprender

1. ✅ Estruturar testes com `describe` e `it`
2. ✅ Usar `expect()` e matchers (`.toBe()`, `.toEqual()`)
3. ✅ Testar diferentes cenários (casos válidos e inválidos)
4. ✅ Importar funções de módulos com `@/` alias
5. ✅ Verificar cobertura de código
6. ✅ Aplicar padrão AAA (Arrange-Act-Assert)

---

## Recursos de Ajuda

**Documentação Vitest**:

- [Matchers (expect)](https://vitest.dev/api/expect.html)
- [describe e it](https://vitest.dev/api/#describe)

**Referência Rápida de Matchers**:

```javascript
expect(valor).toBe(esperado)           // Igualdade estrita (===)
expect(valor).toEqual(esperado)        // Igualdade de objetos/arrays
expect(valor).toBeTruthy()             // Valor verdadeiro
expect(valor).toBeFalsy()              // Valor falso
expect(array).toHaveLength(3)          // Tamanho de array
expect(string).toContain('texto')      // Substring
expect(fn).toThrow()                   // Lança exceção
```

---

## Entrega Esperada

Ao final deste exercício, você deve ter:

1. ✅ Arquivo `tests/unit/utils/validators.spec.js` criado
2. ✅ Mínimo 12 testes implementados (4 por função)
3. ✅ Todos os testes passando
4. ✅ Alta cobertura (>80%) nas funções testadas

**Tempo estimado**: 30-45 minutos

---

**Dica Final**: Rode `npm run test:ui` para ver os testes em uma interface gráfica interativa!
