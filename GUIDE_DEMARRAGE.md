# Guide de Démarrage - Système Bancaire EGA

## 🚀 Démarrage du Système Complet

### 1. Prérequis
- **Java 17+** pour le backend Spring Boot
- **Node.js 18+** et **npm** pour le frontend Angular
- **Base de données H2** (intégrée) ou **PostgreSQL** (optionnel)

### 2. Démarrage du Backend

```bash
# Aller dans le dossier backend
cd ega-backend

# Démarrer l'application Spring Boot
./mvnw spring-boot:run

# Ou sur Windows
mvnw.cmd spring-boot:run
```

**Le backend sera accessible sur :** `http://localhost:8080`

### 3. Démarrage du Frontend

```bash
# Aller dans le dossier frontend
cd ega-frontend

# Installer les dépendances (première fois seulement)
npm install

# Démarrer le serveur de développement
ng serve

# Ou avec npm
npm start
```

**Le frontend sera accessible sur :** `http://localhost:4200`

### 4. Vérification du Système

#### Test Backend
```bash
# Tester la santé de l'application
curl http://localhost:8080/actuator/health

# Tester la connexion admin
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin@123"}'
```

#### Test Frontend
- Ouvrir `http://localhost:4200` dans le navigateur
- Se connecter avec : `admin` / `Admin@123`

## 🔧 Configuration

### Base de Données
Le système utilise H2 par défaut (base en mémoire). Pour PostgreSQL :

1. Modifier `ega-backend/src/main/resources/application.yml`
2. Configurer les paramètres de connexion PostgreSQL
3. Redémarrer le backend

### Utilisateurs par Défaut
- **Admin** : `admin` / `Admin@123`
- **Client** : Créé via l'interface admin

## 📋 Fonctionnalités Disponibles

### Pour les Administrateurs
- ✅ **Dashboard global** avec statistiques système
- ✅ **Gestion des clients** (CRUD complet)
- ✅ **Gestion des comptes** (tous les comptes)
- ✅ **Toutes les transactions** du système
- ✅ **Détails complets** de chaque client
- ✅ **Création de comptes** avec solde initial
- ✅ **Interface avec icônes** moderne

### Pour les Clients
- ✅ **Dashboard personnel** avec leurs stats
- ✅ **Gestion de leurs comptes** (CRUD)
- ✅ **Leurs transactions** uniquement
- ✅ **Profil personnel** complet
- ✅ **Statistiques financières** (revenus/dépenses)

## 🎯 Pages Principales

### Navigation Admin
1. **Dashboard** - `/dashboard`
2. **Gestion Clients** - `/admin-clients`
3. **Détails Client** - `/client-details/:id`
4. **Comptes** - `/accounts`
5. **Détails Compte** - `/account-details/:id`
6. **Transactions** - `/transactions`
7. **Profil** - `/profile`

### Navigation Client
1. **Dashboard** - `/dashboard`
2. **Mes Comptes** - `/accounts`
3. **Détails Compte** - `/account-details/:id`
4. **Mes Transactions** - `/transactions`
5. **Mon Profil** - `/profile`

## 🔐 Sécurité

### Authentification
- **JWT Tokens** pour l'authentification
- **Rôles** : ADMIN, CLIENT
- **Guards Angular** pour protéger les routes
- **Spring Security** pour sécuriser les endpoints

### Autorisations
- **Admins** : Accès complet au système
- **Clients** : Accès uniquement à leurs données
- **Endpoints protégés** par rôle avec `@PreAuthorize`

## 🧪 Tests

### Scripts de Test Disponibles
```bash
# Test complet du système
.\test_complete_system.ps1

# Test des endpoints dashboard
.\test_dashboard_endpoints.ps1

# Test des endpoints comptes
.\test_accounts_endpoints.ps1

# Test API général
.\test_api.ps1
```

### Tests Manuels
1. **Connexion Admin** : Vérifier l'accès aux fonctionnalités admin
2. **Création Client** : Créer un nouveau client
3. **Création Compte** : Créer un compte avec solde initial
4. **Transactions** : Vérifier l'affichage des transactions
5. **Navigation** : Tester tous les liens et boutons

## 🐛 Dépannage

### Erreurs Communes

#### Backend ne démarre pas
```bash
# Vérifier Java
java -version

# Nettoyer et recompiler
./mvnw clean install
./mvnw spring-boot:run
```

#### Frontend ne compile pas
```bash
# Nettoyer node_modules
rm -rf node_modules package-lock.json
npm install

# Vérifier Angular CLI
ng version
```

#### Erreurs 500 sur les API
1. Vérifier que le backend est démarré
2. Vérifier les logs du backend
3. Tester les endpoints avec curl/Postman

#### Problèmes de CORS
- Le backend est configuré pour accepter `http://localhost:4200`
- Vérifier la configuration dans `SecurityConfig.java`

### Logs Utiles
- **Backend** : Console Spring Boot
- **Frontend** : Console du navigateur (F12)
- **Réseau** : Onglet Network des DevTools

## 📊 Monitoring

### Endpoints de Santé
- **Health Check** : `GET /actuator/health`
- **Métriques** : `GET /actuator/metrics`
- **Info** : `GET /actuator/info`

### Base de Données H2
- **Console H2** : `http://localhost:8080/h2-console`
- **JDBC URL** : `jdbc:h2:mem:testdb`
- **Username** : `sa`
- **Password** : (vide)

## 🚀 Déploiement Production

### Backend
```bash
# Construire le JAR
./mvnw clean package

# Lancer en production
java -jar target/ega-backend-1.0.0.jar
```

### Frontend
```bash
# Build de production
ng build --prod

# Servir les fichiers statiques
# (utiliser nginx, Apache, ou un CDN)
```

## 📞 Support

En cas de problème :
1. Vérifier ce guide de dépannage
2. Consulter les logs d'erreur
3. Tester les endpoints individuellement
4. Vérifier la configuration des ports (8080, 4200)

Le système est maintenant prêt pour utilisation ! 🎉