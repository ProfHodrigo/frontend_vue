from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import timedelta
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Configuracoes
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI', 'sqlite:///usuarios.db')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'chave-muito-secreta')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(seconds=int(os.getenv('JWT_ACCESS_TOKEN_EXPIRES', 3600)))

# Inicializar extensoes
db = SQLAlchemy(app)
jwt = JWTManager(app)
CORS(app)

# =====================
# HANDLERS JWT
# =====================

@jwt.invalid_token_loader
def invalid_token_callback(error):
    print(f'[DEBUG] Invalid token: {str(error)}')
    return jsonify({'message': 'Token invalido ou expirado'}), 401

@jwt.unauthorized_loader
def missing_token_callback(error):
    print(f'[DEBUG] Missing token: {str(error)}')
    return jsonify({'message': 'Token de autorizacao nao fornecido'}), 401

@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_data):
    print(f'[DEBUG] Token expirado')
    return jsonify({'message': 'Token expirado'}), 401

# =====================
# MODELS
# =====================

class Usuario(db.Model):
    __tablename__ = 'usuarios'
    
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    senha = db.Column(db.String(255), nullable=False)
    data_criacao = db.Column(db.DateTime, default=db.func.now())
    
    def set_password(self, senha):
        """Hash da senha antes de armazenar"""
        self.senha = generate_password_hash(senha)
    
    def check_password(self, senha):
        """Verifica se a senha fornecida corresponde ao hash armazenado"""
        return check_password_hash(self.senha, senha)
    
    def to_dict(self):
        """Converte usuario para dicionario (sem expor a senha)"""
        return {
            'id': self.id,
            'nome': self.nome,
            'email': self.email,
            'data_criacao': self.data_criacao.isoformat() if self.data_criacao else None
        }

# =====================
# ROTAS DE AUTENTICACAO
# =====================

@app.route('/login', methods=['POST'])
def login():
    """
    Endpoint para login do usuario.
    
    Request JSON:
    {
        "email": "prof@admin.com",
        "senha": "admin123"
    }
    
    Response (sucesso):
    {
        "access_token": "eyJ0eXAiOiJKV1QiLC...",
        "user": {
            "id": 1,
            "nome": "Prof Admin",
            "email": "prof@admin.com"
        }
    }
    
    Response (erro 401):
    {
        "message": "Email ou senha incorretos."
    }
    """
    try:
        dados = request.get_json()
        
        if not dados or not dados.get('email') or not dados.get('senha'):
            return jsonify({'message': 'Email e senha sao obrigatorios'}), 400
        
        usuario = Usuario.query.filter_by(email=dados['email']).first()
        
        if not usuario or not usuario.check_password(dados['senha']):
            return jsonify({'message': 'Email ou senha incorretos.'}), 401
        
        # Gerar JWT token
        access_token = create_access_token(identity=str(usuario.id))
        
        return jsonify({
            'access_token': access_token,
            'user': usuario.to_dict()
        }), 200
    
    except Exception as e:
        print(f'Erro no login: {str(e)}')
        return jsonify({'message': 'Erro interno do servidor'}), 500


@app.route('/form', methods=['POST'])
def cadastro():
    """
    Endpoint para cadastro de novo usuario.
    
    Request JSON:
    {
        "nome": "Aluno User",
        "email": "aluno@user.com",
        "senha": "user123"
    }
    
    Response (sucesso):
    {
        "message": "Usuario criado com sucesso",
        "user": {
            "id": 2,
            "nome": "Aluno User",
            "email": "aluno@user.com"
        }
    }
    
    Response (erro 422):
    {
        "message": "Email ja registrado"
    }
    """
    try:
        dados = request.get_json()
        
        if not dados or not dados.get('nome') or not dados.get('email') or not dados.get('senha'):
            return jsonify({'message': 'Nome, email e senha sao obrigatorios'}), 400
        
        if len(dados['senha']) < 6:
            return jsonify({'message': 'Senha deve ter pelo menos 6 caracteres'}), 400
        
        if Usuario.query.filter_by(email=dados['email']).first():
            return jsonify({'message': 'Email ja registrado'}), 422
        
        novo_usuario = Usuario(
            nome=dados['nome'],
            email=dados['email']
        )
        novo_usuario.set_password(dados['senha'])
        
        db.session.add(novo_usuario)
        db.session.commit()
        
        return jsonify({
            'message': 'Usuario criado com sucesso',
            'user': novo_usuario.to_dict()
        }), 201
    
    except Exception as e:
        db.session.rollback()
        print(f'Erro no cadastro: {str(e)}')
        return jsonify({'message': 'Erro ao criar usuario'}), 500


@app.route('/api/perfil', methods=['GET'])
@jwt_required(locations=["headers"])
def obter_perfil():
    """
    Endpoint protegido para obter dados do perfil do usuario logado.
    Requer token JWT no header Authorization: Bearer <token>
    
    Response:
    {
        "id": 1,
        "nome": "Prof Admin",
        "email": "prof@admin.com",
        "data_criacao": "2025-10-24T10:30:00"
    }
    """
    try:
        # Debug: verificar token
        auth_header = request.headers.get('Authorization', 'Nao fornecido')
        print(f'[DEBUG] Authorization header: {auth_header[:50]}...' if len(auth_header) > 50 else f'[DEBUG] Authorization header: {auth_header}')
        
        usuario_id = get_jwt_identity()
        print(f'[DEBUG] JWT identity extraido: {usuario_id}')
        
        usuario = Usuario.query.get(int(usuario_id))
        
        if not usuario:
            return jsonify({'message': 'Usuario nao encontrado'}), 404
        
        return jsonify(usuario.to_dict()), 200
    
    except Exception as e:
        print(f'Erro ao obter perfil: {str(e)}')
        import traceback
        traceback.print_exc()
        return jsonify({'message': 'Erro ao obter perfil'}), 500


# =====================
# ROTA DE TESTE
# =====================

@app.route('/health', methods=['GET'])
def health():
    """Endpoint para verificar se o servidor esta rodando"""
    return jsonify({'status': 'ok', 'message': 'Backend Flask rodando'}), 200


# =====================
# MANIPULADORES DE ERRO
# =====================

@app.errorhandler(404)
def nao_encontrado(error):
    return jsonify({'message': 'Recurso nao encontrado'}), 404


@app.errorhandler(500)
def erro_interno(error):
    return jsonify({'message': 'Erro interno do servidor'}), 500


# =====================
# CRIAR BANCO DE DADOS E EXECUTAR APP
# =====================

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    
    app.run(debug=True, host='0.0.0.0', port=5000)
