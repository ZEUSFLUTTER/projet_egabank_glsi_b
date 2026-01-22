#!/usr/bin/env pwsh

Write-Host "👑 CORRECTION RÔLE ADMIN" -ForegroundColor Green
Write-Host "========================" -ForegroundColor Green

# Attendre que le backend soit prêt
Write-Host "⏳ Attente du backend..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Test de santé
try {
    $health = Invoke-RestMethod -Uri "http://localhost:8080/api/test/health" -Method GET -TimeoutSec 10
    Write-Host "✅ Backend accessible: $($health.message)" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend non accessible!" -ForegroundColor Red
    exit 1
}

# Promouvoir admin
Write-Host "👑 Promotion de l'utilisateur admin..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/test/promote-admin/admin" -Method POST -TimeoutSec 10
    Write-Host "✅ $($response.message)" -ForegroundColor Green
    Write-Host "   Nouveau rôle: $($response.newRole)" -ForegroundColor White
} catch {
    Write-Host "⚠️ Erreur promotion: $($_.Exception.Message)" -ForegroundColor Yellow
}

# Test de connexion admin
Write-Host "🧪 Test connexion admin..." -ForegroundColor Cyan
$loginData = @{
    username = "admin"
    password = "admin123"
} | ConvertTo-Json

$headers = @{
    "Content-Type" = "application/json"
}

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -Body $loginData -Headers $headers
    Write-Host "✅ Connexion admin réussie!" -ForegroundColor Green
    Write-Host "   Username: $($loginResponse.username)" -ForegroundColor White
    Write-Host "   Role: $($loginResponse.role)" -ForegroundColor White
    Write-Host "   Token: $($loginResponse.token.Substring(0, 30))..." -ForegroundColor White
} catch {
    Write-Host "❌ Erreur connexion admin: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "" -ForegroundColor White
Write-Host "🎯 RÉSULTAT:" -ForegroundColor Green
Write-Host "👑 Admin: admin / admin123" -ForegroundColor Yellow
Write-Host "🌐 Frontend: http://localhost:4200" -ForegroundColor Cyan
Write-Host "🔧 Backend: http://localhost:8080" -ForegroundColor Cyan