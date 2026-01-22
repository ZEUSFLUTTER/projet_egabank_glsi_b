#!/usr/bin/env pwsh

Write-Host "🎨 DÉMARRAGE FRONTEND SEULEMENT" -ForegroundColor Green
Write-Host "===============================" -ForegroundColor Green

# Vérifier le backend
Write-Host "🔍 Test backend..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/test/health" -Method GET -TimeoutSec 5
    Write-Host "✅ Backend OK: $($response.message)" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend non accessible!" -ForegroundColor Red
    Write-Host "💡 Démarrez d'abord le backend avec: ./fix-java-and-start.ps1" -ForegroundColor Yellow
    exit 1
}

# Aller dans frontend
Set-Location "frontend-angular"

Write-Host "🚀 Démarrage Angular..." -ForegroundColor Green
Write-Host "🌐 http://localhost:4200" -ForegroundColor Cyan
Write-Host "👑 Admin: admin / admin123" -ForegroundColor Yellow
Write-Host "" -ForegroundColor White

npm start