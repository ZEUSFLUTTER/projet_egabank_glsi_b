# Script PowerShell pour démarrer le frontend Angular automatiquement
Write-Host "Démarrage du frontend Angular..." -ForegroundColor Green

# Ajouter Node.js au PATH
$env:PATH = "C:\Program Files\nodejs;$env:PATH"

# Aller dans le répertoire Angular
Set-Location "bank-frontend-angular"

# Désactiver les analytics Angular
Write-Host "Configuration d'Angular..." -ForegroundColor Yellow
npx ng analytics off

# Démarrer le serveur de développement
Write-Host "Lancement du serveur de développement..." -ForegroundColor Yellow
npx ng serve --port 4200