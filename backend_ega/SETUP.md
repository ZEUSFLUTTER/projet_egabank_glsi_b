# Guide de Configuration de l'Environnement - Système Bancaire EGA

## Prérequis Système

### 1. Java Development Kit (JDK) 17

**IMPORTANT**: Ce projet require **Java 17** (pas Java 11, pas Java 21, pas Java 25).

#### Vérifier la version de Java actuelle:
```bash
java -version
javac -version
```

#### Installation de Java 17 sur Linux (Arch/Manjaro):
```bash
# Installer OpenJDK 17
sudo pacman -S jdk17-openjdk

# Lister les versions Java installées
archlinux-java status

# Définir Java 17 comme version par défaut
sudo archlinux-java set java-17-openjdk

# Vérifier la version
java -version
# Devrait afficher: openjdk version "17.0.x"
```

#### Installation sur Debian/Ubuntu:
```bash
sudo apt update
sudo apt install openjdk-17-jdk

# Configurer la version par défaut
sudo update-alternatives --config java
sudo update-alternatives --config javac
```

#### Installation sur MacOS:
```bash
# Avec Homebrew
brew install openjdk@17

# Ajouter à votre PATH
echo 'export PATH="/usr/local/opt/openjdk@17/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### 2. Apache Maven

Le projet utilise Maven 3.8+ comme gestionnaire de build.

#### Vérifier Maven:
```bash
mvn --version
# Devrait afficher Maven 3.8.x ou 3.9.x
```

#### Installation si nécessaire:

**Linux (Arch/Manjaro):**
```bash
sudo pacman -S maven
```

**Debian/Ubuntu:**
```bash
sudo apt install maven
```

**MacOS:**
```bash
brew install maven
```

### 3. PostgreSQL (Optionnel - pour production)

Pour la production, PostgreSQL est recommandé.

#### Installation PostgreSQL:

**Linux:**
```bash
# Arch/Manjaro
sudo pacman -S postgresql
sudo systemctl enable postgresql
sudo systemctl start postgresql

# Debian/Ubuntu
sudo apt install postgresql postgresql-contrib
```

#### Créer la base de données:
```bash
# Se connecter à PostgreSQL
sudo -u postgres psql

# Créer la base de données
CREATE DATABASE egabank;
CREATE USER egauser WITH PASSWORD 'votre_mot_de_passe';
GRANT ALL PRIVILEGES ON DATABASE egabank TO egauser;
\q
```

## Configuration du Projet

### 1. Cloner ou accéder au projet
```bash
cd /home/vladmir/Documents/JEE/EGA/backend_ega
```

### 2. Configuration de la base de données

#### Option A: Utiliser H2 (Base de données en mémoire - Mode développement)
Aucune configuration nécessaire. C'est le mode par défaut.

#### Option B: Utiliser PostgreSQL
Éditez `src/main/resources/application-postgres.yml`:
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/egabank
    username: egauser
    password: votre_mot_de_passe
```

### 3. Compiler le projet

```bash
# Nettoyer et compiler
mvn clean install

# Ou compiler sans exécuter les tests
mvn clean install -DskipTests
```

Si vous rencontrez des erreurs de compilation Lombok, vérifiez que:
- Vous utilisez bien Java 17
- Maven 3.8+ est installé

### 4. Démarrer l'application

#### Mode développement (H2):
```bash
mvn spring-boot:run
```

#### Mode production (PostgreSQL):
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=postgres
```

#### Ou en utilisant le JAR compilé:
```bash
# Compiler le JAR
mvn clean package -DskipTests

# Lancer l'application
java -jar target/banking-1.0.0.jar

# Ou avec PostgreSQL
java -jar target/banking-1.0.0.jar --spring.profiles.active=postgres
```

### 5. Vérifier que l'application fonctionne

L'application démarre sur `http://localhost:8080`

Testez l'accès à:
- Swagger UI: http://localhost:8080/swagger-ui.html
- H2 Console (mode dev): http://localhost:8080/h2-console

## Premiers Pas

### 1. Créer un utilisateur

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@ega.com",
    "password": "admin123"
  }'
```

Réponse (exemple):
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "type": "Bearer",
  "username": "admin",
  "email": "admin@ega.com",
  "role": "ROLE_USER"
}
```

**Important**: Copiez le token JWT pour les prochaines requêtes!

### 2. Créer un client

