# 🔧 DIAGNOSTIC - PROBLÈME CRÉATION CLIENT

## PROBLÈME IDENTIFIÉ

Le client ne se crée pas dans la base de données et n'apparaît pas dans l'application.

## ✅ CORRECTIONS EFFECTUÉES

1. **Frontend client-form.component.ts** : Remplacé la simulation par l'appel API réel
2. **Architecture APIs** : Remis les composants de gestion pour utiliser les APIs CRUD

## 🔍 ÉTAPES DE DIAGNOSTIC

### 1. **Vérifier que XAMPP est démarré**
```bash
# Vérifiez que MySQL est démarré dans XAMPP
# Apache et MySQL doivent être verts
```

### 2. **Tester le backend directement**
Ouvrez le fichier `test-backend-client.html` dans votre navigateur :
- Il testera la connexion au backend
- Il listera les clients existants
- Il permettra de créer un client de test

### 3. **Vérifier les logs du backend**
Dans votre console Spring Boot, cherchez :
```
# Logs de connexion à la base
Hibernate: create table if not exists clients...

# Logs des requêtes SQL
Hibernate: insert into clients (adresse, courriel, date_creation, date_naissance, nationalite, nom, numero_telephone, prenom, sexe) values (?, ?, ?, ?, ?, ?, ?, ?, ?)

# Erreurs éventuelles
ERROR: Could not connect to database...
```

### 4. **Vérifier la base de données MySQL**
```sql
-- Connectez-vous à phpMyAdmin (http://localhost/phpmyadmin)
-- Vérifiez que la base 'bank_db' existe
USE bank_db;

-- Vérifiez que la table clients existe
SHOW TABLES;

-- Vérifiez le contenu de la table
SELECT * FROM clients;
```

## 🚨 CAUSES POSSIBLES

### **Cause 1 : XAMPP non démarré**
- **Solution** : Démarrer Apache et MySQL dans XAMPP

### **Cause 2 : Base de données non créée**
- **Solution** : Exécuter le script `database/setup_database.bat`

### **Cause 3 : Erreur de connexion MySQL**
- **Vérifier** : `application.properties` 
- **URL** : `jdbc:mysql://localhost:3306/bank_db`
- **User** : `root`
- **Password** : (vide)

### **Cause 4 : Port 8080 occupé**
- **Vérifier** : Que le backend Spring Boot démarre sur le port 8080
- **Tester** : http://localhost:8080/api/clients

### **Cause 5 : Problème CORS**
- **Vérifier** : Que `@CrossOrigin(origins = "*")` est présent sur le contrôleur

## 🔧 SOLUTIONS RAPIDES

### **Solution 1 : Redémarrer tout**
```bash
1. Arrêter Spring Boot
2. Arrêter XAMPP
3. Démarrer XAMPP (Apache + MySQL)
4. Démarrer Spring Boot
5. Tester avec test-backend-client.html
```

### **Solution 2 : Vérifier la base manuellement**
```sql
-- Dans phpMyAdmin
CREATE DATABASE IF NOT EXISTS bank_db;
USE bank_db;

-- Vérifier les tables
SHOW TABLES;

-- Si pas de table clients, redémarrer Spring Boot
-- avec spring.jpa.hibernate.ddl-auto=create-drop
```

### **Solution 3 : Mode debug**
Ajoutez dans `application.properties` :
```properties
logging.level.com.ega.bank=DEBUG
logging.level.org.springframework.web=DEBUG
logging.level.org.hibernate.SQL=DEBUG
```

## 📋 CHECKLIST DE VÉRIFICATION

- [ ] XAMPP démarré (Apache + MySQL verts)
- [ ] Backend Spring Boot démarré sans erreur
- [ ] Base `bank_db` existe dans phpMyAdmin
- [ ] Table `clients` existe
- [ ] http://localhost:8080/api/clients accessible
- [ ] test-backend-client.html fonctionne
- [ ] Pas d'erreurs dans la console du navigateur
- [ ] Pas d'erreurs dans les logs Spring Boot

## 🎯 TEST FINAL

1. Ouvrir `test-backend-client.html`
2. Cliquer "Tester la connexion" → ✅ Doit être vert
3. Cliquer "Lister tous les clients" → ✅ Doit afficher la liste (même vide)
4. Remplir le formulaire et cliquer "Créer le client" → ✅ Doit créer le client
5. Retourner dans l'application Angular → ✅ Le client doit apparaître

Si tout est vert dans le test HTML mais que ça ne marche pas dans Angular, le problème est côté frontend. Sinon, le problème est côté backend/base de données.