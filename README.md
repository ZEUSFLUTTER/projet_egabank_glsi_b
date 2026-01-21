# EgaBank - Système de Gestion Bancaire

## Description
Système de gestion bancaire complet avec backend Spring Boot et frontend Angular, permettant la gestion des clients, des comptes (courant et épargne) et des transactions bancaires.

## Technologies utilisées

### Backend
- **Spring Boot 3.3.0** - Framework Java
- **Spring Security** - Sécurité et authentification
- **JWT (JSON Web Tokens)** - Authentification
- **Spring Data JPA** - Accès aux données
- **MySQL** - Base de données
- **IBAN4J** - Génération de numéros IBAN
- **iTextPDF** - Génération de relevés PDF
- **Maven** - Gestion des dépendances

### Frontend
- **Angular 19** - Framework frontend
- **TypeScript** - Langage de programmation
- **RxJS** - Programmation réactive
- **SweetAlert2** - Notifications

## Prérequis
- Java 21
- Node.js 18+ et npm
- MySQL 8.0+
- Maven 3.8+

## Installation

### Base de données
1. Créer une base de données MySQL nommée `egabank`:
```sql
CREATE DATABASE egabank;
```

2. Configurer les paramètres de connexion dans `Backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/egabank
spring.datasource.username=root
spring.datasource.password=votre_mot_de_passe
```

### Backend
1. Naviguer vers le dossier Backend:
```bash
cd EGABANK/Backend
```

2. Compiler et lancer l'application:
```bash
mvn clean install
mvn spring-boot:run
```

Le backend sera accessible sur `http://localhost:8081`

### Frontend
1. Naviguer vers le dossier Frontend:
```bash
cd EGABANK/Frontend
```

2. Installer les dépendances:
```bash
npm install
```

3. Lancer l'application:
```bash
npm start
```

Le frontend sera accessible sur `http://localhost:4200`

## Fonctionnalités

### Authentification
- Inscription d'utilisateurs
- Connexion avec JWT
- Protection des routes avec guards

### Gestion des Clients
- CRUD complet (Create, Read, Update, Delete)
- Validation des données
- Informations: nom, prénom, date de naissance, sexe, adresse, téléphone, email, nationalité

### Gestion des Comptes
- Création de comptes courants (avec découvert autorisé)
- Création de comptes épargne (avec taux d'intérêt)
- Génération automatique de numéros IBAN uniques
- Consultation des comptes
- Liste de tous les comptes

### Opérations Bancaires
- **Dépôt**: Ajout d'argent sur un compte
- **Retrait**: Retrait d'argent (avec vérification du solde et découvert)
- **Virement**: Transfert d'argent entre comptes

### Transactions
- Historique des transactions par période
- Filtrage par compte et dates
- Téléchargement de relevés PDF

## API Endpoints

### Authentification
- `POST /api/auth/connexion` - Connexion
- `POST /api/auth/inscription` - Inscription

### Clients
- `GET /api/clients` - Liste des clients
- `GET /api/clients/{id}` - Détails d'un client
- `POST /api/clients` - Créer un client
- `PUT /api/clients/{id}` - Modifier un client
- `DELETE /api/clients/{id}` - Supprimer un client

### Comptes
- `GET /api/comptes` - Liste des comptes
- `GET /api/comptes/{numeroCompte}` - Détails d'un compte
- `POST /api/comptes/courant` - Créer un compte courant
- `POST /api/comptes/epargne` - Créer un compte épargne
- `POST /api/comptes/depot` - Effectuer un dépôt
- `POST /api/comptes/retrait` - Effectuer un retrait
- `POST /api/comptes/virement` - Effectuer un virement

### Transactions
- `GET /api/transactions` - Liste de toutes les transactions
- `GET /api/transactions/{numeroCompte}?dateDebut=...&dateFin=...` - Transactions par période

### Relevés
- `GET /api/releves/{numeroCompte}?dateDebut=...&dateFin=...` - Télécharger un relevé PDF

## Sécurité
- Authentification JWT obligatoire pour toutes les routes (sauf `/api/auth/**`)
- CORS configuré pour `http://localhost:4200`
- Validation des données avec Bean Validation
- Gestion globale des exceptions

## Structure du projet

```
EGABANK/
├── Backend/
│   ├── src/main/java/com/egabank/Backend/
│   │   ├── controleur/      # Contrôleurs REST
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── entity/          # Entités JPA
│   │   ├── exception/       # Gestion des exceptions
│   │   ├── repository/      # Repositories JPA
│   │   ├── securite/        # Configuration sécurité JWT
│   │   └── service/         # Services métier
│   └── src/main/resources/
│       └── application.properties
└── Frontend/
    └── src/
        ├── app/
        │   ├── components/   # Composants Angular
        │   ├── guards/      # Guards d'authentification
        │   ├── interceptors/# Intercepteurs HTTP
        │   └── services/    # Services Angular
        └── styles.css
```

## Tests Postman
Un fichier de collection Postman devrait être créé pour tester toutes les APIs. Les endpoints nécessitent un token JWT (sauf `/api/auth/**`).

Pour obtenir un token:
1. Créer un utilisateur via `POST /api/auth/inscription`
2. Se connecter via `POST /api/auth/connexion`
3. Utiliser le token retourné dans le header `Authorization: Bearer <token>`

## Notes importantes
- Le solde initial d'un compte est toujours 0
- Les numéros de compte (IBAN) sont générés automatiquement et sont uniques
- Les retraits vérifient le solde disponible (solde + découvert autorisé pour les comptes courants)
- Les virements vérifient que les comptes source et destination sont différents
- Toutes les opérations créent des transactions enregistrées dans la base de données

## Auteur
Projet développé pour la société bancaire Ega
