# Système de Gestion Bancaire - Banque Ega

Application complète de gestion bancaire avec backend Spring Boot et frontend Angular.

## Structure du Projet

```
TPE_JEE_GLSI_B-main/
├── src/                    # Backend Spring Boot
│   └── main/
│       ├── java/com/banque/
│       │   ├── controller/     # Contrôleurs REST
│       │   ├── service/         # Services métier
│       │   ├── entity/          # Entités JPA
│       │   ├── repository/     # Repositories
│       │   ├── dto/            # Data Transfer Objects
│       │   ├── security/       # Configuration sécurité JWT
│       │   └── exception/      # Gestionnaire d'exceptions
│       └── resources/
│           └── application.properties
└── 
```

## Prérequis

- Java 17+
- Maven 3.6+
- npm ou yarn
- MySQL 8.0+

## Installation et Démarrage

### Backend

1. Configurer la base de données dans `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/gest_banque
spring.datasource.username=root
spring.datasource.password=votre_mot_de_passe
```

2. Compiler et démarrer le backend:
```bash
cd TPE_JEE_GLSI_B-main
mvn clean install
mvn spring-boot:run
```

Le backend sera accessible sur `http://localhost:8080`



## Fonctionnalités

### Backend

- ✅ API CRUD pour les clients et comptes
- ✅ Authentification JWT avec Spring Security
- ✅ Transactions bancaires (dépôt, retrait, virement)
- ✅ Filtrage des transactions par période
- ✅ Génération de relevés PDF
- ✅ Validation des données avec Bean Validation
- ✅ Gestionnaire global d'exceptions
- ✅ Génération automatique des numéros IBAN



## APIs Disponibles

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion

### Clients
- `GET /api/clients` - Liste des clients
- `GET /api/clients/{id}` - Détails d'un client
- `POST /api/clients` - Créer un client
- `PUT /api/clients/{id}` - Modifier un client
- `DELETE /api/clients/{id}` - Supprimer un client

### Comptes
- `GET /api/comptes` - Liste des comptes
- `GET /api/comptes/{id}` - Détails d'un compte
- `GET /api/comptes/client/{clientId}` - Comptes d'un client
- `POST /api/comptes` - Créer un compte
- `PUT /api/comptes/{id}` - Modifier un compte
- `DELETE /api/comptes/{id}` - Supprimer un compte

### Transactions
- `POST /api/transactions/depot` - Effectuer un dépôt
- `POST /api/transactions/retrait` - Effectuer un retrait
- `POST /api/transactions/transfert` - Effectuer un virement
- `GET /api/transactions/compte/{compteId}` - Transactions d'un compte (avec filtres dateDebut et dateFin)
- `GET /api/transactions` - Toutes les transactions

### Relevés
- `GET /api/releves/compte/{compteId}` - Générer un relevé PDF (avec filtres dateDebut et dateFin)

## Sécurité

Toutes les APIs (sauf `/api/auth/**`) nécessitent une authentification JWT.
Le token doit être inclus dans le header `Authorization: Bearer <token>`.

## Technologies Utilisées

### Backend
- Spring Boot 3.2.0
- Spring Security
- Spring Data JPA
- MySQL
- JWT (jjwt)
- iText7 (génération PDF)
- IBAN4j (génération IBAN)
- Lombok
- Bean Validation
## Notes

- Les numéros de compte sont générés automatiquement au format IBAN lors de la création
- Le solde initial d'un compte est toujours 0
- Les retraits et virements vérifient que le solde est suffisant
- Les relevés PDF peuvent être générés pour une période spécifique ou pour toutes les transactions
