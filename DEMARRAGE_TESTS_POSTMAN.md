# 🚀 Démarrage Rapide - Tests Postman

## ⚡ Étapes Rapides (5 minutes)

### 1. **Prérequis** ✅
- [x] XAMPP démarré (Apache + MySQL)
- [x] Base de données `bank_db` créée
- [x] Postman installé

### 2. **Démarrer le Backend** 🔧
```bash
# Dans le dossier racine du projet
./mvnw spring-boot:run
```
**Attendre le message** : `Started BankApiApplication`

### 3. **Importer dans Postman** 📥

#### A. Collection principale
1. Ouvrir Postman
2. Cliquer **Import** (en haut à gauche)
3. Glisser-déposer : `postman/Bank_API_Complete_Tests.postman_collection.json`

#### B. Environnement (optionnel mais recommandé)
1. Cliquer **Import** 
2. Glisser-déposer : `postman/Bank_API_Environment.postman_environment.json`
3. Sélectionner l'environnement "🏦 Bank API EGA - Local" en haut à droite

### 4. **Test Rapide** ⚡
1. Aller dans la collection "🏦 Bank API EGA - Tests Complets"
2. Dossier "🧪 Scénario de Test Complet"
3. **Exécuter dans l'ordre** :
   - `1️⃣ Créer Client Test`
   - `2️⃣ Créer Compte Test`
   - `3️⃣ Dépôt Initial`
   - `4️⃣ Retrait Partiel`
   - `5️⃣ Vérifier Solde Final`

## 🎯 Tests Automatisés

### **Runner Postman** (Recommandé)
1. Clic droit sur la collection
2. **Run collection**
3. Sélectionner le dossier "🧪 Scénario de Test Complet"
4. Cliquer **Run Bank API EGA**

**Résultat attendu** : ✅ 5/5 tests passés

## 📊 Endpoints Principaux

| Opération | Méthode | URL | Status |
|-----------|---------|-----|--------|
| Lister clients | GET | `/api/clients` | 200 |
| Créer client | POST | `/api/clients` | 201 |
| Créer compte | POST | `/api/comptes` | 201 |
| Effectuer dépôt | POST | `/api/transactions/depot` | 201 |
| Effectuer retrait | POST | `/api/transactions/retrait` | 201 |
| Effectuer virement | POST | `/api/transactions/virement` | 201 |

## 🔧 Dépannage Rapide

### ❌ Erreur 404 - Backend non démarré
```bash
# Vérifier que le backend tourne
curl http://localhost:8080/api/clients
```

### ❌ Erreur 500 - Base de données
```sql
-- Vérifier la base dans phpMyAdmin
USE bank_db;
SHOW TABLES;
```

### ❌ Variables non définies
- Vérifier que l'environnement "🏦 Bank API EGA - Local" est sélectionné
- Les variables `clientId` et `numeroCompte` se remplissent automatiquement

## 🎉 Validation Complète

### **Scénario Complet Réussi** ✅
- Client créé avec ID
- Compte créé avec IBAN valide
- Dépôt de 100 000 XOF effectué
- Retrait de 25 000 XOF effectué
- Solde final : 125 000 XOF (50 000 + 100 000 - 25 000)

### **Prochaines Étapes**
1. Tester les autres endpoints individuellement
2. Tester les cas d'erreur (solde insuffisant, etc.)
3. Tester l'interface Angular sur http://localhost:4200

**Tes APIs sont maintenant validées avec Postman !** 🚀

---

## 📁 Fichiers Postman Disponibles

- `postman/Bank_API_Complete_Tests.postman_collection.json` - Collection principale
- `postman/Bank_API_Environment.postman_environment.json` - Environnement local
- `postman/Bank_API_Tests.postman_collection.json` - Tests de base (legacy)
- `postman/Bank_API_Client_Operations.postman_collection.json` - Opérations client (legacy)

**Utilise la collection "Complete Tests" pour tous tes tests !** 🎯