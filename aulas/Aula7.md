# Aula 7: Autenticacao JWT com Flask e Vue.js

## Introducao

Nesta aula aprenderemos a implementar um sistema completo de autenticacao usando JSON Web Tokens (JWT) em uma arquitetura client-server.

**Objetivo**: Criar um fluxo de login/cadastro onde o frontend (Vue.js) autentica usuarios por meio de uma API REST (Flask), gerencia tokens JWT no cliente e envia automaticamente tokens em requisicoes protegidas.

**O que voce aprendera**:
- Como funciona autenticacao baseada em tokens (JWT)
- Implementar login e cadastro no backend (Flask)
- Armazenar e usar tokens no frontend (Vue.js)
- Proteger rotas e endpoints
- Validar sessoes do usuario

---

## Parte 1: Conceitos Fundamentais

### O que eh JWT (JSON Web Token)

JWT eh um padrao para transmitir informacoes entre sistemas de forma segura e verificavel. Tem tres partes separadas por pontos:

```
HEADER.PAYLOAD.SIGNATURE
```

Exemplo real:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzk5MjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

**Vantagens do JWT**:

- Stateless: nao precisa armazenar sessoes no servidor
- Auto-contido: leva informacoes do usuario dentro dele
- Seguro: assinado com chave secreta
- Ideal para SPAs (Single Page Applications)

### Fluxo de Autenticacao JWT (passo a passo)

1. Usuario preenche email+senha e clica "Entrar"
2. Frontend envia credenciais em POST para `/login` no backend
3. Backend valida credenciais contra banco de dados
4. Se correto, backend gera JWT token com dados do usuario
5. Backend retorna token para o frontend
6. Frontend armazena token em localStorage (persistencia local)
7. Nas proximas requisicoes, frontend envia token no header `Authorization: Bearer <token>`
8. Backend valida token em cada requisicao protegida
9. Se token expirou, usuario faz logout automaticamente

---

## Parte 2: Backend Flask

### Arquitetura do Backend

O backend roda em `http://localhost:5000` e oferece tres tipos de endpoints:

- **Publicos** (qualquer um acessa): `/login`, `/form` (cadastro), `/health`
- **Protegidos** (requer JWT): `/api/perfil`

### Banco de Dados

A aplicacao usa SQLite (simples para desenvolvimento). Modelo de Usuario:

```
Usuario:
  - id (chave primaria)
  - nome (string)
  - email (string, unico)
  - senha (hasheada com Werkzeug)
  - data_criacao (timestamp)
```

**Importante**: senhas sao sempre hasheadas antes de armazenar usando `generate_password_hash()`. Nunca armazene senhas em plain text.

### Endpoints do Backend

#### 1. POST /login

Faz login e retorna JWT token.

Request:

```json
{
  "email": "prof@admin.com",
  "senha": "admin123"
}
```

Response (sucesso - 200):

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nome": "Prof Admin",
    "email": "prof@admin.com",
    "data_criacao": "2025-10-24T10:30:00"
  }
}
```

Response (erro - 401):

```json
{
  "message": "Email ou senha incorretos."
}
```

**Implementacao no backend** (resumida):

1. Recebe email+senha do request
2. Busca usuario pelo email no banco
3. Verifica se senha corresponde ao hash (usando `check_password()`)
4. Se ok, gera token com `create_access_token(identity=usuario.id)`
5. Retorna token e dados do usuario

#### 2. POST /form

Cria novo usuario (cadastro).

Request:

```json
{
  "nome": "Aluno User",
  "email": "aluno1@user.com",
  "senha": "user123"
}
```

Response (sucesso - 201):

```json
{
  "message": "Usuario criado com sucesso",
  "user": {
    "id": 2,
    "nome": "Aluno User",
    "email": "aluno@user.com",
    "data_criacao": "2025-10-24T11:00:00"
  }
}
```

Response (erro - 422):

```json
{
  "message": "Email ja registrado"
}
```

**Implementacao no backend**:

1. Valida se email ja existe (deve ser unico)
2. Valida tamanho minimo da senha (6+ caracteres)
3. Hash da senha com `usuario.set_password(senha)`
4. Salva novo usuario no banco
5. Retorna dados criados

#### 3. GET /api/perfil (PROTEGIDO)

Retorna dados do usuario logado. Requer token JWT.

Request:

```
GET /api/perfil
Header: Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Response (sucesso - 200):

```json
{
  "id": 1,
  "nome": "Prof Admin",
  "email": "prof@admin.com",
  "data_criacao": "2025-10-24T10:30:00"
}
```

Response (erro - 401):

```json
{
  "message": "Token invalido ou expirado"
}
```

**Implementacao no backend**:

