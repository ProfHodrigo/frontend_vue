#!/usr/bin/env python
"""
Script para popular o banco de dados com produtos de teste.

Uso:
    python seed.py

Produtos criados:
    - 23 produtos em 4 categorias (Eletronicos, Roupas, Livros, Alimentos)

Requisitos:
    - Flask, SQLAlchemy
"""

import sys
import os

# Adicionar diretorio atual ao path para importar app
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from app import app, db, Produto
except ImportError as e:
    print(f"Erro ao importar app: {str(e)}")
    print("Certifique-se de que as dependencias foram instaladas:")
    print("  pip install -r requirements.txt")
    sys.exit(1)

# Dados dos produtos de teste
PRODUTOS_TESTE = [
    # Eletronicos
    {
        'nome': 'Notebook Dell Inspiron 15',
        'descricao': 'Notebook com processador Intel Core i5, 8GB RAM, SSD 256GB',
        'preco': 3499.99,
        'estoque': 15,
        'categoria': 'Eletronicos',
        'imagem': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
        'ativo': True
    },
    {
        'nome': 'Mouse Logitech MX Master 3',
        'descricao': 'Mouse wireless ergonomico com alta precisao',
        'preco': 449.90,
        'estoque': 30,
        'categoria': 'Eletronicos',
        'imagem': 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400',
        'ativo': True
    },
    {
        'nome': 'Teclado Mecanico Keychron K2',
        'descricao': 'Teclado mecanico wireless 75% com switches Brown',
        'preco': 699.00,
        'estoque': 8,
        'categoria': 'Eletronicos',
        'imagem': 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400',
        'ativo': True
    },
    {
        'nome': 'Monitor LG UltraWide 29"',
        'descricao': 'Monitor ultrawide 29 polegadas Full HD IPS',
        'preco': 1299.99,
        'estoque': 12,
        'categoria': 'Eletronicos',
        'imagem': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400',
        'ativo': True
    },
    {
        'nome': 'Webcam Logitech C920',
        'descricao': 'Webcam Full HD 1080p com microfone stereo',
        'preco': 399.00,
        'estoque': 5,
        'categoria': 'Eletronicos',
        'imagem': 'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=400',
        'ativo': True
    },
    
    # Roupas
    {
        'nome': 'Camiseta Basica Preta',
        'descricao': 'Camiseta 100% algodao, gola redonda',
        'preco': 49.90,
        'estoque': 50,
        'categoria': 'Roupas',
        'imagem': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
        'ativo': True
    },
    {
        'nome': 'Jaqueta Jeans',
        'descricao': 'Jaqueta jeans classica, tamanhos P ao GG',
        'preco': 199.90,
        'estoque': 20,
        'categoria': 'Roupas',
        'imagem': 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
        'ativo': True
    },
    {
        'nome': 'Tenis Esportivo Nike',
        'descricao': 'Tenis para corrida e caminhada',
        'preco': 349.90,
        'estoque': 15,
        'categoria': 'Roupas',
        'imagem': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
        'ativo': True
    },
    {
        'nome': 'Calca Jeans Skinny',
        'descricao': 'Calca jeans skinny, varios tamanhos',
        'preco': 159.90,
        'estoque': 25,
        'categoria': 'Roupas',
        'imagem': 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400',
        'ativo': True
    },
    {
        'nome': 'Moletom Canguru',
        'descricao': 'Moletom com capuz e bolso frontal',
        'preco': 119.90,
        'estoque': 30,
        'categoria': 'Roupas',
        'imagem': 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400',
        'ativo': True
    },
    
    # Livros
    {
        'nome': 'Clean Code - Robert Martin',
        'descricao': 'Guia completo sobre como escrever codigo limpo',
        'preco': 89.90,
        'estoque': 25,
        'categoria': 'Livros',
        'imagem': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
        'ativo': True
    },
    {
        'nome': 'The Pragmatic Programmer',
        'descricao': 'Classico sobre desenvolvimento de software',
        'preco': 95.00,
        'estoque': 18,
        'categoria': 'Livros',
        'imagem': 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400',
        'ativo': True
    },
    {
        'nome': 'Design Patterns - Gang of Four',
        'descricao': 'Padroes de projeto orientados a objetos',
        'preco': 110.00,
        'estoque': 10,
        'categoria': 'Livros',
        'imagem': 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400',
        'ativo': True
    },
    {
        'nome': 'JavaScript: The Good Parts',
        'descricao': 'Guia essencial sobre JavaScript',
        'preco': 75.00,
        'estoque': 20,
        'categoria': 'Livros',
        'imagem': 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400',
        'ativo': True
    },
    {
        'nome': 'Eloquent JavaScript',
        'descricao': 'Introducao moderna a programacao',
        'preco': 82.00,
        'estoque': 22,
        'categoria': 'Livros',
        'imagem': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
        'ativo': True
    },
    
    # Alimentos
    {
        'nome': 'Cafe Premium Torrado',
        'descricao': 'Cafe gourmet 100% arabica, pacote 500g',
        'preco': 35.90,
        'estoque': 40,
        'categoria': 'Alimentos',
        'imagem': 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400',
        'ativo': True
    },
    {
        'nome': 'Chocolate Belga 70% Cacau',
        'descricao': 'Chocolate amargo premium, barra 200g',
        'preco': 28.90,
        'estoque': 35,
        'categoria': 'Alimentos',
        'imagem': 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400',
        'ativo': True
    },
    {
        'nome': 'Azeite Extra Virgem',
        'descricao': 'Azeite portugues extra virgem, 500ml',
        'preco': 45.90,
        'estoque': 28,
        'categoria': 'Alimentos',
        'imagem': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400',
        'ativo': True
    },
    {
        'nome': 'Mel Organico Puro',
        'descricao': 'Mel de flores silvestres organico, 300g',
        'preco': 32.90,
        'estoque': 18,
        'categoria': 'Alimentos',
        'imagem': 'https://images.unsplash.com/photo-1587049352846-4a222e784554?w=400',
        'ativo': True
    },
    {
        'nome': 'Queijo Parmesao Ralado',
        'descricao': 'Queijo parmesao italiano ralado, 100g',
        'preco': 24.90,
        'estoque': 45,
        'categoria': 'Alimentos',
        'imagem': 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400',
        'ativo': True
    },
    {
        'nome': 'Vinho Tinto Reserva',
        'descricao': 'Vinho tinto seco reserva, 750ml',
        'preco': 89.90,
        'estoque': 12,
        'categoria': 'Alimentos',
        'imagem': 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400',
        'ativo': True
    },
    {
        'nome': 'Cha Verde Premium',
        'descricao': 'Cha verde importado, caixa 25 saches',
        'preco': 19.90,
        'estoque': 50,
        'categoria': 'Alimentos',
        'imagem': 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400',
        'ativo': True
    },
    {
        'nome': 'Granola Artesanal',
        'descricao': 'Granola caseira com frutas secas, 500g',
        'preco': 27.90,
        'estoque': 33,
        'categoria': 'Alimentos',
        'imagem': 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=400',
        'ativo': True
    }
]


