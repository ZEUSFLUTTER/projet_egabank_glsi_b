# EGA Bank Application

Application de gestion bancaire développée avec Angular 17 et TailwindCSS.

## Fonctionnalités

### Pour ADMIN
- Créer des gestionnaires et caissières
- Gérer les utilisateurs (activer/désactiver)

### Pour GESTIONNAIRE
- Gérer les clients (créer, modifier, supprimer)
- Gérer les comptes bancaires
- Générer des relevés PDF
- Consulter l'historique des transactions

### Pour CAISSIERE
- Effectuer des dépôts
- Effectuer des retraits
- Effectuer des transferts

## Installation

1. Installer les dépendances:
```bash
npm install
```

2. Configurer l'URL de l'API dans les services (actuellement: http://localhost:8080)

3. Lancer l'application:
```bash
npm start
```

L'application sera accessible sur http://localhost:4200

## Connexion par défaut

Utilisez les identifiants de l'administrateur définis dans votre backend:
- Username: administrateur
- Password: 96118586

## Structure du projet

```
src/
├── app/
│   ├── core/
│   │   ├── guards/         # Guards d'authentification et de rôles
│   │   ├── interceptors/   # Intercepteur JWT
│   │   └── services/       # Services API
│   ├── features/
│   │   ├── auth/          # Connexion
│   │   ├── dashboard/     # Dashboard principal
│   │   ├── users/         # Gestion utilisateurs
│   │   ├── clients/       # Gestion clients
│   │   ├── accounts/      # Gestion comptes
│   │   ├── transactions/  # Transactions
│   │   └── reports/       # Rapports et relevés
│   └── shared/
│       ├── components/    # Composants réutilisables
│       └── models/        # Modèles TypeScript
```

## Technologies utilisées

- Angular 17 (Standalone Components)
- TailwindCSS
- FontAwesome
- RxJS
- TypeScript

## Build pour production

```bash
npm run build
```

Les fichiers de build seront dans le répertoire `dist/`.
