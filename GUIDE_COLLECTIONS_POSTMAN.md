# 📚 Guide d'Utilisation des Collections Postman - Ega Bank API

## 📋 Fichiers Générés

### 1. **Collection Postman**
- **Fichier**: `Ega-Bank-API-Collection.postman_collection.json`
- **Contenu**: Tous les endpoints de l'API avec exemples de requêtes
- **Organisation**: Structurée par modules fonctionnels

### 2. **Environnement Postman**
- **Fichier**: `Ega-Bank-Environment.postman_environment.json`
- **Contenu**: Variables d'environnement pour les tests
- **Configuration**: URLs, tokens, IDs dynamiques

### 3. **Script de Test Automatisé**
- **Fichier**: `test-api-endpoints.ps1`
- **Fonction**: Validation automatique de tous les endpoints
- **Usage**: Test de régression et validation de l'API

## 🚀 Installation et Configuration

### Étape 1: Importer dans Postman
```bash
1. Ouvrez Postman
2. Cliquez sur "Import" (bouton en haut à gauche)
3. Sélectionnez les deux fichiers JSON:
   - Ega-Bank-API-Collection.postman_collection.json
   - Ega-Bank-Environment.postman_environment.json
4. Cliquez sur "Import"
```

### Étape 2: Configurer l'Environnement
```bash
1. Dans Postman, sélectionnez l'environnement "Ega Bank - Environnement Local"
2. Vérifiez les variables:
   - base_url: http://localhost:8080/api
   - frontend_url: http://localhost:4200
   - admin_username: admin
   - admin_password: Admin@123
```

### Étape 3: Démarrer les Services
```bash
# Backend
cd "Ega backend/Ega-backend"
./mvnw spring-boot:run

# Frontend (optionnel pour les tests API)
cd frontend-angular
npm start
```

## 📊 Structure de la Collection

### 🔐 **1. Authentification**
- **Initialiser Admin**: Crée le compte administrateur
- **Connexion Admin**: Authentification admin avec récupération du JWT
- **Inscription Client**: Création d'un nouveau compte client
- **Connexion Client**: Authentification client

### 👥 **2. Gestion Clients**
- **Lister tous les clients**: GET /api/clients
- **Obtenir client par ID**: GET /api/clients/{id}
- **Créer un client**: POST /api/clients
- **Modifier un client**: PUT /api/clients/{id}
- **Supprimer un client**: DELETE /api/clients/{id}

### 🏦 **3. Gestion Comptes**
- **Lister tous les comptes**: GET /api/comptes
- **Créer compte courant**: POST /api/comptes/client/{clientId}?typeCompte=COURANT
- **Créer compte épargne**: POST /api/comptes/client/{clientId}?typeCompte=EPARGNE
- **Obtenir compte par numéro**: GET /api/comptes/numero/{numeroCompte}
- **Obtenir comptes par client**: GET /api/comptes/client/{clientId}

### 💳 **4. Transactions**
- **Effectuer un dépôt**: POST /api/transactions/depot
- **Effectuer un retrait**: POST /api/transactions/retrait
- **Effectuer un virement**: POST /api/transactions/virement
- **Obtenir transactions par compte**: GET /api/transactions/compte/{numeroCompte}
- **Obtenir relevé de compte**: POST /api/transactions/releve

### 📄 **5. Relevés**
- **Imprimer relevé PDF**: POST /api/releves/imprimer

### 🧪 **6. Tests Complets**
- **Workflow Complet**: Test d'un scénario utilisateur complet

## 🔧 Utilisation Recommandée

### Workflow Standard
```bash
1. 🔐 Authentification
   └── Initialiser Admin (une seule fois)
   └── Connexion Admin
   
2. 👥 Créer des Clients
   └── Inscription Client OU Créer un client
   
3. 🏦 Créer des Comptes
   └── Créer compte courant
   └── Créer compte épargne (optionnel)
   
4. 💳 Effectuer des Transactions
   └── Dépôt initial
   └── Retraits/Virements selon besoins
   
5. 📄 Générer des Relevés
   └── Consulter transactions
   └── Générer relevé PDF
```