1. Decorator `@jwt_required()` valida token automaticamente
2. Extrai user_id do token com `get_jwt_identity()`
3. Busca usuario no banco por ID
4. Retorna dados do usuario


---

## Parte 3: Frontend Vue.js

### Servico de API (axios)

Arquivo: `src/services/api.js`

Responsabilidade: criar instancia axios centralizada com configuracoes:
- baseURL: `http://localhost:5000`
- Interceptor de requisicoes: adiciona header `Authorization: Bearer <token>` automaticamente

**Como funciona o interceptor**:

1. Toda requisicao passa pelo interceptor ANTES de ser enviada
2. Interceptor busca token em localStorage
3. Se token existe, adiciona no header Authorization
4. Requisicao eh enviada com o header

**Beneficio**: nao precisa adicionar token manualmente em cada requisicao.

### Servico de Autenticacao (AuthService)

Arquivo: `src/services/AuthService.js`

Encapsula toda logica de autenticacao. Principais metodos:

#### login(credentials)

Faz login e armazena token localmente.

**Input**:

```javascript
{
  email: "prof@admin.com",
  senha: "admin123"
}
```

**Output** (sucesso):

```javascript
{
  sucesso: true,
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  usuario: { id, nome, email, data_criacao },
  mensagem: "Login realizado com sucesso!"
}
```

**O que faz internamente**:

1. Chama `api.post('/login', credentials)`
2. Recebe token e usuario
3. Armazena em localStorage: `authToken` e `userData`
4. Retorna resultado

#### cadastrar(dadosUsuario)

Cria novo usuario.

**Input**:

```javascript
{
  nome: "Aluno User",
  email: "aluno@user.com",
  senha: "user123"
}
```

**Output**: `{ sucesso, dados, mensagem }`

#### logout()

Remove sessao local e redireciona para login.

**O que faz**:

1. Remove `authToken` do localStorage
2. Remove `userData` do localStorage
3. Redireciona pagina para `/` (tela de login)

#### isAuthenticated()

Verifica se usuario tem sessao valida.

**Logic**:

1. Busca token em localStorage
2. Se nao existe, retorna false
3. Se existe, decodifica payload do JWT
4. Verifica campo `exp` (expiracao em segundos Unix)
5. Compara com hora atual: se `exp > agora`, eh valido
6. Retorna true/false

#### getCurrentUser() e getToken()

Simples getters de dados locais.

- `getCurrentUser()`: retorna usuario em localStorage (parse JSON)
- `getToken()`: retorna token string bruto

#### obterPerfil() e refreshUserData()

Faz chamada protegida ao backend.

**O que faz**:

1. Faz `api.get('/api/perfil')` (inclui token automaticamente via interceptor)
2. Se sucesso, atualiza `userData` em localStorage
3. Retorna `{ sucesso, usuario, mensagem }`

**Uso**: ao iniciar app ou quando usuario clica "Atualizar Perfil"

#### parseJWT(token)

Decodifica payload do JWT.

**O que faz**:

1. Pega parte 2 do token (separado por pontos)
2. Decodifica base64url para string JSON
3. Faz parse e retorna objeto JavaScript

**Resultado**:

```javascript
{
  sub: "1",           // subject (user ID)
  iat: 1516239022,    // issued at (hora de emissao)
  exp: 1516243622,    // expiration (hora de expiracao)
}
```

#### tratarErroAuth(error)

Converte erros axios em mensagens amigaveis.

**Mapeia HTTP status para mensagens**:

- 400: "Dados inválidos"
- 401: "Email ou senha incorretos"
- 422: "Email ja registrado" ou outra validacao
- 429: "Muitas tentativas"
- Erro de conexao: "Erro de conexao"

### Componentes de UI

#### LoginForm.vue

Responsabilidade: UI de login com validacao local.

**Campos**:

- email (obrigatorio, formato valido)
- senha (minimo 6 caracteres)
- lembrar-me (checkbox, opcional)

**Fluxo**:

1. Usuario preenche e clica "Entrar"
2. Componente valida campos localmente
3. Chama `AuthService.login(credentials)`
4. Aguarda resposta
5. Se sucesso: emite evento `login-sucesso` para App.vue
6. Se erro: exibe alert com mensagem amigavel

**Eventos emitidos**:

- `login-sucesso`: quando login funciona (leva dados do usuario para pai)
- `mostrar-cadastro`: quando usuario clica link "Cadastre-se"

**Debug info**: mostra credenciais de teste (apenas em desenvolvimento, NODE_ENV=development)

#### CadastroForm.vue

Responsabilidade: UI de cadastro com validacoes.

**Campos**:

- nome (minimo 2 caracteres)
- email (formato valido)
- senha (minimo 8 caracteres)
- confirmar senha (deve coincidir)
- aceitar termos (obrigatorio)

