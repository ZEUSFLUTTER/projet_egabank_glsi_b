# Configuration de la Base de Données MySQL avec XAMPP

## Étapes de configuration

### 1. Démarrer XAMPP
1. Ouvrez le panneau de contrôle XAMPP
2. Démarrez **Apache** et **MySQL**
3. Vérifiez que les services sont en cours d'exécution (voyants verts)

### 2. Créer la base de données

#### Option A : Via phpMyAdmin (Recommandé)
1. Ouvrez votre navigateur
2. Allez sur http://localhost/phpmyadmin
3. Cliquez sur "Nouvelle base de données"
4. Nom : `bank_db`
5. Interclassement : `utf8mb4_unicode_ci`
6. Cliquez sur "Créer"
7. Sélectionnez la base `bank_db`
8. Cliquez sur "Importer"
9. Choisissez le fichier `create_bank_db.sql`
10. Cliquez sur "Exécuter"

#### Option B : Via ligne de commande
1. Ouvrez un terminal dans le dossier `database`
2. Exécutez : `setup_database.bat`
3. Suivez les instructions

### 3. Vérification
Après création, vous devriez voir dans phpMyAdmin :
- Base de données : `bank_db`
- Tables : `users`, `clients`, `comptes`, `transactions`
- Données de test insérées

### 4. Redémarrer l'application
1. Arrêtez votre application Spring Boot (Ctrl+C)
2. Redémarrez avec : `.\mvnw.cmd spring-boot:run`

## Données de test incluses

### Utilisateurs
- **admin** / **admin123** (Administrateur)
- **user** / **user123** (Utilisateur normal)

### Clients de test
1. **Amadou Diop** - +221771234567 - amadou.diop@email.com
2. **Fatou Fall** - +221772345678 - fatou.fall@email.com  
3. **Moussa Ndiaye** - +221773456789 - moussa.ndiaye@email.com

### Comptes créés
- Amadou : 1 compte courant (150,000 FCFA) + 1 compte épargne (75,000 FCFA)
- Fatou : 1 compte courant (200,000 FCFA)
- Moussa : 1 compte épargne (120,000 FCFA)

## Accès aux outils

- **phpMyAdmin** : http://localhost/phpmyadmin
- **API Backend** : http://localhost:8080
- **Test API** : Ouvrez `test-api.html` dans votre navigateur

## Dépannage

### Erreur de connexion MySQL
1. Vérifiez que MySQL est démarré dans XAMPP
2. Vérifiez le port (par défaut 3306)
3. Vérifiez que le mot de passe root est vide

### Erreur "Table doesn't exist"
1. Vérifiez que la base `bank_db` existe
2. Vérifiez que les tables ont été créées
3. Redémarrez l'application Spring Boot

### Erreur de dépendances
1. Vérifiez que `mysql-connector-j` est dans le pom.xml
2. Recompilez : `.\mvnw.cmd clean compile`