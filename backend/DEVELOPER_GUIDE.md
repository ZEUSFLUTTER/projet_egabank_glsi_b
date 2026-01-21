# 👨‍💻 GUIDE DÉVELOPPEUR - Gestion de Session

## 🎯 Objectif
L'utilisateur doit rester connecté **tant qu'il est actif**, et se déconnecter automatiquement après **3 minutes d'inactivité**.

---

## 🏗️ Architecture

### Système JWT à Deux Tokens
```
┌────────────────────────────────────────────┐
│  LOGIN                                     │
├────────────────────────────────────────────┤
│                                            │
│  Retourne:                                 │
│  • accessToken (3 min)     ← Requêtes API │
│  • refreshToken (7 jours)  ← Renouvelle  │
│                                            │
└────────────────────────────────────────────┘
```

---

## 📂 Structure du Code

### 1. Configuration (`application.properties`)
```properties
jwt.access-token.expiration=180000       # 3 minutes
jwt.refresh-token.expiration=604800000   # 7 jours
jwt.secret=...                           # Secret key
```

### 2. Propriétés Spring (`JwtProperties.java`)
```java
@Component
@ConfigurationProperties(prefix = "jwt")
public class JwtProperties {
    private String secret;
    private long accessTokenExpiration;   // 180000
    private long refreshTokenExpiration;  // 604800000
}
```

### 3. Utilitaire JWT (`JwtUtil.java`)
```java
// Génère access token (3 min)
public String generateAccessToken(UserDetails userDetails) { ... }

// Génère refresh token (7 jours)
public String generateRefreshToken(UserDetails userDetails) { ... }

// Renouvelle access token
public String refreshAccessToken(String refreshToken, UserDetails userDetails) { ... }

// Valide token
public Boolean validateToken(String token, UserDetails userDetails) { ... }
```

### 4. Service d'Auth (`AuthService.java`)
```java
// Login retourne 2 tokens
public AuthResponseDTO login(AuthRequestDTO authRequest) {
    // ... authentification ...
    String accessToken = jwtUtil.generateAccessToken(userDetails);
    String refreshToken = jwtUtil.generateRefreshToken(userDetails);
    return AuthResponseDTO(accessToken, refreshToken);
}

// Renouvelle access token
public AuthResponseDTO refreshAccessToken(RefreshTokenRequestDTO request) {
    // ... validation refresh token ...
    String newAccessToken = jwtUtil.generateAccessToken(userDetails);
    return AuthResponseDTO(newAccessToken, refreshToken);
}
```

### 5. Endpoints (`AuthController.java`)
```java
@PostMapping("/login")
public ResponseEntity<AuthResponseDTO> login(@Valid @RequestBody AuthRequestDTO authRequest) {
    return ResponseEntity.ok(authService.login(authRequest));
}

@PostMapping("/refresh")
public ResponseEntity<AuthResponseDTO> refreshToken(@Valid @RequestBody RefreshTokenRequestDTO request) {
    return ResponseEntity.ok(authService.refreshAccessToken(request));
}
```

### 6. DTOs
```java
// Réponse d'auth avec 2 tokens
public class AuthResponseDTO {
    private String accessToken;      // 3 min
    private String refreshToken;     // 7 jours
    private Long expiresIn = 180000; // millisecondes
}

// Requête de renouvellement
public class RefreshTokenRequestDTO {
    private String refreshToken;
}
```

---

## 🔄 Flux d'Exécution

### Étape 1: Login
```
Client: POST /api/auth/login
        { "courriel": "...", "motDePasse": "..." }
         │
         ▼
Server: AuthController.login()
         │
         └─► AuthService.login()
              ├─► Authentifier
              ├─► JwtUtil.generateAccessToken()
              ├─► JwtUtil.generateRefreshToken()
              └─► Retourner { accessToken, refreshToken }
         │
         ▼
Client: localStorage.setItem('accessToken', ...)
        localStorage.setItem('refreshToken', ...)
```

### Étape 2: Requête Normal (<3 min)
```
Client: GET /api/clients
        Header: Authorization: Bearer <accessToken>
         │
         ▼
Server: JwtAuthenticationFilter
         │
         ├─► Extraire token du header
         ├─► JwtUtil.validateToken()
         ├─► ✅ Valide → Continuer
         └─► ❌ Expiré → Retourner 401
         │
         ▼
Client: ✅ Données reçues
```

### Étape 3: Renouvellement (>3 min)
```
Client: GET /api/clients
        Header: Authorization: Bearer <accessToken>
         │
         ▼
Server: Retourner 401 (Token expiré)
         │
         ▼
Client: Interceptor attrape 401
        │
        └─► POST /api/auth/refresh
            { "refreshToken": "..." }
         │
         ▼
Server: AuthController.refreshToken()
        │
        ├─► JwtUtil.validateToken(refreshToken)
        ├─► ✅ Valide → generateAccessToken()
        └─► Retourner { accessToken, refreshToken }
         │
         ▼
Client: localStorage.setItem('accessToken', newToken)
        │
        └─► Renvoyer requête originale
            GET /api/clients
            Header: Authorization: Bearer <newAccessToken>
         │
         ▼
Server: ✅ Traiter la requête
         │
         ▼
Client: ✅ Données reçues
```

