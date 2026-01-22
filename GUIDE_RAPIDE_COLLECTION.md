# 🚀 Guide Rapide - Collection Postman EGA BANK

## 📥 Import Rapide

1. **Télécharger** : `EGA-BANK-COMPLETE.postman_collection.json`
2. **Ouvrir Postman** → Clic sur "Import" 
3. **Glisser-déposer** le fichier JSON
4. **✅ Prêt !** La collection apparaît dans votre sidebar

## 🎯 Utilisation en 5 Minutes

### Étape 1: Démarrer le Backend
```bash
cd "Ega backend/Ega-backend"
./mvnw spring-boot:run
```

### Étape 2: Séquence de Test Rapide
Exécutez dans cet ordre :

1. **🔐 Authentification** → `Init Admin` → `Login Admin`
2. **👥 Gestion Clients** → `Inscription Client Test` 
3. **🏦 Gestion Comptes** → `Créer compte courant`
4. **💳 Transactions** → `Dépôt 1000€` → `Retrait 150€`
5. **📄 Relevés** → `Relevé période complète`

### Étape 3: Variables Automatiques
La collection gère automatiquement :
- `jwt_token` : Token d'authentification
- `client_id` : ID du client connecté
- `compte_numero` : Numéro de compte créé
- Toutes les autres variables nécessaires

## 📊 Contenu de la Collection

### 🔐 **1. AUTHENTIFICATION** (4 requêtes)
- Init Admin (première fois)
- Login Admin  
- Inscription Client Test (Jean Dupont)
- Login Client Test

### 👥 **2. GESTION CLIENTS** (5 requêtes)
- Lister tous les clients
- Obtenir client par ID
- Créer client (Marie Martin)
- Modifier client
- Supprimer client

### 🏦 **3. GESTION COMPTES** (6 requêtes)
- Lister tous les comptes
- Créer compte courant
- Créer compte épargne
- Obtenir compte par numéro
- Obtenir comptes par client
- Supprimer compte

### 💳 **4. TRANSACTIONS** (10 requêtes)
- Dépôt 1000€ (salaire)
- Dépôt 500€ supplémentaire (prime)
- Retrait 150€ DAB (courses)
- Retrait 75€ Restaurant
- Virement 250€ vers épargne
- Virement 100€ vers ami
- Consulter transactions du compte
- Obtenir transaction par ID
- Relevé période complète
- Relevé mois courant

### 📄 **5. RELEVÉS PDF** (2 requêtes)
- Imprimer relevé PDF complet
- Imprimer relevé PDF mensuel

### 🧪 **6. TESTS SCÉNARIOS** (4 requêtes)
- Workflow complet nouveau client
- Test transactions multiples
- Test validation données (erreurs)
- Test performance consultation

### 🎯 **7. DONNÉES DE TEST AVANCÉES** (2 requêtes)
- Créer 5 clients de test (aléatoire)
- Simulation transactions réalistes

## 💡 Données de Test Incluses

### 👤 **Utilisateurs Pré-configurés**
```json
Admin:
- Username: admin
- Password: Admin@123

Client Test:
- Username: jean.dupont  
- Password: motdepasse123
- Email: jean.dupont@email.com
- Nom: Jean Dupont
```

### 💰 **Transactions Réalistes**
- Dépôts : 1000€ (salaire), 500€ (prime)
- Retraits : 150€ (courses), 75€ (restaurant)
- Virements : 250€ (épargne), 100€ (ami)
- Descriptions réalistes incluses

### 🏪 **Commerces Simulés**
- Supermarché Carrefour
- Station essence Total  
- Restaurant Le Petit Bistro
- Pharmacie du Centre
- Boulangerie Paul
- Librairie Fnac

## 🔧 Fonctionnalités Avancées

### ⚡ **Tests Automatiques**
Chaque requête inclut :
- Validation du code de statut
- Sauvegarde automatique des variables
- Messages de console informatifs
- Gestion d'erreurs

### 🎲 **Données Aléatoires**
- Génération automatique d'emails uniques
- Numéros de téléphone dynamiques
- Montants de transaction variables
- Descriptions commerciales réalistes

### 📊 **Monitoring**
- Temps de réponse mesuré
- Logs détaillés dans la console
- Compteurs de transactions
- Validation des soldes

## 🚨 Dépannage Rapide

### ❌ **Backend non accessible**
```
Erreur: Connection refused
Solution: Démarrer le backend sur port 8080
```

### ❌ **Token expiré**  
```
Erreur: 401 Unauthorized
Solution: Re-exécuter "Login Admin" ou "Login Client"
```

### ❌ **Variables manquantes**
```
Erreur: client_id is undefined  
Solution: Exécuter "Inscription Client Test" d'abord
```

## 🎉 Prêt à Tester !

**✅ Import** → **🚀 Backend** → **▶️ Séquence** → **📊 Résultats**

La collection est **100% autonome** avec toutes les données de test intégrées !