# Guide d'Installation - EGA Bank Frontend

## 📋 Prérequis

- **Node.js** version 18 ou supérieure
- **npm** (installé avec Node.js)
- **Backend Spring Boot** en cours d'exécution sur `http://localhost:8080`

## 🚀 Installation

### 1. Extraire le projet

Extrayez le fichier ZIP dans le répertoire de votre choix.

### 2. Installer les dépendances

```bash
cd ega-bank-frontend
npm install
```

Cette commande peut prendre quelques minutes pour télécharger toutes les dépendances nécessaires.

### 3. Lancer l'application

```bash
npm start
```

L'application sera accessible sur **http://localhost:4200**

## 🔧 Configuration

### Modifier l'URL de l'API

Si votre backend n'est pas sur `http://localhost:8080`, modifiez les fichiers suivants:

- `src/app/services/auth.service.ts`
- `src/app/services/admin.service.ts`
- `src/app/services/compte.service.ts`
- `src/app/services/transaction.service.ts`

Remplacez `http://localhost:8080` par votre URL.

## 📦 Build pour la production

```bash
npm run build:prod
```

Les fichiers optimisés seront dans le dossier `dist/ega-bank-frontend/`

## 🎯 Comptes de test

### Admin
- Email: `admin@egabank.com`
- Mot de passe: (celui que vous avez créé)

### Client
- Créez un compte via la page d'inscription

## 🐛 Dépannage

### Port 4200 déjà utilisé

```bash
ng serve --port 4300
```

### Problèmes de CORS

Vérifiez que le backend autorise les requêtes depuis `http://localhost:4200`

### Erreurs npm install

```bash
rm -rf node_modules package-lock.json
npm install
```

## 📱 Accès depuis un mobile

Pour tester sur mobile:

```bash
ng serve --host 0.0.0.0
```

Puis accédez via l'IP de votre ordinateur : `http://192.168.x.x:4200`

## ✅ Vérification

Une fois l'application lancée:

1. Ouvrez **http://localhost:4200**
2. Vous devriez voir la page de connexion
3. Créez un compte ou connectez-vous avec un compte existant

## 📞 Support

En cas de problème, vérifiez:
- Que Node.js est bien installé : `node --version`
- Que le backend Spring Boot est lancé
- Les logs de la console du navigateur (F12)

---

**EGA Bank** © 2026
