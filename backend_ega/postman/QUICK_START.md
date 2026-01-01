# 🚀 Guide Rapide : Utiliser Postman avec EGA Banking API

## ✅ Postman est déjà lancé !

## 📥 Étape 1 : Importer la collection

### Dans Postman :

1. **Cliquez sur "Import"** en haut à gauche (gros bouton orange/bleu)

2. **Sélectionnez "Choose Files"** ou glissez-déposez ces fichiers :
   ```
   📂 Fichiers à importer :
   ├── /home/vladmir/Documents/JEE/EGA/backend_ega/postman/EGA_Banking_API.postman_collection.json
   └── /home/vladmir/Documents/JEE/EGA/backend_ega/postman/EGA_Banking.postman_environment.json
   ```

3. **Cliquez sur "Import"** pour confirmer

---

## 🌍 Étape 2 : Sélectionner l'environnement

En haut à droite de Postman :
- Trouvez le menu déroulant qui dit **"No Environment"**
- Cliquez dessus
- Sélectionnez **"EGA Banking - Local Development"**

✅ Vous devriez voir maintenant : `EGA Banking - Local Development` affiché

---

## 🎯 Étape 3 : Exécuter les tests

### Option A - Lancer TOUTE la collection (Recommandé) :

1. Dans la barre de gauche, cliquez sur **"Collections"** 
2. Vous verrez **"EGA Banking API - Complete Tests"**
3. **Passez votre souris dessus** → Cliquez sur les **...** (trois points)
4. Cliquez sur **"Run collection"**
5. Dans la fenêtre qui s'ouvre → Cliquez sur **"Run EGA Banking API..."**

🎬 **Les tests vont s'exécuter automatiquement !**

### Option B - Tester manuellement une par une :

1. Développez **"Collections"** → **"EGA Banking API - Complete Tests"**
2. Développez **"1. Authentication"**
3. Cliquez sur **"Register New User"**
4. Cliquez sur le bouton bleu **"Send"**
5. Regardez la réponse en bas
6. Allez dans l'onglet **"Test Results"** pour voir : ✅ Tests passed

Continuez avec les autres requêtes dans l'ordre !

---

## 📊 Résultats attendus

Quand vous lancez toute la collection, vous devriez voir environ :

```
📈 Iterations: 1
📨 Requests: 30+
✅ Tests passed: ~60
❌ Tests failed: 0
⏱️  Total time: ~10-15 secondes
```

---

## 🔥 Ordre d'exécution recommandé (si manuel)

1. **Authentication**
   - ✅ Register New User
   - ✅ Login
   
2. **Clients Management**
   - ✅ Create Client
   - ✅ Get All Clients
   - ✅ Get Client by ID
   
3. **Accounts Management**
   - ✅ Create Savings Account
   - ✅ Create Current Account
   
4. **Transactions**
   - ✅ Deposit Money
   - ✅ Withdraw Money
   - ✅ Transfer Money
   
5. **Account Statements**
   - ✅ Get Statement by Period

---

## 🎨 Ce que vous allez voir dans Postman

### Pour chaque requête qui réussit :
- ✅ Status: **200 OK** ou **201 Created** (en vert)
- ✅ **Body** avec la réponse JSON
- ✅ Onglet **"Test Results"** : tous les tests en vert ✅

### Variables sauvegardées automatiquement :
Les tests sauvegardent automatiquement :
- 🔑 `authToken` - Token JWT après login
- 👤 `clientId` - ID du client créé
- 💰 `savingsAccountId` - ID du compte épargne
- 💳 `currentAccountId` - ID du compte courant

Vous les verrez dans : **Environments** → **EGA Banking - Local Development**

---

## 🐛 Problèmes courants

### ❌ Erreur 401 Unauthorized
**Solution** : Relancez la requête **"Login"** pour obtenir un nouveau token

### ❌ Connection refused
**Solution** : Vérifiez que l'application tourne :
```bash
curl http://localhost:8080/actuator/health
```

### ❌ Les tests échouent
**Solution** : Exécutez-les dans l'ordre, ou utilisez "Run collection" qui le fait automatiquement

---

## 🎓 Astuce Pro

Une fois que vous avez importé la collection, vous pouvez aussi :

1. **Voir la documentation** : Chaque requête a une description
2. **Modifier les données** : Changez le nom, email, etc. dans le Body
3. **Voir les tests** : Onglet "Tests" pour comprendre ce qui est vérifié
4. **Consulter les exemples** : Onglet "Examples" pour voir les réponses attendues

---

## 🚀 C'est parti !

Votre application tourne sur : **http://localhost:8080** ✅

**Bonne chance avec vos tests !** 🎉
