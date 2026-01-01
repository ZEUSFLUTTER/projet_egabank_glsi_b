# Projet Système Bancaire EGA

## Description du Projet

Système de gestion bancaire complet développé avec Spring Boot. Cette application propose une API REST sécurisée pour la gestion de comptes bancaires, de clients et de transactions.

## Technologies Utilisées

### Backend
- **Java 17** - Langage de programmation
- **Spring Boot 3.2.1** - Framework principal
- **Spring Data JPA** - Gestion de la persistance
- **Spring Security** - Sécurité et authentification
- **JWT (JSON Web Token)** - Authentification basée sur des tokens
- **Lombok** - Réduction du boilerplate code
- **Maven** - Gestionnaire de dépendances et build

### Base de Données
- **H2 Database** - Base de données en mémoire (développement)
- **PostgreSQL** - Base de données relationnelle (production)

### Documentation & Tests
- **SpringDoc OpenAPI** - Documentation API (Swagger UI)
- **JUnit 5** - Tests unitaires
- **Spring Security Test** - Tests de sécurité

### Génération de Documents
- **iText 7** - Génération de PDF pour les relevés bancaires
- **IBAN4j** - Génération et validation d'IBAN

## Architecture du Projet

```
backend_ega/
├── src/main/java/com/ega/banking/
│   ├── model/           # Entités JPA (Client, Compte, Transaction)
│   ├── repository/      # Repositories Spring Data JPA
│   ├── service/         # Logique métier
│   ├── controller/      # Endpoints REST
│   ├── security/        # Configuration de sécurité JWT
│   ├── dto/             # Objets de transfert de données
│   ├── exception/       # Gestion des exceptions
│   └── BankingApplication.java
├── src/main/resources/
│   ├── application.yml          # Configuration H2 (dev)
│   └── application-postgres.yml # Configuration PostgreSQL (prod)
└── pom.xml
```

## Fonctionnalités Principales

### 1. Gestion des Clients
- Création de profils clients
- Informations personnelles (nom, prénom, date de naissance, etc.)
- Gestion de l'adresse et des coordonnées
- Statut du client (ACTIF/INACTIF/SUSPENDU)

### 2. Gestion des Comptes Bancaires
- **Comptes Épargne** : avec taux d'intérêt
- **Comptes Courants** : avec découvert autorisé
- Numéros de compte IBAN générés automatiquement
- Suivi du solde en temps réel
- Historique des transactions

### 3. Opérations Bancaires
- **Dépôts** : Ajout d'argent sur un compte
- **Retraits** : Retrait d'argent avec vérification du solde
- **Virements** : Transferts entre comptes
- Validation des montants et des soldes
- Enregistrement de toutes les opérations

### 4. Relevés de Compte
- Consultation de l'historique des transactions
- Filtrage par période
- Génération de relevés PDF
- Calcul des totaux (débits, crédits, solde)

### 5. Sécurité
- Authentification JWT
- Endpoints sécurisés
- Gestion des rôles et permissions
- Protection contre CSRF

## Modèle de Données

### Entités Principales

#### Client
- Informations personnelles
- Coordonnées
- Liste de comptes associés
- Statut du client

#### Compte (classe abstraite)
- Numéro de compte (IBAN)
- Type de compte
- Solde
- Client propriétaire
- Transactions liées

#### Compte Épargne (hérite de Compte)
- Taux d'intérêt

#### Compte Courant (hérite de Compte)
- Découvert autorisé

#### Transaction
- Type (DEPOT, RETRAIT, VIREMENT)
- Montant
- Compte source
- Compte destination
- Description
- Date et heure

#### User
- Username
- Email
- Mot de passe (hashé)
- Rôle (ROLE_USER, ROLE_ADMIN)

## API Endpoints

### Authentification
- `POST /api/auth/register` - Créer un compte utilisateur
- `POST /api/auth/login` - Se connecter et obtenir un token JWT

### Clients
- `POST /api/clients` - Créer un client
- `GET /api/clients/{id}` - Consulter un client
- `GET /api/clients` - Lister tous les clients
- `PUT /api/clients/{id}` - Modifier un client
- `DELETE /api/clients/{id}` - Supprimer un client

### Comptes
- `POST /api/comptes/epargne` - Créer un compte épargne
- `POST /api/comptes/courant` - Créer un compte courant
- `GET /api/comptes/{id}` - Consulter un compte
- `GET /api/comptes/client/{clientId}` - Lister les comptes d'un client
- `GET /api/comptes` - Lister tous les comptes

### Transactions
- `POST /api/transactions/depot` - Effectuer un dépôt
- `POST /api/transactions/retrait` - Effectuer un retrait
- `POST /api/transactions/virement` - Effectuer un virement
- `GET /api/transactions/{id}` - Consulter une transaction
- `GET /api/transactions/compte/{compteId}` - Historique d'un compte

### Relevés
- `GET /api/releves/{compteId}` - Consulter le relevé d'un compte
- `GET /api/releves/{compteId}/pdf` - Télécharger le relevé en PDF
- `GET /api/releves/{compteId}/periode?debut=...&fin=...` - Relevé par période

## Configuration

### Mode Développement (H2)
```bash
mvn spring-boot:run
```

### Mode Production (PostgreSQL)
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=postgres
```

## Accès à la Documentation

- **Swagger UI** : http://localhost:8080/swagger-ui.html
- **H2 Console** : http://localhost:8080/h2-console (mode dev uniquement)

## Démarrage Rapide

1. **Installer Java 17** (voir SETUP.md)
2. **Compiler le projet** : `mvn clean install`
3. **Lancer l'application** : `mvn spring-boot:run`
4. **Accéder à Swagger** : http://localhost:8080/swagger-ui.html
5. **Créer un utilisateur** via `/api/auth/register`
6. **Utiliser le token JWT** pour les autres endpoints

## Problèmes Connus

### ⚠️ Erreur Lombok avec Java 25
Si vous voyez `@NoArgsConstructor` souligné en rouge, c'est que vous utilisez Java 25. 

**Solution** : Passer à Java 17 (voir SETUP.md lignes 15-49)

```bash
# Sur Arch Linux
sudo pacman -S jdk17-openjdk
sudo archlinux-java set java-17-openjdk
java -version  # Vérifier que c'est bien 17.x.x
```

## Documentation Complémentaire

- **README.md** - Vue d'ensemble et instructions de base
- **SETUP.md** - Guide détaillé de configuration de l'environnement
- **QUICKSTART.md** - Guide rapide pour démarrer

## Contributions

Pour toute question ou amélioration, consultez la documentation ou les fichiers de configuration.

## Licence

Projet éducatif - Système bancaire EGA
