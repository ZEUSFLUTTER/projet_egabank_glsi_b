#!/usr/bin/env pwsh

Write-Host "🧪 TEST CLIENT NAVIGATION FINAL" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

$baseUrl = "http://localhost:8080/api"

Write-Host "`n1. Création d'un client de test..." -ForegroundColor Yellow

# Données du client de test
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
    $registerResponse = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method POST -ContentType "application/json" -Body $clientData
    Write-Host "✅ Client créé: $($registerResponse.username)" -ForegroundColor Green
    Write-Host "   Token: $($registerResponse.token.Substring(0,20))..." -ForegroundColor Gray
    Write-Host "   Role: $($registerResponse.role)" -ForegroundColor Gray
    Write-Host "   ClientId: $($registerResponse.clientId)" -ForegroundColor Gray
} catch {
    if ($_.Exception.Response.StatusCode -eq 409) {
        Write-Host "⚠️ Client existe déjà, tentative de connexion..." -ForegroundColor Yellow
        
        $loginData = @{
            username = "testclient"
            password = "Test@123"
        } | ConvertTo-Json
        
        try {
            $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -ContentType "application/json" -Body $loginData
            Write-Host "✅ Connexion réussie: $($loginResponse.username)" -ForegroundColor Green
            $registerResponse = $loginResponse
        } catch {
            Write-Host "❌ Erreur de connexion: $($_.Exception.Message)" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "❌ Erreur création client: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
}

Write-Host "`n2. Test des endpoints client..." -ForegroundColor Yellow

$headers = @{
    "Authorization" = "Bearer $($registerResponse.token)"
    "Content-Type" = "application/json"
}

# Test récupération client
try {
    $clientInfo = Invoke-RestMethod -Uri "$baseUrl/clients/$($registerResponse.clientId)" -Method GET -Headers $headers
    Write-Host "✅ Client récupéré: $($clientInfo.nom) $($clientInfo.prenom)" -ForegroundColor Green
} catch {
    Write-Host "❌ Erreur récupération client: $($_.Exception.Message)" -ForegroundColor Red
}

# Test récupération comptes
try {
    $comptes = Invoke-RestMethod -Uri "$baseUrl/comptes/client/$($registerResponse.clientId)" -Method GET -Headers $headers
    Write-Host "✅ Comptes récupérés: $($comptes.Count) compte(s)" -ForegroundColor Green
} catch {
    Write-Host "❌ Erreur récupération comptes: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n3. Instructions pour tester la navigation:" -ForegroundColor Yellow
Write-Host "   1. Ouvrez: http://localhost:4200/login" -ForegroundColor White
Write-Host "   2. Connectez-vous avec:" -ForegroundColor White
Write-Host "      Username: testclient" -ForegroundColor Cyan
Write-Host "      Password: Test@123" -ForegroundColor Cyan
Write-Host "   3. Après connexion, allez sur: http://localhost:4200/test-client" -ForegroundColor White
Write-Host "   4. Vérifiez que l'authentification est ✅ OUI" -ForegroundColor White
Write-Host "   5. Cliquez sur 'Aller au Profil'" -ForegroundColor White
Write-Host "   6. Observez les logs dans la console du navigateur (F12)" -ForegroundColor White

Write-Host "`n4. Logs à surveiller:" -ForegroundColor Yellow
Write-Host "   🛡️ Auth Guard - Vérification de l'authentification" -ForegroundColor Gray
Write-Host "   🧪 Test navigation vers /profil" -ForegroundColor Gray
Write-Host "   ProfilComponent: Initialisation..." -ForegroundColor Gray

Write-Host "`n5. Si le problème persiste:" -ForegroundColor Yellow
Write-Host "   - Utilisez: http://localhost:4200/debug-nav pour plus de détails" -ForegroundColor White
Write-Host "   - Vérifiez la console pour les erreurs Angular" -ForegroundColor White
Write-Host "   - Vérifiez que le token JWT est valide" -ForegroundColor White

Write-Host "`n🚀 Ouverture automatique du navigateur..." -ForegroundColor Green
Start-Process "http://localhost:4200/login"

Write-Host "`n📋 Credentials de test:" -ForegroundColor Cyan
Write-Host "Username: testclient" -ForegroundColor White
Write-Host "Password: Test@123" -ForegroundColor White