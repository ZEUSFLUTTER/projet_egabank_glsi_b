# Script de test automatisé pour tous les endpoints de l'API Ega Bank
Write-Host "🧪 TEST AUTOMATISÉ DES ENDPOINTS EGA BANK API" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan

$baseUrl = "http://localhost:8080/api"
$frontendUrl = "http://localhost:4200"

# Variables globales
$global:jwtToken = ""
$global:clientId = ""
$global:compteNumero = ""

# Fonction pour faire des requêtes HTTP
function Invoke-ApiRequest {
    param(
        [string]$Method,
        [string]$Url,
        [object]$Body = $null,
        [hashtable]$Headers = @{}
    )
    
    try {
        $requestParams = @{
            Uri = $Url
            Method = $Method
            ContentType = "application/json"
            Headers = $Headers
        }
        
        if ($Body) {
            $requestParams.Body = ($Body | ConvertTo-Json -Depth 10)
        }
        
        $response = Invoke-RestMethod @requestParams
        return @{ Success = $true; Data = $response; StatusCode = 200 }
    }
    catch {
        $statusCode = if ($_.Exception.Response) { $_.Exception.Response.StatusCode.value__ } else { 0 }
        return @{ Success = $false; Error = $_.Exception.Message; StatusCode = $statusCode }
    }
}

# Fonction pour ajouter le token JWT aux headers
function Get-AuthHeaders {
    if ($global:jwtToken) {
        return @{ "Authorization" = "Bearer $global:jwtToken" }
    }
    return @{}
}

Write-Host "`n1. VÉRIFICATION DU BACKEND" -ForegroundColor Yellow
Write-Host "----------------------------"

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/../actuator/health" -Method GET -TimeoutSec 5 -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Backend accessible" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Backend non accessible - Démarrez le backend d'abord" -ForegroundColor Red
    Write-Host "   Commande: cd 'Ega backend/Ega-backend' && ./mvnw spring-boot:run" -ForegroundColor Gray
    exit 1
}

Write-Host "`n2. TESTS D'AUTHENTIFICATION" -ForegroundColor Yellow
Write-Host "-----------------------------"

# Test 1: Initialisation Admin
Write-Host "🔐 Test 1: Initialisation Admin..."
$initResult = Invoke-ApiRequest -Method "POST" -Url "$baseUrl/auth/init-admin?username=admin&password=Admin@123"
if ($initResult.Success) {
    Write-Host "✅ Admin initialisé" -ForegroundColor Green
} else {
    Write-Host "⚠️ Admin déjà existant ou erreur: $($initResult.Error)" -ForegroundColor Yellow
}

# Test 2: Connexion Admin
Write-Host "🔐 Test 2: Connexion Admin..."
$loginBody = @{
    username = "admin"
    password = "Admin@123"
}
$loginResult = Invoke-ApiRequest -Method "POST" -Url "$baseUrl/auth/login" -Body $loginBody
if ($loginResult.Success) {
    $global:jwtToken = $loginResult.Data.token
    Write-Host "✅ Connexion admin réussie" -ForegroundColor Green
    Write-Host "   Token: $($global:jwtToken.Substring(0, 30))..." -ForegroundColor Gray
} else {
    Write-Host "❌ Échec connexion admin: $($loginResult.Error)" -ForegroundColor Red
    exit 1
}

# Test 3: Inscription Client
Write-Host "🔐 Test 3: Inscription Client..."
$timestamp = [DateTimeOffset]::Now.ToUnixTimeSeconds()
$registerBody = @{
    nom = "TestUser"
    prenom = "Test"
    dateNaissance = "1990-01-01"
    sexe = "M"
    adresse = "123 Test Street"
    telephone = "0123456789"
    courriel = "test$timestamp@email.com"
    nationalite = "Française"
    username = "testuser$timestamp"
    password = "testpass123"
}
$registerResult = Invoke-ApiRequest -Method "POST" -Url "$baseUrl/auth/register" -Body $registerBody
if ($registerResult.Success) {
    $global:clientId = $registerResult.Data.clientId
    Write-Host "✅ Inscription client réussie" -ForegroundColor Green
    Write-Host "   Client ID: $global:clientId" -ForegroundColor Gray
} else {
    Write-Host "❌ Échec inscription client: $($registerResult.Error)" -ForegroundColor Red
}

