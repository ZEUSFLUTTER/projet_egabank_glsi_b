#!/usr/bin/env pwsh

Write-Host "🚀 DÉMARRAGE BACKEND EGA BANK - MONGODB" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green

# Vérifier si MongoDB est en cours d'exécution
Write-Host "🔍 Vérification de MongoDB..." -ForegroundColor Yellow
try {
    $mongoProcess = Get-Process -Name "mongod" -ErrorAction SilentlyContinue
    if ($mongoProcess) {
        Write-Host "✅ MongoDB est déjà en cours d'exécution (PID: $($mongoProcess.Id))" -ForegroundColor Green
    } else {
        Write-Host "⚠️ MongoDB ne semble pas être en cours d'exécution" -ForegroundColor Yellow
        Write-Host "💡 Assurez-vous que MongoDB est démarré sur le port 27017" -ForegroundColor Cyan
        Write-Host "💡 Commande pour démarrer MongoDB: mongod --dbpath C:\data\db" -ForegroundColor Cyan
    }
} catch {
    Write-Host "⚠️ Impossible de vérifier l'état de MongoDB" -ForegroundColor Yellow
}

# Aller dans le répertoire backend
Set-Location "Ega backend/Ega-backend"

Write-Host "📁 Répertoire actuel: $(Get-Location)" -ForegroundColor Cyan

# Nettoyer et compiler
Write-Host "🧹 Nettoyage du projet..." -ForegroundColor Yellow
& ./mvnw clean -q

Write-Host "🔨 Compilation du projet..." -ForegroundColor Yellow
& ./mvnw compile -q

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur de compilation!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Compilation réussie!" -ForegroundColor Green

# Démarrer le backend
Write-Host "🚀 Démarrage du backend Spring Boot avec MongoDB..." -ForegroundColor Green
Write-Host "🌐 Le backend sera disponible sur: http://localhost:8080" -ForegroundColor Cyan
Write-Host "📊 Base de données MongoDB: egabank sur localhost:27017" -ForegroundColor Cyan
Write-Host "" -ForegroundColor White
Write-Host "⏹️ Pour arrêter le serveur, appuyez sur Ctrl+C" -ForegroundColor Yellow
Write-Host "" -ForegroundColor White

& ./mvnw spring-boot:run