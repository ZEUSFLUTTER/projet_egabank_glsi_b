# Tests Postman - EGA Banking API

Ce dossier contient les tests end-to-end et d'intégration pour l'API EGA Banking.

## 📁 Fichiers

### `EGA_Banking_API.postman_collection.json`
Collection Postman complète avec tous les tests automatisés pour l'API.

**Contient 6 sections principales :**
1. **Authentication** - Tests d'inscription et de connexion
2. **Clients Management** - CRUD complet pour les clients
3. **Accounts Management** - Gestion des comptes bancaires (épargne et courant)
4. **Transactions** - Tests pour dépôts, retraits et virements
5. **Account Statements** - Génération de relevés de compte
6. **Cleanup** - Nettoyage optionnel des données de test

### `EGA_Banking.postman_environment.json`
Fichier d'environnement avec toutes les variables nécessaires pour l'exécution des tests.

## 🚀 Comment utiliser

### 1. Importer dans Postman

**Option A: Via l'interface Postman**
1. Ouvrez Postman
2. Cliquez sur "Import" en haut à gauche
3. Sélectionnez les fichiers JSON ou glissez-les dans la fenêtre
4. Les collections et environnement seront importés automatiquement

**Option B: Via ligne de commande**
```bash
# Utiliser Newman (CLI Postman)
npm install -g newman
newman run postman/EGA_Banking_API.postman_collection.json \
  -e postman/EGA_Banking.postman_environment.json
```

### 2. Démarrer l'application

Avant de lancer les tests, assurez-vous que l'application est démarrée :

```bash
# Option 1: Lancer directement
java -jar target/banking-1.0.0.jar

# Option 2: Avec Docker
cd infrastructure/docker
docker-compose up
```

L'API sera disponible sur `http://localhost:8080`

### 3. Exécuter les tests

**Dans Postman Desktop:**
1. Sélectionnez l'environnement "EGA Banking - Local Development"
2. Ouvrez la collection "EGA Banking API - Complete Tests"
3. Cliquez sur "Run collection"
4. Configurez les options d'exécution si nécessaire
5. Cliquez sur "Run EGA Banking API - Complete Tests"

**Avec Newman (ligne de commande):**
```bash
# Exécuter tous les tests
newman run postman/EGA_Banking_API.postman_collection.json \
  -e postman/EGA_Banking.postman_environment.json

# Avec rapport HTML
newman run postman/EGA_Banking_API.postman_collection.json \
  -e postman/EGA_Banking.postman_environment.json \
  -r html --reporter-html-export report.html

# Avec rapport JSON
newman run postman/EGA_Banking_API.postman_collection.json \
  -e postman/EGA_Banking.postman_environment.json \
  -r json --reporter-json-export report.json
```

## 📊 Structure des tests

### Tests automatisés inclus

Chaque requête contient des tests automatiques qui vérifient :

#### Tests globaux (pour toutes les requêtes)
- ✅ Le temps de réponse est acceptable (< 3000ms)
- ✅ Le Content-Type est application/json

#### Tests par section

**Authentication**
- ✅ Code de statut correct (200)
- ✅ Réponse contient un token JWT valide
- ✅ Format du token (3 parties séparées par des points)
- ✅ Informations utilisateur présentes
- ✅ Sauvegarde automatique du token pour les requêtes suivantes

**Clients Management**
- ✅ Création client avec status 201
- ✅ Validation des champs obligatoires
- ✅ Format des données (email, téléphone, etc.)
- ✅ Récupération par ID et email
- ✅ Mise à jour des informations
- ✅ Sauvegarde automatique des IDs

