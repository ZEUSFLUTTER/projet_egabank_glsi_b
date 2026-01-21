# Backend - Banque EGA

## Prérequis

- Java 17 ou supérieur
- (Optionnel) Maven installé globalement, sinon utilisez le wrapper Maven inclus

## Démarrage de l'application

### Option 1 : Utiliser le wrapper Maven (Recommandé - Pas besoin d'installer Maven)

```bash
# Windows
.\mvnw.cmd spring-boot:run

# Linux/Mac
./mvnw spring-boot:run
```

### Option 2 : Utiliser Maven installé globalement

```bash
mvn spring-boot:run
```

## Compilation

```bash
# Avec wrapper
.\mvnw.cmd clean install

# Avec Maven installé
mvn clean install
```

## Accès à l'application

- API Backend : http://localhost:8080
- H2 Console : http://localhost:8080/h2-console
  - URL JDBC : `jdbc:h2:mem:banque_ega`
  - Username : `sa`
  - Password : (vide)

## Tests avec Postman

Importez le fichier `postman_collection.json` dans Postman pour tester toutes les APIs.

## Structure du projet

```
backend/
├── src/
│   └── main/
│       ├── java/com/ega/
│       │   ├── controller/     # Contrôleurs REST
│       │   ├── service/         # Services métier
│       │   ├── repository/      # Repositories JPA
│       │   ├── model/           # Entités JPA
│       │   ├── dto/             # Data Transfer Objects
│       │   ├── exception/       # Gestion des exceptions
│       │   ├── security/        # Configuration sécurité
│       │   └── util/            # Utilitaires
│       └── resources/
│           └── application.properties
├── pom.xml
└── postman_collection.json
```



