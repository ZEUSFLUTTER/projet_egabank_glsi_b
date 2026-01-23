# 🚨 Configuration Base de Données URGENTE

## Problème Actuel
L'erreur **403 Forbidden** sur `/api/auth/login` est due au fait que la base de données n'est pas configurée.

## ✅ Solution Temporaire Appliquée
J'ai ajouté une authentification mock dans le backend qui permet de tester l'application avec :
- **admin** / **password**
- **user** / **password**

## 🎯 Configuration Définitive de la Base de Données

### Étape 1 : Démarrer XAMPP
1. Ouvrir **XAMPP Control Panel**
2. Cliquer **"Start"** pour **Apache**
3. Cliquer **"Start"** pour **MySQL**
4. Attendre que les deux services soient verts

### Étape 2 : Accéder à phpMyAdmin
1. Cliquer **"Admin"** à côté de MySQL dans XAMPP
2. Ou aller directement sur : http://localhost/phpmyadmin

### Étape 3 : Créer la Base de Données
1. Dans phpMyAdmin, cliquer **"Nouvelle base de données"**
2. Nom : `bank_db`
3. Cliquer **"Créer"**

### Étape 4 : Exécuter le Script SQL
1. **Sélectionner** la base `bank_db` (cliquer dessus)
2. Aller dans l'onglet **"SQL"**
3. **COPIER** tout le contenu du fichier `database/script_complet_phpmyadmin.sql`
4. **COLLER** dans la zone de texte SQL
5. Cliquer **"Exécuter"**

### Étape 5 : Vérifier l'Installation
Tu devrais voir :
- ✅ 4 tables créées : users, clients, comptes, transactions
- ✅ Données de test insérées
- ✅ Message de succès

### Étape 6 : Redémarrer le Backend
1. Arrêter le backend (Ctrl+C dans le terminal)
2. Redémarrer avec : `./mvnw spring-boot:run`

## 🧪 Test de Fonctionnement

### Avec Base de Données Configurée
- Username : `admin` / Password : `password`
- Username : `user` / Password : `password`

### Sans Base de Données (Mode Mock)
- Mêmes identifiants, mais fonctionnalités limitées

## 📊 Vérification

### Backend Fonctionne
- http://localhost:8080/api/auth/test → "Backend is working!"

### Frontend Fonctionne  
- http://localhost:4200 → Page de connexion

### Base de Données Fonctionne
- phpMyAdmin → Base `bank_db` avec 4 tables

## 🎯 Prochaines Étapes

1. **MAINTENANT** : Configurer la base de données
2. **ENSUITE** : Redémarrer le backend
3. **ENFIN** : Tester la connexion sur http://localhost:4200

---

**⚡ PRIORITÉ : Configurer la base de données pour avoir toutes les fonctionnalités !**