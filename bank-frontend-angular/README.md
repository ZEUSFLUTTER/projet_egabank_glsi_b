# Frontend Angular - Banque EGA

## Installation et démarrage

### Prérequis
- Node.js (version 18 ou supérieure)
- npm ou yarn

### Installation des dépendances
```bash
npm install
```

### Démarrage du serveur de développement
```bash
npm start
```

L'application sera accessible sur http://localhost:4200

### Comptes de test
- **Admin**: admin / password
- **User**: user / password

### Structure du projet

```
src/
├── app/
│   ├── core/
│   │   ├── guards/          # Guards d'authentification
│   │   ├── interceptors/    # Intercepteurs HTTP
│   │   ├── models/          # Modèles de données
│   │   └── services/        # Services Angular
│   ├── features/
│   │   ├── auth/            # Authentification (login/register)
│   │   ├── dashboard/       # Tableau de bord
│   │   ├── clients/         # Gestion des clients
│   │   ├── comptes/         # Gestion des comptes
│   │   └── transactions/    # Gestion des transactions
│   ├── app.component.ts     # Composant principal
│   └── app.routes.ts        # Configuration des routes
└── environments/            # Configuration d'environnement
```

### Fonctionnalités implémentées

#### Authentification
- Connexion avec JWT
- Inscription de nouveaux utilisateurs
- Protection des routes avec AuthGuard
- Gestion des rôles (USER/ADMIN)

#### Gestion des clients
- Liste des clients avec recherche et filtres
- Création de nouveaux clients
- Modification des informations client
- Visualisation des détails client
- Suppression de clients

#### Gestion des comptes
- Liste de tous les comptes
- Création de nouveaux comptes (courant/épargne)
- Visualisation des détails de compte
- Statistiques des comptes

#### Gestion des transactions
- Liste des transactions avec filtres avancés
- Création de nouvelles transactions (dépôt/retrait/virement)
- Historique des transactions par compte
- Statistiques des transactions

#### Tableau de bord
- Vue d'ensemble des statistiques
- Accès rapide aux fonctionnalités principales
- Graphiques et indicateurs clés

### API Backend
L'application communique avec l'API Spring Boot sur http://localhost:8080/api

### Technologies utilisées
- Angular 17
- Angular Material
- RxJS
- JWT pour l'authentification
- TypeScript