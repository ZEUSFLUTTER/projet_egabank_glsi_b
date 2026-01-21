# Collection Postman - EgaBank API

Ce document explique comment utiliser la collection Postman pour tester toutes les APIs de l'application EgaBank.

## Installation

1. **Ouvrir Postman** (télécharger depuis https://www.postman.com/downloads/ si nécessaire)

2. **Importer la collection**
   - Cliquer sur **Import** dans Postman
   - Sélectionner le fichier `EGABANK_Postman_Collection.json`
   - La collection "EgaBank API Collection" sera ajoutée

## Configuration

### Variables d'environnement

La collection utilise deux variables :

1. **`base_url`** : URL de base de l'API (par défaut: `http://localhost:8081/api`)
2. **`jwt_token`** : Token JWT pour l'authentification (auto-rempli après connexion)

Ces variables sont définies au niveau de la collection et peuvent être modifiées si nécessaire.

## Utilisation

### Étape 1 : Authentification

1. **Inscription** (optionnel, si vous n'avez pas encore de compte)
   - Exécuter la requête **"Authentification > Inscription"**
   - Modifier les valeurs `nomUtilisateur`, `motDePasse`, et `role` si nécessaire

2. **Connexion**
   - Exécuter la requête **"Authentification > Connexion"**
   - Le token JWT sera automatiquement enregistré dans la variable `jwt_token`
   - Ce token sera utilisé pour toutes les autres requêtes nécessitant une authentification

### Étape 2 : Tests des APIs

Une fois authentifié, vous pouvez tester tous les endpoints :

#### Clients (CRUD complet)
- **Lister tous les clients** : `GET /api/clients`
- **Créer un client** : `POST /api/clients`
- **Obtenir un client par ID** : `GET /api/clients/{id}`
- **Modifier un client** : `PUT /api/clients/{id}`
- **Supprimer un client** : `DELETE /api/clients/{id}`

#### Comptes (CRUD complet)
- **Lister tous les comptes** : `GET /api/comptes`
- **Créer un compte courant** : `POST /api/comptes/courant`
- **Créer un compte épargne** : `POST /api/comptes/epargne`
- **Consulter un compte** : `GET /api/comptes/{numeroCompte}`
- **Modifier un compte courant** : `PUT /api/comptes/courant/{numeroCompte}`
- **Modifier un compte épargne** : `PUT /api/comptes/epargne/{numeroCompte}`
- **Supprimer un compte** : `DELETE /api/comptes/{numeroCompte}`

#### Opérations bancaires
- **Effectuer un dépôt** : `POST /api/comptes/depot`
- **Effectuer un retrait** : `POST /api/comptes/retrait`
- **Effectuer un virement** : `POST /api/comptes/virement`

#### Transactions
- **Lister toutes les transactions** : `GET /api/transactions`
- **Lister les transactions par période** : `GET /api/transactions/{numeroCompte}?dateDebut=...&dateFin=...`

#### Relevés
- **Télécharger un relevé PDF** : `GET /api/releves/{numeroCompte}?dateDebut=...&dateFin=...`

## Notes importantes

1. **Authentification** : Toutes les requêtes (sauf `/api/auth/**`) nécessitent un token JWT valide dans le header `Authorization: Bearer {token}`

2. **Ordre recommandé pour les tests** :
   - Créer d'abord un client
   - Créer un compte (courant ou épargne) pour ce client
   - Effectuer des opérations (dépôt, retrait, virement)
   - Consulter les transactions
   - Télécharger un relevé

3. **Variables dans les requêtes** :
   - Les numéros de compte sont des variables : `{{numeroCompte}}` - remplacer par un IBAN réel
   - Les IDs de clients sont des variables : `{{id}}` - remplacer par un ID réel

4. **Format des dates** : Utiliser le format `YYYY-MM-DD` pour les dates (ex: `2024-01-01`)

5. **Suppression de compte** : Un compte ne peut être supprimé que s'il n'a aucune transaction associée

## Exemples de données

### Création d'un client
```json
{
    "nom": "Dupont",
    "prenom": "Jean",
    "dateNaissance": "1990-01-15",
    "sexe": "MASCULIN",
    "adresse": "123 Rue de la République, Paris",
    "numeroTelephone": "0612345678",
    "courriel": "jean.dupont@email.com",
    "nationalite": "Française"
}
```

### Création d'un compte courant
```json
{
    "idClient": 1,
    "decouvertAutorise": 500.0
}
```

### Opération (dépôt/retrait)
```json
{
    "numeroCompte": "FR1234567890123456789012345",
    "montant": 1000.0,
    "libelle": "Dépôt initial"
}
```

## Résolution de problèmes

- **Erreur 401 (Unauthorized)** : Vérifier que vous êtes bien connecté et que le token JWT est valide
- **Erreur 404 (Not Found)** : Vérifier que l'ID ou le numéro de compte existe
- **Erreur 400 (Bad Request)** : Vérifier le format des données envoyées et les validations
- **Erreur de connexion** : Vérifier que le backend est lancé sur `http://localhost:8081`
