# 🗃️ GUIDE DE MIGRATION MONGODB - EGA BANK

## ✅ MIGRATION TERMINÉE

La migration de H2 vers MongoDB a été effectuée avec succès !

## 📋 MODIFICATIONS APPORTÉES

### 1. Configuration (application.properties)
```properties
# MongoDB Configuration
spring.data.mongodb.uri=mongodb://localhost:27017/egabank
spring.data.mongodb.database=egabank
```

### 2. Dépendances (pom.xml)
- ✅ Ajout de `spring-boot-starter-data-mongodb`
- ✅ Suppression de `h2database`

### 3. Entités migrées vers MongoDB
- ✅ **User** : `@Entity` → `@Document(collection = "users")`
- ✅ **Client** : `@Entity` → `@Document(collection = "clients")`
- ✅ **Compte** : `@Entity` → `@Document(collection = "comptes")`
- ✅ **Transaction** : `@Entity` → `@Document(collection = "transactions")`

### 4. Repositories migrés
- ✅ **UserRepository** : `JpaRepository<User, Long>` → `MongoRepository<User, String>`
- ✅ **ClientRepository** : `JpaRepository<Client, Long>` → `MongoRepository<Client, String>`
- ✅ **CompteRepository** : `JpaRepository<Compte, Long>` → `MongoRepository<Compte, String>`
- ✅ **TransactionRepository** : `JpaRepository<Transaction, Long>` → `MongoRepository<Transaction, String>`

### 5. Types d'ID mis à jour
- ✅ Tous les ID : `Long` → `String`
- ✅ DTOs mis à jour
- ✅ Services mis à jour
- ✅ Controllers mis à jour

### 6. Annotations MongoDB
- ✅ `@Id` pour les identifiants MongoDB
- ✅ `@Indexed(unique = true)` pour les champs uniques
- ✅ `@DBRef` pour les références entre documents

## 🚀 DÉMARRAGE

### Prérequis
1. **MongoDB installé et démarré** sur le port 27017
2. Base de données `egabank` (sera créée automatiquement)

### Scripts disponibles
```bash
# Démarrer le backend avec MongoDB
./start-backend-mongodb.ps1

# Initialiser les données de test
./init-mongodb-data.ps1

# Démarrer le projet complet
./start-project-mongodb.ps1
```

## 📊 STRUCTURE MONGODB

### Collections créées automatiquement :
- `users` - Utilisateurs et authentification
- `clients` - Informations clients
- `comptes` - Comptes bancaires
- `transactions` - Historique des transactions

### Données de test incluses :
- 👑 **Admin** : `admin` / `admin123`
- 👤 **Client 1** : `jean.dupont` / `password123`
- 👤 **Client 2** : `marie.martin` / `password123`
- 👤 **Client 3** : `pierre.durand` / `password123`

## 🔧 VÉRIFICATION

### 1. Vérifier MongoDB
```bash
# Vérifier que MongoDB fonctionne
mongosh
> show dbs
> use egabank
> show collections
```

### 2. Tester l'API
```bash
# Test de connexion
curl http://localhost:8080/api/auth/login -X POST -H "Content-Type: application/json" -d '{"username":"admin","password":"admin123"}'
```

## 🌐 URLS

- **Frontend** : http://localhost:4200
- **Backend** : http://localhost:8080
- **MongoDB** : localhost:27017/egabank
- **MongoDB Compass** : mongodb://localhost:27017/egabank

## ⚠️ NOTES IMPORTANTES

1. **MongoDB doit être démarré** avant le backend
2. Les **ID sont maintenant des String** (ObjectId MongoDB)
3. Les **relations utilisent @DBRef** au lieu de @JoinColumn
4. **Pas de schéma fixe** - MongoDB est flexible
5. **Index automatiques** sur les champs marqués @Indexed

## 🎯 AVANTAGES DE MONGODB

- ✅ **Performance** : Meilleure pour les lectures
- ✅ **Flexibilité** : Schéma dynamique
- ✅ **Scalabilité** : Facilement extensible
- ✅ **JSON natif** : Parfait pour les APIs REST
- ✅ **Pas de migrations** : Structure flexible

## 🔄 RETOUR EN ARRIÈRE

Si vous voulez revenir à H2, utilisez les fichiers de sauvegarde :
- `*.java.mongodb.backup` → renommer en `.java`
- Restaurer `application.properties` et `pom.xml`

## 🎉 RÉSULTAT

Le projet EGA Bank fonctionne maintenant avec MongoDB !
Toutes les fonctionnalités sont préservées avec de meilleures performances.