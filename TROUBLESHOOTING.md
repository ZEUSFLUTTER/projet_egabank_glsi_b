# 🔧 Guide de Dépannage - Affichage des Données

## Problème : Le contenu de la base de données ne s'affiche plus

### ✅ Étapes de diagnostic

#### 1. **Vérifier que le Backend est actif**
- Le serveur Backend doit tournersur le port **8081**
- Vérifiez avec: `GET http://localhost:8081/api/clients`
- Réponse attendue: Un JSON avec la liste des clients

#### 2. **Vérifier la connexion à la base de données MySQL**
```properties
# Vérifiez dans: Backend/src/main/resources/application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/egabank_db
spring.datasource.username=root
spring.datasource.password=
```
- Assurez-vous que MySQL/MariaDB est en cours d'exécution
- La base de données `egabank_db` existe

#### 3. **Vérifier que le Frontend est actif**
- Le Frontend doit tourner sur le port **4200**
- Accédez à: `http://localhost:4200`

#### 4. **Vérifier les logs du navigateur**
- Ouvrez la console du navigateur (F12)
- Allez dans l'onglet **Console**
- Vérifiez les messages d'erreur (en rouge)
- Allez dans l'onglet **Network** et vérifiez les requêtes API:
  - Status 401: Problème d'authentification
  - Status 403: Problème de permission
  - Status 0: Le Backend n'est pas accessible

#### 5. **Vérifier le Token JWT**
```typescript
// Dans la console du navigateur, exécutez:
localStorage.getItem('token')
```
- Si `null`: Vous n'êtes pas connecté
- Si vide ou invalide: Le token est expiré

### 🔑 Solutions communes

#### **Si vous voyez: "Impossible de se connecter au serveur"**
1. Assurez-vous que le Backend est lancé
2. Vérifiez que le port 8081 n'est pas bloqué
3. Redémarrez le Backend: `mvn spring-boot:run`

#### **Si vous voyez: "Erreur d'authentification"**
1. Déconnectez-vous
2. Rechargez la page (F5)
3. Reconnectez-vous avec vos identifiants

#### **Si vous voyez: "Accès refusé"**
1. Vérifiez que votre utilisateur a les bonnes permissions
2. Consultez les logs du Backend

#### **Si les données se chargent mais ne s'affichent pas**
1. Ouvrez la console du navigateur (F12)
2. Vérifiez s'il y a des erreurs Angular
3. Vérifiez que les données sont bien retournées par l'API (onglet Network)

### 📋 Améliorations apportées
✅ Affichage des messages d'erreur à l'utilisateur
✅ Indicateur de chargement pendant les requêtes
✅ Gestion des codes d'erreur HTTP (401, 403, 0)
✅ Meilleur rapport d'erreur dans la console

### 🚀 Pour redémarrer les services

**Backend (dans le dossier Backend/):**
```bash
mvn clean spring-boot:run
```

**Frontend (dans le dossier Frontend/):**
```bash
npm start
```

ou

```bash
ng serve
```

### 📞 Logs à vérifier
- **Backend logs**: Console où vous avez lancé `mvn spring-boot:run`
- **Frontend logs**: Console du navigateur (F12 → Console)
- **Database logs**: Dépend de votre MySQL/MariaDB

