# Système de Gestion Bancaire EGA - Backend

## Description

Système de gestion bancaire complet développé avec Spring Boot pour la banque EGA. Ce système permet de gérer les clients, leurs comptes bancaires (épargne et courant), et d'effectuer des opérations bancaires (dépôts, retraits, virements) avec un historique complet des transactions.

## Fonctionnalités

### Gestion des Clients
- ✅ CRUD complet (Créer, Lire, Modifier, Supprimer)
- ✅ Validation des données (email, téléphone unique)
- ✅ Consultation des comptes d'un client

### Gestion des Comptes
- ✅ Création de comptes épargne avec taux d'intérêt
- ✅ Création de comptes courants avec découvert autorisé
- ✅ Génération automatique d'IBAN (norme française)
- ✅ Consultation du solde et des informations

### Opérations Bancaires
- ✅ Dépôt d'argent sur un compte
- ✅ Retrait avec vérification du solde
- ✅ Virement entre comptes
- ✅ Historique complet des transactions

### Relevés de Compte
- ✅ Consultation des transactions par période
- ✅ Relevés mensuels
- ✅ Relevés annuels

### Sécurité
- ✅ Authentification JWT
- ✅ Endpoints protégés
- ✅ Gestion des rôles utilisateurs

## Technologies Utilisées

- **Java**: 17
- **Spring Boot**: 3.2.1
- **Spring Data JPA**: Persistance des données
- **Spring Security**: Authentification et autorisation
- **JWT (jjwt)**: Tokens d'authentification
- **H2 Database**: Base de données en mémoire (développement)
- **PostgreSQL**: Base de données (production)
- **iban4j**: Génération d'IBAN
- **Lombok**: Réduction du code boilerplate
- **SpringDoc OpenAPI**: Documentation Swagger
- **Maven**: Gestion des dépendances

## Prérequis

- Java JDK 17 ou supérieur
- Maven 3.8+
- PostgreSQL 14+ (optionnel, H2 utilisé par défaut)

## Installation et Démarrage

### 1. Cloner le projet

```bash
cd /home/vladmir/Documents/JEE/EGA/backend_ega
```

### 2. Compiler le projet

```bash
mvn clean install
```

### 3. Démarrer l'application

#### Mode développement (H2)
```bash
mvn spring-boot:run
```

#### Mode production (PostgreSQL)
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=postgres
```

L'application démarre sur `http://localhost:8080`

## Accès aux Services

### Swagger UI
Documentation interactive de l'API:
```
http://localhost:8080/swagger-ui.html
```

### H2 Console (mode dev)
Console de la base de données H2:
```
http://localhost:8080/h2-console

JDBC URL: jdbc:h2:mem:egabank
Username: sa
Password: (laisser vide)
```

## Endpoints API

### Authentification
- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Inscription

### Clients
- `POST /api/clients` - Créer un client
- `GET /api/clients` - Liste des clients
- `GET /api/clients/{id}` - Détails d'un client
- `PUT /api/clients/{id}` - Modifier un client
- `DELETE /api/clients/{id}` - Supprimer un client
- `GET /api/clients/{id}/comptes` - Comptes d'un client

### Comptes
- `POST /api/comptes/epargne` - Créer compte épargne
- `POST /api/comptes/courant` - Créer compte courant
- `GET /api/comptes` - Liste des comptes
- `GET /api/comptes/{id}` - Détails d'un compte
- `GET /api/comptes/numero/{iban}` - Chercher par IBAN
- `DELETE /api/comptes/{id}` - Supprimer un compte

### Transactions
- `POST /api/transactions/depot` - Dépôt
- `POST /api/transactions/retrait` - Retrait
- `POST /api/transactions/virement` - Virement
- `GET /api/transactions/compte/{id}` - Historique

### Relevés
- `GET /api/releves/{compteId}?dateDebut=&dateFin=` - Par période
- `GET /api/releves/{compteId}/mensuel?annee=&mois=` - Mensuel
- `GET /api/releves/{compteId}/annuel?annee=` - Annuel

## Exemples d'Utilisation

### 1. S'inscrire
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 2. Se connecter
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "password123"
  }'
```

Réponse:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "username": "john_doe",
  "email": "john@example.com",
  "role": "ROLE_USER"
}
```

### 3. Créer un client
```bash
curl -X POST http://localhost:8080/api/clients \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "DUPONT",
    "prenom": "Jean",
    "dateNaissance": "1990-05-15",
    "sexe": "M",
    "adresse": "123 Rue de la Paix, Paris",
    "telephone": "+33612345678",
    "email": "jean.dupont@email.com",
    "nationalite": "Française"
  }'
```

### 4. Créer un compte épargne
```bash
curl -X POST http://localhost:8080/api/comptes/epargne \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": 1,
    "tauxInteret": 3.5
  }'
```

### 5. Effectuer un dépôt
```bash
curl -X POST http://localhost:8080/api/transactions/depot \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "compteId": 1,
    "montant": 1000.00,
    "description": "Dépôt initial"
  }'
```

### 6. Effectuer un virement
```bash
curl -X POST http://localhost:8080/api/transactions/virement \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "compteSourceId": 1,
    "compteDestinationId": 2,
    "montant": 250.00,
    "description": "Virement mensuel"
  }'
```

## Configuration PostgreSQL

Pour utiliser PostgreSQL en production, modifiez `application-postgres.yml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/egabank
    username: votre_username
    password: votre_password
```

Créez la base de données:
```sql
CREATE DATABASE egabank;
```

## Structure du Projet

```
backend_ega/
├── src/main/java/com/ega/banking/
│   ├── config/          # Configuration (Security, OpenAPI)
│   ├── controller/      # REST Controllers
│   ├── dto/             # Data Transfer Objects
│   ├── exception/       # Gestion des exceptions
│   ├── model/           # Entités JPA
│   ├── repository/      # Repositories Spring Data
│   ├── security/        # JWT et sécurité
│   └── service/         # Logique métier
├── src/main/resources/
│   ├── application.yml           # Configuration principale
│   └── application-postgres.yml  # Configuration PostgreSQL
└── pom.xml              # Dépendances Maven
```

## Tests avec Postman

1. Importez la collection Postman (à créer)
2. Créez un environnement avec:
   - `baseUrl`: `http://localhost:8080`
   - `token`: (sera rempli après login)
3. Exécutez les tests dans l'ordre:
   - Authentification → Clients → Comptes → Transactions

## Sécurité

- **JWT**: Token valide pendant 24 heures
- **Mots de passe**: Hashés avec BCrypt
- **Endpoints publics**: `/api/auth/**`, Swagger, H2 Console
- **Endpoints protégés**: Tous les autres endpoints

## Développement

### Ajouter une nouvelle fonctionnalité

1. Créer l'entité dans `model/`
2. Créer le repository dans `repository/`
3. Créer le service dans `service/`
4. Créer le contrôleur dans `controller/`
5. Ajouter la documentation Swagger

### Logs

Les logs sont configurés au niveau DEBUG pour `com.ega.banking`

## Auteur

**Banque EGA**
- Email: contact@ega-bank.com

## Licence

Ce projet est sous licence Apache 2.0
