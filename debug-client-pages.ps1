# 🔍 DEBUG PAGES CLIENT - DIAGNOSTIC COMPLET
Write-Host "🔍 DEBUG PAGES CLIENT - DIAGNOSTIC COMPLET" -ForegroundColor Red
Write-Host "===========================================" -ForegroundColor Red
Write-Host ""

Write-Host "🧪 TESTS DIAGNOSTIQUES:" -ForegroundColor Yellow
Write-Host ""

# Test 1: Vérifier l'inscription client
Write-Host "1️⃣ Test inscription client..." -ForegroundColor Cyan
$timestamp = Get-Date -Format "HHmmss"
$clientData = @{
    nom = "TestClient"
    prenom = "Debug"
    dateNaissance = "1990-01-01"
    sexe = "M"
    adresse = "123 Test St"
    telephone = "12345678"
    courriel = "testclient$timestamp@test.com"
    nationalite = "Test"
    username = "testclient$timestamp"
    password = "test123"
} | ConvertTo-Json

try {
    $clientResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/register" -Method POST -Body $clientData -ContentType "application/json"
    Write-Host "✅ Inscription client API: OK" -ForegroundColor Green
    Write-Host "   Username: $($clientResponse.username)" -ForegroundColor Cyan
    Write-Host "   Role: $($clientResponse.role)" -ForegroundColor Cyan
    Write-Host "   ClientId: $($clientResponse.clientId)" -ForegroundColor Cyan
    Write-Host "   Token: $($clientResponse.token.Substring(0,20))..." -ForegroundColor Cyan
    
    $clientToken = $clientResponse.token
    $clientCreated = $true
} catch {
    Write-Host "❌ Inscription client API: ÉCHEC" -ForegroundColor Red
    Write-Host "   Erreur: $($_.Exception.Message)" -ForegroundColor Yellow
    $clientCreated = $false
}

Write-Host ""

# Test 2: Test connexion client
if ($clientCreated) {
    Write-Host "2️⃣ Test connexion client..." -ForegroundColor Cyan
    $clientLoginData = @{
        username = $clientResponse.username
        password = "test123"
    } | ConvertTo-Json
    
    try {
        $clientLoginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -Body $clientLoginData -ContentType "application/json"
        Write-Host "✅ Connexion client API: OK" -ForegroundColor Green
        Write-Host "   Role: $($clientLoginResponse.role)" -ForegroundColor Cyan
        Write-Host "   Token: $($clientLoginResponse.token.Substring(0,20))..." -ForegroundColor Cyan
        $clientLoginOK = $true
    } catch {
        Write-Host "❌ Connexion client API: ÉCHEC" -ForegroundColor Red
        Write-Host "   Erreur: $($_.Exception.Message)" -ForegroundColor Yellow
        $clientLoginOK = $false
    }
}

Write-Host ""

# Test 3: Vérifier les composants client
Write-Host "3️⃣ Vérification composants client..." -ForegroundColor Cyan
$clientComponents = @(
    "frontend-angular/src/app/components/profil/profil.component.ts",
    "frontend-angular/src/app/components/profil/profil.component.html",
    "frontend-angular/src/app/components/comptes/comptes.component.ts",
    "frontend-angular/src/app/components/comptes/comptes.component.html",
    "frontend-angular/src/app/components/transactions/transactions.component.ts",
    "frontend-angular/src/app/components/transactions/transactions.component.html"
)

$missingComponents = @()
foreach ($component in $clientComponents) {
    if (Test-Path $component) {
        $componentName = Split-Path $component -Leaf
        Write-Host "✅ $componentName" -ForegroundColor Green
    } else {
        $componentName = Split-Path $component -Leaf
        Write-Host "❌ $componentName MANQUANT" -ForegroundColor Red
        $missingComponents += $component
    }
}

Write-Host ""

# Test 4: Vérifier les routes client
Write-Host "4️⃣ Vérification routes client..." -ForegroundColor Cyan
$routesFile = "frontend-angular/src/app/app.routes.ts"
if (Test-Path $routesFile) {
    $routesContent = Get-Content $routesFile -Raw
    
    $clientRoutes = @("profil", "comptes", "transactions")
    foreach ($route in $clientRoutes) {
        if ($routesContent -match $route) {
            Write-Host "✅ Route /$route configurée" -ForegroundColor Green
        } else {
            Write-Host "❌ Route /$route MANQUANTE" -ForegroundColor Red
        }
    }
} else {
    Write-Host "❌ Fichier routes non trouvé" -ForegroundColor Red
}

Write-Host ""

# Test 5: Instructions de test manuel
Write-Host "5️⃣ INSTRUCTIONS TEST MANUEL:" -ForegroundColor Yellow
Write-Host "=============================" -ForegroundColor Yellow
Write-Host ""