---

## 🔑 Points Importants

### Access Token
- **Durée:** 3 minutes
- **Usage:** Toutes les requêtes API
- **Stockage:** localStorage (frontend)
- **Expiration:** Automatique ou après inactivité
- **Sécurité:** Court-vécu = limiter dégâts

### Refresh Token
- **Durée:** 7 jours
- **Usage:** Renouvellement uniquement
- **Stockage:** localStorage (frontend)
- **Expiration:** Absolu après 7 jours
- **Sécurité:** Jamais envoyé en requête normale

### Validation
```java
// Dans JwtUtil.java
public Boolean validateToken(String token, UserDetails userDetails) {
    final String username = extractUsername(token);
    return (username.equals(userDetails.getUsername()) && 
            !isTokenExpired(token));
}
```

---

## 🧪 Test Développeur

### Test Unitaire (Optionnel)
```java
@Test
public void testAccessTokenExpires() {
    UserDetails userDetails = new User("test@example.com", ...);
    String token = jwtUtil.generateAccessToken(userDetails);
    
    // Token valide immédiatement
    assertTrue(jwtUtil.validateToken(token, userDetails));
    
    // Après 3 minutes...
    // Token devrait être expiré
}

@Test
public void testRefreshToken() {
    UserDetails userDetails = new User("test@example.com", ...);
    String refreshToken = jwtUtil.generateRefreshToken(userDetails);
    String newAccessToken = jwtUtil.refreshAccessToken(refreshToken, userDetails);
    
    assertNotNull(newAccessToken);
    assertTrue(jwtUtil.validateToken(newAccessToken, userDetails));
}
```

### Test Integration (Avec Postman)
```bash
# 1. Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"courriel":"admin@ega.com","motDePasse":"admin123"}'

# Sauvegarder: accessToken et refreshToken

# 2. Utiliser access token
curl -X GET http://localhost:8080/api/clients \
  -H "Authorization: Bearer <accessToken>"

# 3. Attendre 3+ minutes

# 4. Réessayer
curl -X GET http://localhost:8080/api/clients \
  -H "Authorization: Bearer <accessToken>"
# → 401 Unauthorized

# 5. Renouveler
curl -X POST http://localhost:8080/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<refreshToken>"}'

# 6. Utiliser nouveau token
curl -X GET http://localhost:8080/api/clients \
  -H "Authorization: Bearer <newAccessToken>"
# → 200 OK
```

---

## 🛠️ Customisation

### Modifier Timeout d'Inactivité
Dans `application.properties`:
```properties
# 5 minutes
jwt.access-token.expiration=300000

# 10 minutes
jwt.access-token.expiration=600000

# 30 secondes (test)
jwt.access-token.expiration=30000
```

### Modifier Durée Refresh Token
```properties
# 14 jours
jwt.refresh-token.expiration=1209600000

# 1 jour
jwt.refresh-token.expiration=86400000
```

---

## 🐛 Debugging

### Problème: Token n'expire jamais
**Solution:** Vérifier la configuration dans `application.properties`
```properties
jwt.access-token.expiration=180000  # Bien présent?
```

### Problème: Refresh token ne fonctionne pas
**Solution:** Vérifier qu'il est valide
```java
// Dans JwtUtil
public Boolean isRefreshToken(String token) {
    Claims claims = extractAllClaims(token);
    return "refresh".equals(claims.get("type"));
}
```

### Problème: 401 non capturé au frontend
**Solution:** Implémenter l'interceptor
```typescript
// TokenInterceptor.ts
if (error instanceof HttpErrorResponse && error.status === 401) {
    return this.refreshAccessToken()...
}
```

---

## 📊 Monitoring

### Logs Utiles
```properties
# Application
logging.level.com.ega=DEBUG

# Spring Security
logging.level.org.springframework.security=DEBUG
```

### Vérifier Token
```bash
# Décoder JWT (en ligne)
# https://jwt.io/

# Token valide?
# Vérifier exp claim
{
  "exp": 1705601890,    # Unix timestamp
  "username": "admin@ega.com",
  "type": "access"
}
```

---

## 📚 Références

- JWT: https://jwt.io/
- Spring Security: https://spring.io/projects/spring-security
- RFC 7519: https://tools.ietf.org/html/rfc7519

---

## ✅ Checklist Développeur

- [ ] Comprendre flux JWT
- [ ] Modifier timeout si besoin
- [ ] Tester endpoints avec Postman
- [ ] Implémenter frontend (AuthService + Interceptor)
- [ ] Tester redirection 401 → refresh
- [ ] Vérifier logout nettoie tokens
- [ ] Test utilisateur final

