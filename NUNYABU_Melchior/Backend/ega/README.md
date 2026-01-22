# 🏦 Application Bancaire EGA - Backend

## 📋 Prérequis

- Java 17 ou supérieur
- Maven 3.6+
- MySQL 8.0+
- IDE (IntelliJ IDEA, Eclipse, VS Code)

## 🚀 Installation et Démarrage

### 1. Configuration de la base de données

Créez une base de données MySQL nommée `ega` :

```sql
CREATE DATABASE ega CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Configuration de l'application

Modifiez le fichier `src/main/resources/application.properties` si nécessaire :

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ega?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=votre_mot_de_passe
```

### 3. Lancement de l'application

```bash
cd Backend/ega
mvn spring-boot:run
```

Ou depuis votre IDE, lancez la classe `EgaApplication.java`.

L'application démarre sur le port **9090** : http://localhost:9090

## 👤 Comptes créés automatiquement

Au premier démarrage, les comptes suivants sont créés automatiquement :

### 🔐 ADMIN
- **Username:** `admin`
- **Password:** `admin123`
- **Rôle:** ADMIN
- **Accès:** Tous les clients, comptes et transactions

### 👤 CLIENT
- **Username:** `client`
- **Password:** `client123`
- **Email:** client@ega.com
- **Rôle:** CLIENT
- **Comptes créés:**
  - 1 Compte Courant avec 50 000 XOF
  - 1 Compte Épargne avec 0 XOF

## 📡 Endpoints API

### Authentification
- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Inscription

### Clients (nécessite authentification)
- `GET /api/clients` - Liste tous les clients
- `GET /api/clients/{id}` - Détails d'un client
- `POST /api/clients` - Créer un client
- `DELETE /api/clients/{id}` - Supprimer un client

### Comptes (nécessite authentification)
- `GET /api/comptes` - Mes comptes (CLIENT) ou tous (ADMIN)
- `POST /api/comptes/creer` - Créer un compte
- `POST /api/comptes/depot` - Effectuer un dépôt
- `POST /api/comptes/retrait` - Effectuer un retrait
- `POST /api/comptes/virement` - Effectuer un virement

### Transactions (nécessite authentification)
- `GET /api/transactions/mes-transactions` - Mes transactions
- `GET /api/transactions/compte/{numeroCompte}` - Transactions d'un compte
- `GET /api/transactions/compte/{numeroCompte}/periode` - Transactions par période

### Relevé (nécessite authentification)
- `GET /api/releve/compte/{numeroCompte}` - Générer un relevé
- `GET /api/releve/compte/{numeroCompte}/pdf` - Générer un relevé PDF

### Admin (nécessite rôle ADMIN)
- `GET /api/admin/clients` - Tous les clients
- `GET /api/admin/comptes` - Tous les comptes
- `GET /api/admin/transactions` - Toutes les transactions
- `GET /api/admin/statistiques` - Statistiques globales
- `GET /api/admin/clients/{id}/details` - Détails d'un client

## 🔒 Sécurité

- Authentification JWT
- Rôles : ADMIN et CLIENT
- Routes protégées selon les rôles
- Validation des données avec Bean Validation

## 📝 Documentation API

Une fois l'application démarrée, accédez à Swagger UI :
- http://localhost:9090/swagger-ui.html

## 🧪 Test avec Postman

1. Importez la collection Postman (à créer)
2. Testez d'abord `/api/auth/login` avec les credentials ci-dessus
3. Copiez le token JWT retourné
4. Utilisez ce token dans l'header `Authorization: Bearer <token>` pour les autres requêtes

## ⚠️ Notes importantes

- Les mots de passe sont hashés avec BCrypt
- Les tokens JWT expirent après 24 heures
- La base de données est créée automatiquement au premier démarrage (hibernate.ddl-auto=update)
