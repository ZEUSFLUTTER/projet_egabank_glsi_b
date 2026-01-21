# Guide de Déploiement - EGA Bank Application

## 📋 Prérequis

- Node.js 18+ installé
- npm 9+ installé
- Backend Spring Boot en cours d'exécution sur http://localhost:8080

## 🚀 Installation et Démarrage

### 1. Installer les dépendances

```bash
cd ega-bank-app
npm install
```

Si vous rencontrez des erreurs de dépendances, utilisez :
```bash
npm install --legacy-peer-deps
```

### 2. Démarrer l'application en mode développement

```bash
npm start
```

L'application sera accessible sur : **http://localhost:4200**

### 3. Build pour la production

```bash
npm run build
```

Les fichiers de build seront dans le dossier `dist/ega-bank-app/`

## 🔐 Connexion par Défaut

Utilisez les identifiants définis dans votre backend :
- **Username**: administrateur
- **Password**: 96118586
- **Rôle**: ADMIN

## 📁 Structure du Projet

```
src/
├── app/
│   ├── core/
│   │   ├── guards/              # Guards d'authentification et de rôles
│   │   │   ├── auth.guard.ts
│   │   │   └── role.guard.ts
│   │   ├── interceptors/        # Intercepteur JWT
│   │   │   └── jwt.interceptor.ts
│   │   └── services/            # Services pour l'API
│   │       ├── auth.service.ts
│   │       ├── user.service.ts
│   │       ├── client.service.ts
│   │       ├── account.service.ts
│   │       ├── transaction.service.ts
│   │       └── report.service.ts
│   ├── features/
│   │   ├── auth/               # Module de connexion
│   │   │   └── login/
│   │   ├── dashboard/          # Dashboard principal
│   │   │   ├── home/           # Page d'accueil
│   │   │   └── dashboard.component.*
│   │   ├── users/              # Gestion des utilisateurs (ADMIN)
│   │   ├── clients/            # Gestion des clients (GESTIONNAIRE)
│   │   ├── accounts/           # Gestion des comptes (GESTIONNAIRE)
│   │   ├── transactions/       # Transactions (CAISSIERE)
│   │   └── reports/            # Rapports et relevés (GESTIONNAIRE)
│   └── shared/
│       ├── models/             # Modèles TypeScript
│       │   ├── user.model.ts
│       │   ├── client.model.ts
│       │   ├── account.model.ts
│       │   ├── transaction.model.ts
│       │   └── api-response.model.ts
│       └── components/         # Composants réutilisables
├── assets/                     # Images et fichiers statiques
├── environments/               # Configuration d'environnement
│   ├── environment.ts
│   └── environment.prod.ts
└── styles.css                  # Styles globaux avec TailwindCSS
```

## 🎯 Fonctionnalités par Rôle

### ADMIN
- ✅ Créer des gestionnaires
- ✅ Créer des caissières
- ✅ Lister les utilisateurs actifs
- ✅ Lister les utilisateurs inactifs
- ✅ Activer/Désactiver des utilisateurs

### GESTIONNAIRE
- ✅ Lister les clients actifs/inactifs
- ✅ Consulter les détails d'un client
- ✅ Modifier les informations d'un client
- ✅ Supprimer un client
- ✅ Créer un compte pour nouveau client
- ✅ Créer un compte pour client existant
- ✅ Lister les comptes actifs/inactifs
- ✅ Consulter les détails d'un compte
- ✅ Supprimer un compte
- ✅ Consulter l'historique des transactions
- ✅ Générer des relevés PDF

### CAISSIERE
- ✅ Effectuer des dépôts
- ✅ Effectuer des retraits
- ✅ Effectuer des transferts entre comptes

## ⚙️ Configuration de l'API

Par défaut, l'application pointe vers `http://localhost:8080`.

Pour changer l'URL de l'API :

1. Modifier `src/environments/environment.ts` pour le développement
2. Modifier `src/environments/environment.prod.ts` pour la production

Ou modifier directement dans chaque service :
```typescript
private readonly API_URL = 'http://your-api-url.com';
```

## 🎨 Technologies Utilisées

- **Angular 17** - Framework principal (Standalone Components)
- **TailwindCSS 3.3** - Framework CSS
- **FontAwesome** - Icônes
- **RxJS** - Programmation réactive
- **TypeScript 5.2** - Langage de programmation

## 📦 Déploiement en Production

### Option 1 : Serveur Web Classique (Apache/Nginx)

1. Build l'application :
   ```bash
   npm run build
   ```

2. Copier le contenu de `dist/ega-bank-app/` vers votre serveur web

3. Configuration Nginx exemple :
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /path/to/dist/ega-bank-app;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

### Option 2 : Hébergement Cloud (Firebase, Netlify, Vercel)

#### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

#### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist/ega-bank-app
```

## 🔧 Dépannage

### Problème : Erreur CORS
**Solution** : Vérifier que votre backend autorise l'origine de votre application Angular dans la configuration CORS.

### Problème : Token JWT non envoyé
**Solution** : Vérifier que l'intercepteur JWT est correctement configuré dans `app.config.ts` ou `main.ts`.

### Problème : Routes non trouvées après build
**Solution** : Configurer votre serveur web pour rediriger toutes les routes vers `index.html`.

### Problème : Erreurs de compilation TypeScript
**Solution** : Vérifier que vous utilisez TypeScript 5.2.x :
```bash
npm install --save-dev typescript@~5.2.2
```

## 📝 Scripts NPM Disponibles

```bash
npm start          # Démarrer en mode développement
npm run build      # Build pour production
npm run watch      # Build en mode watch
npm test           # Lancer les tests unitaires
```

## 🔒 Sécurité

- Les mots de passe ne sont jamais stockés côté client
- Le token JWT est stocké dans localStorage
- L'intercepteur ajoute automatiquement le token aux requêtes
- Les guards protègent les routes selon les rôles
- Déconnexion automatique si le token expire (401)

## 📧 Support

Pour toute question ou problème, consultez :
- README.md
- Documentation Spring Boot
- Documentation Angular : https://angular.io
- Documentation TailwindCSS : https://tailwindcss.com

## 📄 Licence

Ce projet est développé pour EGA Bank.

---

**Version**: 1.0.0  
**Date**: Janvier 2026  
**Auteur**: Développé avec Angular 17 et TailwindCSS
