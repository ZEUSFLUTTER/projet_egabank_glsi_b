# Guide de Déploiement - EGA Bank Frontend

## 🚀 Déploiement en Production

### Prérequis
- Node.js 18+ installé
- Angular CLI 17+ installé
- Backend Spring Boot déployé et accessible

### 1. Configuration de Production

#### Variables d'Environnement
Modifiez `src/environments/environment.prod.ts` :
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://votre-api.egabank.tg/api', // URL de votre API
  appName: 'EGA Bank',
  version: '1.0.0',
  features: {
    mobileMoneySimulation: false, // Désactiver en prod
    realTimeNotifications: true,
    autoRefreshBalance: true
  }
};
```

### 2. Build de Production

```bash
# Build optimisé pour la production
ng build --configuration=production

# Vérifier la taille des bundles
ls -la dist/ega-bank-frontend/
```

### 3. Options de Déploiement

#### Option A: Serveur Web Statique (Nginx)

**Configuration Nginx** (`/etc/nginx/sites-available/egabank`):
```nginx
server {
    listen 80;
    server_name egabank.tg www.egabank.tg;
    
    root /var/www/egabank/dist/ega-bank-frontend;
    index index.html;
    
    # Gestion des routes Angular
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache des assets statiques
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Sécurité
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

**Commandes de déploiement** :
```bash
# Copier les fichiers
sudo cp -r dist/ega-bank-frontend/* /var/www/egabank/

# Redémarrer Nginx
sudo systemctl reload nginx
```

#### Option B: Docker

**Dockerfile** :
```dockerfile
# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build --prod

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist/ega-bank-frontend /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf** :
```nginx
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    server {
        listen 80;
        root /usr/share/nginx/html;
        index index.html;
        
        location / {
            try_files $uri $uri/ /index.html;
        }
    }
}
```

**Commandes Docker** :
```bash
# Build de l'image
docker build -t egabank-frontend .

# Lancement du conteneur
docker run -d -p 80:80 --name egabank-app egabank-frontend
```

#### Option C: Vercel (Déploiement Cloud)

**vercel.json** :
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist/ega-bank-frontend"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

**package.json** (ajouter) :
```json
{
  "scripts": {
    "build-vercel": "ng build --configuration=production"
  }
}
```

### 4. Configuration HTTPS

#### Certificat SSL avec Let's Encrypt
```bash
# Installation Certbot
sudo apt install certbot python3-certbot-nginx

# Obtention du certificat
sudo certbot --nginx -d egabank.tg -d www.egabank.tg

# Renouvellement automatique
sudo crontab -e
# Ajouter : 0 12 * * * /usr/bin/certbot renew --quiet
```

### 5. Monitoring et Logs

#### Monitoring Nginx
```bash
# Logs d'accès
sudo tail -f /var/log/nginx/access.log

# Logs d'erreur
sudo tail -f /var/log/nginx/error.log
```

#### Métriques de Performance
```bash
# Analyse des bundles
npx webpack-bundle-analyzer dist/ega-bank-frontend/stats.json

# Test de performance
npx lighthouse https://egabank.tg --view
```

### 6. Sécurité en Production

#### Headers de Sécurité
```nginx
# Dans la configuration Nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

#### Variables Sensibles
- Ne jamais commiter les clés API
- Utiliser des variables d'environnement
- Chiffrer les communications (HTTPS)

### 7. Sauvegarde et Rollback

#### Script de Sauvegarde
```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf /backups/egabank-frontend-$DATE.tar.gz /var/www/egabank/
```

#### Rollback Rapide
```bash
#!/bin/bash
# rollback.sh
BACKUP_FILE=$1
sudo tar -xzf $BACKUP_FILE -C /
sudo systemctl reload nginx
```

### 8. Tests de Production

#### Checklist de Déploiement
- [ ] Build sans erreurs
- [ ] Tests unitaires passent
- [ ] Configuration API correcte
- [ ] HTTPS fonctionnel
- [ ] Routes Angular fonctionnelles
- [ ] Authentification opérationnelle
- [ ] Mobile Money simulé désactivé
- [ ] Logs de monitoring actifs

#### Tests Post-Déploiement
```bash
# Test de connectivité
curl -I https://egabank.tg

# Test des routes
curl -I https://egabank.tg/login
curl -I https://egabank.tg/dashboard

# Test API
curl -X POST https://votre-api.egabank.tg/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test"}'
```

### 9. Maintenance

#### Mises à Jour
```bash
# Mise à jour des dépendances
npm update

# Audit de sécurité
npm audit

# Rebuild et redéploiement
ng build --prod
```

#### Monitoring Continu
- Surveiller les logs d'erreur
- Vérifier les performances
- Tester régulièrement les fonctionnalités
- Sauvegarder régulièrement

---

## 🆘 Dépannage

### Problèmes Courants

#### 404 sur les routes Angular
**Solution** : Vérifier la configuration `try_files` dans Nginx

#### Erreurs CORS
**Solution** : Configurer les headers CORS sur le backend

#### Bundle trop volumineux
**Solution** : Activer le lazy loading et analyser les bundles

---

**EGA Bank** - Déploiement sécurisé et performant 🚀