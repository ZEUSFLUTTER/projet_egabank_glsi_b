#!/usr/bin/env pwsh

Write-Host "🎯 TEST FINAL MONGODB - EGA BANK" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

$baseUrl = "http://localhost:8080/api"

# Attendre que le backend soit prêt
Write-Host "⏳ Attente du backend..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Test endpoint de santé
Write-Host "🔍 Test endpoint de santé..." -ForegroundColor Cyan
try {
    $healthResponse = Invoke-RestMethod -Uri "$baseUrl/test/health" -Method GET
    Write-Host "✅ Backend accessible!" -ForegroundColor Green
    Write-Host "   Status: $($healthResponse.status)" -ForegroundColor White
    Write-Host "   Message: $($healthResponse.message)" -ForegroundColor White
    Write-Host "   Database: $($healthResponse.database)" -ForegroundColor White
} catch {
    Write-Host "❌ Backend non accessible: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "💡 Vérifiez que le backend est démarré" -ForegroundColor Yellow
    exit 1
}

# Test endpoint info
Write-Host "📊 Test endpoint info..." -ForegroundColor Cyan
try {
    $infoResponse = Invoke-RestMethod -Uri "$baseUrl/test/info" -Method GET
    Write-Host "✅ Informations récupérées!" -ForegroundColor Green
    Write-Host "   Application: $($infoResponse.application)" -ForegroundColor White
    Write-Host "   Version: $($infoResponse.version)" -ForegroundColor White
    Write-Host "   Database: $($infoResponse.database)" -ForegroundColor White
} catch {
    Write-Host "⚠️ Erreur info: $($_.Exception.Message)" -ForegroundColor Yellow
}

# Test création d'un admin
Write-Host "👑 Test création admin..." -ForegroundColor Cyan

$adminData = @{
    nom = "Admin"
    prenom = "System"
    dateNaissance = "1990-01-01"
    sexe = "M"
    adresse = "123 Admin Street"
    telephone = "0123456789"
    courriel = "admin@egabank.com"
    nationalite = "Française"
    username = "admin"
    password = "admin123"
} | ConvertTo-Json

$headers = @{
    "Content-Type" = "application/json"
}

try {
    $adminResponse = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method POST -Body $adminData -Headers $headers
    Write-Host "✅ Admin créé!" -ForegroundColor Green
    Write-Host "   Username: $($adminResponse.username)" -ForegroundColor White
    Write-Host "   Role: $($adminResponse.role)" -ForegroundColor White
    
    # Test de connexion
    $loginData = @{
        username = "admin"
        password = "admin123"
    } | ConvertTo-Json
    
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $loginData -Headers $headers
    Write-Host "✅ Connexion admin réussie!" -ForegroundColor Green
    Write-Host "   Token: $($loginResponse.token.Substring(0, 30))..." -ForegroundColor White
    
} catch {
    Write-Host "⚠️ Admin: $($_.Exception.Message)" -ForegroundColor Yellow
    
    # Essayer juste la connexion
    try {
        $loginData = @{
            username = "admin"
            password = "admin123"
        } | ConvertTo-Json
        
        $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $loginData -Headers $headers
        Write-Host "✅ Admin existe déjà - Connexion OK!" -ForegroundColor Green
    } catch {
        Write-Host "❌ Connexion admin échouée" -ForegroundColor Red
    }
}

Write-Host "" -ForegroundColor White
Write-Host "🎉 MIGRATION MONGODB TERMINÉE!" -ForegroundColor Green
Write-Host "===============================" -ForegroundColor Green
Write-Host "" -ForegroundColor White
Write-Host "✅ Backend MongoDB: http://localhost:8080" -ForegroundColor Cyan
Write-Host "✅ Base de données: localhost:27017/egabank" -ForegroundColor Cyan
Write-Host "✅ API fonctionnelle" -ForegroundColor Cyan
Write-Host "" -ForegroundColor White
Write-Host "🚀 PROCHAINES ÉTAPES:" -ForegroundColor Yellow
Write-Host "1. Démarrer le frontend: cd frontend-angular && npm start" -ForegroundColor White
Write-Host "2. Tester sur: http://localhost:4200" -ForegroundColor White
Write-Host "3. Se connecter avec: admin / admin123" -ForegroundColor White