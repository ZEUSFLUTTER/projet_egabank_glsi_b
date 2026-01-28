# 🏦 EGA BANK - Système de Gestion Bancaire

![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.1-green)
![Angular](https://img.shields.io/badge/Angular-17-red)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)
![JWT](https://img.shields.io/badge/JWT-Authentication-yellow)

## 📋 Table des Matières

- [Vue d'ensemble](#vue-densemble)
- [Architecture](#architecture)
- [Technologies utilisées](#technologies-utilisées)
- [Fonctionnalités](#fonctionnalités)
- [Installation et Configuration](#installation-et-configuration)
- [API Documentation](#api-documentation)
- [Structure du Projet](#structure-du-projet)
- [Tests](#tests)
- [Déploiement](#déploiement)
- [Contribution](#contribution)

## 🎯 Vue d'ensemble

EGA Bank est un système complet de gestion bancaire développé avec une architecture moderne full-stack. Le projet comprend :

- **Backend** : API REST avec Spring Boot 3.2.1
- **Frontend** : Application web avec Angular 17
- **Base de données** : PostgreSQL
- **Sécurité** : Authentification JWT avec Spring Security
- **Documentation** : API REST complètement documentée

### 🎭 Rôles Utilisateurs

- **👨‍💼 ADMIN** : Gestion complète des clients, comptes et transactions
- **👤 CLIENT** : Gestion de ses propres comptes et opérations bancaires

## 🏗️ Architecture

```
┌─────────────────┐    HTTP/REST    ┌─────────────────┐    JPA/Hibernate    ┌─────────────────┐
│                 │ ◄──────────────► │                 │ ◄──────────────────► │                 │
│  Angular 17     │                 │  Spring Boot    │                     │  PostgreSQL     │
│  Frontend       │                 │  Backend API    │                     │  Database       │
│                 │                 │                 │                     │                 │
└─────────────────┘                 └─────────────────┘                     └─────────────────┘
```

### 🔐 Sécurité

- **JWT (JSON Web Tokens)** pour l'authentification
- **Spring Security** pour l'autorisation
- **Chiffrement BCrypt** pour les mots de passe
- **CORS** configuré pour le frontend

## 🛠️ Technologies utilisées

### Backend
- **Java 17**
- **Spring Boot 3.2.1**
- **Spring Security 6**
- **Spring Data JPA**
- **PostgreSQL**
- **JWT (jjwt 0.11.5)**
- **OpenPDF** pour la génération de PDF
- **IBAN4J** pour la validation IBAN
- **Maven** pour la gestion des dépendances

### Frontend
- **Angular 17**
- **TypeScript 5.2**
- **RxJS 7.8**
- **Angular Router**
- **Angular Forms**
- **SCSS** pour les styles

### Base de données
- **PostgreSQL 15+**
- **Hibernate ORM**
- **Flyway** (optionnel pour les migrations)

## ✨ Fonctionnalités

### 🔐 Authentification & Autorisation
- [x] Inscription des clients
- [x] Connexion avec JWT
- [x] Gestion des rôles (ADMIN/CLIENT)
- [x] Protection des routes
- [x] Déconnexion sécurisée

### 👨‍💼 Gestion Administrative
- [x] Création d'administrateurs
- [x] CRUD complet des clients
- [x] Statistiques du dashboard
- [x] Gestion des comptes clients
- [x] Historique des transactions
- [x] Export des données

### 💳 Gestion des Comptes
- [x] Création de comptes (COURANT/EPARGNE)
- [x] Génération automatique de numéros de compte
- [x] Consultation des soldes
- [x] Historique des opérations
- [x] Relevés de compte (JSON/PDF)

### 💸 Opérations Bancaires
- [x] Dépôts
- [x] Retraits
- [x] Virements entre comptes
- [x] Validation des soldes
- [x] Traçabilité complète

### 📊 Rapports & Exports
- [x] Relevés de compte PDF
- [x] Historique des transactions PDF
- [x] Export des données clients
- [x] Statistiques en temps réel

## 🚀 Installation et Configuration

### Prérequis

- **Java 17+**
- **Node.js 18+**
- **PostgreSQL 15+**
- **Maven 3.8+**
- **Angular CLI 17+**

### 1. Configuration de la Base de Données

```sql
-- Créer la base de données
CREATE DATABASE egadb;

-- Créer l'utilisateur
CREATE USER egadmin WITH PASSWORD 'egapass';

-- Accorder les privilèges
GRANT ALL PRIVILEGES ON DATABASE egadb TO egadmin;
```

### 2. Configuration du Backend

```bash
# Cloner le projet
git clone <repository-url>
cd ega-bank-project

# Aller dans le dossier backend
cd Ega-Bank/ega-bank

# Configurer application.properties (déjà configuré)
# spring.datasource.url=jdbc:postgresql://localhost:5432/egadb
# spring.datasource.username=egadmin
# spring.datasource.password=egapass

# Installer les dépendances et démarrer
mvn clean install
mvn spring-boot:run
```

Le backend sera accessible sur `http://localhost:8080`

### 3. Configuration du Frontend

```bash
# Aller dans le dossier frontend
cd ega-bank-frontend

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm start
```

Le frontend sera accessible sur `http://localhost:4200`

### 4. Données de Test

Le système crée automatiquement un administrateur par défaut :
- **Email** : `admin@ega.com`
- **Mot de passe** : `admin123`

## 📚 API Documentation

### Base URL
```
http://localhost:8080/api
```

### Authentification
Tous les endpoints (sauf `/auth/login` et `/auth/register`) nécessitent un token JWT :
```
Authorization: Bearer <your-jwt-token>
```

### Endpoints Principaux

#### 🔐 Authentification (`/auth`)
```http
POST /auth/login
POST /auth/register
```

#### 👨‍💼 Administration (`/admin`)
```http
POST   /admin/register
GET    /admin/clients
POST   /admin/clients
GET    /admin/clients/{id}
PUT    /admin/clients/{id}
DELETE /admin/clients/{id}
GET    /admin/clients/{id}/comptes
GET    /admin/clients/{id}/transactions
```

#### 💳 Comptes (`/comptes`)
```http
POST   /comptes
POST   /comptes/admin
GET    /comptes/mes-comptes
GET    /comptes/{numero}
POST   /comptes/operations
GET    /comptes/{numero}/releve
GET    /comptes/{numero}/releve/pdf
```

#### 💸 Transactions (`/transactions`)
```http
GET /transactions/recent
GET /transactions/client/{clientId}
GET /transactions/client/{clientId}/pdf
```

### Exemples de Requêtes

#### Connexion
```json
POST /api/auth/login
{
  "courriel": "admin@ega.com",
  "password": "admin123"
}
```

#### Création d'un Client
```json
POST /api/admin/clients
{
  "nom": "Dupont",
  "prenom": "Jean",
  "dateNaissance": "1990-01-01",
  "sexe": "M",
  "adresse": "123 Rue de la Paix",
  "telephone": "0123456789",
  "courriel": "jean.dupont@email.com",
  "password": "password123",
  "nationalite": "Française"
}
```

#### Opération Bancaire
```json
POST /api/comptes/operations
{
  "type": "DEPOT",
  "numeroCompteSource": "CPT001",
  "montant": 1000.00,
  "description": "Dépôt initial"
}
```

## 📁 Structure du Projet

```
ega-bank-project/
├── Ega-Bank/ega-bank/                 # Backend Spring Boot
│   ├── src/main/java/com/ega/ega_bank/
│   │   ├── controller/                # Contrôleurs REST
│   │   ├── service/                   # Logique métier
│   │   ├── repository/                # Accès aux données
│   │   ├── entite/                    # Entités JPA
│   │   ├── dto/                       # Data Transfer Objects
│   │   ├── security/                  # Configuration sécurité
│   │   ├── config/                    # Configurations
│   │   └── exception/                 # Gestion des exceptions
│   ├── src/main/resources/
│   │   ├── application.properties     # Configuration
│   │   └── static/                    # Ressources statiques
│   └── pom.xml                        # Dépendances Maven
│
├── ega-bank-frontend/                 # Frontend Angular
│   ├── src/app/
│   │   ├── components/                # Composants Angular
│   │   │   ├── auth/                  # Authentification
│   │   │   ├── admin/                 # Interface admin
│   │   │   ├── client/                # Interface client
│   │   │   └── shared/                # Composants partagés
│   │   ├── services/                  # Services Angular
│   │   ├── guards/                    # Guards de route
│   │   ├── interceptors/              # Intercepteurs HTTP
│   │   ├── models/                    # Modèles TypeScript
│   │   └── app.routes.ts              # Configuration des routes
│   ├── src/assets/                    # Ressources statiques
│   ├── src/styles.scss                # Styles globaux
│   └── package.json                   # Dépendances npm
│
├── test-scripts/                      # Scripts de test
├── documentation/                     # Documentation supplémentaire
└── README.md                          # Ce fichier
```

### 🏗️ Architecture Backend

#### Couches de l'Application
1. **Controller** : Endpoints REST
2. **Service** : Logique métier
3. **Repository** : Accès aux données
4. **Entity** : Modèles de données
5. **DTO** : Objets de transfert
6. **Security** : Authentification/Autorisation

#### Entités Principales
- **Client** : Utilisateurs du système
- **Compte** : Comptes bancaires
- **Transaction** : Opérations bancaires

### 🎨 Architecture Frontend

#### Structure Angular
- **Components** : Interfaces utilisateur
- **Services** : Communication avec l'API
- **Guards** : Protection des routes
- **Interceptors** : Gestion des tokens JWT
- **Models** : Types TypeScript

## 🧪 Tests

### Backend (Spring Boot)
```bash
cd Ega-Bank/ega-bank
mvn test
```

### Frontend (Angular)
```bash
cd ega-bank-frontend
npm test
```

### Tests d'API avec les Scripts Fournis
Le projet inclut plusieurs scripts de test :
- `test-admin-complete.js` : Tests complets admin
- `test-dashboard-final.js` : Tests du dashboard
- `test-connectivity.ps1` : Test de connectivité

## 🚀 Déploiement

### Environnement de Production

#### Backend
```bash
# Build du JAR
mvn clean package -DskipTests

# Démarrage avec profil production
java -jar target/ega-bank-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod
```

#### Frontend
```bash
# Build de production
npm run build:prod

# Les fichiers sont générés dans dist/
```

### Variables d'Environnement
```bash
# Base de données
DB_URL=jdbc:postgresql://localhost:5432/egadb
DB_USERNAME=egadmin
DB_PASSWORD=egapass

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRATION=86400000

# Server
SERVER_PORT=8080
```

## 🔧 Configuration Avancée

### CORS Configuration
Le backend est configuré pour accepter les requêtes du frontend :
```java
@CrossOrigin(origins = "http://localhost:4200")
```

### JWT Configuration
- **Durée de vie** : 24 heures
- **Algorithme** : HS256
- **Claims** : email, role, expiration

### Base de Données
- **Pool de connexions** : HikariCP
- **Hibernate** : DDL auto-update
- **Logs SQL** : Activés en développement

## 📈 Monitoring et Logs

### Logs Backend
```properties
# Configuration dans application.properties
logging.level.org.springframework=INFO
logging.level.org.hibernate.SQL=DEBUG
logging.level.com.ega.ega_bank=DEBUG
```

### Métriques
- Actuator endpoints disponibles
- Health checks configurés
- Métriques JVM activées

## 🤝 Contribution

### Standards de Code
- **Java** : Google Java Style Guide
- **TypeScript** : Angular Style Guide
- **Git** : Conventional Commits

### Workflow
1. Fork du projet
2. Création d'une branche feature
3. Développement avec tests
4. Pull Request avec description

## 📞 Support

### Issues Connues
- Vérifier que PostgreSQL est démarré
- Port 8080 libre pour le backend
- Port 4200 libre pour le frontend

### Contact
- **Développeur** : EGA Bank Team
- **Email** : support@ega-bank.com
- **Documentation** : [Wiki du projet]

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

## 🎉 Démarrage Rapide

```bash
# 1. Démarrer PostgreSQL et créer la base egadb

# 2. Backend
cd Ega-Bank/ega-bank
mvn spring-boot:run

# 3. Frontend (nouveau terminal)
cd ega-bank-frontend
npm install && npm start

# 4. Accéder à l'application
# Frontend: http://localhost:4200
# Backend API: http://localhost:8080
# Login admin: admin@ega.com / admin123
```

**🎯 L'application est maintenant prête à être utilisée !**