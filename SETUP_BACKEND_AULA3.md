# Configuração do Backend Flask para Aula 3

## Passos necessários:

### 1. Instalar Flask-CORS

```bash
cd backend_flask
pip install flask-cors
pip freeze > requirements.txt
```

### 2. Adicionar CORS no `app/__init__.py`

Adicione estas linhas após a criação do app:

```python
from flask_cors import CORS

# Logo após: app = Flask(__name__, template_folder="templates", static_folder="static")
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000", "http://localhost:5173"],
        "methods": ["GET", "POST", "PUT", "DELETE"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})
```

### 3. Adicionar endpoint de teste em `app/routes.py`

Adicione esta rota (ANTES da rota `/api/dados`):

```python
# Aula 3 - Endpoint público para teste de conexão
@app.route("/api/teste")
def api_teste():
    return jsonify({
        "mensagem": "Conexão estabelecida com sucesso!",
        "servidor": "Flask Backend",
        "versao": "1.0.0",
        "timestamp": datetime.now().isoformat()
    })
```

E adicione o import do datetime no topo do arquivo:

```python
from datetime import timedelta, datetime
```

### 4. Rodar o servidor Flask

```bash
# No diretório backend_flask
python run.py
```

O servidor deve estar rodando em: `http://localhost:5000`

### 5. Testar os endpoints

- Endpoint público (sem auth): `http://localhost:5000/api/teste`
- Endpoint protegido (com JWT): `http://localhost:5000/api/dados`

### Troubleshooting

Se houver erro de CORS, verifique se:
1. Flask-CORS está instalado
2. CORS foi configurado corretamente
3. O frontend está rodando na porta correta (3000 ou 5173)
4. O backend está rodando na porta 5000
