#!/usr/bin/env pwsh

Write-Host "🔍 DIAGNOSTIC PROBLEME FINAL" -ForegroundColor Red
Write-Host "=============================" -ForegroundColor Red

Write-Host "`n1. Vérification des services..." -ForegroundColor Yellow

# Test Backend
Write-Host "`n   Backend (port 8080):" -ForegroundColor Cyan
try {
    $backendTest = Invoke-WebRequest -Uri "http://localhost:8080/api/auth/login" -Method POST -ContentType "application/json" -Body '{"username":"test","password":"test"}' -ErrorAction SilentlyContinue
    if ($backendTest.StatusCode -eq 401) {
        Write-Host "   ✅ Backend accessible (401 = normal pour mauvais credentials)" -ForegroundColor Green
    }
} catch {
    Write-Host "   ❌ Backend non accessible: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   🔧 Solution: Redémarrer le backend" -ForegroundColor Yellow
}

# Test Frontend
Write-Host "`n   Frontend (port 4200):" -ForegroundColor Cyan
try {
    $frontendTest = Invoke-WebRequest -Uri "http://localhost:4200" -ErrorAction SilentlyContinue
    Write-Host "   ✅ Frontend accessible" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Frontend non accessible: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   🔧 Solution: Redémarrer le frontend" -ForegroundColor Yellow
}

Write-Host "`n2. Test de connexion client..." -ForegroundColor Yellow

$loginData = @{
    username = "testclient"
    password = "Test@123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -ContentType "application/json" -Body $loginData
    Write-Host "   ✅ Connexion client réussie" -ForegroundColor Green
    Write-Host "   👤 Username: $($loginResponse.username)" -ForegroundColor Gray
    Write-Host "   🎭 Role: $($loginResponse.role)" -ForegroundColor Gray
    Write-Host "   🆔 ClientId: $($loginResponse.clientId)" -ForegroundColor Gray
    Write-Host "   🎫 Token: $($loginResponse.token.Substring(0,20))..." -ForegroundColor Gray
    
    # Test récupération client
    $headers = @{
        "Authorization" = "Bearer $($loginResponse.token)"
        "Content-Type" = "application/json"
    }
    
    try {
        $clientInfo = Invoke-RestMethod -Uri "http://localhost:8080/api/clients/$($loginResponse.clientId)" -Method GET -Headers $headers
        Write-Host "   ✅ Récupération données client réussie" -ForegroundColor Green
        Write-Host "   📝 Nom: $($clientInfo.nom) $($clientInfo.prenom)" -ForegroundColor Gray
    } catch {
        Write-Host "   ❌ Erreur récupération client: $($_.Exception.Message)" -ForegroundColor Red
    }
    
} catch {
    Write-Host "   ❌ Erreur connexion client: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "   🔧 Credentials incorrects ou client inexistant" -ForegroundColor Yellow
        Write-Host "   💡 Créer le client avec: ./test-client-navigation-final.ps1" -ForegroundColor Yellow
    }
}

Write-Host "`n3. Instructions de test détaillées:" -ForegroundColor Yellow
Write-Host "   📋 Étapes à suivre EXACTEMENT:" -ForegroundColor Cyan
Write-Host "   1. Ouvrez: http://localhost:4200/login" -ForegroundColor White
Write-Host "   2. Entrez: testclient / Test@123" -ForegroundColor White
Write-Host "   3. Cliquez 'Se connecter'" -ForegroundColor White
Write-Host "   4. Après connexion, allez sur: http://localhost:4200/test-client-browser" -ForegroundColor White
Write-Host "   5. Vérifiez l'état d'authentification" -ForegroundColor White
Write-Host "   6. Cliquez 'Aller au Profil'" -ForegroundColor White

Write-Host "`n4. Que vérifier dans la console (F12):" -ForegroundColor Yellow
Write-Host "   🔍 Logs à chercher:" -ForegroundColor Cyan
Write-Host "   - 🔐 AuthService constructor appelé" -ForegroundColor Gray
Write-Host "   - 🔐 Initialisation AuthService..." -ForegroundColor Gray
Write-Host "   - 🔐 ✅ Restauration session: testclient (ROLE_CLIENT)" -ForegroundColor Gray
Write-Host "   - 🛡️ Auth Guard - ✅ Utilisateur authentifié, accès autorisé" -ForegroundColor Gray

Write-Host "`n   ❌ Erreurs à signaler:" -ForegroundColor Red
Write-Host "   - ReferenceError: localStorage is not defined" -ForegroundColor Gray
Write-Host "   - 🛡️ Auth Guard - ❌ Utilisateur non authentifié" -ForegroundColor Gray
Write-Host "   - Navigation vers profil échouée" -ForegroundColor Gray
Write-Host "   - Erreurs HTTP 401/403" -ForegroundColor Gray

Write-Host "`n5. Que faire si ça ne marche toujours pas:" -ForegroundColor Yellow
Write-Host "   📝 Donnez-moi ces informations:" -ForegroundColor Cyan
Write-Host "   - À quelle étape ça bloque?" -ForegroundColor White
Write-Host "   - Quels messages d'erreur dans la console?" -ForegroundColor White
Write-Host "   - L'authentification montre-t-elle ✅ OUI ou ❌ NON?" -ForegroundColor White
Write-Host "   - La navigation échoue-t-elle ou la page ne se charge-t-elle pas?" -ForegroundColor White

Write-Host "`n🚀 Ouverture du navigateur pour test..." -ForegroundColor Green
Start-Process "http://localhost:4200/login"

Write-Host "`n⏳ Testez maintenant et dites-moi EXACTEMENT ce qui ne fonctionne pas!" -ForegroundColor Cyan