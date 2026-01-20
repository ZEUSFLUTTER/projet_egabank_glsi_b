---
description: Démarrer l'application EGA Banking avec Docker
---

# Démarrage de l'application EGA Banking

// turbo-all

## Étapes de démarrage

1. Aller dans le répertoire Docker :
```bash
cd /home/vladmir/Documents/JEE/EGA/infrastructure/docker
```

2. Démarrer tous les services :
```bash
docker compose up -d
```

3. Vérifier que tout fonctionne :
```bash
docker compose ps
```

## Accès à l'application

- **Frontend** : http://localhost:4202
- **Backend API** : http://localhost:8082

## Identifiants

### Admin
- Username : `admin`
- Password : `admin123`

### Client (exemple)
- Nom : `GG`
- Numéro de compte : `FR0749232213984061805043814`

## Arrêter l'application

```bash
cd /home/vladmir/Documents/JEE/EGA/infrastructure/docker
docker compose down
```

## En cas de problème

### Reconstruire les images
```bash
docker compose down
docker compose up --build -d
```

### Voir les logs
```bash
docker compose logs -f backend
docker compose logs -f frontend
```
