# 🏦 Application Bancaire EGA - Frontend

## 📋 Prérequis

- Node.js 18+ et npm
- Angular CLI 17+

## 🚀 Installation et Démarrage

### 1. Installation des dépendances

```bash
cd Fontend/EGA_FRONTEND
npm install
```

### 2. Configuration

Assurez-vous que le backend est démarré sur `http://localhost:9090`

### 3. Lancement de l'application

```bash
ng serve
```

L'application démarre sur : http://localhost:4200

## 👤 Comptes de connexion

### 🔐 ADMIN
- **Username:** `admin`
- **Password:** `admin123`
- **Redirection:** `/admin/dashboard`

### 👤 CLIENT
- **Username:** `client`
- **Password:** `client123`
- **Redirection:** `/dashboard`

## 🎨 Fonctionnalités

### Pour le CLIENT
- ✅ Dashboard avec statistiques personnelles
- ✅ Gestion des comptes
- ✅ Dépôt sur compte
- ✅ Retrait (avec vérification du solde)
- ✅ Virement entre comptes
- ✅ Historique des transactions avec filtres
- ✅ Génération et impression de relevé

### Pour l'ADMIN
- ✅ Dashboard avec statistiques globales
- ✅ Vue de tous les clients
- ✅ Vue de tous les comptes
- ✅ Vue de toutes les transactions
- ✅ Détails complets par client

## 🛠️ Technologies utilisées

- Angular 17+
- Tailwind CSS
- RxJS
- JWT Authentication

## 📁 Structure du projet

```
src/app/
├── auth/              # Authentification (login, register)
├── core/              # Services et guards
│   ├── guards/        # Auth guards
│   ├── interceptors/  # JWT interceptor
│   └── services/      # Services partagés
├── dashboard/         # Dashboard principal
├── compte/            # Gestion des comptes
├── depot/             # Opérations de dépôt
├── retrait/           # Opérations de retrait
├── virement/          # Opérations de virement
├── transaction/       # Historique des transactions
└── layout/            # Layout principal (navbar, sidebar)
```

## 🔒 Sécurité

- Authentification JWT
- Guards pour protéger les routes
- Interceptor pour ajouter automatiquement le token
- Vérification de l'expiration du token

## 🎯 Routes

- `/login` - Page de connexion
- `/register` - Page d'inscription
- `/dashboard` - Dashboard client
- `/admin/dashboard` - Dashboard admin
- `/comptes` - Gestion des comptes
- `/depot` - Effectuer un dépôt
- `/retrait` - Effectuer un retrait
- `/virement` - Effectuer un virement
- `/historique` - Historique des transactions
- `/parametres` - Paramètres utilisateur

## ⚠️ Notes importantes

- Le token JWT est stocké dans localStorage
- Le token expire après 24 heures
- Déconnexion automatique si le token est expiré
- Redirection automatique selon le rôle (ADMIN/CLIENT)
