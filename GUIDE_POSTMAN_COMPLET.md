# 📮 Guide Complet - Test des APIs avec Postman

## 🚀 Démarrage Rapide

### 1. **Prérequis**
- ✅ Postman installé ([Télécharger ici](https://www.postman.com/downloads/))
- ✅ Backend Spring Boot démarré (`mvnw.cmd spring-boot:run`)
- ✅ Base de données MySQL/XAMPP active

### 2. **Import des Collections**
1. Ouvrir Postman
2. Cliquer sur **Import** (bouton en haut à gauche)
3. Glisser-déposer ces fichiers :
   - `postman/Bank_API_Tests.postman_collection.json`
   - `postman/Bank_API_Client_Operations.postman_collection.json`

## 🏦 APIs Disponibles

### 📋 **1. Gestion des Clients**
```
Base URL: http://localhost:8080/api/clients
```

#### GET - Lister tous les clients
- **URL** : `GET http://localhost:8080/api/clients`
- **Headers** : `Content-Type: application/json`
- **Réponse** : Liste des clients

#### POST - Créer un client
- **URL** : `POST http://localhost:8080/api/clients`
- **Headers** : `Content-Type: application/json`
- **Body (JSON)** :
```json
{
  "nom": "Diop",
  "prenom": "Amadou",
  "dateNaissance": "1990-05-15",
  "sexe": "M",
  "adresse": "123 Rue de la Paix, Dakar",
  "numeroTelephone": "+221771234567",
  "courriel": "amadou.diop@test.com",
  "nationalite": "Sénégalaise"
}
```

#### GET - Client par ID
- **URL** : `GET http://localhost:8080/api/clients/{id}`
- **Exemple** : `GET http://localhost:8080/api/clients/1`

#### PUT - Modifier un client
- **URL** : `PUT http://localhost:8080/api/clients/{id}`
- **Body** : Même structure que POST

#### DELETE - Supprimer un client
- **URL** : `DELETE http://localhost:8080/api/clients/{id}`

### 💳 **2. Gestion des Comptes**
```
Base URL: http://localhost:8080/api/comptes
```

#### GET - Lister tous les comptes
- **URL** : `GET http://localhost:8080/api/comptes`

#### POST - Créer un compte
- **URL** : `POST http://localhost:8080/api/comptes`
- **Body (JSON)** :
```json
{
  "proprietaireId": 1,
  "typeCompte": "COURANT",
  "solde": 100000
}
```

#### GET - Comptes d'un client
- **URL** : `GET http://localhost:8080/api/comptes/client/{clientId}`
- **Exemple** : `GET http://localhost:8080/api/comptes/client/1`

#### GET - Compte par numéro
- **URL** : `GET http://localhost:8080/api/comptes/numero/{numeroCompte}`

### 💰 **3. Opérations Bancaires**
```
Base URL: http://localhost:8080/api/transactions
```

#### GET - Lister toutes les transactions
- **URL** : `GET http://localhost:8080/api/transactions`

#### POST - Effectuer un dépôt
- **URL** : `POST http://localhost:8080/api/transactions/depot`
- **Body (JSON)** :
```json
{
  "numeroCompte": "SN12K00100152000025000000268",
  "montant": 50000,
  "description": "Dépôt de salaire"
}
```

#### POST - Effectuer un retrait
- **URL** : `POST http://localhost:8080/api/transactions/retrait`
- **Body (JSON)** :
```json
{
  "numeroCompte": "SN12K00100152000025000000268",
  "montant": 10000,
  "description": "Retrait DAB"
}
```

#### POST - Effectuer un virement
- **URL** : `POST http://localhost:8080/api/transactions/virement`
- **Body (JSON)** :
```json
{
  "compteSource": "SN12K00100152000025000000268",
  "compteDestinataire": "SN12K00100152000025000000269",
  "montant": 5000,
  "description": "Virement familial"
}
```

#### GET - Transactions d'un compte
- **URL** : `GET http://localhost:8080/api/transactions/compte/{numeroCompte}`

#### GET - Transactions par période
- **URL** : `GET http://localhost:8080/api/transactions/compte/{numeroCompte}/periode`
- **Params** :
  - `dateDebut`: `2024-01-01T00:00:00`
  - `dateFin`: `2024-12-31T23:59:59`

## 🧪 Scénario de Test Complet

### **Étape 1 : Créer un Client**
```http
POST http://localhost:8080/api/clients
Content-Type: application/json

{
  "nom": "TestPostman",
  "prenom": "Utilisateur",
  "dateNaissance": "1985-03-20",
  "sexe": "M",
  "adresse": "456 Avenue des Tests, Dakar",
  "numeroTelephone": "+221779876543",
  "courriel": "test.postman@bank.com",
  "nationalite": "Sénégalaise"
}
```
**Résultat attendu** : Status 201, retourne le client avec un ID

### **Étape 2 : Créer un Compte**
```http
POST http://localhost:8080/api/comptes
Content-Type: application/json

{
  "proprietaireId": 1,
  "typeCompte": "COURANT",
  "solde": 100000
}
```
**Résultat attendu** : Status 201, retourne le compte avec numéro IBAN

### **Étape 3 : Effectuer un Dépôt**
```http
POST http://localhost:8080/api/transactions/depot
Content-Type: application/json

{
  "numeroCompte": "SN12K00100152000025000000268",
  "montant": 50000,
  "description": "Dépôt test Postman"
}
```
**Résultat attendu** : Status 201, transaction créée, solde mis à jour

### **Étape 4 : Vérifier le Solde**
```http
GET http://localhost:8080/api/comptes/numero/SN12K00100152000025000000268
```
**Résultat attendu** : Solde = 150000 (100000 + 50000)

### **Étape 5 : Effectuer un Retrait**
```http
POST http://localhost:8080/api/transactions/retrait
Content-Type: application/json

{
  "numeroCompte": "SN12K00100152000025000000268",
  "montant": 20000,
  "description": "Retrait test Postman"
}
```
**Résultat attendu** : Status 201, nouveau solde = 130000

### **Étape 6 : Consulter l'Historique**
```http
GET http://localhost:8080/api/transactions/compte/SN12K00100152000025000000268
```
**Résultat attendu** : Liste des 2 transactions (dépôt + retrait)

## 🔧 Configuration Postman

### **Variables d'Environnement**
Créer un environnement "Bank API Local" avec :
- `baseUrl` = `http://localhost:8080`
- `clientId` = `1` (à mettre à jour après création)
- `numeroCompte` = `SN12K00100152000025000000268` (à mettre à jour)

### **Utilisation des Variables**
```
{{baseUrl}}/api/clients
{{baseUrl}}/api/comptes/client/{{clientId}}
{{baseUrl}}/api/transactions/compte/{{numeroCompte}}
```

## 📊 Tests Automatisés

### **Script de Test POST Client**
Ajouter dans l'onglet "Tests" de la requête POST client :
```javascript
pm.test("Client créé avec succès", function () {
    pm.response.to.have.status(201);
});

pm.test("Client a un ID", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.id).to.be.a('number');
    pm.environment.set("clientId", jsonData.id);
});

pm.test("Email correct", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.courriel).to.include("@");
});
```

### **Script de Test POST Compte**
```javascript
pm.test("Compte créé avec succès", function () {
    pm.response.to.have.status(201);
});

pm.test("Numéro IBAN généré", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.numeroCompte).to.match(/^SN\d{2}K\d{21}$/);
    pm.environment.set("numeroCompte", jsonData.numeroCompte);
});

pm.test("Solde initial correct", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.solde).to.equal(100000);
});
```

### **Script de Test Dépôt**
```javascript
pm.test("Dépôt effectué avec succès", function () {
    pm.response.to.have.status(201);
});

pm.test("Transaction enregistrée", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.typeTransaction).to.equal("DEPOT");
    pm.expect(jsonData.montant).to.equal(50000);
});

pm.test("Solde mis à jour", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.soldeApres).to.be.above(jsonData.soldeAvant);
});
```

## 🚨 Gestion des Erreurs

### **Erreurs Courantes**
- **404 Not Found** : Vérifier que le backend est démarré
- **400 Bad Request** : Vérifier le format JSON et les validations
- **500 Internal Server Error** : Vérifier les logs du backend

### **Validation des Données**
- **Email** : Format valide requis
- **Téléphone** : Format international recommandé
- **Montant** : Doit être positif
- **Solde** : Vérifier avant retrait

## 📁 Organisation des Collections

### **Collection 1 : Bank_API_Tests**
- Tests CRUD de base
- Gestion des clients et comptes
- Validation des données

### **Collection 2 : Bank_API_Client_Operations**
- Opérations bancaires
- Transactions et virements
- Tests de solde et historique

## 🎯 Conseils d'Utilisation

1. **Ordre des Tests** : Toujours créer client → compte → opérations
2. **Variables** : Utiliser les variables d'environnement pour les IDs
3. **Assertions** : Ajouter des tests automatisés pour valider les réponses
4. **Documentation** : Documenter chaque requête avec des exemples
5. **Sauvegarde** : Exporter régulièrement les collections

## 🚀 Démarrage Ultra-Rapide

### **Option 1 : Test Automatique (Recommandé)**
1. Démarrer le backend : `./mvnw spring-boot:run`
2. Ouvrir dans le navigateur : `test-postman-auto.html`
3. Cliquer sur "🚀 Lancer tous les tests"
4. **Résultat en 30 secondes** : ✅ 6/6 tests réussis

### **Option 2 : Postman Manuel**
1. Suivre le guide : `DEMARRAGE_TESTS_POSTMAN.md`
2. Importer : `postman/Bank_API_Complete_Tests.postman_collection.json`
3. Importer : `postman/Bank_API_Environment.postman_environment.json`
4. Exécuter le "🧪 Scénario de Test Complet"

## 📁 Fichiers Disponibles

### **Collections Postman**
- `Bank_API_Complete_Tests.postman_collection.json` - **Collection principale** ⭐
- `Bank_API_Environment.postman_environment.json` - **Environnement local** ⭐
- `Bank_API_Tests.postman_collection.json` - Tests de base (legacy)
- `Bank_API_Client_Operations.postman_collection.json` - Opérations client (legacy)

### **Guides et Tests**
- `DEMARRAGE_TESTS_POSTMAN.md` - **Guide de démarrage rapide** ⭐
- `test-postman-auto.html` - **Test automatique dans le navigateur** ⭐
- `GUIDE_POSTMAN_COMPLET.md` - Documentation complète (ce fichier)

**Tes APIs sont maintenant prêtes à être testées avec Postman !** 🚀