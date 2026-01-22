#!/usr/bin/env pwsh

Write-Host "🎨 DÉMARRAGE FRONTEND CLEAN - EGA BANK" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Aller dans le répertoire frontend
Set-Location "frontend-angular"

Write-Host "📁 Répertoire: $(Get-Location)" -ForegroundColor Cyan

# Vérifier que node_modules existe
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installation des dépendances..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erreur lors de l'installation des dépendances!" -ForegroundColor Red
        exit 1
    }
}

# Vérifier que le backend est accessible
Write-Host "🔍 Vérification du backend..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/test/health" -Method GET -TimeoutSec 5
    Write-Host "✅ Backend accessible: $($response.message)" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Backend non accessible sur http://localhost:8080" -ForegroundColor Yellow
    Write-Host "💡 Assurez-vous que le backend MongoDB est démarré" -ForegroundColor Cyan
}

# Démarrer le frontend
Write-Host "🚀 Démarrage du frontend Angular..." -ForegroundColor Green
Write-Host "🌐 Frontend sera disponible sur: http://localhost:4200" -ForegroundColor Cyan
Write-Host "🔗 Backend MongoDB: http://localhost:8080" -ForegroundColor Cyan
Write-Host "" -ForegroundColor White
Write-Host "📋 COMPTES DE TEST:" -ForegroundColor Yellow
Write-Host "👑 Admin: admin / admin123" -ForegroundColor White
Write-Host "" -ForegroundColor White
Write-Host "⏹️ Pour arrêter: Ctrl+C" -ForegroundColor Red
Write-Host "" -ForegroundColor White

npm start