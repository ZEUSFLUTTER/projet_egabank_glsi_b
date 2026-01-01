# Guide Docker - Système Bancaire EGA

## 🐳 Dockerisation du Projet

Ce guide explique comment utiliser Docker pour déployer l'application bancaire EGA.

## Prérequis

- **Docker** : Version 20.10 ou supérieure
- **Docker Compose** : Version 2.0 ou supérieure

### Installer Docker

#### Linux (Ubuntu/Debian)
```bash
# Installer Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Installer Docker Compose
sudo apt-get update
sudo apt-get install docker-compose-plugin
```

#### Linux (Arch/Manjaro)
```bash
sudo pacman -S docker docker-compose
sudo systemctl enable docker
sudo systemctl start docker

# Ajouter votre utilisateur au groupe docker (évite sudo)
sudo usermod -aG docker $USER
# Déconnectez-vous et reconnectez-vous pour que les changements prennent effet
```

#### MacOS
```bash
# Installer Docker Desktop
brew install --cask docker
```

### Vérifier l'installation
```bash
docker --version
docker compose version
```

## 🚀 Démarrage Rapide

### Option 1 : Docker Compose (Recommandé)

Cette option démarre toute la stack :
- PostgreSQL
- Backend Spring Boot
- PgAdmin (interface web pour la base de données)

```bash
# À la racine du projet backend_ega
cd /home/vladmir/Documents/JEE/EGA/backend_ega

# Construire et démarrer tous les services
docker compose up -d

# Voir les logs
docker compose logs -f backend

# Arrêter tous les services
docker compose down

# Arrêter et supprimer les volumes (⚠️ SUPPRIME LES DONNÉES)
docker compose down -v
```

### Option 2 : Docker seul (Sans PostgreSQL)

Utilise H2 database en mémoire :

```bash
# Construire l'image
docker build -t ega-banking:latest .

# Lancer le conteneur
docker run -d \
  --name ega-backend \
  -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=h2 \
  ega-banking:latest

# Voir les logs
docker logs -f ega-backend

# Arrêter et supprimer le conteneur
docker stop ega-backend
docker rm ega-backend
```

## 📊 Accès aux Services

Une fois les services démarrés :

| Service | URL | Credentials |
|---------|-----|-------------|
| **Backend API** | http://localhost:8080 | - |
| **Swagger UI** | http://localhost:8080/swagger-ui.html | - |
| **PostgreSQL** | localhost:5432 | User: `egauser`<br>Password: `egapassword` |
| **PgAdmin** | http://localhost:5050 | Email: `admin@ega.com`<br>Password: `admin` |

## 🔧 Configuration

### Variables d'Environnement

Vous pouvez personnaliser la configuration via les variables d'environnement dans `docker-compose.yml` :

```yaml
environment:
  # Base de données
  SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/egabank
  SPRING_DATASOURCE_USERNAME: egauser
  SPRING_DATASOURCE_PASSWORD: egapassword
  
  # JWT (⚠️ CHANGEZ CECI EN PRODUCTION)
  JWT_SECRET: "votre-secret-jwt-super-securise"
  JWT_EXPIRATION: 86400000  # 24 heures
  
  # Java
  JAVA_OPTS: "-Xmx512m -Xms256m"
```

### Profils Spring

Le projet supporte deux profils :

- **h2** : Base de données en mémoire (développement)
- **postgres** : PostgreSQL (production)

Changez le profil actif :
```yaml
environment:
  SPRING_PROFILES_ACTIVE: postgres  # ou h2
```

## 🛠️ Commandes Docker Utiles

### Gestion des Conteneurs

```bash
# Lister les conteneurs en cours d'exécution
docker ps

# Lister tous les conteneurs
docker ps -a

# Voir les logs d'un service
docker compose logs -f backend
docker compose logs -f postgres

# Redémarrer un service
docker compose restart backend

# Reconstruire une image après modifications
docker compose up -d --build backend
```

### Gestion des Images

```bash
# Lister les images
docker images

# Supprimer une image
docker rmi ega-banking:latest

# Nettoyer les images non utilisées
docker image prune -a
```

### Gestion des Volumes

