# Backend Flask - Aula 7 (Autenticacao JWT)

Este diretorio contem o servidor Flask necessario para suportar o frontend Vue.js da Aula 7.

## Instalacao

1. Criar ambiente virtual:
```
python -m venv venv
```

2. Ativar ambiente virtual:

Windows:
```
venv\Scripts\activate
```

Linux/Mac:
```
source venv/bin/activate
```

3. Instalar dependencias:
```
pip install -r requirements.txt
```

## Uso

1. Popular banco de dados com usuarios de teste:
```
curl -X POST http://localhost:5000/seed
```

Ou use Postman/Thunder Client para fazer um POST em `http://localhost:5000/seed`.

2. Iniciar o servidor:
```
python app.py
```

O backend ficara disponivel em `http://localhost:5000`

## Usuarios de Teste

Apos executar o endpoint `/seed`, os seguintes usuarios estarao disponiveis:

- Administrador: `prof@admin.com` / `admin123`
- Aluno: `aluno@user.com` / `user123`

## Endpoints Disponiveis

### Autenticacao

**POST /login** - Fazer login e obter token JWT
- Body: `{ "email": "prof@admin.com", "senha": "admin123" }`
- Response: `{ "access_token": "...", "user": {...} }`

**POST /form** - Cadastrar novo usuario
- Body: `{ "nome": "Nome", "email": "email@test.com", "senha": "senha123" }`
- Response: `{ "message": "...", "user": {...} }`

**GET /api/perfil** - Obter dados do perfil (requer JWT)
- Header: `Authorization: Bearer <token>`
- Response: `{ "id": 1, "nome": "...", "email": "...", "data_criacao": "..." }`

### Utilitarios

**GET /health** - Verificar se o servidor esta rodando
- Response: `{ "status": "ok", "message": "Backend Flask rodando" }`

**POST /seed** - Popular banco com usuarios de teste
- Response: `{ "message": "...", "usuarios": 2 }`

## Arquitetura

- `app.py` - Arquivo principal com Flask app, models, rotas e autenticacao JWT
- `requirements.txt` - Dependencias Python
- `.env` - Configuracoes de ambiente (dev/test)

## Como funciona a Autenticacao JWT

1. **Login**: Usuario envia email+senha para `/login`
2. **Validacao**: Backend verifica credenciais contra banco de dados
3. **Token**: Backend gera JWT token com tempo de expiracao
4. **Armazenamento**: Frontend armazena token em localStorage
5. **Requisicoes**: Frontend envia token no header `Authorization: Bearer <token>`
6. **Verificacao**: Backend valida token em rotas protegidas (`@jwt_required()`)

## Troubleshooting

**Erro: ModuleNotFoundError: No module named 'flask'**
- Execute `pip install -r requirements.txt`

**Erro: "Address already in use"**
- Mudar porta em `app.py`: mudar `port=5000` para outra (ex: `port=5001`)
- Ou matar processo na porta 5000:
  - Windows: `netstat -ano | findstr :5000` e `taskkill /PID <PID> /F`
  - Linux/Mac: `lsof -i :5000` e `kill -9 <PID>`

**CORS Error no frontend**
- Certificar que backend esta rodando em `http://localhost:5000`
- Frontend deve estar em `http://localhost:3000` ou `http://localhost:5173` (Vite)

**Token expirado**
- Token JWT expira em 1 hora (3600 segundos)
- Faca login novamente para obter novo token
