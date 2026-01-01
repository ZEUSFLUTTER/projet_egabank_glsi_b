# Guide de Démarrage Rapide - EGA Banking System

## ⚡ Démarrage en 2 étapes

### Étape 1: Configurer l'environnement

Vous avez **Java 25** actif mais le projet nécessite **Java 17** (déjà installé).

**Option A - Script automatique (RECOMMANDÉ):**
```bash
cd /home/vladmir/Documents/JEE/EGA/backend_ega
./setup.sh
```

**Option B - Manuellement:**
```bash
# Activer Java 17
sudo archlinux-java set java-17-openjdk

# Vérifier
java -version
# Devrait afficher: openjdk version "17.0.x"

# Compiler
mvn clean package -DskipTests
```

### Étape 2: Démarrer l'application

```bash
# Option 1: Avec Maven
mvn spring-boot:run

# Option 2: Avec le JAR compilé
java -jar target/banking-1.0.0.jar
```

L'application démarre sur **http://localhost:8080**

## 🎯 Tester l'application

### Avec Swagger UI (PLUS FACILE):
1. Ouvrir: http://localhost:8080/swagger-ui.html
2. Créer un utilisateur via `/api/auth/register`
3. Cliquer "Authorize" et entrer le token reçu
4. Tester toutes les APIs!

### Avec cURL:

**1. S'inscrire:**
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@ega.com",
    "password": "admin123"
  }'
```

Copier le `token` de la réponse.

**2. Créer un client:**
```bash
export TOKEN="votre_token_ici"

curl -X POST http://localhost:8080/api/clients \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "MARTIN",
    "prenom": "Sophie",
    "dateNaissance": "1990-05-15",
    "sexe": "F",
    "adresse": "10 Rue de la Paix, Paris",
    "telephone": "+33612345678",
    "email": "sophie.martin@email.com",
    "nationalite": "Française"
  }'
```

**3. Créer un compte épargne:**
```bash
curl -X POST http://localhost:8080/api/comptes/epargne \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"clientId": 1, "tauxInteret": 3.5}'
```

**4. Faire un dépôt:**
```bash
curl -X POST http://localhost:8080/api/transactions/depot \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"compteId": 1, "montant": 1000, "description": "Dépôt initial"}'
```

**5. Consulter les transactions:**
```bash
curl http://localhost:8080/api/transactions/compte/1 \
  -H "Authorization: Bearer $TOKEN"
```

## 🌐 Accès aux Services

| Service | URL | Identifiants |
|---------|-----|--------------|
| **Swagger UI** | http://localhost:8080/swagger-ui.html | - |
| **API Docs** | http://localhost:8080/v3/api-docs | - |
| **H2 Console** | http://localhost:8080/h2-console | URL: `jdbc:h2:mem:egabank`<br>User: `sa`<br>Pass: (vide) |

## 📚 Endpoints Principaux

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion

### Clients
- `GET /api/clients` - Liste
- `POST /api/clients` - Créer
- `GET /api/clients/{id}` - Détails
- `PUT /api/clients/{id}` - Modifier
- `DELETE /api/clients/{id}` - Supprimer

### Comptes  
- `POST /api/comptes/epargne` - Créer compte épargne
- `POST /api/comptes/courant` - Créer compte courant
- `GET /api/comptes` - Liste
- `GET /api/comptes/{id}` - Détails

### Transactions
- `POST /api/transactions/depot` - Dépôt
- `POST /api/transactions/retrait` - Retrait  
- `POST /api/transactions/virement` - Virement
- `GET /api/transactions/compte/{id}` - Historique

### Relevés
- `GET /api/releves/{compteId}?dateDebut=&dateFin=` - Par période
- `GET /api/releves/{compteId}/mensuel?annee=&mois=` - Mensuel
- `GET /api/releves/{compteId}/annuel?annee=` - Annuel

## ❓ Problèmes Courants

### "cannot find symbol" lors de la compilation
```bash
# Vérifier la version Java
java -version

# Si ce n'est pas 17.x.x, activer Java 17
sudo archlinux-java set java-17-openjdk
```

### Port 8080 déjà utilisé
```bash
# Trouver le processus
lsof -i :8080

# Ou changer le port dans application.yml
server.port: 8081
```

### 401 Unauthorized
- Vérifiez que vous avez le token JWT
- Format du header: `Authorization: Bearer votre_token`
- Le token expire après 24h

## 📝 Documentation Complète

- **README.md** - Documentation détaillée
- **SETUP.md** - Guide d'installation complet
- **Swagger UI** - Documentation interactive des APIs

## 🚀 Fonctionnalités Implémentées

- ✅ CRUD Clients et Comptes
- ✅ Génération automatique IBAN (iban4j)
- ✅ Dépôt, retrait, virement
- ✅ Historique des transactions
- ✅ Relevés par période
- ✅ Authentification JWT
- ✅ Validation complète
- ✅ Gestion d'erreurs globale
- ✅ Documentation Swagger
- ✅ Base H2 (dev) et PostgreSQL (prod)