def seed_database():
    """Popular banco com produtos de teste"""
    print("Populando banco de dados com produtos...")
    print("-" * 50)
    
    with app.app_context():
        try:
            # Criar tabelas se nao existirem
            db.create_all()
            
            # Verificar se ja tem produtos
            produto_count = Produto.query.count()
            
            if produto_count > 0:
                print(f"Aviso: Banco ja tem {produto_count} produtos.")
                print("\nPara resetar o banco:")
                print("  1. Delete o arquivo 'produtos.db' na pasta instance/")
                print("  2. Execute este script novamente")
                return False
            
            # Criar produtos
            print(f"Criando {len(PRODUTOS_TESTE)} produtos de teste...")
            
            for produto_data in PRODUTOS_TESTE:
                produto = Produto(
                    nome=produto_data['nome'],
                    descricao=produto_data['descricao'],
                    preco=produto_data['preco'],
                    estoque=produto_data['estoque'],
                    categoria=produto_data['categoria'],
                    imagem=produto_data['imagem'],
                    ativo=produto_data['ativo']
                )
                db.session.add(produto)
            
            db.session.commit()
            
            print("-" * 50)
            print("Sucesso! Banco de dados populado.")
            
            # Exibir resumo
            print(f"\nProdutos criados por categoria:")
            categorias = db.session.query(Produto.categoria).distinct().all()
            for cat in categorias:
                count = Produto.query.filter_by(categoria=cat[0], ativo=True).count()
                print(f"  - {cat[0]}: {count} produtos ativos")
            
            total_ativos = Produto.query.filter_by(ativo=True).count()
            print(f"\nTotal: {total_ativos} produtos ativos")
            
            return True
        
        except Exception as e:
            db.session.rollback()
            print(f"Erro ao popular banco: {str(e)}")
            import traceback
            traceback.print_exc()
            return False


def main():
    """Funcao principal"""
    print("\n" + "=" * 50)
    print("Seed Database - Aula 6 CRUD de Produtos")
    print("=" * 50 + "\n")
    
    sucesso = seed_database()
    
    if sucesso:
        print("\nProximos passos:")
        print("  1. Iniciar backend: python app.py")
        print("  2. Em outro terminal, iniciar frontend: npm run dev")
        print("  3. Acessar: http://localhost:5173")
        print("  4. Testar CRUD de produtos")
        print("\n" + "=" * 50)
        return 0
    else:
        print("\n" + "=" * 50)
        print("Falha ao popular banco. Verifique os erros acima.")
        print("=" * 50)
        return 1


if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)

