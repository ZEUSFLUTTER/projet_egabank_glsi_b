## 🧪 Test du Système de Session - Guide Pratique

### Prérequis
- Application démarrée: `http://localhost:8080`
- Postman ou équivalent
- Utilisateur admin: `admin@ega.com` / `admin123`

---

## ✅ Test 1: Login et Récupération des Tokens

### Étape 1.1 - Login
```
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "courriel": "admin@ega.com",
  "motDePasse": "admin123"
}
```

**Réponse Attendue:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiJ9...",
  "type": "Bearer",
  "userId": 1,
  "courriel": "admin@ega.com",
  "role": "ROLE_ADMIN",
  "expiresIn": 180000
}
```

**✅ Copier l'accessToken et le refreshToken pour les étapes suivantes**

---

## ✅ Test 2: Utiliser l'Access Token (Actif)

### Étape 2.1 - Requête Immédiate (Succès)
```
GET http://localhost:8080/api/clients
Authorization: Bearer <accessToken>
```

**Résultat:** 200 OK ✅

### Étape 2.2 - Vérifier le Token
```
POST http://localhost:8080/api/clients
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "nom": "TestClient",
  "prenom": "Test",
  "dateNaissance": "1990-01-01",
  "sexe": "M",
  "adresse": "123 Test St",
  "telephone": "12345678",
  "courriel": "test@example.com",
  "nationalite": "TN"
}
```

**Résultat:** 201 CREATED ✅

---

## ⏱️ Test 3: Timeout d'Inactivité (3 minutes)

### Étape 3.1 - Attendre 3+ minutes
- ⏰ Attendez **3 minutes** (ou modifiez la durée dans les logs)
- Laissez le accessToken tel quel

### Étape 3.2 - Tentative Après Timeout
```
GET http://localhost:8080/api/clients
Authorization: Bearer <accessToken>
```

**Résultat Attendu:** 401 Unauthorized ❌
```json
{
  "status": 403,
  "message": "Accès interdit",
  "timestamp": "2026-01-18T10:30:00"
}
```

**Ceci est normal!** Le token a expiré après 3 minutes d'inactivité.

---

## 🔄 Test 4: Renouvellement du Token

### Étape 4.1 - Renouveler avec Refresh Token
```
POST http://localhost:8080/api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "<refreshToken>"
}
```

**Réponse Attendue:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9...",  // NOUVEAU TOKEN
  "refreshToken": "eyJhbGciOiJIUzI1NiJ9...",  // MÊME
  "type": "Bearer",
  "userId": 1,
  "courriel": "admin@ega.com",
  "role": "ROLE_ADMIN",
  "expiresIn": 180000
}
```

**✅ Copier le NOUVEAU accessToken**

### Étape 4.2 - Réessayer avec Nouveau Token
```
GET http://localhost:8080/api/clients
Authorization: Bearer <newAccessToken>
```

**Résultat:** 200 OK ✅

---

## 🛡️ Test 5: Refresh Token Expiré

### Étape 5.1 - Attendre 7 jours (Simulation)
Dans `JwtUtil.java`, remplacez temporairement pour tester:
```java
@Value("${jwt.refresh-token.expiration}")
private Long refreshTokenExpiration = 1000L; // 1 seconde pour test
```

### Étape 5.2 - Attendre et Renouveler
```
POST http://localhost:8080/api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "<oldRefreshToken>"
}
```

**Résultat Attendu:** 403 FORBIDDEN
```json
{
  "status": 403,
  "message": "Refresh token invalide ou expiré",
  "timestamp": "2026-01-18T10:35:00"
}
```

**✅ L'utilisateur doit se reconnecter**

---

## 📊 Résumé des Résultats

| Test | Condition | Résultat | Code |
|------|-----------|----------|------|
| 1 | Login | Tokens générés | 200 |
| 2 | Access Token Valide | Requête OK | 200 |
| 3 | Access Token Expiré (>3min) | Rejet | 401 |
| 4 | Refresh Token Valide | Nouveau Token | 200 |
| 4b | Requête avec Nouveau Token | OK | 200 |
| 5 | Refresh Token Expiré (>7j) | Rejet | 403 |

---

## 🎯 Cas d'Usage Réel

### Utilisateur Travaille Pendant 1 Heure
```
10:00 - Login → Token valide jusqu'à 10:03
10:01 - Clique sur "Comptes" → Requête OK (1 min d'activité)
10:02 - Clique sur "Transactions" → Token renouvelé auto (2 min)
10:03 - Clique sur "Virements" → Token renouvelé auto (3 min)
...
11:00 - Clique sur "Logout" → Déconnexion complète
```

### Utilisateur Inactif 5 Minutes
```
10:00 - Login → Token valide jusqu'à 10:03
10:01 - Clique sur "Clients" → OK
       → Partie café ☕
10:06 - Revient, clique sur "Comptes"
       → Token expiré
       → App refresh auto avec refreshToken
       → Token renouvelé
       → Requête renvoyée → OK
       → Utilisateur voit les données ✅
```

---

## 🔧 Ajustement des Timeouts

Pour modifier les durées, éditez `application.properties`:

```properties
# 5 minutes d'inactivité
jwt.access-token.expiration=300000

# 14 jours de refresh
jwt.refresh-token.expiration=1209600000
```

---

## 💡 Notes Importantes

1. **Le Refresh Token doit être stocké sécurisé** (httpOnly cookie en prod)
2. **L'Access Token expire automatiquement** (3 min)
3. **Chaque refresh crée un NOUVEAU access token**
4. **Le Refresh Token reste le même** tant qu'il est valide
5. **Après 7 jours**, l'utilisateur doit se reconnecter