**Accounts Management**
- ✅ Création de comptes épargne et courant
- ✅ Validation du numéro IBAN généré
- ✅ Types de comptes corrects (EPARGNE, COURANT)
- ✅ Champs spécifiques (taux d'intérêt, découvert autorisé)
- ✅ Récupération par ID et par numéro de compte
- ✅ Liste des comptes d'un client

**Transactions**
- ✅ Dépôts avec calcul correct du nouveau solde
- ✅ Retraits avec vérification du solde
- ✅ Virements entre comptes
- ✅ Vérification que source ≠ destination
- ✅ Test de solde insuffisant (doit échouer)
- ✅ Horodatage des transactions
- ✅ Ordre chronologique des transactions

**Account Statements**
- ✅ Génération de relevés par période
- ✅ Relevés mensuels et annuels
- ✅ Format des données retournées

## 🔄 Flux de tests End-to-End

Le scénario complet teste le cycle de vie d'un client :

1. **Inscription** → Crée un nouvel utilisateur
2. **Connexion** → Obtient un token JWT
3. **Créer Client** → Enregistre un nouveau client
4. **Créer Comptes** → Ouvre un compte épargne et un compte courant
5. **Effectuer Dépôts** → Alimente les deux comptes
6. **Effectuer Retrait** → Teste un retrait
7. **Effectuer Virement** → Transfère de l'argent entre comptes
8. **Consulter Transactions** → Vérifie l'historique
9. **Générer Relevés** → Obtient les relevés de compte
10. **Nettoyage** → Supprime les données de test (optionnel)

## 📈 Variables d'environnement

Les variables suivantes sont utilisées et mises à jour automatiquement :

| Variable | Description | Exemple |
|----------|-------------|---------|
| `baseUrl` | URL de base de l'API | `http://localhost:8080` |
| `authToken` | Token JWT d'authentification | `eyJhbGciOiJIUzI1...` |
| `clientId` | ID du client créé | `1` |
| `clientEmail` | Email du client | `john.doe@example.com` |
| `savingsAccountId` | ID du compte épargne | `1` |
| `savingsAccountNumber` | Numéro IBAN du compte épargne | `TG2012345678901234567890` |
| `currentAccountId` | ID du compte courant | `2` |
| `currentAccountNumber` | Numéro IBAN du compte courant | `TG2098765432109876543210` |
| `depositTransactionId` | ID de la transaction de dépôt | `1` |
| `startDate` | Date de début pour les relevés | `2024-01-01T00:00:00Z` |
| `endDate` | Date de fin pour les relevés | `2024-12-31T23:59:59Z` |
| `currentYear` | Année en cours | `2024` |
| `currentMonth` | Mois en cours | `12` |

## 🎯 Cas de test couverts

### Tests positifs ✅
- Création et authentification d'utilisateurs
- CRUD complet sur les clients
- Création de différents types de comptes
- Transactions bancaires valides
- Génération de relevés de compte

### Tests négatifs ❌
- Tentative de retrait avec solde insuffisant
- Virement vers le même compte (si implémenté)
- Authentification avec credentials invalides

### Tests d'intégration 🔗
- Flux complet de bout en bout
- Enchaînement des opérations avec dépendances
- Vérification de la cohérence des données
- Tests de navigation entre ressources liées

## 📝 Exemples de requêtes

### Authentication
```bash
# Register
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "Test123!@#",
    "email": "test@egabank.com",
    "nom": "Test",
    "prenom": "User"
  }'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "Test123!@#"
  }'
```

### Clients
```bash
# Create Client
curl -X POST http://localhost:8080/api/clients \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Doe",
    "prenom": "John",
    "dateNaissance": "1990-05-15",
    "sexe": "M",
    "adresse": "123 Main Street, Lomé, Togo",
    "telephone": "+22890123456",
    "email": "john.doe@example.com",
    "nationalite": "Togolaise"
  }'
```

### Transactions
```bash
# Deposit
curl -X POST http://localhost:8080/api/transactions/depot \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "compteId": 1,
    "montant": 1000.00,
    "description": "Dépôt initial"
  }'

# Transfer
curl -X POST http://localhost:8080/api/transactions/virement \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "compteSourceId": 1,
    "compteDestinationId": 2,
    "montant": 300.00,
    "description": "Virement épargne"
  }'
```

## 🐛 Dépannage

### L'application ne démarre pas
```bash
# Vérifier que Java 17 est bien installé
java -version

# Vérifier que le port 8080 n'est pas déjà utilisé
lsof -i :8080

# Si nécessaire, changer le port dans application.yml
server:
  port: 8081
```

### Les tests échouent
1. Vérifiez que l'application est bien démarrée
2. Vérifiez que `baseUrl` pointe vers la bonne URL
3. Exécutez les tests dans l'ordre (ou utilisez "Run collection")
4. Consultez les logs de l'application pour plus de détails

### Erreur 401 Unauthorized
- Le token JWT a peut-être expiré (durée: 24h)
- Relancez la requête "Login" pour obtenir un nouveau token

## 📚 Documentation API

Pour une documentation interactive complète de l'API :

```
http://localhost:8080/swagger-ui.html
```

## 🤝 Contribution

Pour ajouter de nouveaux tests :
1. Ajoutez la requête dans la section appropriée
2. Incluez les tests automatiques dans l'onglet "Tests"
3. Mettez à jour les variables d'environnement si nécessaire
4. Documentez les nouveaux cas de test dans ce README

## 📄 License

Ce projet est sous licence privée - EGA Banking System.
