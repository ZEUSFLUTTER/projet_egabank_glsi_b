# 🧪 Guide de Tests Postman - API Bancaire

## 📥 Installation de la Collection

### 1. Importer la Collection
1. Ouvrir **Postman**
2. Cliquer **"Import"** (en haut à gauche)
3. Sélectionner le fichier `Bank_API_Tests.postman_collection.json`
4. Cliquer **"Import"**

### 2. Configuration des Variables
La collection utilise des variables automatiques :
- `base_url` : http://localhost:8080/api
- `auth_token` : Rempli automatiquement après login
- `client_id` : Rempli automatiquement après création client
- `compte_numero` : Rempli automatiquement après création compte

## 🚀 Ordre d'Exécution des Tests

### ⚠️ IMPORTANT : Démarrer le Backend
```bash
# Dans le dossier racine du projet
mvn spring-boot:run
```

### 📋 Séquence de Tests Recommandée

#### 1. **Authentification** (OBLIGATOIRE EN PREMIER)
```
1.1 Login Admin
```
✅ **Résultat attendu** : Token JWT récupéré automatiquement

#### 2. **Gestion des Clients**
```
2.1 Créer un Client
2.2 Lister tous les Clients
2.3 Obtenir un Client par ID
2.4 Modifier un Client
2.5 Rechercher des Clients
```
✅ **Résultat attendu** : Client créé avec ID sauvegardé

#### 3. **Gestion des Comptes**
```
3.1 Créer un Compte
3.2 Lister tous les Comptes
3.3 Obtenir Comptes par Client
3.4 Obtenir Compte par Numéro
```
✅ **Résultat attendu** : Compte créé avec numéro sauvegardé

#### 4. **Opérations Bancaires**
```
4.1 Effectuer un Dépôt
4.2 Effectuer un Retrait
4.3 Effectuer un Virement
```
✅ **Résultat attendu** : Transactions créées avec succès

#### 5. **Consultation des Transactions**
```
5.1 Lister Transactions d'un Compte
5.2 Transactions par Période
```
✅ **Résultat attendu** : Historique des transactions

#### 6. **Génération de Relevés**
```
6.1 Générer Relevé (Téléchargement)
6.2 Voir Relevé (Visualisation)
```
✅ **Résultat attendu** : Relevé généré au format texte

#### 7. **Tests de Validation**
```
7.1 Test Validation - Client Invalide
7.2 Test Solde Insuffisant
```
✅ **Résultat attendu** : Erreurs de validation correctes

## 🎯 Tests Automatisés

### Scripts de Test Intégrés
Chaque requête contient des **scripts de test automatiques** :

```javascript
// Exemple : Vérification de création de client
pm.test('Client créé avec succès', function () {
    pm.response.to.have.status(201);
    pm.expect(response.nom).to.eql('Diop');
});
```

### Exécution en Lot
1. Cliquer sur **"Bank API - Tests Complets"**
2. Cliquer **"Run"** (bouton bleu)
3. Sélectionner tous les tests
4. Cliquer **"Run Bank API - Tests Complets"**

## 📊 Résultats Attendus

### ✅ Tests de Succès
- **Status 200/201** : Opérations réussies
- **Variables automatiques** : ID et tokens sauvegardés
- **Données cohérentes** : Réponses conformes aux attentes

### ❌ Tests d'Erreur (Volontaires)
- **Status 400** : Validation échouée
- **Status 401** : Non authentifié
- **Status 404** : Ressource non trouvée

## 🔧 Dépannage

### Problème : "Unauthorized" (401)
**Solution** : Exécuter d'abord "Login Admin"

### Problème : "Connection refused"
**Solution** : Vérifier que le backend est démarré sur le port 8080

### Problème : Variables non remplies
**Solution** : Exécuter les tests dans l'ordre recommandé

## 📋 Checklist de Validation

### Backend CRUD ✅
- [ ] Création de clients
- [ ] Lecture de clients
- [ ] Modification de clients
- [ ] Suppression de clients (Admin uniquement)
- [ ] Création de comptes
- [ ] Consultation de comptes

### Opérations Bancaires ✅
- [ ] Dépôts sur compte
- [ ] Retraits avec vérification de solde
- [ ] Virements entre comptes
- [ ] Historique des transactions
- [ ] Filtrage par période

### Sécurité ✅
- [ ] Authentification JWT
- [ ] Protection des endpoints
- [ ] Validation des données
- [ ] Gestion des erreurs

### Fonctionnalités Avancées ✅
- [ ] Génération de relevés
- [ ] Recherche de clients
- [ ] Filtrage des transactions
- [ ] Téléchargement de documents

## 🎉 Validation Complète

Une fois tous les tests passés avec succès, votre API bancaire est **100% fonctionnelle** et conforme au cahier des charges !

### Prochaines Étapes
1. **Tests Frontend** : Vérifier l'interface Angular
2. **Tests d'Intégration** : Tester le flux complet
3. **Tests de Performance** : Vérifier les temps de réponse
4. **Documentation** : Finaliser la documentation utilisateur