# Script simple pour demarrer Angular
Write-Host "Demarrage Angular..." -ForegroundColor Green

# Ajouter Node.js au PATH
$env:PATH = "C:\Program Files\nodejs;$env:PATH"

# Aller dans le repertoire Angular
Set-Location "bank-frontend-angular"

# Verifier Node.js
Write-Host "Version Node.js:" -ForegroundColor Yellow
node --version

Write-Host "Version npm:" -ForegroundColor Yellow
npm --version

# Demarrer Angular
Write-Host "Demarrage du serveur..." -ForegroundColor Yellow
npm start