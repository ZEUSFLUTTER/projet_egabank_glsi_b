# Guide d'Installation - Ega Bank Application

## 📋 Informations de la Base de Données

**Nom de la base de données MongoDB : `ega_bank`**

- **URI complète** : `mongodb://localhost:27017/ega_bank`
- **Host** : `localhost`
- **Port** : `27017`
- **Base de données** : `ega_bank`

## 🔧 Étape 1 : Installation de MongoDB

### Option A : Installation Windows (Recommandé)

1. **Télécharger MongoDB Community Server**
   - Allez sur : https://www.mongodb.com/try/download/community
   - Sélectionnez :
     - Version : 7.0 (ou la dernière version stable)
     - Platform : Windows
     - Package : MSI
   - Cliquez sur "Download"

2. **Installer MongoDB**
   - Exécutez le fichier MSI téléchargé
   - Choisissez "Complete" installation
   - Cochez "Install MongoDB as a Service"
   - Cochez "Install MongoDB Compass" (interface graphique - optionnel mais recommandé)
   - Cliquez sur "Install"

3. **Vérifier l'installation**
   - MongoDB devrait démarrer automatiquement comme service Windows
   - Vérifiez dans les Services Windows (Win + R, tapez `services.msc`)
   - Cherchez "MongoDB" et vérifiez qu'il est "En cours d'exécution"

### Option B : Installation avec Docker (Alternative)

Si vous avez Docker installé :

```bash
docker run -d -p 27017:27017 --name mongodb-ega mongo:latest
```

### Option C : MongoDB Atlas (Cloud - Gratuit)

1. Créez un compte gratuit sur https://www.mongodb.com/cloud/atlas
2. Créez un cluster gratuit
3. Obtenez votre URI de connexion
4. Modifiez `application.properties` :
   ```properties
   spring.data.mongodb.uri=mongodb+srv://username:password@cluster.mongodb.net/ega_bank
   ```

## 🚀 Étape 2 : Démarrer le Backend

### Méthode 1 : Avec le script batch (Windows)
```bash
cd "Ega backend/Ega-backend"
start-backend.bat
```

### Méthode 2 : Avec Maven Wrapper
```bash
cd "Ega backend/Ega-backend"
.\mvnw.cmd spring-boot:run
```

### Méthode 3 : Avec Maven (si installé)
```bash
cd "Ega backend/Ega-backend"
mvn spring-boot:run
```

Le backend démarrera sur : **http://localhost:8080**

## 🌐 Étape 3 : Démarrer le Frontend

```bash
cd frontend-angular
npm install  # Si c'est la première fois
npm start
# ou
ng serve
```

Le frontend démarrera sur : **http://localhost:4200**

## ✅ Vérification

1. **Vérifier MongoDB** :
   - Ouvrez MongoDB Compass ou un terminal
   - Connectez-vous à `mongodb://localhost:27017`
   - Vous devriez voir la base de données `ega_bank` après le premier démarrage

2. **Vérifier le Backend** :
   - Ouvrez : http://localhost:8080/api/auth/login
   - Vous devriez voir une réponse (même si c'est une erreur, cela signifie que le serveur fonctionne)

3. **Vérifier le Frontend** :
   - Ouvrez : http://localhost:4200
   - Vous devriez être redirigé vers la page de connexion

## 🐛 Dépannage

### MongoDB ne démarre pas
- Vérifiez que le port 27017 n'est pas utilisé par une autre application
- Vérifiez les logs MongoDB dans `C:\Program Files\MongoDB\Server\7.0\log\mongod.log`

### L'application ne peut pas se connecter à MongoDB
- Vérifiez que MongoDB est en cours d'exécution
- Vérifiez l'URI dans `application.properties`
- Essayez de vous connecter avec MongoDB Compass

### Le frontend affiche toujours la page par défaut
- Videz le cache du navigateur (Ctrl + Shift + Delete)
- Redémarrez le serveur Angular
- Vérifiez que vous êtes sur http://localhost:4200 (pas 4201)

## 📝 Collections MongoDB créées automatiquement

Après le premier démarrage, ces collections seront créées dans `ega_bank` :
- `clients` - Informations des clients
- `comptes` - Comptes bancaires  
- `transactions` - Historique des transactions
- `users` - Utilisateurs pour l'authentification

## 🎯 Première utilisation

1. Démarrez MongoDB
2. Démarrez le backend (port 8080)
3. Démarrez le frontend (port 4200)
4. Allez sur http://localhost:4200
5. Cliquez sur "S'inscrire" pour créer un compte
6. Connectez-vous avec vos identifiants
