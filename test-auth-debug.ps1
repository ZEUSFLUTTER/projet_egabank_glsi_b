# Script de diagnostic des problèmes d'authentification EGA BANK
Write-Host "🔍 DIAGNOSTIC AUTHENTIFICATION EGA BANK" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""

# Test 1: Vérifier que le backend est accessible
Write-Host "1️⃣ Test Backend Accessibility" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/init-admin" -Method POST -ContentType "application/json"
    Write-Host "✅ Backend accessible: $response" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend inaccessible: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "💡 Vérifiez que le backend est démarré sur le port 8080" -ForegroundColor Yellow
}

Write-Host ""

# Test 2: Créer un admin si nécessaire
Write-Host "2️⃣ Test Admin Creation" -ForegroundColor Yellow
try {
    $adminResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/init-admin" -Method POST -ContentType "application/json"
    Write-Host "✅ Admin: $adminResponse" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Admin déjà existant ou erreur: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host ""

# Test 3: Test de connexion admin
Write-Host "3️⃣ Test Admin Login" -ForegroundColor Yellow
$loginData = @{
    username = "admin"
    password = "Admin@123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -Body $loginData -ContentType "application/json"
    Write-Host "✅ Connexion admin réussie!" -ForegroundColor Green
    Write-Host "   Token: $($loginResponse.token.Substring(0,20))..." -ForegroundColor Cyan
    Write-Host "   Username: $($loginResponse.username)" -ForegroundColor Cyan
    Write-Host "   Role: $($loginResponse.role)" -ForegroundColor Cyan
    Write-Host "   UserId: $($loginResponse.userId)" -ForegroundColor Cyan
    
    # Test 4: Test d'accès aux données avec le token admin
    Write-Host ""
    Write-Host "4️⃣ Test Admin Data Access" -ForegroundColor Yellow
    $headers = @{
        "Authorization" = "Bearer $($loginResponse.token)"
        "Content-Type" = "application/json"
    }
    
    try {
        $clientsResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/clients" -Method GET -Headers $headers
        Write-Host "✅ Accès clients admin: $($clientsResponse.Count) clients trouvés" -ForegroundColor Green
    } catch {
        Write-Host "❌ Erreur accès clients: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    try {
        $comptesResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/comptes" -Method GET -Headers $headers
        Write-Host "✅ Accès comptes admin: $($comptesResponse.Count) comptes trouvés" -ForegroundColor Green
    } catch {
        Write-Host "❌ Erreur accès comptes: $($_.Exception.Message)" -ForegroundColor Red
    }
    
} catch {
    Write-Host "❌ Échec connexion admin: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "💡 Vérifiez les credentials admin dans la base de données" -ForegroundColor Yellow
}

Write-Host ""

# Test 5: Test de création de client
Write-Host "5️⃣ Test Client Registration" -ForegroundColor Yellow
$clientData = @{
    nom = "TestClient"
    prenom = "Debug"
    dateNaissance = "1990-01-01"
    sexe = "M"
    adresse = "123 Test Street"
    telephone = "1234567890"
    courriel = "test.debug@example.com"
    nationalite = "Française"
    username = "testclient"
    password = "TestPass123"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/register" -Method POST -Body $clientData -ContentType "application/json"
    Write-Host "✅ Inscription client réussie!" -ForegroundColor Green
    Write-Host "   Username: $($registerResponse.username)" -ForegroundColor Cyan
    Write-Host "   Role: $($registerResponse.role)" -ForegroundColor Cyan
    Write-Host "   ClientId: $($registerResponse.clientId)" -ForegroundColor Cyan
    
    # Test 6: Test de connexion client
    Write-Host ""
    Write-Host "6️⃣ Test Client Login" -ForegroundColor Yellow
    $clientLoginData = @{
        username = "testclient"
        password = "TestPass123"
    } | ConvertTo-Json
    
    try {
        $clientLoginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -Body $clientLoginData -ContentType "application/json"
        Write-Host "✅ Connexion client réussie!" -ForegroundColor Green
        Write-Host "   Role: $($clientLoginResponse.role)" -ForegroundColor Cyan
        Write-Host "   ClientId: $($clientLoginResponse.clientId)" -ForegroundColor Cyan
    } catch {
        Write-Host "❌ Échec connexion client: $($_.Exception.Message)" -ForegroundColor Red
    }
    
} catch {
    Write-Host "⚠️ Inscription client échouée (peut-être déjà existant): $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host ""

# Test 7: Vérifier le frontend
Write-Host "7️⃣ Test Frontend Accessibility" -ForegroundColor Yellow
try {
    $frontendResponse = Invoke-WebRequest -Uri "http://localhost:4200" -Method GET
    if ($frontendResponse.StatusCode -eq 200 -or $frontendResponse.StatusCode -eq 302) {
        Write-Host "✅ Frontend accessible: Status $($frontendResponse.StatusCode)" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Frontend inaccessible: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "💡 Vérifiez que le frontend Angular est démarré sur le port 4200" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎯 RÉSUMÉ DU DIAGNOSTIC" -ForegroundColor Green
Write-Host "======================" -ForegroundColor Green
Write-Host "✅ Si tous les tests passent, les problèmes sont côté frontend (routing, guards, cache)" -ForegroundColor Green
Write-Host "❌ Si des tests échouent, les problèmes sont côté backend (auth, base de données)" -ForegroundColor Red
Write-Host ""
Write-Host "📋 SOLUTIONS RECOMMANDÉES:" -ForegroundColor Yellow
Write-Host "1. Problème admin → Vérifier les guards et le routing Angular" -ForegroundColor White
Write-Host "2. Problème session → Vérifier le DataCacheService et l'AuthService" -ForegroundColor White
Write-Host "3. Problème inscription → Vérifier la gestion d'erreurs dans RegisterComponent" -ForegroundColor White
Write-Host ""
Write-Host "Appuyez sur une touche pour continuer..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")