### Variables Automatiques
La collection gère automatiquement:
- **jwt_token**: Token d'authentification JWT
- **client_id**: ID du client connecté/créé
- **compte_numero**: Numéro du compte créé/sélectionné
- **current_user_id**: ID de l'utilisateur connecté
- **current_role**: Rôle de l'utilisateur (ADMIN/CLIENT)

## 📋 Exemples de Données

### Inscription Client
```json
{
    "nom": "Dupont",
    "prenom": "Jean",
    "dateNaissance": "1990-05-15",
    "sexe": "M",
    "adresse": "123 Rue de la Paix, 75001 Paris",
    "telephone": "0123456789",
    "courriel": "jean.dupont@email.com",
    "nationalite": "Française",
    "username": "jean.dupont",
    "password": "motdepasse123"
}
```

### Dépôt
```json
{
    "numeroCompte": "COMPTE_123456789",
    "montant": 1000.00,
    "description": "Dépôt initial"
}
```

### Virement
```json
{
    "compteSource": "COMPTE_123456789",
    "compteDestinataire": "COMPTE_987654321",
    "montant": 250.00,
    "description": "Virement vers ami"
}
```

### Relevé
```json
{
    "numeroCompte": "COMPTE_123456789",
    "dateDebut": "2024-01-01",
    "dateFin": "2024-12-31"
}
```

## 🧪 Tests Automatisés

### Script PowerShell
```bash
# Exécuter tous les tests
./test-api-endpoints.ps1

# Le script teste automatiquement:
# ✅ Connexion au backend
# ✅ Initialisation admin
# ✅ Authentification
# ✅ Création client
# ✅ Création compte
# ✅ Transactions (dépôt/retrait)
# ✅ Consultation relevé
```

### Tests Postman Intégrés
Chaque requête inclut des tests automatiques:
```javascript
pm.test('Connexion réussie', function () {
    pm.response.to.have.status(200);
});

// Sauvegarde automatique des variables
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.globals.set('jwt_token', response.token);
}
```

## 🔒 Sécurité et Authentification

### Token JWT
- **Durée**: 24 heures par défaut
- **Stockage**: Variable d'environnement sécurisée
- **Usage**: Automatiquement ajouté aux headers des requêtes

### Permissions
- **Admin**: Accès à tous les endpoints
- **Client**: Accès limité à ses propres données
- **Validation**: Contrôle d'accès automatique côté backend

## 📈 Monitoring et Debugging

### Logs Console
```javascript
// Activés dans chaque requête
console.log('✅ Connexion admin réussie, token sauvegardé');
console.log('📊 Données reçues:', response);
```

### Variables de Debug
- **test_username**: Nom d'utilisateur généré pour les tests
- **test_email**: Email généré dynamiquement
- **test_phone**: Numéro de téléphone unique

## 🎯 Cas d'Usage Avancés

### Test de Charge
```bash
# Utiliser Postman Runner pour:
1. Créer plusieurs clients simultanément
2. Effectuer des transactions en masse
3. Générer des relevés multiples
```

### Intégration CI/CD
```bash
# Utiliser Newman (CLI Postman)
npm install -g newman
newman run Ega-Bank-API-Collection.postman_collection.json \
       -e Ega-Bank-Environment.postman_environment.json
```

### Tests de Régression
```bash
# Exécuter après chaque modification du backend
1. Lancer le script test-api-endpoints.ps1
2. Vérifier tous les endpoints
3. Valider les réponses et codes de statut
```

## 🚨 Dépannage

### Problèmes Courants

#### Backend non accessible
```bash
❌ Erreur: Connection refused
✅ Solution: Démarrer le backend sur le port 8080
```

#### Token expiré
```bash
❌ Erreur: 401 Unauthorized
✅ Solution: Re-exécuter "Connexion Admin" ou "Connexion Client"
```

#### Variables manquantes
```bash
❌ Erreur: client_id is undefined
✅ Solution: Exécuter d'abord "Inscription Client" ou "Lister tous les clients"
```

## 📞 Support

Pour toute question ou problème:
1. Vérifiez que le backend est démarré
2. Consultez les logs de la console Postman
3. Exécutez le script de test automatisé
4. Vérifiez les variables d'environnement

---

**🎉 Bonne utilisation des collections Postman Ega Bank !**