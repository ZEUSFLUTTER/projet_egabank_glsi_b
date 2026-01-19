# 🚀 Guide de Démarrage EGA Bank

## 📋 Prérequis

Avant de démarrer l'application, assurez-vous d'avoir installé:

- ✅ **Java 17+** (pour le backend Spring Boot)
- ✅ **Node.js 18+** et **npm** (pour le frontend Angular)
- ✅ **Maven** (inclus dans le projet via Maven Wrapper)

> **Note :** Ce projet utilise une base de données **H2 en mémoire**. Aucune installation de base de données n'est requise !

## 🗄️ Base de Données

### Configuration H2 (Base en mémoire)

Le projet utilise **H2**, une base de données en mémoire. Cela signifie :

- ✅ **Aucune installation requise**
- ✅ **Données pré-initialisées** au démarrage (utilisateur admin + clients de test)
- ⚠️ **Données non persistées** : les données sont réinitialisées à chaque redémarrage

### Console H2 (Visualisation des données)

Une fois le backend démarré, vous pouvez accéder à la console H2 :

- **URL :** http://localhost:8080/h2-console
- **JDBC URL :** `jdbc:h2:mem:egabank`
- **Username :** `sa`
- **Password :** *(laisser vide)*

## 🔧 Installation

### Backend (Spring Boot)

```bash
cd backend/ega-bank

# Les dépendances seront téléchargées automatiquement au démarrage
# Ou pour les télécharger manuellement:
./mvnw clean install
```

### Frontend (Angular)

```bash
cd frontend/ega-bank-ui

# Installer les dépendances
npm install
```

## ▶️ Démarrage de l'application

### Option 1: Démarrage séparé (Recommandé pour le développement)

#### Terminal 1 - Backend
```bash
cd backend/ega-bank
./mvnw spring-boot:run
```

Le backend sera accessible sur: **http://localhost:8080**

Documentation Swagger: **http://localhost:8080/swagger-ui.html**

#### Terminal 2 - Frontend
```bash
cd frontend/ega-bank-ui

# Démarrage avec proxy (recommandé)
npm start
```

Le frontend sera accessible sur: **http://localhost:4200**

### Option 2: Démarrage avec scripts (Windows)

Créez deux fichiers batch:

**start-backend.bat**
```batch
@echo off
cd backend\ega-bank
call mvnw.cmd spring-boot:run
```

**start-frontend.bat**
```batch
@echo off
cd frontend\ega-bank-ui
call npm start
```

Exécutez les deux fichiers dans des terminaux séparés.

## 🔐 Compte Utilisateur par Défaut

Au démarrage, un compte administrateur est créé automatiquement :

| Champ | Valeur |
|-------|--------|
| **Nom d'utilisateur** | `admin` |
| **Mot de passe** | `admin123` |
| **Email** | `admin@egabank.com` |

Deux clients de test sont également créés :
- Jean Dupont (Lomé, Togo)
- Marie Curie (Kara, Togo)

## ✅ Vérification de la connexion

### 1. Vérifier le backend

Ouvrez votre navigateur et accédez à:
- Swagger UI: http://localhost:8080/swagger-ui.html
- Console H2: http://localhost:8080/h2-console

### 2. Tester la connexion via Swagger

1. Accédez à http://localhost:8080/swagger-ui.html
2. Testez l'endpoint `/api/auth/login` avec :
   ```json
   {
     "username": "admin",
     "password": "admin123"
   }
   ```
3. Copiez le `accessToken` retourné
4. Cliquez sur "Authorize" dans Swagger
5. Entrez `Bearer <votre-token>`
6. Testez les autres endpoints protégés

### 3. Tester via l'interface Angular

1. Accédez à http://localhost:4200
2. Connectez-vous avec `admin` / `admin123`
3. Explorez le dashboard, les clients, les comptes et les transactions

## 📁 Structure du projet

