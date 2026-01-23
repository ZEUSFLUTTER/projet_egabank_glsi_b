# Guide d'Installation - Système Bancaire EGA

## Prérequis

### 1. Installation de Node.js
1. Téléchargez Node.js depuis https://nodejs.org/
2. Installez la version LTS (Long Term Support)
3. Vérifiez l'installation :
   ```bash
   node --version
   npm --version
   ```

### 2. Installation d'Angular CLI
```bash
npm install -g @angular/cli
```

Vérifiez l'installation :
```bash
ng version
```

## Démarrage du Backend

1. **Base de données** : L'application utilise H2 en mémoire (pas besoin d'installation)

2. **Démarrage de l'API** :
   ```bash
   .\mvnw.cmd spring-boot:run
   ```

3. **Vérification** : L'API sera disponible sur http://localhost:8080

4. **Console H2** : Accessible sur http://localhost:8080/h2-console
   - JDBC URL: `jdbc:h2:mem:testdb`
   - Username: `sa`
   - Password: `password`

## Comptes de test créés automatiquement

- **Admin** : admin / admin123
- **User** : user / user123

## Création du Frontend Angular

Une fois Node.js et Angular CLI installés, exécutez :

```bash
ng new bank-frontend --routing=true --style=scss --skip-git=true
cd bank-frontend
ng add @angular/material
npm install @angular/flex-layout
npm install jwt-decode
```

## APIs disponibles

### Authentification
- POST `/api/auth/login` - Connexion
- POST `/api/auth/register` - Inscription

### Clients
- GET `/api/clients` - Liste des clients
- POST `/api/clients` - Créer un client
- GET `/api/clients/{id}` - Détails d'un client
- PUT `/api/clients/{id}` - Modifier un client
- DELETE `/api/clients/{id}` - Supprimer un client

### Comptes
- GET `/api/comptes` - Liste des comptes
- POST `/api/comptes` - Créer un compte
- GET `/api/comptes/{id}` - Détails d'un compte
- GET `/api/comptes/client/{clientId}` - Comptes d'un client

### Transactions
- POST `/api/transactions/depot` - Effectuer un dépôt
- POST `/api/transactions/retrait` - Effectuer un retrait
- POST `/api/transactions/virement` - Effectuer un virement
- GET `/api/transactions/compte/{numeroCompte}` - Historique des transactions

### Relevés
- GET `/api/releves/compte/{numeroCompte}` - Générer un relevé

## Structure du projet

```
bank-api/
├── src/main/java/com/ega/bank/bank_api/
│   ├── controller/          # Contrôleurs REST
│   ├── service/            # Services métier
│   ├── repository/         # Repositories JPA
│   ├── entity/            # Entités JPA
│   ├── dto/               # Data Transfer Objects
│   ├── security/          # Configuration sécurité JWT
│   └── exception/         # Gestion des exceptions
├── frontend/              # Frontend HTML/CSS/JS temporaire
└── bank-frontend/         # Projet Angular (à créer)
```