if ($clientCreated -and $clientLoginOK) {
    Write-Host "🎯 TESTEZ MAINTENANT DANS LE NAVIGATEUR:" -ForegroundColor Green
    Write-Host ""
    Write-Host "A. TEST INSCRIPTION CLIENT:" -ForegroundColor Yellow
    Write-Host "   1. Aller sur: http://localhost:4200/register" -ForegroundColor White
    Write-Host "   2. Remplir le formulaire:" -ForegroundColor White
    Write-Host "      - Nom: Test" -ForegroundColor Gray
    Write-Host "      - Prénom: Client" -ForegroundColor Gray
    Write-Host "      - Date: 01/01/1990" -ForegroundColor Gray
    Write-Host "      - Sexe: M" -ForegroundColor Gray
    Write-Host "      - Adresse: 123 Test St" -ForegroundColor Gray
    Write-Host "      - Téléphone: 12345678" -ForegroundColor Gray
    Write-Host "      - Email: client@test.com" -ForegroundColor Gray
    Write-Host "      - Nationalité: Test" -ForegroundColor Gray
    Write-Host "      - Username: clienttest" -ForegroundColor Gray
    Write-Host "      - Password: test123" -ForegroundColor Gray
    Write-Host "   3. Cliquer 'S'inscrire'" -ForegroundColor White
    Write-Host "   4. OUVRIR F12 → CONSOLE AVANT" -ForegroundColor Red
    Write-Host ""
    Write-Host "B. RÉSULTAT ATTENDU:" -ForegroundColor Yellow
    Write-Host "   - Logs '🚨 URGENCE' dans la console" -ForegroundColor White
    Write-Host "   - Message 'Inscription réussie'" -ForegroundColor White
    Write-Host "   - Redirection vers /profil" -ForegroundColor White
    Write-Host "   - Page profil s'affiche" -ForegroundColor White
    Write-Host ""
    Write-Host "C. SI LA PAGE NE S'AFFICHE PAS:" -ForegroundColor Red
    Write-Host "   - Vérifier les erreurs dans la console" -ForegroundColor White
    Write-Host "   - Tester directement: http://localhost:4200/profil" -ForegroundColor White
    Write-Host "   - Tester la page de test: http://localhost:4200/test-auth" -ForegroundColor White
    Write-Host ""
    Write-Host "D. ERREURS COMMUNES À CHERCHER:" -ForegroundColor Yellow
    Write-Host "   - 'Cannot load component'" -ForegroundColor White
    Write-Host "   - 'Guard rejected navigation'" -ForegroundColor White
    Write-Host "   - 'Component not found'" -ForegroundColor White
    Write-Host "   - 'Authentication failed'" -ForegroundColor White
    Write-Host ""
    Write-Host "E. TEST ALTERNATIF - CONNEXION CLIENT:" -ForegroundColor Yellow
    Write-Host "   1. Aller sur: http://localhost:4200/login" -ForegroundColor White
    Write-Host "   2. Username: $($clientResponse.username)" -ForegroundColor White
    Write-Host "   3. Password: test123" -ForegroundColor White
    Write-Host "   4. Cliquer 'Se connecter'" -ForegroundColor White
    Write-Host "   5. Vérifier redirection vers /profil" -ForegroundColor White
} else {
    Write-Host "❌ PROBLÈME BACKEND CLIENT" -ForegroundColor Red
    Write-Host "Le backend ne permet pas l'inscription/connexion client" -ForegroundColor White
    Write-Host "Vérifiez les logs du backend Spring Boot" -ForegroundColor White
}

Write-Host ""
Write-Host "📞 RAPPORT REQUIS:" -ForegroundColor Yellow
Write-Host "==================" -ForegroundColor Yellow
Write-Host "Après le test, rapportez:" -ForegroundColor White
Write-Host "1. L'inscription client fonctionne-t-elle ?" -ForegroundColor Cyan
Write-Host "2. Y a-t-il redirection vers /profil ?" -ForegroundColor Cyan
Write-Host "3. La page profil s'affiche-t-elle ?" -ForegroundColor Cyan
Write-Host "4. Quelles erreurs dans la console F12 ?" -ForegroundColor Cyan
Write-Host "5. Que se passe-t-il si vous allez directement sur /profil ?" -ForegroundColor Cyan

if ($missingComponents.Count -gt 0) {
    Write-Host ""
    Write-Host "⚠️ COMPOSANTS MANQUANTS DÉTECTÉS:" -ForegroundColor Red
    foreach ($missing in $missingComponents) {
        Write-Host "   - $missing" -ForegroundColor Yellow
    }
    Write-Host "Ces composants doivent être créés pour que les pages client fonctionnent" -ForegroundColor White
}

Write-Host ""
Write-Host "Appuyez sur une touche pour continuer..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")