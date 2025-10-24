## Aula 7 — Autenticação JWT

Esta aula apresenta um sistema completo de autenticação usando JSON Web Tokens (JWT) em uma SPA Vue 3.

### Conteúdo chave:
- Conceito do JWT e fluxo de autenticação (login → emissão de token → envio em Authorization header → validação no servidor)
- Arquitetura do frontend para autenticação: api (axios), AuthService, componentes de UI (Login/Cadastro), App.vue que orquestra o fluxo
- Boas práticas de armazenamento e segurança

---

### 1) Destrinchando o projeto

- `src/services/api.js`
  - Responsabilidade: criar e exportar uma instância do axios configurada com a baseURL do backend.
  - Interceptor de requisições: insere o header Authorization: `Bearer <token>` quando um token válido existe em localStorage.
  - Erros comuns: esquecer de exportar a instância ou não tratar URLs relativas corretamente; importante configurar timeouts e tratamento centralizado de erros para UX consistente.

- `src/services/AuthService.js`
  - Responsabilidade: encapsular toda a lógica de autenticação e persistência local.
  - Principais métodos (descrição rápida):
    - `login(credentials)`
      - O que faz: POST `/login` com email+senha; no sucesso armazena `authToken` e `userData` em localStorage.
      - Retorno: objeto com { sucesso, token, usuario, mensagem }.
      - Erros tratados: 401 (credenciais), 422 (validações), falha de rede.

    - `cadastrar(dadosUsuario)`
      - O que faz: POST para endpoint de cadastro (ex: `/form`); retorna sucesso/falha e mensagens amigáveis.

    - `logout()`
      - O que faz: remove `authToken` e `userData` do localStorage e redireciona para a tela de login.

    - `isAuthenticated()`
      - O que faz: verifica existência do token e verifica se o `exp` no payload do JWT ainda é maior que o tempo atual.
      - Observação: decodifica o payload com `parseJWT(token)` e compara `exp` (em segundos).

    - `getCurrentUser()` / `getToken()`
      - O que fazem: retornam os dados do usuário em localStorage (parse JSON) ou o token string.

    - `obterPerfil()` / `refreshUserData()`
      - O que fazem: fazem chamada protegida ao backend (`GET /api/perfil`) para obter dados atualizados do usuário; atualizam `userData` local.
      - Uso: chamado ao montar a App ou quando o usuário pede "atualizar perfil"; também usado para validar token em tempo de execução.

    - `parseJWT(token)`
      - O que faz: decodifica a payload do JWT (base64url) e retorna o JSON com claims (i.e., `exp`, `sub`, `email`, etc.).

    - `tratarErroAuth(error)`
      - O que faz: converte erros axios (response/request/other) em mensagens amigáveis para o usuário.

  - Notas de segurança e persistência:
    - LocalStorage é usado por simplicidade; em produção considere medidas adicionais (httpOnly cookies, mitigação de XSS).
    - Nunca armazene senhas em plain text; sempre valide e trate erros do servidor de forma genérica no frontend.

- `src/components/LoginForm.vue`
  - Responsabilidade: UI e validação do formulário de entrada; chama `AuthService.login` e emite eventos para o pai.
  - Comportamento principal:
    - Campos: email, senha, lembrar-me.
    - Validações: formato de email, comprimento mínimo da senha, feedback em tempo real via `invalid-feedback`.
    - Ações: ao submeter, chama `AuthService.login`; ao sucesso emite `login-sucesso` com dados do usuário; tem link que emite `mostrar-cadastro`.
    - Feedback: exibe alertas com tipos (sucesso/erro/info) e faz auto-hide.
  - Debug/info: contém bloco opcional (apenas em dev) com credenciais de teste.

- `src/components/CadastroForm.vue`
  - Responsabilidade: UI e validação do cadastro; chama `AuthService.cadastrar`.
  - Comportamento principal:
    - Campos: nome, email, senha, confirmar senha, aceitar termos.
    - Validações: força da senha, confirmação, aceite de termos.
    - Ações: ao submeter realiza cadastro pelo serviço; em caso de sucesso emite `cadastro-sucesso` para o pai (normalmente troca para tela de login).