**Validacoes extras**:

- Forca da senha: mostra barra colorida (fraca/media/forte)
- Confirmacao de senha
- Aceite de termos de uso

**Fluxo**:

1. Usuario preenche formulario
2. Clica "Criar Conta"
3. Componente valida campos
4. Chama `AuthService.cadastrar(dados)`
5. Se sucesso: emite `cadastro-sucesso`
6. Pai recebe evento e volta para tela de login

**Eventos emitidos**:

- `cadastro-sucesso`: quando cadastro funciona
- `mostrar-login`: quando usuario clica link "Faca login aqui"

### App.vue - Orquestracao

Responsabilidade: orquestrar fluxo da aplicacao (login vs logged in).

**State local**:

```javascript
data() {
  return {
    telaAtual: 'login',      // 'login' ou 'cadastro'
    usuarioLogado: null,     // null se nao autenticado
    dataLogin: null,         // timestamp do login
    testandoAPI: false,      // flag enquanto testa API
    atualizandoPerfil: false,// flag enquanto atualiza perfil
    logAtividades: []        // lista de acoes do usuario
  }
}
```

**Fluxo na montagem** (mounted):

1. Chama `AuthService.isAuthenticated()`
2. Se true: carrega usuario com `AuthService.getCurrentUser()`
3. Tenta sincronizar perfil com `AuthService.refreshUserData()`
4. Exibe UI protegida (se autenticado) ou tela de login (se nao)

**Eventos recebidos de componentes filhos**:

- `login-sucesso`: atualiza `usuarioLogado`
- `cadastro-sucesso`: volta para tela de login
- `mostrar-cadastro`: muda para formulario de cadastro
- `mostrar-login`: muda para formulario de login

**Acoes disponiveis quando logado**:

- `fazerLogout()`: chama `AuthService.logout()`
- `testarAPIProtegida()`: faz requisicao GET /api/perfil para validar token
- `atualizarPerfil()`: chama `AuthService.refreshUserData()`
- `copiarToken()`: copia token para clipboard (util para testes)

---

## Parte 4: Fluxo Completo (Passo a Passo)

### Cenario 1: Primeiro Login

1. Usuario acessa `http://localhost:3000`
2. App.vue monta e chama `isAuthenticated()` - retorna false
3. LoginForm exibido na tela
4. Usuario digita `prof@admin.com` e `admin123`
5. Clica botao "Entrar"
6. LoginForm valida e chama `AuthService.login(...)`
7. AuthService faz POST para `http://localhost:5000/login`
8. Backend procura usuario por email, valida senha, gera JWT
9. Backend retorna `{ access_token, user }`
10. AuthService armazena em localStorage: `authToken` e `userData`
11. LoginForm emite `login-sucesso` com dados do usuario
12. App.vue recebe evento, atualiza `usuarioLogado`
13. UI muda de LoginForm para "App principal"
14. Usuario ve seu nome e dados na tela

### Cenario 2: Recarregar Pagina (Sessao Persistente)

1. Usuario recarrega pagina (F5)
2. App.vue monta
3. Chama `isAuthenticated()`
4. isAuthenticated valida token em localStorage - ainda valido
5. Chama `getCurrentUser()` - retorna usuario em localStorage
6. Chama `refreshUserData()` para sincronizar com servidor
7. Backend recebe GET /api/perfil com token no header Authorization
8. Backend valida token, retorna dados atualizados
9. App.vue ve usuario autenticado e mostra UI principal
10. Usuario ja conectado sem fazer login novamente

### Cenario 3: Token Expirado

1. Usuario logado por mais de 1 hora
2. Tenta fazer acao (ex: clicar "Atualizar Perfil")
3. Frontend faz requisicao com token antigo
4. Backend recebe, valida JWT, encontra `exp < agora`
5. Backend retorna erro 401 (Unauthorized)
6. Frontend recebe erro, chama `AuthService.logout()`
7. Logout remove localStorage e redireciona para /login
8. Usuario precisa fazer login novamente

### Cenario 4: Cadastro

1. Usuario novo acessa app
2. Clica link "Cadastre-se aqui" em LoginForm
3. App.vue muda para CadastroForm
4. Usuario preenche: nome, email, senha (8+ chars), confirma senha, aceita termos
5. Clica "Criar Conta"
6. CadastroForm valida e chama `AuthService.cadastrar(...)`
7. AuthService faz POST para `/form`
8. Backend valida: email unico, senha comprimento minimo
9. Backend hash a senha, cria usuario no banco
10. Backend retorna sucesso
11. CadastroForm emite `cadastro-sucesso`
12. App.vue volta para tela de login
13. Usuario faz login com novas credenciais

---

## Parte 5: Como Executar Localmente

### Passo 1: Instalar Dependencias