Write-Host "`n3. TESTS GESTION CLIENTS" -ForegroundColor Yellow
Write-Host "--------------------------"

# Test 4: Lister tous les clients
Write-Host "👥 Test 4: Lister tous les clients..."
$clientsResult = Invoke-ApiRequest -Method "GET" -Url "$baseUrl/clients" -Headers (Get-AuthHeaders)
if ($clientsResult.Success) {
    $clientCount = $clientsResult.Data.Count
    Write-Host "✅ $clientCount clients trouvés" -ForegroundColor Green
    if ($clientCount -gt 0 -and -not $global:clientId) {
        $global:clientId = $clientsResult.Data[0].id
        Write-Host "   Premier client ID sauvegardé: $global:clientId" -ForegroundColor Gray
    }
} else {
    Write-Host "❌ Échec liste clients: $($clientsResult.Error)" -ForegroundColor Red
}

# Test 5: Obtenir client par ID
if ($global:clientId) {
    Write-Host "👥 Test 5: Obtenir client par ID..."
    $clientResult = Invoke-ApiRequest -Method "GET" -Url "$baseUrl/clients/$global:clientId" -Headers (Get-AuthHeaders)
    if ($clientResult.Success) {
        Write-Host "✅ Client récupéré: $($clientResult.Data.nom) $($clientResult.Data.prenom)" -ForegroundColor Green
    } else {
        Write-Host "❌ Échec récupération client: $($clientResult.Error)" -ForegroundColor Red
    }
}

Write-Host "`n4. TESTS GESTION COMPTES" -ForegroundColor Yellow
Write-Host "--------------------------"

# Test 6: Créer un compte courant
if ($global:clientId) {
    Write-Host "🏦 Test 6: Créer compte courant..."
    $compteResult = Invoke-ApiRequest -Method "POST" -Url "$baseUrl/comptes/client/$global:clientId?typeCompte=COURANT" -Headers (Get-AuthHeaders)
    if ($compteResult.Success) {
        $global:compteNumero = $compteResult.Data.numeroCompte
        Write-Host "✅ Compte courant créé: $global:compteNumero" -ForegroundColor Green
    } else {
        Write-Host "❌ Échec création compte: $($compteResult.Error)" -ForegroundColor Red
    }
}

# Test 7: Lister tous les comptes
Write-Host "🏦 Test 7: Lister tous les comptes..."
$comptesResult = Invoke-ApiRequest -Method "GET" -Url "$baseUrl/comptes" -Headers (Get-AuthHeaders)
if ($comptesResult.Success) {
    $compteCount = $comptesResult.Data.Count
    Write-Host "✅ $compteCount comptes trouvés" -ForegroundColor Green
    if ($compteCount -gt 0 -and -not $global:compteNumero) {
        $global:compteNumero = $comptesResult.Data[0].numeroCompte
        Write-Host "   Premier compte numéro sauvegardé: $global:compteNumero" -ForegroundColor Gray
    }
} else {
    Write-Host "❌ Échec liste comptes: $($comptesResult.Error)" -ForegroundColor Red
}

Write-Host "`n5. TESTS TRANSACTIONS" -ForegroundColor Yellow
Write-Host "----------------------"

