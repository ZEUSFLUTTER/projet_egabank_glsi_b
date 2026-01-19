# Système de Gestion Bancaire - Backend

Ce projet est une API REST développée avec Spring Boot pour la gestion des clients, des comptes bancaires et des transactions.

## Fonctionnalités Implémentées

### 1. Gestion des Clients (CRUD)
- **Créer un client** : Enregistre les informations personnelles (nom, prénom, date de naissance, sexe, adresse, téléphone, email, nationalité).
- **Lister les clients** : Récupère la liste de tous les clients.
- **Détails d'un client** : Récupère les informations d'un client par son ID.
- **Modifier un client** : Met à jour les informations d'un client.
- **Supprimer un client** : Supprime un client du système.

### 2. Gestion des Comptes (CRUD)
- **Créer un compte** : Génère automatiquement un numéro de compte IBAN unique (via `iban4j`). Le solde initial est de 0.
- **Types de comptes** : Supporte les comptes `COURANT` et `EPARGNE`.
- **Lister les comptes** : Voir tous les comptes existants.
- **Détails d'un compte** : Rechercher par numéro de compte.

### 3. Opérations Bancaires (Transactions)
- **Dépôt (Versement)** : Créditer un montant sur un compte.
- **Retrait** : Débiter un montant si le solde est suffisant.
- **Virement** : Transférer un montant d'un compte source vers un compte destinataire.
- **Historique** : Consulter les transactions d'un compte sur une période donnée (date de début et de fin).
- **Relevé Bancaire** : Générer un récapitulatif textuel des opérations pour impression.

### 4. Sécurité et Fiabilité
- **Authentification JWT** : Sécurisation de tous les endpoints (sauf `/api/auth/**`).
- **Validation des données** : Utilisation de Jakarta Validation pour assurer la conformité des entrées.
- **Gestion Globale des Exceptions** : Renvoie des messages d'erreur clairs et formattés en cas de problème (ressource non trouvée, solde insuffisant, erreur de validation).

---

## Guide des Endpoints

### Authentification
- `POST /api/auth/login` : Se connecter pour obtenir un jeton JWT.
  - *Identifiants par défaut* : `admin` / `admin123`

### Clients (`/api/clients`)
- `POST /` : Créer un client.
- `GET /` : Liste de tous les clients.
- `GET /{id}` : Détails d'un client.
- `PUT /{id}` : Modifier un client.
- `DELETE /{id}` : Supprimer un client.

### Comptes (`/api/accounts`)
- `POST /` : Créer un compte pour un client.
- `GET /` : Liste des comptes.
- `GET /{accountNumber}` : Détails d'un compte.

### Transactions (`/api/transactions`)
- `POST /deposit` : Effectuer un dépôt.
- `POST /withdraw` : Effectuer un retrait.
- `POST /transfer` : Effectuer un virement.
- `GET /history/{accountNumber}?start=...&end=...` : Historique des transactions.
- `GET /statement/{accountNumber}?start=...&end=...` : Générer le relevé (format texte).

---

## Validation et Tests
- Le projet inclut une configuration H2 pour les tests rapides.
- Les validateurs sont présents sur les entités et les DTOs.
- Un utilisateur par défaut est configuré en mémoire pour les tests initiaux.
