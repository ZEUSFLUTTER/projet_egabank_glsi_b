# Banque EGA - Backend API

API REST pour la gestion bancaire de la société Ega. Ce système permet de gérer les clients, leurs comptes et les transactions bancaires.

## Technologies

- **Java 21** avec Spring Boot 4.0.1
- **Spring Security** + JWT pour l'authentification
- **JPA/Hibernate** pour la persistance
- **Oracle Database** (JDBC)
- **iText7** pour la génération de relevés PDF

## Fonctionnalités

- Authentification sécurisée (JWT)
- Gestion des clients (CRUD)
- Gestion des comptes (Épargne & Courant)
- Opérations bancaires : dépôts, retraits, virements
- Historique des transactions avec filtrage par période
- Génération de relevés de compte au format PDF
- Validation des données et gestion des erreurs
- Génération automatique de numéros IBAN (iban4j)

## Installation

```bash
mvn clean install
mvn spring-boot:run
```

L'API sera accessible sur `http://localhost:8080`

## Endpoints Principaux

- `POST /api/auth/login` - Connexion
- `GET /api/accounts/{id}` - Détails d'un compte
- `POST /api/transactions` - Créer une transaction
- `GET /api/accounts/{id}/statement` - Télécharger le relevé PDF
