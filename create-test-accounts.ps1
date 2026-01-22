#!/usr/bin/env pwsh

Write-Host "👤 CRÉATION COMPTES DE TEST" -ForegroundColor Cyan
Write-Host "===========================" -ForegroundColor Cyan

Write-Host "`n1. Attente backend..." -ForegroundColor Yellow
$maxAttempts = 10
$attempt = 0

do {
    $attempt++
    Write-Host "   Tentative $attempt/$maxAttempts..." -ForegroundColor Gray
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8080/actuator/health" -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ Backend accessible!" -ForegroundColor Green
            break
        }
    } catch {
        # Backend pas encore prêt
    }
    
    if ($attempt -eq $maxAttempts) {
        Write-Host "❌ Backend non accessible après $maxAttempts tentatives" -ForegroundColor Red
        Write-Host "   Essayons quand même de créer les comptes..." -ForegroundColor Yellow
        break
    }
    
    Start-Sleep -Seconds 3
} while ($attempt -lt $maxAttempts)

Write-Host "`n2. Création compte admin..." -ForegroundColor Yellow
$adminData = @{
    username = "admin"
    password = "Admin@123"
} | ConvertTo-Json

try {
    $adminResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/register-admin" -Method POST -ContentType "application/json" -Body $adminData -ErrorAction SilentlyContinue
    Write-Host "✅ Admin créé: $($adminResponse.username)" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Admin existe déjà ou erreur: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host "`n3. Création compte client..." -ForegroundColor Yellow
$clientData = @{
    nom = "TestClient"
    prenom = "User"
    dateNaissance = "1990-01-01"
    sexe = "M"
    adresse = "123 Test Street"
    telephone = "0123456789"
    courriel = "testclient@example.com"
    nationalite = "Française"
    username = "testclient"
    password = "Test@123"
} | ConvertTo-Json

try {
    $clientResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/register" -Method POST -ContentType "application/json" -Body $clientData -ErrorAction SilentlyContinue
    Write-Host "✅ Client créé: $($clientResponse.username)" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Client existe déjà ou erreur: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host "`n✅ COMPTES CRÉÉS!" -ForegroundColor Green
Write-Host "   - Admin: admin / Admin@123" -ForegroundColor Cyan
Write-Host "   - Client: testclient / Test@123" -ForegroundColor Cyan

Write-Host "`n🧪 TESTEZ MAINTENANT:" -ForegroundColor Yellow
Write-Host "   1. Ouvrez: http://localhost:4200/login" -ForegroundColor White
Write-Host "   2. Connectez-vous avec un des comptes ci-dessus" -ForegroundColor White
Write-Host "   3. Testez les pages simplifiées" -ForegroundColor White

Start-Process "http://localhost:4200/login"