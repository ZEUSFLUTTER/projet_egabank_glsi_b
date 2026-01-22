#!/usr/bin/env pwsh

Write-Host "🔄 REDÉMARRAGE PROPRE - EGA BANK MONGODB" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green

# Arrêter tous les processus Java existants
Write-Host "🛑 Arrêt des processus Java existants..." -ForegroundColor Yellow
try {
    Get-Process -Name "java" -ErrorAction SilentlyContinue | Stop-Process -Force
    Write-Host "✅ Processus Java arrêtés" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Aucun processus Java à arrêter" -ForegroundColor Yellow
}

# Attendre un peu
Start-Sleep -Seconds 2

# Vérifier MongoDB
Write-Host "🔍 Vérification de MongoDB..." -ForegroundColor Yellow
try {
    $mongoProcess = Get-Process -Name "mongod" -ErrorAction SilentlyContinue
    if ($mongoProcess) {
        Write-Host "✅ MongoDB est en cours d'exécution (PID: $($mongoProcess.Id))" -ForegroundColor Green
    } else {
        Write-Host "❌ MongoDB n'est pas en cours d'exécution!" -ForegroundColor Red
        Write-Host "💡 Veuillez démarrer MongoDB avec: mongod --dbpath C:\data\db" -ForegroundColor Cyan
        Write-Host "💡 Ou utilisez MongoDB Compass pour démarrer le service" -ForegroundColor Cyan
        
        # Demander si on continue quand même
        $continue = Read-Host "Continuer sans MongoDB? (y/N)"
        if ($continue -ne "y" -and $continue -ne "Y") {
            exit 1
        }
    }
} catch {
    Write-Host "⚠️ Impossible de vérifier MongoDB, continuons..." -ForegroundColor Yellow
}

# Nettoyer et compiler le backend
Write-Host "🧹 Nettoyage et compilation du backend..." -ForegroundColor Cyan
Set-Location "Ega backend/Ega-backend"

& ./mvnw clean -q
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors du nettoyage!" -ForegroundColor Red
    exit 1
}

& ./mvnw compile -q
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur de compilation!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Backend compilé avec succès!" -ForegroundColor Green

# Démarrer le backend
Write-Host "🚀 Démarrage du backend avec MongoDB..." -ForegroundColor Green
Write-Host "🌐 Backend: http://localhost:8080" -ForegroundColor Cyan
Write-Host "🗃️ MongoDB: localhost:27017/egabank" -ForegroundColor Cyan
Write-Host "" -ForegroundColor White
Write-Host "⏹️ Pour arrêter, appuyez sur Ctrl+C" -ForegroundColor Yellow
Write-Host "" -ForegroundColor White

& ./mvnw spring-boot:run