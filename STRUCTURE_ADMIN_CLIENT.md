# Structure Admin/Client - EGA Bank

## ✅ Changements Implémentés

### 🔐 Backend (Spring Boot)

#### 1. **Gestion des Rôles**
- `ROLE_ADMIN` : Personnel de la banque
- `ROLE_USER` : Clients de la banque
- Le rôle est automatiquement inclus dans le JWT lors de l'authentification

#### 2. **Protection des Endpoints**

##### **Endpoints ADMIN uniquement** (`@PreAuthorize("hasRole('ADMIN')")`)
- `POST /api/clients` - Créer un client
- `PUT /api/clients/{id}` - Modifier un client
- `DELETE /api/clients/{id}` - Supprimer un client
- `GET /api/clients` - Lister tous les clients
- `GET /api/clients/search` - Rechercher des clients
- `GET /api/clients/{id}` - Détails d'un client
- `POST /api/accounts` - Créer un compte
- `DELETE /api/accounts/{id}` - Supprimer un compte
- `PUT /api/accounts/{id}/deactivate` - Désactiver un compte
- `GET /api/accounts` - Lister tous les comptes

##### **Endpoints Authentifiés** (Admin + Client)
- `GET /api/accounts/{numeroCompte}` - Consulter un compte spécifique
- `GET /api/accounts/client/{clientId}` - Consulter les comptes d'un client
- `POST /api/transactions/**` - Effectuer des transactions
- `GET /api/transactions/**` - Consulter l'historique des transactions

---

### 🎨 Frontend (Angular)

#### 1. **Nouveaux Guards**
- `AdminGuard` : Protège les routes `/admin/*`
- `ClientGuard` : Protège les routes `/client/*`
- Redirection automatique selon le rôle lors de la connexion

#### 2. **Structure des Routes**

##### **Routes ADMIN** (`/admin/*`)
```
/admin/dashboard      - Vue d'ensemble globale
/admin/clients        - Gestion des clients (CRUD)
/admin/clients/new    - Créer un client
/admin/accounts       - Gestion de tous les comptes
/admin/accounts/new   - Créer un compte pour un client
/admin/transactions   - Historique de toutes les transactions
/admin/settings       - Paramètres
```

##### **Routes CLIENT** (`/client/*`)
```
/client/dashboard         - Tableau de bord personnel
/client/accounts          - Mes comptes uniquement
/client/transactions      - Mes transactions uniquement
/client/transactions/new  - Effectuer une transaction
/client/settings          - Paramètres personnels
```

#### 3. **Navigation Dynamique**
Le composant `app-sidebar` affiche des menus différents selon le rôle :
- **Admin** : Dashboard, Clients, Accounts, Transactions
- **Client** : Dashboard, My Accounts, Transactions

#### 4. **Méthodes AuthService**
```typescript
getUserRole(): string | null          // Récupère le rôle
hasRole(role: string): boolean        // Vérifie un rôle spécifique
isAdmin(): boolean                    // Vérifie si admin
isClient(): boolean                   // Vérifie si client
```

---

## 🔄 Flux d'Authentification

1. **Connexion** → Le backend renvoie le rôle dans le JWT
2. **Stockage** → Le rôle est sauvegardé dans localStorage
3. **Redirection** → Selon le rôle :
   - `ROLE_ADMIN` → `/admin/dashboard`
   - `ROLE_USER` → `/client/dashboard`
4. **Navigation** → Le sidebar s'adapte automatiquement

---

## 🎯 Cas d'Usage

### Scénario Admin
1. Se connecte avec un compte admin
2. Voit tous les clients et comptes
3. Peut créer/modifier/supprimer des clients
4. Peut créer des comptes pour les clients
5. Peut consulter toutes les transactions

### Scénario Client
1. Se connecte avec un compte client
2. Voit uniquement ses propres comptes
3. Peut effectuer des transactions (dépôt, retrait, virement)
4. Peut consulter l'historique de ses transactions
5. Peut imprimer ses relevés

---

## 🚀 Pour Tester

### Créer un compte Admin (via console ou script)
```sql
INSERT INTO users (username, email, password, role, enabled, created_at, updated_at)
VALUES ('admin', 'admin@egabank.com', '$2a$10$...', 'ROLE_ADMIN', true, NOW(), NOW());
```

### Créer un compte Client (via l'inscription)
Les utilisateurs qui s'inscrivent reçoivent automatiquement le rôle `ROLE_USER`.

---

## 📝 Notes Importantes

1. **Sécurité Backend** : Toutes les routes critiques sont protégées par `@PreAuthorize`
2. **Sécurité Frontend** : Les guards empêchent l'accès non autorisé aux routes
3. **Double Validation** : Backend + Frontend pour une sécurité maximale
4. **Séparation Claire** : Admin gère le système, Client utilise ses services

---

## ⚠️ À Faire Ensuite

- [ ] Créer un script de seed pour initialiser un compte admin
- [ ] Implémenter la liaison Client ↔ User lors de l'inscription
- [ ] Ajouter des filtres côté client pour ne voir que SES comptes
- [ ] Implémenter les permissions granulaires si nécessaire
