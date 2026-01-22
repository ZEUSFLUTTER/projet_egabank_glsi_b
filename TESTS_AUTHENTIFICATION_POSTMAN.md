# 🔐 Tests d'Authentification Postman - Bank EGA

## 🎯 Endpoint d'Authentification

### **URL** : `POST /api/auth/login`
### **Headers** : `Content-Type: application/json`

## 📋 Bodies Postman Disponibles

### **1. Connexion Admin** ✅
```json
{
  "username": "admin",
  "password": "password"
}
```

**Réponse attendue** (Status 200) :
```json
{
  "token": "mock-jwt-token-admin",
  "username": "admin",
  "email": "admin@ega-bank.com",
  "role": "ADMIN"
}
```

### **2. Connexion User** ✅
```json
{
  "username": "user",
  "password": "password"
}
```

**Réponse attendue** (Status 200) :
```json
{
  "token": "mock-jwt-token-user",
  "username": "user",
  "email": "user@ega-bank.com",
  "role": "USER"
}
```

### **3. Connexion Échouée** ❌
```json
{
  "username": "wronguser",
  "password": "wrongpassword"
}
```

**Réponse attendue** (Status 401) : Corps vide

## 🧪 Tests Automatisés Postman

### **Script de Test (onglet Tests)** :
```javascript
pm.test("Login réussi", function () {
    pm.response.to.have.status(200);
});

pm.test("Token présent", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.token).to.be.a('string');
    pm.expect(jsonData.token).to.include('mock-jwt-token');
});

pm.test("Rôle correct", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.role).to.be.oneOf(['ADMIN', 'USER']);
});

pm.test("Email valide", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.email).to.include('@ega-bank.com');
});

// Sauvegarder le token pour les autres requêtes
if (pm.response.code === 200) {
    var jsonData = pm.response.json();
    pm.environment.set("authToken", jsonData.token);
    pm.environment.set("userRole", jsonData.role);
    pm.environment.set("currentUser", jsonData.username);
}
```

## 🔧 Configuration Postman

### **Variables d'Environnement Ajoutées** :
- `authToken` - Token JWT reçu après connexion
- `userRole` - Rôle de l'utilisateur (ADMIN/USER)
- `currentUser` - Nom d'utilisateur connecté

### **Utilisation du Token** :
Pour les requêtes nécessitant une authentification, ajouter dans les Headers :
```
Authorization: Bearer {{authToken}}
```

## 🚀 Tests Disponibles dans la Collection

### **Section "🔐 Authentification"** :
1. **🔑 Login Admin** - Connexion administrateur
2. **👤 Login User** - Connexion utilisateur standard
3. **❌ Login Échec** - Test de connexion échouée

### **Tests Automatisés** :
- ✅ Validation du status code (200 pour succès, 401 pour échec)
- ✅ Vérification de la présence du token
- ✅ Validation du rôle utilisateur
- ✅ Contrôle du format email
- ✅ Sauvegarde automatique des variables d'environnement

## 🎯 Scénario de Test Complet

### **1. Test de Connexion Admin** :
```bash
POST {{baseUrl}}/api/auth/login
Body: {"username": "admin", "password": "password"}
Résultat attendu: ✅ Token admin + rôle ADMIN
```

### **2. Test de Connexion User** :
```bash
POST {{baseUrl}}/api/auth/login
Body: {"username": "user", "password": "password"}
Résultat attendu: ✅ Token user + rôle USER
```

### **3. Test de Connexion Échouée** :
```bash
POST {{baseUrl}}/api/auth/login
Body: {"username": "wrong", "password": "wrong"}
Résultat attendu: ❌ Status 401 + corps vide
```

## 📊 Validation des Réponses

### **Connexion Réussie** ✅
- **Status** : 200 OK
- **Token** : Chaîne contenant "mock-jwt-token"
- **Username** : Correspond à la demande
- **Email** : Format "@ega-bank.com"
- **Role** : "ADMIN" ou "USER"

### **Connexion Échouée** ❌
- **Status** : 401 Unauthorized
- **Corps** : Vide (pas de données sensibles)

## 🔗 Intégration avec les Autres Tests

### **Utilisation du Token** :
Après une connexion réussie, le token est automatiquement sauvegardé et peut être utilisé dans d'autres requêtes :

```javascript
// Dans les headers des autres requêtes
"Authorization": "Bearer {{authToken}}"
```

### **Vérification du Rôle** :
```javascript
// Dans les tests des autres endpoints
pm.test("Utilisateur autorisé", function () {
    var userRole = pm.environment.get("userRole");
    pm.expect(userRole).to.be.oneOf(['ADMIN', 'USER']);
});
```

## 🚀 Comment Tester

### **1. Import dans Postman** :
- Collection : `postman/Bank_API_Complete_Tests.postman_collection.json`
- Environnement : `postman/Bank_API_Environment.postman_environment.json`

### **2. Exécution** :
1. Sélectionner l'environnement "🏦 Bank API EGA - Local"
2. Aller dans la section "🔐 Authentification"
3. Tester les 3 scénarios de connexion
4. Vérifier que les variables sont bien sauvegardées

### **3. Validation** :
- ✅ Login Admin : Token admin sauvegardé
- ✅ Login User : Token user sauvegardé  
- ✅ Login Échec : Status 401 sans données

**Tes tests d'authentification sont maintenant prêts !** 🔐

---

## 📝 Résumé des Bodies

### **Admin** :
```json
{"username": "admin", "password": "password"}
```

### **User** :
```json
{"username": "user", "password": "password"}
```

### **Échec** :
```json
{"username": "wronguser", "password": "wrongpassword"}
```

**Utilise ces bodies directement dans Postman !** 🚀