#!/usr/bin/env python3
"""
Script pour initialiser la base de données PostgreSQL EGA Bank
Connexion à Neon PostgreSQL et exécution du script d'initialisation
"""

import psycopg2
from psycopg2 import sql
import sys

# Configuration de connexion
CONNECTION_STRING = "postgresql://neondb_owner:npg_djlmWLR06xDu@ep-sparkling-waterfall-ahanxzed-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

def read_sql_file(file_path):
    """Lire le fichier SQL"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        print(f"❌ Erreur: Le fichier {file_path} n'existe pas")
        sys.exit(1)

def execute_sql(sql_content):
    """Exécuter le SQL sur la base de données"""
    try:
        print("🔗 Connexion à la base de données PostgreSQL...")
        conn = psycopg2.connect(CONNECTION_STRING)
        cursor = conn.cursor()
        
        print("📝 Exécution du script d'initialisation...")
        
        # Exécuter le SQL
        cursor.execute(sql_content)
        
        # Récupérer tous les résultats
        results = []
        while True:
            try:
                result = cursor.fetchall()
                if result:
                    results.append(result)
                # Vérifier s'il y a d'autres résultats
                if not cursor.nextset():
                    break
            except Exception:
                break
        
        # Afficher les résultats
        if results:
            print("\n✅ Résultats:")
            for result_set in results:
                for row in result_set:
                    print(f"   {row}")
        
        conn.commit()
        print("\n✅ Base de données initialisée avec succès!")
        
        cursor.close()
        conn.close()
        
        return True
        
    except psycopg2.Error as e:
        print(f"❌ Erreur PostgreSQL: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Erreur: {e}")
        sys.exit(1)

if __name__ == "__main__":
    sql_file_path = "init-database.sql"
    
    print("=" * 60)
    print("EGA BANK - Initialisation de la Base de Données")
    print("=" * 60)
    
    # Lire le fichier SQL
    sql_content = read_sql_file(sql_file_path)
    
    # Exécuter le SQL
    execute_sql(sql_content)
    
    print("=" * 60)
    print("Initialisation terminée!")
    print("=" * 60)