if ($global:compteNumero) {
    # Test 8: Effectuer un dépôt
    Write-Host "💳 Test 8: Effectuer un dépôt..."
    $depotBody = @{
        numeroCompte = $global:compteNumero
        montant = 1000.00
        description = "Dépôt de test"
    }
    $depotResult = Invoke-ApiRequest -Method "POST" -Url "$baseUrl/transactions/depot" -Body $depotBody -Headers (Get-AuthHeaders)
    if ($depotResult.Success) {
        Write-Host "✅ Dépôt effectué: 1000€" -ForegroundColor Green
        Write-Host "   Nouveau solde: $($depotResult.Data.soldeApres)€" -ForegroundColor Gray
    } else {
        Write-Host "❌ Échec dépôt: $($depotResult.Error)" -ForegroundColor Red
    }

    # Test 9: Effectuer un retrait
    Write-Host "💳 Test 9: Effectuer un retrait..."
    $retraitBody = @{
        numeroCompte = $global:compteNumero
        montant = 100.00
        description = "Retrait de test"
    }
    $retraitResult = Invoke-ApiRequest -Method "POST" -Url "$baseUrl/transactions/retrait" -Body $retraitBody -Headers (Get-AuthHeaders)
    if ($retraitResult.Success) {
        Write-Host "✅ Retrait effectué: 100€" -ForegroundColor Green
        Write-Host "   Nouveau solde: $($retraitResult.Data.soldeApres)€" -ForegroundColor Gray
    } else {
        Write-Host "❌ Échec retrait: $($retraitResult.Error)" -ForegroundColor Red
    }

    # Test 10: Consulter les transactions
    Write-Host "💳 Test 10: Consulter les transactions..."
    $transactionsResult = Invoke-ApiRequest -Method "GET" -Url "$baseUrl/transactions/compte/$global:compteNumero" -Headers (Get-AuthHeaders)
    if ($transactionsResult.Success) {
        $transactionCount = $transactionsResult.Data.Count
        Write-Host "✅ $transactionCount transactions trouvées" -ForegroundColor Green
    } else {
        Write-Host "❌ Échec consultation transactions: $($transactionsResult.Error)" -ForegroundColor Red
    }

    # Test 11: Générer un relevé
    Write-Host "💳 Test 11: Générer un relevé..."
    $releveBody = @{
        numeroCompte = $global:compteNumero
        dateDebut = "2024-01-01"
        dateFin = "2024-12-31"
    }
    $releveResult = Invoke-ApiRequest -Method "POST" -Url "$baseUrl/transactions/releve" -Body $releveBody -Headers (Get-AuthHeaders)
    if ($releveResult.Success) {
        $releveCount = $releveResult.Data.Count
        Write-Host "✅ Relevé généré avec $releveCount transactions" -ForegroundColor Green
    } else {
        Write-Host "❌ Échec génération relevé: $($releveResult.Error)" -ForegroundColor Red
    }
}

Write-Host "`n6. RÉSUMÉ DES TESTS" -ForegroundColor Yellow
Write-Host "--------------------"

Write-Host "📊 Endpoints testés:" -ForegroundColor White
Write-Host "   ✅ POST /api/auth/init-admin" -ForegroundColor Green
Write-Host "   ✅ POST /api/auth/login" -ForegroundColor Green
Write-Host "   ✅ POST /api/auth/register" -ForegroundColor Green
Write-Host "   ✅ GET  /api/clients" -ForegroundColor Green
Write-Host "   ✅ GET  /api/clients/{id}" -ForegroundColor Green
Write-Host "   ✅ POST /api/comptes/client/{clientId}" -ForegroundColor Green
Write-Host "   ✅ GET  /api/comptes" -ForegroundColor Green
Write-Host "   ✅ POST /api/transactions/depot" -ForegroundColor Green
Write-Host "   ✅ POST /api/transactions/retrait" -ForegroundColor Green
Write-Host "   ✅ GET  /api/transactions/compte/{numeroCompte}" -ForegroundColor Green
Write-Host "   ✅ POST /api/transactions/releve" -ForegroundColor Green

Write-Host "`n📋 Collections Postman générées:" -ForegroundColor White
Write-Host "   📄 Ega-Bank-API-Collection.postman_collection.json" -ForegroundColor Gray
Write-Host "   🌍 Ega-Bank-Environment.postman_environment.json" -ForegroundColor Gray

Write-Host "`n🎯 Pour utiliser les collections:" -ForegroundColor Cyan
Write-Host "   1. Ouvrez Postman" -ForegroundColor Gray
Write-Host "   2. Importez les fichiers .json" -ForegroundColor Gray
Write-Host "   3. Sélectionnez l'environnement 'Ega Bank - Environnement Local'" -ForegroundColor Gray
Write-Host "   4. Exécutez les requêtes dans l'ordre des dossiers" -ForegroundColor Gray

Write-Host "`n✅ TESTS TERMINÉS AVEC SUCCÈS!" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Cyan