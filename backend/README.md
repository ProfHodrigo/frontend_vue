# Backend Flask - Aula 6 (CRUD de Produtos)

Este diretorio contem o servidor Flask necessario para suportar o frontend Vue.js da Aula 6 (operacoes CRUD basicas).

## Instalacao

1. Criar ambiente virtual (opcional):
```bash
python -m venv venv
```

2. Ativar ambiente virtual:

Windows:
```powershell
venv\Scripts\activate
```

Linux/Mac:
```bash
source venv/bin/activate
```

3. Instalar dependencias:
```bash
pip install -r requirements.txt
```

## Uso

1. Popular banco de dados com produtos de teste:
```bash
python seed.py
```

2. Iniciar o servidor:
```bash
python app.py
```

O backend ficara disponivel em `http://localhost:5000`

## Banco de Dados

O script `seed.py` cria 23 produtos de teste em 4 categorias:
- Eletronicos (5 produtos)
- Roupas (6 produtos)
- Livros (6 produtos)
- Alimentos (6 produtos)

Banco SQLite: `instance/produtos.db`

Para resetar o banco:
1. Deletar o arquivo `instance/produtos.db`
2. Executar `python seed.py` novamente

## Endpoints Disponiveis

### Produtos

**GET /api/produtos** - Listar todos os produtos
- Response: `[{ "id": 1, "nome": "...", "preco": 99.90, ... }]`

**GET /api/produtos/<id>** - Obter um produto especifico
- Response: `{ "id": 1, "nome": "Notebook", "preco": 3499.99, ... }`

**POST /api/produtos** - Criar novo produto
- Body:
```json
{
  "nome": "Produto Novo",
  "descricao": "Descricao do produto",
  "preco": 99.90,
  "estoque": 10,
  "categoria": "Eletronicos",
  "imagem": "https://...",
  "ativo": true
}
```
- Response: `{ "id": 24, "nome": "Produto Novo", ... }`

**PUT /api/produtos/<id>** - Atualizar produto existente
- Body: (mesmos campos do POST)
- Response: `{ "id": 1, "nome": "...", ... }`

**DELETE /api/produtos/<id>** - Deletar produto
- Response: `{ "message": "Produto deletado com sucesso" }`

## Exemplos de Uso com curl

**Listar todos os produtos:**
```bash
curl http://localhost:5000/api/produtos
```

**Obter produto especifico:**
```bash
curl http://localhost:5000/api/produtos/1
```

**Criar novo produto:**
```bash
curl -X POST http://localhost:5000/api/produtos \
  -H "Content-Type: application/json" \
  -d "{\"nome\":\"Produto Teste\",\"descricao\":\"Descricao\",\"preco\":99.90,\"estoque\":5,\"categoria\":\"Testes\",\"imagem\":\"https://via.placeholder.com/400\",\"ativo\":true}"
```

**Atualizar produto:**
```bash
curl -X PUT http://localhost:5000/api/produtos/1 \
  -H "Content-Type: application/json" \
  -d "{\"nome\":\"Nome Atualizado\",\"preco\":199.90}"
```

**Deletar produto:**
```bash
curl -X DELETE http://localhost:5000/api/produtos/1
```

## Modelo de Dados

**Produto**:
- `id`: Integer (auto-incremento)
- `nome`: String (obrigatorio, max 100 caracteres)
- `descricao`: Text (opcional)
- `preco`: Float (obrigatorio)
- `estoque`: Integer (default: 0)
- `categoria`: String (max 50 caracteres)
- `imagem`: String (URL da imagem)
- `ativo`: Boolean (default: True)
- `data_criacao`: DateTime (automatico)
- `data_atualizacao`: DateTime (automatico)

## Arquitetura

- `app.py` - Aplicacao Flask principal com model e rotas CRUD
- `seed.py` - Script para popular banco com produtos de teste
- `requirements.txt` - Dependencias Python
- `instance/produtos.db` - Banco SQLite (criado automaticamente)

## Troubleshooting

**Erro: ModuleNotFoundError: No module named 'flask'**
- Execute `pip install -r requirements.txt`

**Erro: "Address already in use"**
- Mudar porta em `app.py`: alterar `port=5000` para outra (ex: `port=5001`)
- Ou matar processo na porta 5000:
  - Windows: `netstat -ano | findstr :5000` e `taskkill /PID <PID> /F`
  - Linux/Mac: `lsof -i :5000` e `kill -9 <PID>`

**CORS Error no frontend**
- Certificar que backend esta rodando em `http://localhost:5000`
- Frontend deve estar em `http://localhost:5173` (Vite default)

**Banco nao foi criado**
- Execute `python seed.py` primeiro
- Verifique se a pasta `instance/` foi criada
- Verifique permissoes de escrita no diretorio
