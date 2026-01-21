# 🏦 EGA Bank API - Documentation

## 📋 Table des Matières
- [Dépendances](#dépendances)
- [Architecture](#architecture)
- [Endpoints](#endpoints)

---

## Dépendances

```xml
<!-- Spring Boot -->
- spring-boot-starter-web
- spring-boot-starter-data-jpa
- spring-boot-starter-security
- spring-boot-starter-validation
- spring-boot-starter-mail

<!-- Sécurité -->
- jjwt (JSON Web Token)

<!-- Base de données -->
- mysql-connector-j

<!-- PDF -->
- itext7-core

<!-- Utilitaires -->
- lombok
```

---

## Architecture

### Structure des Packages

```
com.ega.bank.bank_api/
│
├── config/                    # Configuration
├── controller/                # Endpoints REST
├── dto/                       # Objets de transfert
│   ├── request/
│   └── response/
├── entity/                    # Entités JPA
├── repository/                # Accès données
├── service/                   # Logique métier
├── security/                  # JWT & Auth
├── exception/                 # Gestion erreurs
└── util/                      # Utilitaires
```

### Description des Fichiers Principaux

#### 📁 **config/**
- `DataInitializer.java` - Crée l'utilisateur admin au démarrage
- `SecurityConfig.java` - Configure la sécurité Spring et les autorisations par rôle
- `JwtConfig.java` - Configuration JWT (vide)

#### 📁 **controller/**
- `AuthController.java` - Inscription et connexion
- `ClientController.java` - CRUD clients (EMPLOYEE/ADMIN)
- `ClientSpaceController.java` - Espace personnel client (CLIENT)
- `CompteController.java` - Gestion comptes (EMPLOYEE/ADMIN)
- `TransactionController.java` - Consultation transactions (EMPLOYEE/ADMIN)
- `RecuController.java` - Téléchargement reçus PDF
- `ReleveController.java` - Téléchargement relevés PDF

#### 📁 **dto/request/**
- `LoginRequest.java` - Connexion (username, password)
- `RegisterRequest.java` - Inscription employé (username, email, password)
- `ClientRegisterRequest.java` - Inscription client avec compte
- `ClientRequest.java` - Création/modification client
- `ClientUpdateRequest.java` - Modification infos client (espace client)
- `CompteRequest.java` - Création compte par employé
- `CompteCreationRequest.java` - Création compte par client
- `VersementRequest.java` - Dépôt d'argent
- `RetraitRequest.java` - Retrait d'argent
- `VirementRequest.java` - Virement entre comptes
- `ChangePasswordRequest.java` - Changement mot de passe

#### 📁 **dto/response/**
- `ApiResponse.java` - Format standard des réponses
- `JwtResponse.java` - Réponse avec token JWT
- `ClientResponse.java` - Infos client
- `ClientCredentialsResponse.java` - Credentials générés pour nouveau client
- `ClientRegisterResponse.java` - Réponse inscription client
- `CompteResponse.java` - Infos compte
- `TransactionResponse.java` - Détails transaction
- `ErrorResponse.java` - Format erreurs

#### 📁 **entity/**
- `User.java` - Utilisateur (authentification, rôles: CLIENT/EMPLOYEE/ADMIN)
- `Client.java` - Informations client (nom, prénom, adresse, etc.)
- `Compte.java` - Compte bancaire (COURANT/EPARGNE, solde, IBAN)
- `Transaction.java` - Transaction (VERSEMENT/RETRAIT/VIREMENT_ENVOYE/VIREMENT_RECU)

#### 📁 **repository/**
- `UserRepository.java` - Requêtes User (findByUsername, existsByEmail)
- `ClientRepository.java` - Requêtes Client (findByEmail, existsByTelephone)
- `CompteRepository.java` - Requêtes Compte (findByNumeroCompte, findByClientId)
- `TransactionRepository.java` - Requêtes Transaction (findByReference, findByPeriode)

#### 📁 **service/**
- `AuthService.java` - Inscription, connexion, génération JWT
- `ClientService.java` - CRUD clients, génération credentials
- `ClientSpaceService.java` - Opérations espace client
- `CompteService.java` - CRUD comptes, versement, retrait, virement
- `TransactionService.java` - Consultation historique transactions
- `RecuService.java` - Génération PDF reçu transaction
- `ReleveService.java` - Génération PDF relevé de compte
- `EmailService.java` - Envoi emails (bienvenue, confirmation)

#### 📁 **security/**
- `JwtUtils.java` - Génération et validation tokens JWT
- `JwtAuthFilter.java` - Filtre pour valider token dans chaque requête
- `UserDetailsServiceImpl.java` - Charge les détails utilisateur pour authentification

#### 📁 **exception/**
- `GlobalExceptionHandler.java` - Gère toutes les exceptions de l'API
- `ResourceNotFoundException.java` - Ressource introuvable
- `DuplicateResourceException.java` - Ressource déjà existante
- `InsufficientBalanceException.java` - Solde insuffisant
- `InvalidOperationException.java` - Opération invalide

#### 📁 **util/**
- `IbanGenerator.java` - Génère numéros IBAN uniques
- `PasswordGenerator.java` - Génère mots de passe temporaires sécurisés

---

## Endpoints

### 🔐 **Authentication** (`/api/auth`) - Public

| Méthode | Endpoint | Rôle | Accès |
|---------|----------|------|-------|
| POST | `/api/auth/register` | Inscription employé/admin | Public |
| POST | `/api/auth/register-client` | Inscription client avec création compte automatique | Public |
| POST | `/api/auth/login` | Connexion et obtention token JWT | Public |

---

### 👥 **Clients** (`/api/clients`) - EMPLOYEE/ADMIN

| Méthode | Endpoint | Rôle |
|---------|----------|------|
| POST | `/api/clients` | Créer un client (génère username/password, envoie email) |
| GET | `/api/clients` | Lister tous les clients |
| GET | `/api/clients/{id}` | Obtenir un client par ID |
| PUT | `/api/clients/{id}` | Modifier un client |
| DELETE | `/api/clients/{id}` | Supprimer un client (ADMIN uniquement) |

---

### 💳 **Comptes** (`/api/comptes`) - EMPLOYEE/ADMIN

| Méthode | Endpoint | Rôle |
|---------|----------|------|
| POST | `/api/comptes` | Créer un compte pour un client |
| GET | `/api/comptes` | Lister tous les comptes |
| GET | `/api/comptes/{id}` | Obtenir un compte par ID |
| GET | `/api/comptes/numero/{numeroCompte}` | Obtenir un compte par numéro |
| GET | `/api/comptes/client/{clientId}` | Lister les comptes d'un client |
| POST | `/api/comptes/versement` | Effectuer un versement |
| POST | `/api/comptes/retrait` | Effectuer un retrait |
| POST | `/api/comptes/virement` | Effectuer un virement |
| DELETE | `/api/comptes/{id}` | Désactiver un compte (ADMIN uniquement) |

---

### 🏠 **Espace Client** (`/api/client-space`) - CLIENT

| Méthode | Endpoint | Rôle |
|---------|----------|------|
| GET | `/api/client-space/me` | Voir ses informations personnelles |
| PUT | `/api/client-space/me` | Modifier ses informations |
| GET | `/api/client-space/comptes` | Voir ses comptes |
| GET | `/api/client-space/comptes/{numeroCompte}` | Détails d'un compte |
| GET | `/api/client-space/comptes/{numeroCompte}/transactions` | Transactions d'un compte |
| POST | `/api/client-space/comptes` | Créer un nouveau compte |
| POST | `/api/client-space/retrait` | Faire un retrait |
| POST | `/api/client-space/virement` | Faire un virement |
| POST | `/api/client-space/change-password` | Changer son mot de passe |
| GET | `/api/client-space/recus/{reference}` | URL pour télécharger un reçu |
| GET | `/api/client-space/releves/{compteId}` | URL pour télécharger un relevé |

---

### 💸 **Transactions** (`/api/transactions`) - EMPLOYEE/ADMIN

| Méthode | Endpoint | Rôle |
|---------|----------|------|
| GET | `/api/transactions/compte/{compteId}` | Toutes les transactions d'un compte |
| GET | `/api/transactions/compte/{compteId}/periode` | Transactions sur une période (dateDebut, dateFin) |
| GET | `/api/transactions/reference/{reference}` | Transaction par référence |

---

### 📄 **Reçus** (`/api/recus`) - CLIENT/EMPLOYEE/ADMIN

| Méthode | Endpoint | Rôle |
|---------|----------|------|
| GET | `/api/recus/transaction/{reference}` | Télécharger reçu PDF d'une transaction |

---

### 📊 **Relevés** (`/api/releves`) - CLIENT/EMPLOYEE/ADMIN

| Méthode | Endpoint | Rôle |
|---------|----------|------|
| GET | `/api/releves/compte/{compteId}` | Télécharger relevé PDF (params: dateDebut, dateFin) |

---

## Format des Réponses

### Succès
```json
{
  "success": true,
  "message": "Message de succès",
  "data": { /* données */ },
  "timestamp": "2025-01-21T10:30:00"
}
```

### Erreur
```json
{
  "success": false,
  "message": "Message d'erreur",
  "timestamp": "2025-01-21T10:30:00"
}
```

---

## Authentification

Toutes les requêtes (sauf `/api/auth/*`) nécessitent un token JWT dans le header:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Rôles et Permissions

- **CLIENT** : Accès à `/api/client-space/*`, `/api/recus/*`, `/api/releves/*`
- **EMPLOYEE** : Accès à `/api/clients/*`, `/api/comptes/*`, `/api/transactions/*`
- **ADMIN** : Tous les accès + suppression clients/comptes