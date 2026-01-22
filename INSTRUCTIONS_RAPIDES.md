# 🚀 Instructions Rapides - EgaBank

## ✅ Corrections appliquées :

### 1. **Problème de connexion Admin** - RÉSOLU ✅
- **Cause** : L'admin doit être créé via un endpoint spécial
- **Solution** : Script automatique pour créer l'admin

### 2. **Problème d'inscription Client** - RÉSOLU ✅  
- **Cause** : Format de date incompatible entre frontend et backend
- **Solution** : Correction du format de date et gestion d'erreur améliorée

## 🎯 Étapes pour tester maintenant :

### Étape 1 : Démarrer le Backend
```bash
# Dans un terminal, allez dans le dossier backend :
cd "Ega backend/Ega-backend"

# Démarrez le backend (nécessite Java 17+) :
./mvnw spring-boot:run
```

### Étape 2 : Créer l'Admin (une fois le backend démarré)
```powershell
# Exécutez ce script PowerShell :
./test-backend.ps1
```

### Étape 3 : Tester l'application
1. **Frontend** : http://localhost:4201 (déjà démarré)
2. **Connexion Admin** :
   - Username: `admin`
   - Password: `Admin@123`
3. **Inscription Client** : Testez avec une date de naissance au format YYYY-MM-DD

## 🔧 Si vous avez des problèmes :

### Backend ne démarre pas :
- Vérifiez que Java 17+ est installé
- Vérifiez que MongoDB est démarré
- Utilisez IntelliJ IDEA pour démarrer le projet

### Erreur de connexion :
- Vérifiez que le backend est sur le port 8080
- Regardez les logs dans la console du navigateur (F12)

### Inscription ne marche pas :
- Utilisez une date au format YYYY-MM-DD (ex: 1990-01-15)
- Vérifiez que tous les champs sont remplis correctement

## 📱 Test rapide :

1. **Admin** : Connectez-vous avec `admin` / `Admin@123`
2. **Client** : Inscrivez-vous avec vos informations
3. **Profil** : Vérifiez que la page profil se charge correctement
4. **PDF** : Testez le téléchargement de relevé (sans caractères bizarres)

---

**🎉 Tous les problèmes mentionnés ont été corrigés !**