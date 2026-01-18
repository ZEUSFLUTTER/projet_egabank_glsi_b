# 🚀 Guide de Lancement - EGA Banking

## Lancer le projet (Méthode simple)

```bash
# 1. Ouvrir un terminal et aller dans le dossier Docker
cd ~/Documents/JEE/EGA/infrastructure/docker

# 2. Lancer tous les conteneurs
docker compose up -d
```

**C'est tout !** L'application démarre en arrière-plan.

## Accéder à l'application

- **Frontend (Interface Web)** : http://localhost:4202
- **Backend API** : http://localhost:8082
- **Compte Admin** : username `admin` / password `admin123`

## Commandes utiles

### Arrêter l'application (GARDE LES DONNÉES)
```bash
cd ~/Documents/JEE/EGA/infrastructure/docker
docker compose down
```
⚠️ **IMPORTANT** : N'utilisez JAMAIS `docker compose down -v` sauf si vous voulez **supprimer toutes les données** (clients, comptes, transactions, etc.)

### Redémarrer après un arrêt
```bash
cd ~/Documents/JEE/EGA/infrastructure/docker
docker compose up -d
```

### Voir les logs (si problème)
```bash
# Logs du backend
docker logs ega-backend

# Logs du frontend  
docker logs ega-frontend

# Logs en temps réel (Ctrl+C pour arrêter)
docker logs -f ega-backend
```

### ⚠️ Reset complet (SUPPRIME TOUTES LES DONNÉES)
**Utilisez uniquement si vous voulez repartir de zéro !**
```bash
cd ~/Documents/JEE/EGA/infrastructure/docker
docker compose down -v  # Le -v EFFACE LA BASE DE DONNÉES
docker compose up -d
```

## Vérifier que tout fonctionne

```bash
# Vérifier que les 3 conteneurs sont lancés
docker ps | grep ega

# Devrait afficher :
# ega-frontend
# ega-backend
# ega-db
```

## En cas de problème

### Problème : "Conteneurs pas lancés"
```bash
# Voir ce qui ne va pas
docker compose logs

# Forcer rebuild
docker compose up --build -d
```

### Problème : "Port déjà utilisé"
Quelque chose utilise déjà le port 4202, 8082 ou 5435.
```bash
# Trouver ce qui utilise le port
sudo lsof -i :4202
sudo lsof -i :8082

# Tuer le processus OU changer les ports dans docker-compose.yml
```

---

**Résumé ultra-rapide :**
1. `cd ~/Documents/JEE/EGA/infrastructure/docker`
2. `docker compose up -d`
3. Ouvrir http://localhost:4202
