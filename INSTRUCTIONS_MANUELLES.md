# 📋 Instructions Manuelles de Démarrage

## ✅ État Actuel
- **Backend Spring Boot** : ✅ EN COURS (port 8080)
- **Base de données** : ⏳ À configurer
- **Frontend Angular** : ⏳ À démarrer manuellement

## 🎯 Étapes à Suivre

### 1. Configuration Base de Données (URGENT)

#### A. Ouvrir XAMPP
1. Démarrer XAMPP Control Panel
2. Cliquer **"Start"** pour Apache et MySQL
3. Cliquer **"Admin"** à côté de MySQL

#### B. Dans phpMyAdmin
1. Cliquer **"Nouvelle base de données"**
2. Nom : `bank_db`
3. Cliquer **"Créer"**
4. Sélectionner la base `bank_db`
5. Aller dans l'onglet **"SQL"**
6. **COPIER** tout le contenu du fichier `database/script_complet_phpmyadmin.sql`
7. **COLLER** dans la zone SQL
8. Cliquer **"Exécuter"**

### 2. Démarrer Frontend Angular

#### Option 1 : Terminal/Invite de commandes
```bash
# Ouvrir un nouveau terminal
cd bank-frontend-angular
npm start
```

#### Option 2 : PowerShell
```powershell
# Ouvrir PowerShell dans le dossier du projet
cd bank-frontend-angular
npm start
```

#### Si npm n'est pas reconnu :
```bash
# Utiliser le chemin complet
"C:\Program Files\nodejs\npm.cmd" start
```

### 3. Répondre aux Questions Angular

Quand Angular demande :
- **Analytics** : Taper `N` puis Entrée
- **Attendre** la compilation (1-2 minutes)

### 4. Vérification

Une fois tout démarré :
- **Backend** : http://localhost:8080 (déjà actif)
- **Frontend** : http://localhost:4200 (après démarrage)
- **Base de données** : Visible dans phpMyAdmin

### 5. Test de Connexion

Sur http://localhost:4200 :
- Username : `admin`
- Password : `password`

## 🚨 Problèmes Courants

### "npm n'est pas reconnu"
**Solution** : Utiliser le chemin complet ou redémarrer le terminal

### "Erreur de connexion base de données"
**Solution** : Vérifier que XAMPP MySQL est démarré

### "Page blanche sur localhost:4200"
**Solution** : Attendre la fin de la compilation Angular

## 📞 Prochaines Étapes

1. **MAINTENANT** : Configurer la base de données
2. **ENSUITE** : Démarrer le frontend
3. **ENFIN** : Tester l'application

---

**🎯 PRIORITÉ : Commencer par la base de données !**