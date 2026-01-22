# Script PowerShell pour démarrer le frontend Angular
Write-Host "Démarrage du frontend Angular..." -ForegroundColor Green

# Ajouter Node.js au PATH
$env:PATH = "C:\Program Files\nodejs;$env:PATH"

# Aller dans le répertoire Angular
Set-Location "bank-frontend-angular"

# Démarrer le serveur de développement
Write-Host "Lancement de npm start..." -ForegroundColor Yellow
npm start