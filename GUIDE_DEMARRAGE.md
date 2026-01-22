# 🚀 Guide de Démarrage EgaBank

## Problèmes résolus dans cette version :

### ✅ **Connexion Admin**
- L'admin doit être créé via l'endpoint `/api/auth/init-admin`
- Utilisez le script `init-admin-http.ps1` pour créer l'admin automatiquement
- Identifiants par défaut : `admin` / `Admin@123`

### ✅ **Inscription Client** 
- Correction du format de date (accepte maintenant les dates au format YYYY-MM-DD)
- Amélioration de la gestion d'erreur
- Support du CORS pour le port 4201

## 📋 Étapes de démarrage :

### 1. **Démarrer MongoDB**
```bash
# Assurez-vous que MongoDB est installé et démarré
mongod
```

### 2. **Démarrer le Backend**
```bash
cd "Ega backend/Ega-backend"
# Si Java est configuré :
./mvnw spring-boot:run

# Sinon, configurez JAVA_HOME ou utilisez un IDE comme IntelliJ
```

### 3. **Démarrer le Frontend**
```bash
cd frontend-angular
ng serve --port 4201
```

### 4. **Créer l'Admin**
```powershell
# Exécutez le script PowerShell
./init-admin-http.ps1
```

### 5. **Tester l'application**
- Frontend : http://localhost:4201
- Backend : http://localhost:8080
- Connexion admin : `admin` / `Admin@123`

## 🔧 Corrections apportées :

### Backend :
- ✅ Ajout de `@JsonFormat(pattern = "yyyy-MM-dd")` pour les dates
- ✅ Support CORS pour les ports 4200 et 4201
- ✅ Endpoint `/init-admin` pour créer l'administrateur

### Frontend :
- ✅ Amélioration des messages d'erreur
- ✅ Logs de débogage pour identifier les problèmes
- ✅ Gestion correcte des erreurs de connexion serveur

## 🐛 Dépannage :

### Problème : "Impossible de se connecter au serveur"
- Vérifiez que le backend est démarré sur le port 8080
- Vérifiez que MongoDB est en cours d'exécution

### Problème : "JAVA_HOME not defined"
- Installez Java 17+ 
- Configurez la variable d'environnement JAVA_HOME
- Ou utilisez un IDE comme IntelliJ IDEA

### Problème : "L'admin existe déjà"
- L'admin a déjà été créé, utilisez les identifiants par défaut
- Username: `admin`, Password: `Admin@123`

## 📞 Support :
Si vous rencontrez des problèmes, vérifiez :
1. MongoDB est démarré
2. Backend est démarré (port 8080)
3. Frontend est démarré (port 4201)
4. Les logs dans la console du navigateur (F12)