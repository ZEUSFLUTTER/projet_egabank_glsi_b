# 📚 Documentation de l'API EGA Bank

## Base URL

```
http://localhost:8083/api
```

## 🔐 Authentification

Toutes les routes (sauf `/auth/*`) nécessitent un token JWT dans le header :

```
Authorization: Bearer <access_token>
```

### Endpoints publics

#### POST `/auth/register`

Inscription d'un nouvel utilisateur.

**Request Body:**

```json
{
  "username": "string",
  "password": "string",
  "email": "string"
}
```

**Response:** `200 OK`

```json
{
  "accessToken": "string",
  "refreshToken": "string",
  "tokenType": "Bearer",
  "expiresIn": 86400000
}
```

#### POST `/auth/login`

Connexion d'un utilisateur existant.

**Request Body:**

```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:** `200 OK` (même structure que register)

#### POST `/auth/refresh?refreshToken={token}`

Rafraîchir le token d'accès.

---

## 👥 Gestion des Clients

### GET `/clients`

Liste paginée des clients.

**Query Parameters:**

- `page` (int, default: 0)
- `size` (int, default: 10)

**Response:** `200 OK`

```json
{
  "content": [
    {
      "id": 1,
      "nom": "Dupont",
      "prenom": "Jean",
      "dateNaissance": "1990-05-15",
      "sexe": "HOMME",
      "adresse": "Lomé, Togo",
      "telephone": "+228 XX XX XX XX",
      "email": "jean.dupont@email.com",
      "nationalite": "Togolaise"
    }
  ],
  "totalElements": 50,
  "totalPages": 5,
  "number": 0
}
```

### GET `/clients/{id}`

Détails d'un client.

### GET `/clients/{id}/details`

Client avec la liste de ses comptes.

### GET `/clients/search?q={terme}`

Recherche de clients (nom, prénom, email).

### POST `/clients`

Créer un nouveau client.

**Request Body:**

```json
{
  "nom": "Dupont",
  "prenom": "Jean",
  "dateNaissance": "1990-05-15",
  "sexe": "HOMME",
  "adresse": "Lomé, Togo",
  "telephone": "+228 XX XX XX XX",
  "email": "jean.dupont@email.com",
  "nationalite": "Togolaise"
}
```

### PUT `/clients/{id}`

Modifier un client.

### DELETE `/clients/{id}`

Supprimer un client.

---

## 💳 Gestion des Comptes

### GET `/accounts`

Liste paginée des comptes.

### GET `/accounts/{numeroCompte}`

Détails d'un compte par son numéro.

### GET `/accounts/client/{clientId}`

Liste des comptes d'un client.

### POST `/accounts`

Créer un nouveau compte.

**Request Body:**

```json
{
  "clientId": 1,
  "typeCompte": "EPARGNE"
}
```

**Types de compte:** `EPARGNE`, `COURANT`

**Response:** Le numéro de compte est généré automatiquement au format IBAN.

### PUT `/accounts/{id}/deactivate`

Désactiver un compte.

### DELETE `/accounts/{id}`

Supprimer un compte.

---

## 💰 Gestion des Transactions

### POST `/transactions/{numeroCompte}/deposit`

Effectuer un dépôt.

**Request Body:**

```json
{
  "montant": 1000.0,
  "description": "Dépôt initial"
}
```

### POST `/transactions/{numeroCompte}/withdraw`

Effectuer un retrait.

**Request Body:**

```json
{
  "montant": 500.0,
  "description": "Retrait espèces"
}
```

**Erreur si solde insuffisant:** `400 Bad Request`

### POST `/transactions/transfer`

Effectuer un virement.

**Request Body:**

```json
{
  "compteSource": "TG05XXXXXXXXXXXXXXXXXXXX",
  "compteDestination": "TG05YYYYYYYYYYYYYYYYYYYY",
  "montant": 200.0,
  "description": "Virement loyer"
}
```

### GET `/transactions/{numeroCompte}/history`

Historique des transactions d'un compte.

**Query Parameters:**

- `startDate` (date, format: YYYY-MM-DD)
- `endDate` (date, format: YYYY-MM-DD)
- `page` (int, default: 0)
- `size` (int, default: 20)

### GET `/transactions/{numeroCompte}`

Toutes les transactions d'un compte.

---

## 📄 Relevés de Compte

### GET `/statements/{numeroCompte}`

Générer un relevé de compte au format PDF.

**Query Parameters:**

- `startDate` (date, format: YYYY-MM-DD)
- `endDate` (date, format: YYYY-MM-DD)

**Response:** Fichier PDF

---

## 📊 Codes d'erreur

| Code | Description                        |
| ---- | ---------------------------------- |
| 200  | Succès                             |
| 201  | Créé avec succès                   |
| 400  | Requête invalide                   |
| 401  | Non authentifié                    |
| 403  | Non autorisé                       |
| 404  | Ressource non trouvée              |
| 409  | Conflit (ressource déjà existante) |
| 500  | Erreur serveur                     |

---

## 🧪 Tests avec Postman

Une collection Postman complète est disponible dans `/docs/EGA-Bank-API.postman_collection.json`.

**Import:**

1. Ouvrir Postman
2. Import → Upload Files
3. Sélectionner le fichier JSON
4. La variable `baseUrl` est pré-configurée

**Workflow de test:**

1. Exécuter "Register" ou "Login"
2. Le token est automatiquement sauvegardé
3. Tester les autres endpoints

---

## 🔒 Sécurité

- **Mots de passe** : Hashés avec BCrypt
- **Tokens JWT** : Expiration 24h (access), 7 jours (refresh)
- **CORS** : Configuré pour `http://localhost:4200`
- **Validation** : Toutes les entrées sont validées côté serveur

---

## 📖 Documentation interactive

Swagger UI disponible sur : **http://localhost:8083/swagger-ui.html**