```bash
export TOKEN="votre_token_jwt_ici"

curl -X POST http://localhost:8080/api/clients \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "DUPONT",
    "prenom": "Jean",
    "dateNaissance": "1990-05-15",
    "sexe": "M",
    "adresse": "123 Rue de la Paix, Paris",
    "telephone": "+33612345678",
    "email": "jean.dupont@email.com",
    "nationalite": "Française"
  }'
```

### 3. Créer un compte bancaire

```bash
# Compte épargne
curl -X POST http://localhost:8080/api/comptes/epargne \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": 1,
    "tauxInteret": 3.5
  }'

# Compte courant
curl -X POST http://localhost:8080/api/comptes/courant \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": 1,
    "decouvertAutorise": 500.00
  }'
```

### 4. Effectuer un dépôt

```bash
curl -X POST http://localhost:8080/api/transactions/depot \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "compteId": 1,
    "montant": 1000.00,
    "description": "Dépôt initial"
  }'
```

## Utilisation de Swagger UI

La manière la plus simple de tester toutes les APIs est d'utiliser Swagger UI:

1. Ouvrez http://localhost:8080/swagger-ui.html
2. Cliquez sur "Authorize" en haut à droite
3. Entrez votre token JWT (sans "Bearer ")
4. Cliquez sur "Authorize"
5. Vous pouvez maintenant tester toutes les APIs!

## Structure des Données

### Base de données H2 (mode dev)
- URL JDBC: `jdbc:h2:mem:egabank`
- Username: `sa`
- Password: (vide)
- Console: http://localhost:8080/h2-console

### Tables créées automatiquement:
- `users` - Utilisateurs du système
- `clients` - Clients de la banque
- `comptes` - Comptes bancaires (table parente)
- `comptes_epargne` - Comptes épargne
- `comptes_courant` - Comptes courants
- `transactions` - Historique des transactions

## Résolution des Problèmes

### Erreur: "cannot find symbol" lors de la compilation
- **Cause**: Version de Java incorrecte
- **Solution**: Vérifiez que Java 17 est installé et activé

### Erreur: "Failed to configure a DataSource"
- **Cause**: Configuration de base de données incorrecte
- **Solution**: Vérifiez les paramètres dans `application.yml` ou démarrez en mode H2

### Erreur: "Port 8080 already in use"
- **Cause**: Un autre service utilise le port 8080
- **Solution**: 
  - Arrêtez l'autre service OU
  - Changez le port dans `application.yml`: `server.port: 8081`

### L'application démarre mais les requêtes renvoient 401 Unauthorized
- **Cause**: Token JWT manquant ou invalide
- **Solution**: 
  - Connectez-vous à nouveau pour obtenir un nouveau token
  - Vérifiez que le header Authorization est correct: `Authorization: Bearer votre_token`

## Recommandations pour le Développement

1. **IDE recommandés**:
   - IntelliJ IDEA (avec plugins Lombok et Spring Boot)
   - VS Code (avec extensions Java et Spring Boot)
   - Eclipse (avec Spring Tools Suite)

2. **Installation du plugin Lombok dans votre IDE**:
   - IntelliJ: Déjà inclus, activez "Enable annotation processing"
   - Eclipse: Téléchargez lombok.jar et exécutez-le
   - VS Code: Installez l'extension "Lombok Annotations Support"

3. **Outils de test API**:
   - Swagger UI (intégré) - http://localhost:8080/swagger-ui.html
   - Postman
   - cURL (ligne de commande)
   - HTTPie

## Commandes Maven Utiles

```bash
# Nettoyer le projet
mvn clean

# Compiler
mvn compile

# Exécuter les tests
mvn test

# Créer le package (JAR)
mvn package

# Installer dans le repository local Maven
mvn install

# Lancer l'application
mvn spring-boot:run

# Vérifier les dépendances
mvn dependency:tree

# Mettre à jour les dépendances
mvn versions:display-dependency-updates
```

## Logs et Debugging

Les logs sont configurés au niveau DEBUG pour le package `com.ega.banking`.

Pour voir les requêtes SQL:
- Déjà activé avec `spring.jpa.show-sql: true`
- Les requêtes SQL formatées apparaissent dans les logs

## Support

Pour toute question ou problème:
- Consultez le fichier README.md
- Vérifiez la documentation Swagger
- Examinez les logs de l'application

## Prochaines Étapes

Après avoir configuré l'environnement:
1. Testez tous les endpoints avec Swagger
2. Créez quelques clients et comptes de test
3. Effectuez des transactions (dépôts, retraits, virements)
4. Consultez les relevés de compte
5. Explorez les fonctionnalités de sécurité JWT