- `src/App.vue`
  - Responsabilidade: orquestrar o fluxo da aplicação (mostra login/cadastro quando não autenticado; mostra a app protegida quando autenticado).
  - Padrões:
    - Ao montar, chama `AuthService.isAuthenticated()` e, se houver sessão válida, carrega `userData` via `getCurrentUser()` e tenta `refreshUserData()` para sincronizar com servidor.
    - Recebe eventos `login-sucesso` / `cadastro-sucesso` dos componentes filhos para atualizar o estado local `usuarioLogado`.
    - Oferece ações: `fazerLogout()`, `testarAPIProtegida()`, `atualizarPerfil()`, `copiarToken()` — todas usando `AuthService`.
    - Exibe token formatado (para debug/estudo) e um pequeno log de atividades (ações do usuário sobre autenticação).

---

### 2) Fluxo de login (resumido)

1. O usuário preenche email/senha em `LoginForm`.
2. `LoginForm` valida localmente e chama `AuthService.login(credentials)`.
3. O backend responde com `access_token` e dados do usuário.
4. `AuthService` armazena `authToken` e `userData` em localStorage.
5. `LoginForm` emite `login-sucesso` e `App.vue` atualiza `usuarioLogado` e exibe a UI protegida.
6. Todas as requisições subsequentes feitas pela instância `api` incluem `Authorization: Bearer <token>` via interceptor.

---

### 3) Contrato (Inputs / Outputs / Erros).

- `AuthService.login({ email, senha })`
  - Input: { email: string, senha: string }
  - Output (sucesso): { sucesso: true, token, usuario, mensagem }
  - Output (erro): { sucesso: false, mensagem }
  - Erros comuns: 401 (credenciais inválidas), 422 (validação), request timeout.

- `AuthService.cadastrar(dados)`
  - Input: { nome, email, senha }
  - Output: { sucesso: boolean, mensagem }

- `AuthService.obterPerfil()`
  - Input: nenhum (usa token)
  - Output: { sucesso: true, usuario } ou { sucesso: false, mensagem }

---

### 4) Pontos de atenção e edge cases

- Expiração de token: `isAuthenticated()` depende do campo `exp` no payload do JWT; se o relógio do cliente estiver fora de sincronia, pode haver falsos negativos/positivos.
- Logout centralizado: sempre remover `authToken` e `userData` do storage e limpar estados reativos da app.
- Requisições durante refresh: se implementar refresh token, serialize requests pendentes até que o token seja renovado para evitar falhas paralelas.
- Segurança: tokens em localStorage são vulneráveis a XSS; em produção considere httpOnly cookies ou fortes proteções de CSP.
- Erros de rede: sempre mostrar mensagens amigáveis e não vazar erros internos do servidor.

---

### 5) Credenciais de teste (atualizadas)

- Conta administrador: `prof@admin.com` / `admin123`
- Conta aluno: `aluno@user.com` / `user123`

Estas credenciais podem aparecer nas seções de debug dos componentes (apenas em desenvolvimento). Não deixe credenciais de teste visíveis em produção.

---

### Exercícios Práticos da Aula 7

#### Exercício 1: Proteção de Rotas
Implementar guards para proteger rotas:
- Guard de autenticação
- Redirecionamento automático
- Verificação de permissões de usuário

#### Exercício 2: Refresh Token
Implementar sistema de refresh automático:
- Token refresh antes do vencimento
- Renovação silenciosa
- Logout automático em caso de falha

#### Exercício 3: Lembrança de Login
Melhorar persistência:
- Opção "Lembrar-me"
- Storage seguro
- Logout de todos os dispositivos

---

### Comandos Git e Deploy

```bash
# Criar branch da aula 7
git checkout master
git checkout -b aula-07-auth

# Implementar componentes
# ... adicionar arquivos ...

git add .
git commit -m "Aula 7 - Sistema completo de autenticação JWT"
git push -u origin aula-07-auth
```

---

### Próxima Aula

Na **Aula 8** veremos:
- Pinia para gerenciamento de estado global
- Store de usuário e autenticação
- Actions assíncronas
- Getters computados
- Persistência de estado

### Conceitos de Segurança

1. **Nunca armazenar senhas em plain text**
2. **Tokens tem tempo de expiração**
3. **HTTPS obrigatório em produção**
4. **Limpar dados sensíveis no logout**
5. **Validação tanto client quanto server**