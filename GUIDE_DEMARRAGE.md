# Guide de Démarrage - Système Bancaire EGA

## Vue d'ensemble du projet

Ce projet est un système bancaire complet développé avec :
- **Backend** : Spring Boot (Java) avec API REST, JWT, MySQL
- **Frontend** : Angular 17 avec Angular Material
- **Base de données** : MySQL (XAMPP)

## État actuel du projet

✅ **Backend Spring Boot** : Complètement implémenté et fonctionnel
- API REST complète (clients, comptes, transactions)
- Authentification JWT
- Gestion des exceptions
- Validation des données
- Fonctionne sur http://localhost:8080

✅ **Base de données MySQL** : Scripts créés et prêts
- Tables : users, clients, comptes, transactions
- Données de test incluses
- Script complet dans `database/script_complet_phpmyadmin.sql`

✅ **Frontend Angular** : Complètement implémenté
- Authentification (login/register)
- Dashboard avec statistiques
- Gestion complète des clients (CRUD)
- Gestion des comptes
- Gestion des transactions avec filtres
- Interface moderne avec Angular Material

## Instructions de démarrage

### 1. Base de données (XAMPP MySQL)

1. **Démarrer XAMPP** et activer MySQL
2. **Ouvrir phpMyAdmin** (http://localhost/phpmyadmin)
3. **Créer la base de données** :
   - Cliquer sur "Nouvelle base de données"
   - Nom : `bank_db`
   - Cliquer sur "Créer"
4. **Exécuter le script SQL** :
   - Sélectionner la base `bank_db`
   - Aller dans l'onglet "SQL"
   - Copier tout le contenu du fichier `database/script_complet_phpmyadmin.sql`
   - Coller et cliquer sur "Exécuter"

### 2. Backend Spring Boot

Le backend est déjà en cours d'exécution. Si ce n'est pas le cas :

```bash
# Dans le répertoire racine du projet
./mvnw spring-boot:run
```

Le backend sera accessible sur : http://localhost:8080

### 3. Frontend Angular

#### Option 1 : Démarrage manuel
```bash
# Aller dans le répertoire Angular
cd bank-frontend-angular

# Installer les dépendances (déjà fait)
npm install

# Démarrer le serveur de développement
npm start
```

#### Option 2 : Utiliser le script batch
Double-cliquer sur `start-angular.bat`

Le frontend sera accessible sur : http://localhost:4200

## Comptes de test

Une fois l'application démarrée, vous pouvez vous connecter avec :

- **Administrateur** :
  - Username : `admin`
  - Password : `password`

- **Utilisateur** :
  - Username : `user`
  - Password : `password`

## Fonctionnalités disponibles

### Dashboard
- Vue d'ensemble des statistiques
- Nombre total de clients, comptes, transactions
- Solde total du système
- Actions rapides

### Gestion des clients
- ✅ Liste de tous les clients
- ✅ Création de nouveaux clients
- ✅ Modification des informations client
- ✅ Visualisation des détails client
- ✅ Suppression de clients
- ✅ Gestion des comptes par client

### Gestion des comptes
- ✅ Liste de tous les comptes
- ✅ Création de comptes (courant/épargne)
- ✅ Visualisation des détails
- ✅ Statistiques des comptes

### Gestion des transactions
- ✅ Liste des transactions avec filtres
- ✅ Filtrage par compte, type, période
- ✅ Création de transactions (dépôt/retrait/virement)
- ✅ Historique complet
- ✅ Statistiques des transactions

## Architecture technique

### Backend (Spring Boot)
```
src/main/java/com/ega/bank/bank_api/
├── controller/     # Contrôleurs REST
├── service/        # Logique métier
├── repository/     # Accès aux données
├── entity/         # Entités JPA
├── dto/           # Objets de transfert
├── security/      # Configuration sécurité
└── exception/     # Gestion des exceptions
```

### Frontend (Angular)
```
src/app/
├── core/
│   ├── guards/      # Protection des routes
│   ├── services/    # Services Angular
│   └── models/      # Modèles TypeScript
├── features/
│   ├── auth/        # Authentification
│   ├── dashboard/   # Tableau de bord
│   ├── clients/     # Gestion clients
│   ├── comptes/     # Gestion comptes
│   └── transactions/ # Gestion transactions
└── shared/          # Composants partagés
```

## Résolution des problèmes

### Problème : npm/ng non reconnu
**Solution** : Redémarrer le terminal ou utiliser les scripts batch fournis

### Problème : Erreur de connexion à la base
**Solution** : Vérifier que XAMPP MySQL est démarré et que le script SQL a été exécuté

### Problème : Erreur CORS
**Solution** : Le backend est configuré pour accepter les requêtes depuis localhost:4200

### Problème : Erreur d'authentification
**Solution** : Utiliser les comptes de test fournis (admin/password ou user/password)

## Tests de l'application

1. **Connexion** : Tester avec admin/password
2. **Dashboard** : Vérifier les statistiques
3. **Clients** : Créer, modifier, supprimer un client
4. **Comptes** : Créer un compte pour un client
5. **Transactions** : Effectuer un dépôt, retrait, virement

## Développement futur

Le système est prêt pour :
- ✅ Ajout de nouvelles fonctionnalités
- ✅ Personnalisation de l'interface
- ✅ Intégration de nouveaux services
- ✅ Déploiement en production

## Support

En cas de problème :
1. Vérifier que tous les services sont démarrés
2. Consulter les logs dans la console
3. Vérifier la configuration de la base de données
4. S'assurer que les ports 8080 et 4200 sont libres