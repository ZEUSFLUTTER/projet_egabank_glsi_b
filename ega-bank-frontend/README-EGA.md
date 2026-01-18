# EGA Bank Frontend - Application Bancaire Togolaise

## 🏦 Description
Application bancaire moderne développée avec Angular 17+ et Tailwind CSS, conçue spécifiquement pour le marché togolais avec intégration des services Mobile Money (T-Money & Flooz).

## ✨ Fonctionnalités

### 🔐 Authentification
- Connexion sécurisée avec JWT
- Gestion des rôles (ADMIN / CLIENT)
- Protection des routes avec guards
- Déconnexion automatique

### 👤 Dashboard Client
- Affichage du solde en temps réel
- Consultation de l'IBAN
- Virement bancaire avec validation du solde
- Intégration Mobile Money (T-Money & Flooz)
- Notifications toast pour toutes les actions

### 🛠️ Espace Administration
- Liste complète des clients
- Création de nouveaux comptes clients
- Interface modale pour la saisie
- Gestion centralisée des utilisateurs

### 📱 Mobile Money (Simulation)
- Support T-Money et Flooz
- Dépôts et retraits simulés
- Animation de chargement (2 secondes)
- Validation des montants et numéros

## 🚀 Installation et Démarrage

### Prérequis
- Node.js 18+
- Angular CLI 17+
- Backend Spring Boot en cours d'exécution sur le port 8081

### Installation
```bash
cd ega-bank-frontend
npm install
```

### Démarrage
```bash
ng serve
```
L'application sera accessible sur `http://localhost:4200`

## 🔧 Configuration

### Backend API
L'application est configurée pour communiquer avec le backend Spring Boot :
- URL de base : `http://localhost:8081/api`
- CORS configuré pour `http://localhost:4200`

### Comptes de test
- **Admin** : `admin@ega.tg` / `admin123`
- **Client** : `client@ega.tg` / `client123`

## 📋 Endpoints utilisés

### Authentification
- `POST /api/auth/login` - Connexion utilisateur

### Client
- `GET /api/clients/me/solde` - Récupération du solde
- `POST /api/clients/virement` - Effectuer un virement

### Administration
- `GET /api/admin/clients` - Liste des clients
- `POST /api/admin/clients` - Créer un nouveau client

## 🎨 Design System

### Couleurs principales
- **Primary** : Bleu (#3b82f6)
- **Success** : Vert (#10b981)
- **Error** : Rouge (#ef4444)
- **Warning** : Orange (#f59e0b)

### Composants réutilisables
- `.btn-primary` - Bouton principal
- `.btn-secondary` - Bouton secondaire
- `.input-field` - Champ de saisie
- `.card` - Carte de contenu

## 🏗️ Architecture

### Services
- **AuthService** : Gestion de l'authentification
- **ClientService** : Opérations bancaires
- **MobileMoneyService** : Simulation Mobile Money
- **ToastService** : Notifications utilisateur

### Guards
- **authGuard** : Protection des routes authentifiées
- **adminGuard** : Accès réservé aux administrateurs
- **clientGuard** : Accès réservé aux clients

### Interceptors
- **jwtInterceptor** : Injection automatique du token JWT

## 🔒 Sécurité
- Tokens JWT stockés en localStorage
- Intercepteur automatique pour l'autorisation
- Guards de protection des routes
- Validation côté client des formulaires

## 📱 Responsive Design
- Interface adaptée mobile et desktop
- Grille responsive avec Tailwind CSS
- Composants optimisés pour tous les écrans

## 🚧 Fonctionnalités à venir
- Historique des transactions
- Notifications push
- Export des relevés
- Chat support client
- Intégration réelle Mobile Money

## 🤝 Contribution
Ce projet fait partie du système EGA Bank complet incluant le backend Spring Boot.

---
**EGA Bank** - Votre partenaire bancaire digital au Togo 🇹🇬