```
TP_JEE_GLSI_B_Bogue_Komla_Armel_2026/
├── backend/
│   └── ega-bank/
│       ├── src/
│       │   ├── main/
│       │   │   ├── java/com/ega/egabank/
│       │   │   │   ├── config/          # Configuration (Security, CORS, DataInitializer)
│       │   │   │   ├── controller/      # Contrôleurs REST
│       │   │   │   ├── dto/             # Objets de Transfert de Données
│       │   │   │   ├── entity/          # Entités JPA
│       │   │   │   ├── exception/       # Gestion des exceptions
│       │   │   │   ├── mapper/          # Mappers Entity <-> DTO
│       │   │   │   ├── repository/      # Repositories JPA
│       │   │   │   ├── security/        # JWT & Sécurité
│       │   │   │   └── service/         # Services métier
│       │   │   └── resources/
│       │   │       └── application.properties
│       │   └── test/                    # Tests unitaires et d'intégration
│       └── pom.xml
│
├── frontend/
│   └── ega-bank-ui/
│       ├── src/
│       │   ├── app/
│       │   │   ├── guards/              # Guards de route
│       │   │   ├── interceptors/        # Intercepteurs HTTP
│       │   │   ├── models/              # Interfaces TypeScript
│       │   │   ├── pages/               # Composants de pages
│       │   │   ├── services/            # Services Angular
│       │   │   ├── shared/              # Composants partagés
│       │   │   └── stores/              # État de l'application
│       │   └── styles.css               # Styles globaux
│       ├── proxy.conf.json              # Configuration proxy
│       └── package.json
│
└── docs/
    └── BACKEND_FRONTEND_CONNECTION.md   # Documentation détaillée
```

## 🛠️ Commandes utiles

### Backend

```bash
# Démarrer l'application
./mvnw spring-boot:run

# Compiler sans exécuter les tests
./mvnw clean install -DskipTests

# Exécuter les tests
./mvnw test

# Nettoyer les builds
./mvnw clean

# Générer le JAR de production
./mvnw package
```

### Frontend

```bash
# Démarrer en mode développement
npm start

# Builder pour la production
npm run build

# Exécuter les tests
npm test
```

## 🐛 Résolution des problèmes courants

### Problème: Backend ne démarre pas

**Erreur**: Port 8080 déjà utilisé

**Solution**:
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### Problème: Frontend ne trouve pas le backend (CORS)

**Erreur**: `Access to XMLHttpRequest has been blocked by CORS policy`

**Solutions**:
1. Vérifiez que le backend est démarré sur http://localhost:8080
2. Vérifiez que vous avez lancé `npm start` (qui utilise le proxy)
3. Vérifiez la configuration CORS dans `SecurityConfig.java`

### Problème: Erreur 401 Unauthorized

**Solution**:
1. Assurez-vous d'être connecté
2. Vérifiez que le token est bien stocké dans localStorage
3. Vérifiez que l'intercepteur JWT est configuré (`app.config.ts`)

### Problème: Port déjà utilisé

**Backend (8080)**:
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8080 | xargs kill -9
```

**Frontend (4200)**:
```bash
# Windows
netstat -ano | findstr :4200
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:4200 | xargs kill -9
```

## 🎯 Endpoints API disponibles

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/auth/refresh` - Rafraîchir le token

### Clients (authentification requise)
- `GET /api/clients` - Liste des clients (pagination)
- `GET /api/clients/search?q=terme` - Recherche
- `GET /api/clients/{id}` - Détails d'un client
- `GET /api/clients/{id}/details` - Client avec comptes
- `POST /api/clients` - Créer un client
- `PUT /api/clients/{id}` - Modifier un client
- `DELETE /api/clients/{id}` - Supprimer un client

### Comptes (authentification requise)
- `GET /api/accounts` - Liste des comptes (pagination)
- `GET /api/accounts/{numeroCompte}` - Détails d'un compte
- `GET /api/accounts/client/{clientId}` - Comptes d'un client
- `POST /api/accounts` - Créer un compte
- `DELETE /api/accounts/{id}` - Supprimer un compte
- `PUT /api/accounts/{id}/deactivate` - Désactiver un compte

### Transactions (authentification requise)
- `POST /api/transactions/{numeroCompte}/deposit` - Dépôt
- `POST /api/transactions/{numeroCompte}/withdraw` - Retrait
- `POST /api/transactions/transfer` - Virement
- `GET /api/transactions/{numeroCompte}/history` - Historique
- `GET /api/transactions/{numeroCompte}` - Toutes les transactions

## 📚 Technologies utilisées

### Backend
- **Spring Boot 3.2** - Framework Java
- **Spring Security** - Authentification JWT
- **Spring Data JPA** - Accès aux données
- **H2 Database** - Base de données en mémoire
- **Lombok** - Réduction du boilerplate
- **Swagger/OpenAPI** - Documentation API

### Frontend
- **Angular 21** - Framework TypeScript
- **RxJS** - Programmation réactive
- **CSS Variables** - Design System

## 📞 Support

Pour toute question ou problème:
1. Consultez la documentation dans `/docs`
2. Vérifiez les logs du backend dans la console
3. Vérifiez la console du navigateur (F12)
4. Accédez à la console H2 pour voir les données: http://localhost:8080/h2-console
