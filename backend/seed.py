#!/usr/bin/env python
"""
Script para popular o banco de dados com usuarios de teste.

Uso:
    python seed.py

Usuarios criados:
    - prof@admin.com / admin123
    - aluno@user.com / user123

Requisitos:
    - Nenhum (usa apenas modulos built-in)
    - Funciona mesmo se o backend HTTP nao estiver rodando
"""

import sys
import os
from pathlib import Path

# Adicionar diretorio atual ao path para importar app
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from app import app, db, Usuario
    USAR_IMPORT_DIRETO = True
except ImportError as e:
    print(f"Erro ao importar app: {str(e)}")
    print("Certifique-se de que as dependencias foram instaladas:")
    print("  pip install -r requirements.txt")
    sys.exit(1)

# Dados dos usuarios de teste
USUARIOS_TESTE = [
    {
        "nome": "Prof Rodrigo",
        "email": "prof@admin.com",
        "senha": "admin123"
    },
    {
        "nome": "Ana Vitória",
        "email": "aluno1@user.com",
        "senha": "user123"
    },
    {
        "nome": "Anderson Freitas",
        "email": "aluno2@user.com",
        "senha": "user123"
    },
    {
        "nome": "Enzo Souto",
        "email": "aluno3@user.com",
        "senha": "user123"
    }
]


def seed_database():
    """
    Popular banco diretamente importando a aplicacao Flask
    """
    print("Populando banco de dados com usuarios de teste...")
    print("-" * 50)
    
    with app.app_context():
        try:
            # Criar tabelas se nao existirem
            db.create_all()
            
            # Verificar se ja tem usuarios
            usuario_count = Usuario.query.count()
            
            if usuario_count > 0:
                print("Aviso: Banco de dados ja estava populado.")
                print(f"Ja existem {usuario_count} usuarios no banco.")
                print("\nPara resetar o banco:")
                print("  1. Delete o arquivo 'usuarios.db'")
                print("  2. Execute este script novamente")
                return False
            
            # Criar usuarios
            print(f"Criando {len(USUARIOS_TESTE)} usuarios de teste...")
            
            for dados in USUARIOS_TESTE:
                usuario = Usuario(
                    nome=dados['nome'],
                    email=dados['email']
                )
                usuario.set_password(dados['senha'])
                db.session.add(usuario)
                print(f"  + {dados['nome']} ({dados['email']})")
            
            db.session.commit()
            
            print("-" * 50)
            print("Sucesso! Banco de dados populado.")
            return True
        
        except Exception as e:
            db.session.rollback()
            print(f"Erro ao popular banco: {str(e)}")
            import traceback
            traceback.print_exc()
            return False


def exibir_usuarios():
    """
    Exibir usuarios criados
    """
    print("\nUsuarios de teste disponiveis:")
    print("=" * 50)
    for i, usuario in enumerate(USUARIOS_TESTE, 1):
        print(f"\nUsuario {i}:")
        print(f"  Email: {usuario['email']}")
        print(f"  Senha: {usuario['senha']}")
    print("\n" + "=" * 50)


def main():
    """
    Funcao principal
    """
    print("\n" + "=" * 50)
    print("Seed Database - Aula 7 Autenticacao JWT")
    print("=" * 50 + "\n")
    
    sucesso = seed_database()
    
    if sucesso:
        exibir_usuarios()
        print("\nProximos passos:")
        print("  1. Iniciar backend: python app.py")
        print("  2. Em outro terminal, iniciar frontend: npm run dev")
        print("  3. Acessar: http://localhost:5173")
        print("  4. Fazer login com as credenciais acima")
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

