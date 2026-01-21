# Tests API d'authentification

## Problèmes résolus:

### 1. **Configuration CORS simplifiée**
- ✅ Suppression de la classe ConfigurationCors (redondante)
- ✅ CORS configurée dans ConfigurationSecurite avec `allowCredentials(true)`
- ✅ MaxAge configuré à 3600 secondes

### 2. **Fluxd'authentification**

#### INSCRIPTION (POST /api/auth/inscription)
```json
{
  "nomUtilisateur": "john_doe",
  "motDePasse": "SecurePass123!",
  "role": "USER"
}
```

**Réponse réussie (200):**
```json
{
  "id": 1,
  "nomUtilisateur": "john_doe",
  "role": "USER"
}
```

**Erreur - Utilisateur existe déjà (400):**
```json
{
  "message": "Erreur de validation",
  "messages": {
    "nomUtilisateur": "Ce nom d'utilisateur est déjà pris"
  }
}
```

---

#### CONNEXION (POST /api/auth/connexion)
```json
{
  "nomUtilisateur": "john_doe",
  "motDePasse": "SecurePass123!"
}
```

**Réponse réussie (200):**
```json
{
  "jeton": "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJqb2huX2RvZSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzY4OTQ4MDEyLCJleHAiOjE3Njg5ODQwMTJ9...."
}
```

**Erreur - Identifiants incorrects (401):**
```json
{
  "message": "Identifiants incorrects",
  "erreur": "Le nom d'utilisateur ou le mot de passe est incorrect"
}
```

---

## Étapes à tester:

1. **CURL - Test d'inscription:**
```bash
curl -X POST http://localhost:8081/api/auth/inscription \
  -H "Content-Type: application/json" \
  -d '{"nomUtilisateur":"testuser","motDePasse":"Password123!","role":"USER"}'
```

2. **CURL - Test de connexion:**
```bash
curl -X POST http://localhost:8081/api/auth/connexion \
  -H "Content-Type: application/json" \
  -d '{"nomUtilisateur":"testuser","motDePasse":"Password123!"}'
```

3. **Frontend Angular:**
   - Accédez à http://localhost:4200
   - Cliquez sur "S'inscrire"
   - Remplissez le formulaire
   - Cliquez sur "Se connecter"
