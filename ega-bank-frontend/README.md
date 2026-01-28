# EGA Bank - Application Frontend Angular

Application bancaire complète avec interface Angular et backend Spring Boot.

## 🎨 Thème

Application avec thème violet en dégradé moderne et responsive.

## 🚀 Installation

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm start

# L'application sera accessible sur http://localhost:4200
```

## 📋 Prérequis

- Node.js 18+ et npm
- Backend Spring Boot en cours d'exécution sur http://localhost:8080

## 🏗️ Structure du projet

```
src/
├── app/
│   ├── components/
│   │   ├── auth/          # Authentification (login, register)
│   │   ├── admin/         # Composants admin
│   │   ├── client/        # Composants client
│   │   └── shared/        # Composants partagés (navbar)
│   ├── services/          # Services API
│   ├── guards/            # Guards de navigation
│   ├── interceptors/      # Intercepteurs HTTP
│   └── models/            # Modèles TypeScript
├── styles.scss            # Styles globaux avec thème violet
└── index.html
```

## 🔐 Fonctionnalités

### Authentification
- ✅ Connexion avec JWT
- ✅ Inscription client
- ✅ Gestion des rôles (ADMIN/CLIENT)

### Espace Admin
- ✅ Dashboard avec statistiques
- ✅ Gestion des clients (CRUD)
- ✅ Visualisation des comptes
- ✅ Création d'admin

### Espace Client
- ✅ Dashboard personnel
- ✅ Gestion des comptes (création, consultation)
- ✅ Opérations bancaires (dépôt, retrait, virement)
- ✅ Historique des transactions
- ✅ Téléchargement de relevés PDF

## 🎯 Routes disponibles

### Public
- `/login` - Connexion
- `/register` - Inscription

### Admin (/admin)
- `/admin/dashboard` - Tableau de bord
- `/admin/clients` - Liste des clients
- `/admin/clients/new` - Nouveau client
- `/admin/clients/:id` - Détails client
- `/admin/comptes` - Liste des comptes
- `/admin/register` - Nouveau admin

### Client (/client)
- `/client/dashboard` - Tableau de bord
- `/client/comptes` - Mes comptes
- `/client/comptes/new` - Nouveau compte
- `/client/comptes/:numero` - Détails d'un compte
- `/client/operations` - Effectuer des opérations
- `/client/historique` - Historique des transactions

## 🔧 Configuration

L'API backend doit être accessible sur `http://localhost:8080`

Pour changer l'URL de l'API, modifier les services dans `src/app/services/`

## 📝 Composants à créer manuellement

Les composants suivants doivent être créés pour compléter l'application :

1. **Admin**:
   - clients-list.component.ts
   - client-form.component.ts
   - client-detail.component.ts
   - comptes-list.component.ts
   - admin-register.component.ts

2. **Client**:
   - mes-comptes.component.ts
   - compte-form.component.ts
   - compte-detail.component.ts
   - operations.component.ts
   - historique.component.ts

3. **Shared**:
   - unauthorized.component.ts

## 🎨 Personnalisation du thème

Les couleurs principales sont définies dans `src/styles.scss`:

```scss
:root {
  --primary-purple: #7B2CBF;
  --secondary-purple: #9D4EDD;
  --light-purple: #C77DFF;
  --lighter-purple: #E0AAFF;
  --dark-purple: #5A189A;
}
```

## 📦 Build Production

```bash
npm run build:prod
```

Les fichiers de production seront dans le dossier `dist/`

## 🔒 Sécurité

- JWT automatiquement ajouté aux requêtes via intercepteur
- Guards de navigation basés sur les rôles
- Validation des formulaires
- Gestion des erreurs HTTP

## 📱 Responsive

L'application est entièrement responsive et fonctionne sur:
- Desktop (1200px+)
- Tablette (768px - 1199px)
- Mobile (< 768px)

## 🤝 Support

Pour toute question ou problème, contacter l'équipe de développement.

---

**EGA Bank** - © 2026 - Tous droits réservés
