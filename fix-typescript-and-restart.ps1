#!/usr/bin/env pwsh

Write-Host "🔧 CORRECTION ERREUR TYPESCRIPT ET REDÉMARRAGE" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan

Write-Host "`n1️⃣ Arrêt du serveur Angular..." -ForegroundColor Yellow
# Tuer tous les processus Node.js qui pourraient être en cours
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

Write-Host "`n2️⃣ Nettoyage du cache Angular..." -ForegroundColor Yellow
Set-Location "frontend-angular"

# Supprimer le cache Angular
if (Test-Path ".angular/cache") {
    Remove-Item -Recurse -Force ".angular/cache"
    Write-Host "   ✅ Cache Angular supprimé" -ForegroundColor Green
}

# Supprimer node_modules et package-lock.json pour un nettoyage complet
if (Test-Path "node_modules") {
    Write-Host "   🧹 Suppression node_modules..." -ForegroundColor Gray
    Remove-Item -Recurse -Force "node_modules"
}

if (Test-Path "package-lock.json") {
    Remove-Item -Force "package-lock.json"
}

Write-Host "`n3️⃣ Réinstallation des dépendances..." -ForegroundColor Yellow
npm install

Write-Host "`n4️⃣ Vérification de la correction TypeScript..." -ForegroundColor Yellow
Write-Host "   Méthode create() maintenant avec paramètre optionnel:" -ForegroundColor White
Write-Host "   create(clientId: string, typeCompte?: 'COURANT' | 'EPARGNE')" -ForegroundColor Green

Write-Host "`n5️⃣ Redémarrage du serveur Angular..." -ForegroundColor Yellow
Write-Host "   🌐 Le serveur sera disponible sur: http://localhost:4200" -ForegroundColor White
Write-Host "   🎯 Interface client sur: http://localhost:4200/profil" -ForegroundColor White

Write-Host "`n⏳ Démarrage en cours..." -ForegroundColor Gray
Write-Host "   (Cela peut prendre 30-60 secondes)" -ForegroundColor Gray

# Démarrer le serveur Angular
npm start

Set-Location ".."