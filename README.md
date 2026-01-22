# EGA Banking System 🏦

Un système de gestion bancaire moderne développé avec Spring Boot et Angular, offrant une interface complète pour la gestion des clients, comptes et transactions bancaires.

## 🚀 Fonctionnalités

### 👥 Gestion des Clients
- ✅ Création, modification et suppression de clients
- ✅ Profils clients complets avec informations personnelles
- ✅ Système d'authentification sécurisé

### 💳 Gestion des Comptes
- ✅ Comptes courants et comptes épargne
- ✅ Génération automatique d'IBAN
- ✅ Consultation des soldes en temps réel
- ✅ Impression de relevés de compte avec design professionnel

### 💰 Transactions Bancaires
- ✅ Dépôts et retraits
- ✅ Virements entre comptes
- ✅ Historique complet des transactions
- ✅ Validation des soldes et gestion des erreurs

### 📊 Tableau de Bord
- ✅ Statistiques financières en temps réel
- ✅ Graphiques et métriques
- ✅ Vue d'ensemble des activités

### 🔐 Sécurité
- ✅ Authentification JWT
- ✅ Gestion des rôles (ADMIN/CLIENT)
- ✅ Contrôle d'accès basé sur les permissions
- ✅ Validation des données côté serveur

## 🛠️ Technologies Utilisées

### Backend
- **Java 17**
- **Spring Boot 3.2.5**
- **Spring Security** (JWT)
- **Spring Data JPA**
- **PostgreSQL**
- **Flyway** (migrations de base de données)
- **Maven**

### Frontend
- **Angular 18**
- **TypeScript**
- **Tailwind CSS**
- **RxJS**

## 📋 Prérequis

- Java 17 ou supérieur
- Node.js 18+ et npm
- PostgreSQL 12+
- Maven 3.6+

## 🚀 Installation et Démarrage

### 1. Cloner le projet
```bash
git clone https://github.com/titiaaaaaa/ATIDIGA_laetitia_GLSIB_EgaBank.git
cd ATIDIGA_laetitia_GLSIB_EgaBank
```

### 2. Configuration de la base de données
```sql
-- Créer la base de données PostgreSQL
CREATE DATABASE ega_bank;
CREATE USER ega_user WITH PASSWORD 'ega_password';
GRANT ALL PRIVILEGES ON DATABASE ega_bank TO ega_user;
```

### 3. Démarrage du Backend
```bash
cd ega-backend
mvn clean install
mvn spring-boot:run
```
Le backend sera accessible sur `http://localhost:8080`

### 4. Démarrage du Frontend
```bash
cd ega-frontend
npm install
npm start
```
Le frontend sera accessible sur `http://localhost:4200`

## 👤 Comptes de Test

### Administrateur
- **Username:** `admin`
- **Password:** `admin123`

### Client
- **Username:** `user2`
- **Password:** `Password1!`

## 📁 Structure du Projet

```
ATIDIGA_laetitia_GLSIB_EgaBank/
├── ega-backend/                 # API Spring Boot
│   ├── src/main/java/
│   │   └── com/ega/backend/
│   │       ├── config/          # Configuration
│   │       ├── domain/          # Entités JPA
│   │       ├── dto/             # Data Transfer Objects
│   │       ├── repository/      # Repositories JPA
│   │       ├── service/         # Logique métier
│   │       ├── web/             # Contrôleurs REST
│   │       └── security/        # Configuration sécurité
│   └── src/main/resources/
│       └── db/migration/        # Scripts Flyway
├── ega-frontend/                # Application Angular
│   ├── src/app/
│   │   ├── components/          # Composants Angular
│   │   ├── services/            # Services Angular
│   │   ├── models/              # Modèles TypeScript
│   │   └── guards/              # Guards de sécurité
└── GUIDE_DEMARRAGE.md          # Guide de démarrage détaillé
```

## 🔧 Configuration

### Backend (application.yml)
```yaml
server:
  port: 8080

spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/ega_bank
    username: ega_user
    password: ega_password
  
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
  
  flyway:
    enabled: true
    locations: classpath:db/migration/postgresql
```

### Frontend (environment.ts)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

## 📊 API Endpoints

### Authentification
- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Inscription

### Clients
- `GET /api/clients` - Liste des clients
- `POST /api/clients` - Créer un client
- `PUT /api/clients/{id}` - Modifier un client
- `DELETE /api/clients/{id}` - Supprimer un client

### Comptes
- `GET /api/accounts` - Liste des comptes
- `POST /api/accounts` - Créer un compte
- `GET /api/accounts/{id}/statement` - Relevé de compte

### Transactions
- `POST /api/transactions/deposit` - Dépôt
- `POST /api/transactions/withdraw` - Retrait
- `POST /api/transactions/transfer` - Virement

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👨‍💻 Auteur

**ATIDIGA Laetitia**
- GitHub: [@titiaaaaaa](https://github.com/titiaaaaaa)
- Projet: GLSIB - EGA Bank

## 🙏 Remerciements

- Spring Boot pour le framework backend
- Angular pour le framework frontend
- Tailwind CSS pour le design
- PostgreSQL pour la base de données

---

⭐ N'hésitez pas à donner une étoile si ce projet vous a aidé !