# 🔐 Comment Accéder à l'Interface Admin

## 🎯 Fonctionnement

Quand vous vous connectez avec vos identifiants, le système détecte automatiquement votre rôle et vous redirige vers l'interface appropriée :

- **Admin** (`ROLE_ADMIN`) → `/admin/dashboard` 
- **Client** (`ROLE_USER`) → `/client/dashboard`

---

## 👤 Compte Administrateur par Défaut

Au démarrage de l'application backend, un compte admin est automatiquement créé si aucun admin n'existe.

### Identifiants Admin
```
Username : admin
Password : admin123
Email    : admin@egabank.com
```

⚠️ **IMPORTANT** : Changez ce mot de passe en production !

---

## 📋 Étapes pour Accéder

### 1️⃣ Démarrer le Backend
```bash
cd backend/ega-bank
./mvnw spring-boot:run
```

**Ce qui se passe au démarrage :**
- Le système vérifie s'il existe déjà un administrateur
- Si aucun admin n'existe, il crée automatiquement le compte `admin`
- Vous verrez ce message dans la console :

```
================================================================================
✅ Compte administrateur créé avec succès !
   Username : admin
   Password : admin123
   Email    : admin@egabank.com
⚠️  IMPORTANT : Changez ce mot de passe en production !
================================================================================
```

### 2️⃣ Démarrer le Frontend
```bash
cd frontend/ega-bank-ui
npm start
```

### 3️⃣ Se Connecter
1. Ouvrez votre navigateur : `http://localhost:4200/login`
2. Entrez les identifiants admin :
   - **Username** : `admin`
   - **Password** : `admin123`
3. Cliquez sur **Sign in**

### 4️⃣ Redirection Automatique
✅ Vous êtes **automatiquement redirigé** vers `/admin/dashboard`

---

## 🎨 Interface Admin vs Client

### Interface Admin (`/admin/*`)
**Menu de navigation :**
- 📊 Dashboard - Vue d'ensemble globale
- 👥 Clients - Gestion CRUD des clients
- 💳 Accounts - Gestion de tous les comptes
- 💸 Transactions - Historique de toutes les transactions
- ⚙️ Settings - Paramètres

**Fonctionnalités :**
- ✅ Créer/Modifier/Supprimer des clients
- ✅ Créer des comptes bancaires pour les clients
- ✅ Consulter tous les comptes et transactions
- ✅ Gérer le système globalement

### Interface Client (`/client/*`)
**Menu de navigation :**
- 📊 Dashboard - Tableau de bord personnel
- 💳 My Accounts - Mes comptes uniquement
- 💸 Transactions - Mes transactions et opérations
- ⚙️ Settings - Paramètres personnels

**Fonctionnalités :**
- ✅ Consulter ses propres comptes
- ✅ Effectuer des transactions (dépôt, retrait, virement)
- ✅ Consulter l'historique de ses transactions
- ✅ Imprimer ses relevés bancaires

---

## 🔄 Comment Créer d'Autres Comptes Admin

### Option 1 : Modifier un utilisateur existant (via la base de données)
```sql
UPDATE users 
SET role = 'ROLE_ADMIN' 
WHERE username = 'nom_utilisateur';
```

### Option 2 : Ajouter un endpoint d'administration (Backend)
Créez un endpoint protégé pour que les admins puissent promouvoir d'autres utilisateurs :

```java
@PutMapping("/users/{id}/promote")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<?> promoteToAdmin(@PathVariable Long id) {
    // Logique pour changer le rôle
}
```

---

## 🛡️ Sécurité

### Backend
- Tous les endpoints admin sont protégés avec `@PreAuthorize("hasRole('ADMIN')")`
- Les tokens JWT contiennent le rôle de l'utilisateur
- Double validation : authentification + autorisation

### Frontend
- `AdminGuard` protège les routes `/admin/*`
- `ClientGuard` protège les routes `/client/*`
- Vérifications dans les composants avant l'affichage des actions

---

## ✅ Test Complet

1. **Login avec Admin** → Redirigé vers `/admin/dashboard`
2. **Voir tous les clients** → Accès à `/admin/clients`
3. **Créer un client** → Bouton "New Client" visible
4. **Créer un compte** → Accès à `/admin/accounts/new`
5. **Logout** → Déconnexion
6. **Login avec Client** → Redirigé vers `/client/dashboard`
7. **Menu différent** → Pas d'accès à la gestion des clients

---

## 📞 En Cas de Problème

### Le compte admin n'est pas créé ?
Vérifiez les logs du backend au démarrage. Le message de création doit apparaître.

### Impossible de se connecter ?
- Vérifiez que le backend tourne sur `http://localhost:8080`
- Vérifiez la base de données PostgreSQL
- Essayez les identifiants : `admin` / `admin123`

### Redirigé vers la mauvaise interface ?
Vérifiez que le rôle est bien `ROLE_ADMIN` dans la base de données :
```sql
SELECT username, role FROM users WHERE username = 'admin';
```

### Token expiré ?
Reconnectez-vous. Le système gère automatiquement le refresh token.

---

## 🚀 C'est Prêt !

Votre système est maintenant configuré avec :
- ✅ Compte admin automatique
- ✅ Redirection intelligente selon le rôle
- ✅ Interfaces séparées admin/client
- ✅ Sécurité complète backend + frontend

**Lancez l'application et connectez-vous avec `admin` / `admin123` !** 🎉
