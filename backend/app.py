"""
Backend Flask - Aula 6: CRUD de Produtos
Sistema simples de gerenciamento de produtos
"""

from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
import os

app = Flask(__name__)

# Configuracoes
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///produtos.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicializar extensoes
db = SQLAlchemy(app)
CORS(app)

# =====================
# MODEL
# =====================

class Produto(db.Model):
    __tablename__ = 'produtos'
    
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(120), nullable=False)
    descricao = db.Column(db.Text)
    preco = db.Column(db.Float, nullable=False)
    estoque = db.Column(db.Integer, default=0)
    categoria = db.Column(db.String(50))
    imagem = db.Column(db.String(200))
    ativo = db.Column(db.Boolean, default=True)
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)
    data_atualizacao = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'descricao': self.descricao,
            'preco': self.preco,
            'estoque': self.estoque,
            'categoria': self.categoria,
            'imagem': self.imagem,
            'ativo': self.ativo,
            'data_criacao': self.data_criacao.isoformat() if self.data_criacao else None,
            'data_atualizacao': self.data_atualizacao.isoformat() if self.data_atualizacao else None
        }

# Criar tabelas
with app.app_context():
    db.create_all()

# =====================
# ROTAS - CRUD PRODUTOS
# =====================

@app.route('/api/produtos', methods=['GET'])
def listar_produtos():
    """
    Lista todos os produtos com filtros opcionais
    
    Query params:
    - nome: filtro por nome (busca parcial)
    - categoria: filtro por categoria
    - preco_min: preco minimo
    - preco_max: preco maximo
    - estoque_min: estoque minimo
    """
    try:
        # Query base
        query = Produto.query
        
        # Filtros
        nome = request.args.get('nome')
        if nome:
            query = query.filter(Produto.nome.ilike(f'%{nome}%'))
        
        categoria = request.args.get('categoria')
        if categoria:
            query = query.filter(Produto.categoria == categoria)
        
        preco_min = request.args.get('preco_min')
        if preco_min:
            query = query.filter(Produto.preco >= float(preco_min))
        
        preco_max = request.args.get('preco_max')
        if preco_max:
            query = query.filter(Produto.preco <= float(preco_max))
        
        estoque_min = request.args.get('estoque_min')
        if estoque_min:
            query = query.filter(Produto.estoque >= int(estoque_min))
        
        # Executar query
        produtos = query.all()
        
        return jsonify([p.to_dict() for p in produtos]), 200
    
    except Exception as e:
        print(f'Erro ao listar produtos: {str(e)}')
        return jsonify({'error': 'Erro ao listar produtos'}), 500


@app.route('/api/produtos/<int:id>', methods=['GET'])
def buscar_produto(id):
    """Busca um produto especifico por ID"""
    try:
        produto = Produto.query.get(id)
        
        if not produto:
            return jsonify({'error': 'Produto nao encontrado'}), 404
        
        return jsonify(produto.to_dict()), 200
    
    except Exception as e:
        print(f'Erro ao buscar produto: {str(e)}')
        return jsonify({'error': 'Erro ao buscar produto'}), 500


@app.route('/api/produtos', methods=['POST'])
def criar_produto():
    """
    Cria um novo produto
    
    Body JSON:
    {
        "nome": "Produto Teste",
        "descricao": "Descricao do produto",
        "preco": 99.99,
        "estoque": 10,
        "categoria": "Eletronicos",
        "imagem": "url_da_imagem",
        "ativo": true
    }
    """
    try:
        dados = request.get_json()
        
        # Validacoes basicas
        if not dados.get('nome'):
            return jsonify({'error': 'Nome e obrigatorio'}), 400
        
        if not dados.get('preco'):
            return jsonify({'error': 'Preco e obrigatorio'}), 400
        
        # Criar produto
        novo_produto = Produto(
            nome=dados['nome'],
            descricao=dados.get('descricao', ''),
            preco=float(dados['preco']),
            estoque=dados.get('estoque', 0),
            categoria=dados.get('categoria', 'Geral'),
            imagem=dados.get('imagem', ''),
            ativo=dados.get('ativo', True)
        )
        
        db.session.add(novo_produto)
        db.session.commit()
        
        return jsonify(novo_produto.to_dict()), 201
    
    except Exception as e:
        db.session.rollback()
        print(f'Erro ao criar produto: {str(e)}')
        return jsonify({'error': 'Erro ao criar produto'}), 500


@app.route('/api/produtos/<int:id>', methods=['PUT'])
def atualizar_produto(id):
    """Atualiza um produto existente"""
    try:
        produto = Produto.query.get(id)
        
        if not produto:
            return jsonify({'error': 'Produto nao encontrado'}), 404
        
        dados = request.get_json()
        
        # Atualizar campos
        if 'nome' in dados:
            produto.nome = dados['nome']
        if 'descricao' in dados:
            produto.descricao = dados['descricao']
        if 'preco' in dados:
            produto.preco = float(dados['preco'])
        if 'estoque' in dados:
            produto.estoque = int(dados['estoque'])
        if 'categoria' in dados:
            produto.categoria = dados['categoria']
        if 'imagem' in dados:
            produto.imagem = dados['imagem']
        if 'ativo' in dados:
            produto.ativo = dados['ativo']
        
        produto.data_atualizacao = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify(produto.to_dict()), 200
    
    except Exception as e:
        db.session.rollback()
        print(f'Erro ao atualizar produto: {str(e)}')
        return jsonify({'error': 'Erro ao atualizar produto'}), 500


@app.route('/api/produtos/<int:id>', methods=['DELETE'])
def deletar_produto(id):
    """Deleta um produto"""
    try:
        produto = Produto.query.get(id)
        
        if not produto:
            return jsonify({'error': 'Produto nao encontrado'}), 404
        
        db.session.delete(produto)
        db.session.commit()
        
        return jsonify({'message': 'Produto deletado com sucesso'}), 200
    
    except Exception as e:
        db.session.rollback()
        print(f'Erro ao deletar produto: {str(e)}')
        return jsonify({'error': 'Erro ao deletar produto'}), 500


# =====================
# ROTAS AUXILIARES
# =====================

@app.route('/api/categorias', methods=['GET'])
def listar_categorias():
    """Lista todas as categorias unicas de produtos"""
    try:
        categorias = db.session.query(Produto.categoria).distinct().all()
        categorias_lista = [cat[0] for cat in categorias if cat[0]]
        
        return jsonify(categorias_lista), 200
    
    except Exception as e:
        print(f'Erro ao listar categorias: {str(e)}')
        return jsonify({'error': 'Erro ao listar categorias'}), 500


@app.route('/health', methods=['GET'])
def health():
    """Endpoint de health check"""
    return jsonify({
        'status': 'ok',
        'message': 'Backend Flask - Aula 6 CRUD'
    }), 200


# =====================
# MANIPULADORES DE ERRO
# =====================

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint nao encontrado'}), 404


@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Erro interno do servidor'}), 500


# =====================
# EXECUTAR APP
# =====================

if __name__ == '__main__':
    print('=' * 50)
    print('Backend Flask - Aula 6: CRUD de Produtos')
    print('=' * 50)
    print('Servidor rodando em: http://localhost:5000')
    print('Health check: http://localhost:5000/health')
    print('API Produtos: http://localhost:5000/api/produtos')
    print('=' * 50)
    
    app.run(debug=True, host='0.0.0.0', port=5000)
