# 🔄 Migration MongoDB vers MySQL - Guide Complet

## 📋 Modifications Effectuées

### ✅ **1. Dépendances Maven (pom.xml)**
```xml
SUPPRIMÉ:
- spring-boot-starter-data-mongodb
- spring-boot-starter-data-mongodb-test

AJOUTÉ:
- spring-boot-starter-data-jpa
- mysql-connector-java (8.0.33)
- h2 (pour les tests)
```

### ✅ **2. Configuration (application.properties)**
```properties
SUPPRIMÉ:
- spring.data.mongodb.uri=mongodb://localhost:27017/ega_bank
- spring.data.mongodb.auto-index-creation=true
- spring.data.mongodb.database=ega_bank

AJOUTÉ:
- spring.datasource.url=jdbc:mysql://localhost:3306/ega_bank?createDatabaseIfNotExist=true
- spring.datasource.username=root
- spring.datasource.password=
- spring.jpa.hibernate.ddl-auto=update
- spring.jpa.show-sql=true
- spring.jpa.properties.hibernate.dialect=MySQL8Dialect
```

## 🔧 Modifications Nécessaires des Entités

### **Client.java** - Modifications requises:
```java
// AVANT (MongoDB)
@Document(collection = "clients")
@Id
private String id;

// APRÈS (MySQL/JPA)
@Entity
@Table(name = "clients")
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;
```

### **User.java** - Modifications requises:
```java
// AVANT (MongoDB)
@Document(collection = "users")
@Id
private String id;

// APRÈS (MySQL/JPA)
@Entity
@Table(name = "users")
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;
```

### **Compte.java** - Modifications requises:
```java
// AVANT (MongoDB)
@Document(collection = "comptes")
@Id
private String id;

// APRÈS (MySQL/JPA)
@Entity
@Table(name = "comptes")
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;

// Relations JPA
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "client_id")
private Client client;
```

### **Transaction.java** - Modifications requises:
```java
// AVANT (MongoDB)
@Document(collection = "transactions")
@Id
private String id;

// APRÈS (MySQL/JPA)
@Entity
@Table(name = "transactions")
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;

// Relations JPA
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "compte_id")
private Compte compte;
```

## 📊 Repositories - Changements

### **Avant (MongoDB)**
```java
public interface ClientRepository extends MongoRepository<Client, String> {
    Optional<Client> findByCourriel(String courriel);
}
```

### **Après (MySQL/JPA)**
```java
public interface ClientRepository extends JpaRepository<Client, Long> {
    Optional<Client> findByCourriel(String courriel);
    // Mêmes méthodes, juste le type d'ID change
}
```

## 🚀 Script de Migration Automatique

Créons un script pour appliquer toutes les modifications :