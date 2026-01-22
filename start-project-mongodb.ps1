#!/usr/bin/env pwsh

Write-Host "🚀 DÉMARRAGE COMPLET EGA BANK - MONGODB" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green

# Vérifier MongoDB
Write-Host "🔍 Vérification de MongoDB..." -ForegroundColor Yellow
try {
    $mongoProcess = Get-Process -Name "mongod" -ErrorAction SilentlyContinue
    if (-not $mongoProcess) {
        Write-Host "❌ MongoDB n'est pas en cours d'exécution!" -ForegroundColor Red
        Write-Host "💡 Veuillez démarrer MongoDB avec: mongod --dbpath C:\data\db" -ForegroundColor Cyan
        Write-Host "💡 Ou utilisez MongoDB Compass pour démarrer le service" -ForegroundColor Cyan
        exit 1
    }
    Write-Host "✅ MongoDB est en cours d'exécution" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Impossible de vérifier MongoDB, continuons..." -ForegroundColor Yellow
}

# Démarrer le backend
Write-Host "🔧 Démarrage du backend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-File", "fix-java-and-start.ps1" -WindowStyle Normal

# Attendre que le backend démarre
Write-Host "⏳ Attente du démarrage du backend (30 secondes)..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Tester le backend
Write-Host "🧪 Test du backend..." -ForegroundColor Cyan
& ./test-mongodb-final.ps1

# Démarrer le frontend
Write-Host "🎨 Démarrage du frontend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-File", "start-frontend-clean.ps1" -WindowStyle Normal

Write-Host "" -ForegroundColor White
Write-Host "🎉 PROJET DÉMARRÉ AVEC SUCCÈS!" -ForegroundColor Green
Write-Host "==============================" -ForegroundColor Green
Write-Host "" -ForegroundColor White
Write-Host "🌐 Frontend: http://localhost:4200" -ForegroundColor Cyan
Write-Host "🔧 Backend: http://localhost:8080" -ForegroundColor Cyan
Write-Host "🗃️ MongoDB: localhost:27017/egabank" -ForegroundColor Cyan
Write-Host "" -ForegroundColor White
Write-Host "📋 COMPTES DE TEST:" -ForegroundColor Yellow
Write-Host "👑 Admin: admin / admin123" -ForegroundColor White
Write-Host "" -ForegroundColor White
Write-Host "⏹️ Pour arrêter, fermez les fenêtres PowerShell ouvertes" -ForegroundColor Red