```bash
# Lister les volumes
docker volume ls

# Inspecter un volume
docker volume inspect backend_ega_postgres_data

# Supprimer un volume (⚠️ SUPPRIME LES DONNÉES)
docker volume rm backend_ega_postgres_data
```

### Accès au Conteneur

```bash
# Ouvrir un shell dans le conteneur backend
docker exec -it ega-backend sh

# Ouvrir un shell dans PostgreSQL
docker exec -it ega-postgres psql -U egauser -d egabank
```

## 🔍 Débogage

### Vérifier l'état des services

```bash
# Vérifier que tous les services sont UP
docker compose ps

# Vérifier les healthchecks
docker inspect ega-postgres | grep Health -A 10
```

### Logs

```bash
# Logs de tous les services
docker compose logs

# Logs d'un service spécifique
docker compose logs backend
docker compose logs postgres

# Suivre les logs en temps réel
docker compose logs -f

# Dernières 100 lignes
docker compose logs --tail=100
```

### Problèmes Courants

#### Le backend ne démarre pas
```bash
# Vérifier les logs
docker compose logs backend

# Vérifier que PostgreSQL est prêt
docker compose logs postgres

# Redémarrer le backend
docker compose restart backend
```

#### Erreur de connexion à PostgreSQL
```bash
# Vérifier que PostgreSQL est accessible
docker exec -it ega-postgres pg_isready -U egauser -d egabank

# Vérifier les variables d'environnement
docker exec ega-backend env | grep SPRING_DATASOURCE
```

#### Port déjà utilisé
```bash
# Trouver quel processus utilise le port 8080
sudo lsof -i :8080

# Changer le port dans docker-compose.yml
ports:
  - "8081:8080"  # Au lieu de 8080:8080
```

## 🗄️ Persistance des Données

Les données PostgreSQL sont stockées dans un volume Docker nommé `postgres_data`. 

Pour **sauvegarder** les données :
```bash
# Exporter la base de données
docker exec ega-postgres pg_dump -U egauser egabank > backup.sql
```

Pour **restaurer** les données :
```bash
# Importer la base de données
docker exec -i ega-postgres psql -U egauser egabank < backup.sql
```

## 🔒 Sécurité pour la Production

Pour un déploiement en production :

1. **Changez les mots de passe** dans `docker-compose.yml`
2. **Utilisez des secrets Docker** au lieu de variables d'environnement
3. **Générez une clé JWT forte** (au moins 256 bits)
4. **Désactivez PgAdmin** ou protégez-le avec un reverse proxy
5. **Utilisez HTTPS** avec un reverse proxy (Nginx, Traefik)
6. **Limitez l'exposition des ports** (ne pas exposer PostgreSQL publiquement)

Exemple de configuration sécurisée :
```yaml
backend:
  ports:
    - "127.0.0.1:8080:8080"  # Seulement localhost
  environment:
    JWT_SECRET: ${JWT_SECRET}  # Depuis variable d'environnement
    SPRING_DATASOURCE_PASSWORD: ${DB_PASSWORD}
```

## 🧪 Tests avec Docker

Tester l'API une fois démarrée :

```bash
# Attendre que le backend soit prêt
sleep 30

# Créer un utilisateur
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@ega.com",
    "password": "test123"
  }'

# Accéder à Swagger UI
xdg-open http://localhost:8080/swagger-ui.html
```

## 📦 Build pour Production

```bash
# Build optimisé pour production
docker build \
  --build-arg MAVEN_OPTS="-XX:+TieredCompilation -XX:TieredStopAtLevel=1" \
  --target build \
  -t ega-banking:1.0.0 .

# Tag pour registry
docker tag ega-banking:1.0.0 votre-registry/ega-banking:1.0.0

# Push vers registry
docker push votre-registry/ega-banking:1.0.0
```

## 🎯 Prochaines Étapes

Après avoir démarré avec Docker :

1. ✅ Vérifiez que tous les services sont UP : `docker compose ps`
2. ✅ Accédez à Swagger UI : http://localhost:8080/swagger-ui.html
3. ✅ Créez un utilisateur et testez l'API
4. ✅ Connectez-vous à PgAdmin pour voir la base de données
5. ✅ Explorez les logs : `docker compose logs -f`

## 📚 Ressources

- [Documentation Docker](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [Spring Boot with Docker](https://spring.io/guides/gs/spring-boot-docker/)