**Frontend**:

```powershell
cd frontend_vue
npm install
```

**Backend**:

```powershell
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### Passo 2: Popular Banco de Dados

Para agilizar a aula, vamos rodar um script:

```powershell
cd backend
python seed.py
```

O script faz:
- Conecta ao backend em http://localhost:5000
- Popula diretamente o banco
- Exibe os usuarios criados

### Passo 3: Iniciar Backend

```powershell
cd backend
venv\Scripts\activate
python app.py
```

Saida esperada:

```
 * Running on http://127.0.0.1:5000
 * Debugger is active!
```

### Passo 4: Iniciar Frontend

Em outro terminal:

```powershell
cd frontend_vue
npm run dev
```

Saida esperada:

```
  VITE v4.5.14  ready in X ms

  Local:   http://localhost:5173/

  OU

  Local:   http://localhost:3000/
```

### Passo 5: Testar

1. Abrir navegador em `http://localhost:5173` ou `http://localhost:3000`
2. Ver formulario de login
3. Testar login com `prof@admin.com` / `admin123`
4. Se sucesso, ver tela principal com dados do usuario
5. Clicar "Atualizar Perfil" para testar requisicao protegida
6. Clicar "Sair" para fazer logout

---

## Parte 6: Troubleshooting

### Erro: "Network Error" ao fazer login

**Causa**: Backend nao esta rodando.

**Solucao**:
1. Certificar que `http://localhost:5000` responde (testar /health)
2. Se porta 5000 estiver em uso, mudar em `backend/app.py` (linha `port=5000`)

### Erro: "CORS error"

**Causa**: Backend nao tem CORS ativado para frontend.

**Solucao**: Ja esta configurado em app.py com `CORS(app)`. Certificar que:
- Backend rodando em `http://localhost:5000`
- Frontend rodando em `http://localhost:3000` ou `http://localhost:5173`

### Erro: "Email ou senha incorretos"

**Causa**: Credenciais erradas ou banco nao foi populado com seed.py.

**Solucao**:
1. Certificar que rodou o `seed.py`.
2. Verificar se usuarios estao no banco (pode usar SQLite browser)
3. Testar com: prof@admin.com / admin123 ou aluno1@user.com / user123

### Erro: "Token invalido ou expirado"

**Causa**: Token expirou (1 hora) ou localStorage foi limpo.

**Solucao**: Fazer login novamente.

### Frontend mostra "Nao autenticado" apos recarregar

**Causa**: localStorage foi limpo pelo navegador.

**Solucao**: Fazer login novamente ou verificar se navegador tem cache ativado.

---

## Parte 7: Seguranca

Pontos importantes para producao:

1. **Chave secreta do JWT**: Mudar `JWT_SECRET_KEY` em `.env` para valor aleatorio forte
2. **HTTPS obrigatorio**: Em producao usar HTTPS (nao HTTP)
3. **httpOnly cookies**: Considerar armazenar token em cookie httpOnly (mais seguro que localStorage)
4. **Validacao de senha**: Reforcar requisitos (minimo 12 chars, maiusculas, numeros, especiais)
5. **Rate limiting**: Limitar tentativas de login para prevenir brute force
6. **Refresh tokens**: Implementar refresh token com TTL maior para renovacao automatica

---

## Parte 8: Exercicios

### Exercício 1: Proteção de Rotas

Tarefa: Implementar guards para proteger rotas.

Passos:
- Guard de autenticação: verificar token antes de acessar rota
- Redirecionamento automático: redirecionar para `/login` se nao autenticado
- Verificação de permissões: rotas admin apenas para usuarios autenticados

### Exercício 2: Refresh Token

Tarefa: Implementar sistema de refresh automático.

Passos:
- Token refresh antes do vencimento: renovar token silenciosamente 5 min antes de expirar
- Renovação silenciosa: usuario nao percebe a renovacao
- Logout automático em caso de falha: se refresh falhar, fazer logout

### Exercício 3: Lembrança de Login

Tarefa: Melhorar persistencia quando usuario marca "Lembrar-me".

Passos:
- Opção "Lembrar-me": aumentar TTL do token quando marcado
- Storage seguro: armazenar em localStorage com flag de seguranca
- Logout de todos os dispositivos: invalidar todos os tokens ao fazer logout


---

## Resumo

Aula 7 apresentou:

- JWT como forma segura de autenticacao stateless
- Backend Flask com autenticacao, banco de dados, endpoints protegidos
- Frontend Vue.js com formularios, validacao, persistencia de token
- Fluxo completo: login -> token -> requisicoes protegidas -> logout
- Como executar localmente e troubleshooting comun
- Pontos de seguranca para producao

**Proxima aula**: Pinia para gerenciamento de estado global (store de usuario, produtos, etc).
