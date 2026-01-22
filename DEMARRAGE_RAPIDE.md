# 🚀 Démarrage Rapide - Système Bancaire EGA

## ✅ État Actuel
- Backend Spring Boot : **EN COURS** (port 8080)
- Frontend Angular : **À DÉMARRER**
- Base de données : **À CONFIGURER**

## 📋 Étapes de Démarrage

### 1. Configuration Base de Données (OBLIGATOIRE)

#### A. Démarrer XAMPP
1. Ouvrir XAMPP Control Panel
2. Démarrer **Apache** et **MySQL**
3. Cliquer sur **Admin** à côté de MySQL (ouvre phpMyAdmin)

#### B. Créer la base de données
1. Dans phpMyAdmin, cliquer sur **"Nouvelle base de données"**
2. Nom : `bank_db`
3. Cliquer **"Créer"**

#### C. Exécuter le script SQL
1. Sélectionner la base `bank_db` (cliquer dessus)
2. Aller dans l'onglet **"SQL"**
3. **COPIER TOUT LE CONTENU** du fichier `database/script_complet_phpmyadmin.sql`
4. **COLLER** dans la zone de texte
5. Cliquer **"Exécuter"**

### 2. Démarrer le Frontend Angular

#### Option A : Commande manuelle
```bash
cd bank-frontend-angular
npm start
```

#### Option B : Script automatique
Double-cliquer sur le fichier `start-angular.bat`

### 3. Accéder à l'application

Une fois tout démarré :
- **Frontend** : http://localhost:4200
- **Backend API** : http://localhost:8080

### 4. Connexion

Utiliser un de ces comptes de test :
- **Admin** : `admin` / `password`
- **User** : `user` / `password`

## 🔧 Résolution de Problèmes

### Problème : "npm n'est pas reconnu"
**Solution** : Utiliser le script `start-angular.bat`

### Problème : Erreur de connexion base de données
**Solution** : Vérifier que XAMPP MySQL est démarré et que le script SQL a été exécuté

### Problème : Page blanche sur localhost:4200
**Solution** : Attendre que la compilation Angular soit terminée (peut prendre 1-2 minutes)

## ✅ Vérification du Succès

1. **Base de données** : Voir les tables dans phpMyAdmin
2. **Backend** : http://localhost:8080 affiche une page
3. **Frontend** : http://localhost:4200 affiche la page de connexion
4. **Connexion** : Pouvoir se connecter avec admin/password

---

**🎯 PROCHAINE ÉTAPE : Configurer la base de données dans phpMyAdmin**