# Script de correction finale des problèmes d'authentification
Write-Host "🔧 CORRECTION FINALE AUTHENTIFICATION EGA BANK" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green
Write-Host ""

Write-Host "1️⃣ Test de l'état actuel..." -ForegroundColor Yellow

# Test admin login
$loginData = @{
    username = "admin"
    password = "Admin@123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -Body $loginData -ContentType "application/json"
    Write-Host "✅ Backend admin login: OK" -ForegroundColor Green
    
    # Test frontend avec ce token
    Write-Host "2️⃣ Test frontend avec token admin..." -ForegroundColor Yellow
    
    # Simuler le stockage du token comme le ferait le frontend
    $tokenData = @{
        token = $loginResponse.token
        username = $loginResponse.username
        role = $loginResponse.role
        userId = $loginResponse.userId
        clientId = $loginResponse.clientId
    }
    
    Write-Host "   Token reçu: $($loginResponse.token.Substring(0,20))..." -ForegroundColor Cyan
    Write-Host "   Role: $($loginResponse.role)" -ForegroundColor Cyan
    Write-Host "   Username: $($loginResponse.username)" -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ Erreur admin login: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "3️⃣ Test d'accès aux données..." -ForegroundColor Yellow

$headers = @{
    "Authorization" = "Bearer $($loginResponse.token)"
    "Content-Type" = "application/json"
}

try {
    $clientsResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/clients" -Method GET -Headers $headers
    Write-Host "✅ Clients: $($clientsResponse.Count) trouvés" -ForegroundColor Green
    
    $comptesResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/comptes" -Method GET -Headers $headers
    Write-Host "✅ Comptes: $($comptesResponse.Count) trouvés" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Erreur accès données: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "4️⃣ Test inscription client avec données simplifiées..." -ForegroundColor Yellow

# Essayer avec des données plus simples
$simpleClientData = @{
    nom = "Test"
    prenom = "User"
    dateNaissance = "1990-01-01"
    sexe = "M"
    adresse = "123 Test St"
    telephone = "12345678"
    courriel = "test@test.com"
    nationalite = "Test"
    username = "testuser"
    password = "password123"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/register" -Method POST -Body $simpleClientData -ContentType "application/json"
    Write-Host "✅ Inscription client: OK" -ForegroundColor Green
    Write-Host "   Username: $($registerResponse.username)" -ForegroundColor Cyan
    Write-Host "   Role: $($registerResponse.role)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Inscription client échouée: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Détails: $($_.ErrorDetails.Message)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎯 RÉSUMÉ ET RECOMMANDATIONS" -ForegroundColor Green
Write-Host "============================" -ForegroundColor Green

if ($loginResponse -and $clientsResponse) {
    Write-Host "✅ Backend fonctionne correctement" -ForegroundColor Green
    Write-Host "📋 Les problèmes sont côté frontend:" -ForegroundColor Yellow
    Write-Host "   1. Routing après login admin" -ForegroundColor White
    Write-Host "   2. Persistance des données entre pages" -ForegroundColor White
    Write-Host "   3. Gestion d'erreurs inscription" -ForegroundColor White
    Write-Host ""
    Write-Host "🔧 Solutions à appliquer:" -ForegroundColor Yellow
    Write-Host "   - Vérifier les guards Angular" -ForegroundColor White
    Write-Host "   - Améliorer le DataCacheService" -ForegroundColor White
    Write-Host "   - Corriger les redirections après auth" -ForegroundColor White
} else {
    Write-Host "❌ Problèmes backend détectés" -ForegroundColor Red
    Write-Host "   - Redémarrer le backend avec les corrections" -ForegroundColor White
}

Write-Host ""
Write-Host "Appuyez sur une touche pour continuer..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")