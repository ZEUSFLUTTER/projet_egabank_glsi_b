# Infrastructure Docker

Ce dossier contient tous les fichiers nécessaires pour la conteneurisation de l'application EGA Banking.

## Fichiers

- **Dockerfile** : Configuration Docker pour l'application Spring Boot
- **docker-compose.yml** : Orchestration des services (PostgreSQL, backend, pgAdmin)
- **.dockerignore** : Fichiers à exclure lors du build Docker

## Utilisation

Pour lancer l'ensemble de l'infrastructure :

```bash
cd infrastructure/docker
docker-compose up -d
```

Pour arrêter les services :

```bash
docker-compose down
```

Pour voir les logs :

```bash
docker-compose logs -f
```

## Services disponibles

- **Backend** : http://localhost:8080
- **PostgreSQL** : localhost:5432
- **PgAdmin** : http://localhost:5050 (admin@ega.com / admin)
