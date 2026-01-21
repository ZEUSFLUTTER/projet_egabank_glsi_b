# 🔐 Gestion de Session - Timeout d'Inactivité 3 Minutes

## 📋 Vue d'Ensemble

Le système implémente un mécanisme de session avec **timeout d'inactivité de 3 minutes**:
- ✅ L'utilisateur reste connecté tant qu'il est actif
- ⏱️ Après 3 minutes d'inactivité, l'access token expire
- 🔄 L'utilisateur peut renouveler sa session sans se reconnecter
- 🚪 Le refresh token est valide 7 jours

## 🎯 Flux d'Authentification

### 1️⃣ **Login Initial**
```
POST /api/auth/login
Body: { "courriel": "...", "motDePasse": "..." }

Response: {
  "accessToken": "eyJhbGc...",    // Token court (3 min)
  "refreshToken": "eyJhbGc...",   // Token long (7 jours)
  "expiresIn": 180000,             // 3 minutes en ms
  "userId": 1,
  "courriel": "user@example.com",
  "role": "ROLE_USER"
}
```

### 2️⃣ **Utilisation des Endpoints**
```
Toutes les requêtes utilisent l'ACCESS TOKEN:

GET /api/comptes
Header: Authorization: Bearer <accessToken>
```

### 3️⃣ **Renouvellement de Session (après 3 min d'inactivité)**
```
POST /api/auth/refresh
Body: { "refreshToken": "..." }

Response: {
  "accessToken": "eyJhbGc...",    // Nouveau token
  "refreshToken": "eyJhbGc...",   // Même refresh token
  "expiresIn": 180000,
  ...
}
```

## ⏱️ Configuration des Timeouts

| Type | Durée | Objectif |
|------|-------|----------|
| **Access Token** | 3 minutes | Expire on inactivity → Force refresh |
| **Refresh Token** | 7 jours | Permet renouvellement prolongé |

## 💻 Implémentation Client (Frontend)

### ✅ Exemple: Angular / React

```typescript
// 1. Login et sauvegarde des tokens
login(credentials) {
  return http.post('/api/auth/login', credentials).then(response => {
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response;
  });
}

// 2. Interceptor pour renouveler automatiquement
// À chaque réponse 401 (token expiré):
if (error.status === 401) {
  return refreshAccessToken().then(() => {
    // Renvoyer la requête originale
    return http.request(originalRequest);
  });
}

// 3. Fonction de renouvellement
refreshAccessToken() {
  const refreshToken = localStorage.getItem('refreshToken');
  return http.post('/api/auth/refresh', { refreshToken }).then(response => {
    localStorage.setItem('accessToken', response.accessToken);
    return response;
  });
}

// 4. Logout
logout() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}
```

## 🔒 Sécurité

- ✅ Access Token court-vécu (3 min) limite l'exposition en cas de vol
- ✅ Refresh Token de longue durée stocké sécurisé (httpOnly si possible)
- ✅ Chaque renouvellement crée un nouveau access token
- ✅ L'utilisateur ne doit pas se reconnecter s'il est actif

## 📊 Scénarios d'Usage

### Scénario 1: Utilisateur Actif
```
10:00 - Login → accessToken valide jusqu'à 10:03
10:01 - Requête API → Token valide, réponse OK
10:02 - Requête API → Token valide, réponse OK
10:03 - Requête API → Token expiré, client refresh
       - Refresh réussit, nouveau token 10:03-10:06
10:04 - Requête API → Token valide, réponse OK
```

### Scénario 2: Utilisateur Inactif
```
10:00 - Login → accessToken valide jusqu'à 10:03
10:01 - Dernière requête API
10:04 - Utilisateur revient après 3+ min d'inactivité
       - Essaie une requête → Token expiré
       - Client appelle /refresh
       - Si refresh token valide → Nouvelle session OK
       - Si refresh token expiré (>7j) → Redirection login
```

## 🛠️ Fichiers Modifiés

| Fichier | Modification |
|---------|--------------|
| `application.properties` | Tokens séparés: 3min + 7jours |
| `JwtUtil.java` | generateAccessToken + generateRefreshToken |
| `AuthService.java` | Login + refresh endpoint implémenté |
| `AuthController.java` | POST /api/auth/refresh endpoint |
| `AuthResponseDTO.java` | accessToken + refreshToken séparés |
| `RefreshTokenRequestDTO.java` | **[NOUVEAU]** DTO pour refresh |
| `JwtProperties.java` | Configurations séparées |

## 🧪 Test Avec Postman

### 1. Login
```
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "courriel": "admin@ega.com",
  "motDePasse": "admin123"
}
```

### 2. Copier l'accessToken et faire une requête
```
GET http://localhost:8080/api/clients
Authorization: Bearer <accessToken>
```

### 3. Attendre 3 minutes ou modifier le token
```
// Le token expire, la requête retourne 401
```

### 4. Renouveller avec refreshToken
```
POST http://localhost:8080/api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "<refreshToken>"
}
```

### 5. Utiliser le nouveau accessToken
```
GET http://localhost:8080/api/clients
Authorization: Bearer <newAccessToken>
```

## ✨ Bénéfices

✅ Utilisateur reste connecté s'il est actif  
✅ Déconnexion auto après 3 min d'inactivité  
✅ Sécurité améliorée avec tokens courts-vécu  
✅ Expérience utilisateur fluide (pas de déconnexion surprise)  
✅ Flexibility: peut augmenter le timeout en modifiant la config  

