#!/usr/bin/env pwsh

Write-Host "🚀 TEST AUTHENTIFICATION COMPLÈTE" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green

# Test 1: Backend Login
Write-Host "`n1. Test backend login..." -ForegroundColor Yellow
try {
    $loginBody = @{username="admin"; password="admin123"} | ConvertTo-Json
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    Write-Host "✅ Backend login OK - Token reçu pour: $($loginResponse.username) ($($loginResponse.role))" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend login KO: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 2: Backend Register (test avec données fictives)
Write-Host "`n2. Test backend register..." -ForegroundColor Yellow
$registerData = @{
    nom = "TestNom"
    prenom = "TestPrenom"
    dateNaissance = "1990-01-01"
    sexe = "M"
    adresse = "123 Test Street"
    telephone = "12345678"
    courriel = "test@example.com"
    nationalite = "Française"
    username = "testuser$(Get-Random -Maximum 9999)"
    password = "testpass123"
}

try {
    $registerBody = $registerData | ConvertTo-Json
    $registerResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/register" -Method POST -Body $registerBody -ContentType "application/json"
    Write-Host "✅ Backend register OK - Token reçu pour: $($registerResponse.username) ($($registerResponse.role))" -ForegroundColor Green
} catch {
    if ($_.Exception.Message -like "*existe déjà*") {
        Write-Host "⚠️ Backend register - Utilisateur existe déjà (normal)" -ForegroundColor Yellow
    } else {
        Write-Host "❌ Backend register KO: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 3: Frontend accessible
Write-Host "`n3. Test frontend accessible..." -ForegroundColor Yellow
try {
    $frontendResponse = Invoke-WebRequest -Uri "http://localhost:4200" -Method GET -TimeoutSec 5
    if ($frontendResponse.StatusCode -eq 200) {
        Write-Host "✅ Frontend accessible sur port 4200" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Frontend non accessible: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🔧 CORRECTIONS APPLIQUÉES:" -ForegroundColor Magenta
Write-Host "   ✓ Login component utilise AuthService" -ForegroundColor White
Write-Host "   ✓ Register component utilise AuthService" -ForegroundColor White
Write-Host "   ✓ Suppression des appels HTTP directs" -ForegroundColor White
Write-Host "   ✓ Gestion d'erreur cohérente" -ForegroundColor White

Write-Host "`n🎯 TESTS MANUELS REQUIS:" -ForegroundColor Green
Write-Host "   1. Login: http://localhost:4200 → admin / admin123" -ForegroundColor Cyan
Write-Host "   2. Register: http://localhost:4200/register → nouveau compte" -ForegroundColor Cyan
Write-Host "   3. Vérifier les redirections après auth" -ForegroundColor Cyan

Write-Host "`n📋 IDENTIFIANTS ADMIN:" -ForegroundColor Yellow
Write-Host "   Username: admin" -ForegroundColor White
Write-Host "   Password: admin123" -ForegroundColor White