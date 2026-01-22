#!/usr/bin/env pwsh

Write-Host "🔄 REDÉMARRAGE COMPLET - EGA BANK MONGODB" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green

# Arrêter tous les processus
Write-Host "🛑 Arrêt de tous les processus..." -ForegroundColor Yellow
try {
    Get-Process -Name "java" -ErrorAction SilentlyContinue | Stop-Process -Force
    Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
    Write-Host "✅ Processus arrêtés" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Aucun processus à arrêter" -ForegroundColor Yellow
}

Start-Sleep -Seconds 3

# Vérifier MongoDB
Write-Host "🔍 Vérification MongoDB..." -ForegroundColor Yellow
$mongoProcess = Get-Process -Name "mongod" -ErrorAction SilentlyContinue
if ($mongoProcess) {
    Write-Host "✅ MongoDB actif (PID: $($mongoProcess.Id))" -ForegroundColor Green
} else {
    Write-Host "❌ MongoDB non détecté!" -ForegroundColor Red
    Write-Host "💡 Démarrez MongoDB avant de continuer" -ForegroundColor Cyan
    exit 1
}

# Démarrer le backend en arrière-plan
Write-Host "🔧 Démarrage backend..." -ForegroundColor Cyan
$backendJob = Start-Job -ScriptBlock {
    Set-Location "C:\Users\fifih\OneDrive\Documents\Egaprojet"
    & ./fix-java-and-start.ps1
}

# Attendre le backend
Write-Host "⏳ Attente backend (45 secondes)..." -ForegroundColor Yellow
Start-Sleep -Seconds 45

# Tester le backend
Write-Host "🧪 Test backend..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/test/health" -Method GET -TimeoutSec 10
    Write-Host "✅ Backend opérationnel: $($response.message)" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend non accessible!" -ForegroundColor Red
    Write-Host "💡 Vérifiez les logs du backend" -ForegroundColor Yellow
    exit 1
}

# Créer admin si nécessaire
Write-Host "👑 Création admin..." -ForegroundColor Cyan
& ./test-mongodb-final.ps1

# Démarrer le frontend
Write-Host "🎨 Démarrage frontend..." -ForegroundColor Green
Set-Location "frontend-angular"

Write-Host "🌐 Frontend: http://localhost:4200" -ForegroundColor Cyan
Write-Host "🔧 Backend: http://localhost:8080" -ForegroundColor Cyan
Write-Host "🗃️ MongoDB: localhost:27017/egabank" -ForegroundColor Cyan
Write-Host "" -ForegroundColor White
Write-Host "📋 CONNEXION:" -ForegroundColor Yellow
Write-Host "👑 Admin: admin / admin123" -ForegroundColor White
Write-Host "" -ForegroundColor White

npm start