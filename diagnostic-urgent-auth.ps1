# Diagnostic urgent des problèmes d'authentification
Write-Host "🚨 DIAGNOSTIC URGENT - PROBLÈMES AUTHENTIFICATION" -ForegroundColor Red
Write-Host "=================================================" -ForegroundColor Red
Write-Host ""

# Test 1: Vérifier l'état du backend
Write-Host "1️⃣ Vérification Backend..." -ForegroundColor Yellow
try {
    $backendTest = Invoke-RestMethod -Uri "http://localhost:8080/actuator/health" -Method GET -TimeoutSec 5
    Write-Host "✅ Backend accessible" -ForegroundColor Green
} catch {
    try {
        # Test alternatif
        $backendTest = Invoke-WebRequest -Uri "http://localhost:8080" -Method GET -TimeoutSec 5
        Write-Host "✅ Backend accessible (status: $($backendTest.StatusCode))" -ForegroundColor Green
    } catch {
        Write-Host "❌ Backend inaccessible: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "💡 Le backend n'est pas démarré ou ne répond pas" -ForegroundColor Yellow
    }
}

# Test 2: Vérifier l'état du frontend
Write-Host ""
Write-Host "2️⃣ Vérification Frontend..." -ForegroundColor Yellow
try {
    $frontendTest = Invoke-WebRequest -Uri "http://localhost:4200" -Method GET -TimeoutSec 5
    Write-Host "✅ Frontend accessible (status: $($frontendTest.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend inaccessible: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "💡 Le frontend n'est pas démarré" -ForegroundColor Yellow
}

# Test 3: Test direct de l'API d'authentification
Write-Host ""
Write-Host "3️⃣ Test API Authentification..." -ForegroundColor Yellow

# Test admin login
$adminData = @{
    username = "admin"
    password = "Admin@123"
} | ConvertTo-Json

try {
    $adminResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -Body $adminData -ContentType "application/json" -TimeoutSec 10
    Write-Host "✅ API Admin Login: OK" -ForegroundColor Green
    Write-Host "   Token reçu: $($adminResponse.token.Substring(0,20))..." -ForegroundColor Cyan
    Write-Host "   Role: $($adminResponse.role)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ API Admin Login: ÉCHEC" -ForegroundColor Red
    Write-Host "   Erreur: $($_.Exception.Message)" -ForegroundColor Yellow
    if ($_.ErrorDetails) {
        Write-Host "   Détails: $($_.ErrorDetails.Message)" -ForegroundColor Yellow
    }
}

# Test client registration
Write-Host ""
Write-Host "4️⃣ Test API Inscription Client..." -ForegroundColor Yellow
$timestamp = Get-Date -Format "HHmmss"
$clientData = @{
    nom = "Test"
    prenom = "User"
    dateNaissance = "1990-01-01"
    sexe = "M"
    adresse = "123 Test St"
    telephone = "12345678"
    courriel = "test$timestamp@test.com"
    nationalite = "Test"
    username = "test$timestamp"
    password = "pass123"
} | ConvertTo-Json

try {
    $clientResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/register" -Method POST -Body $clientData -ContentType "application/json" -TimeoutSec 10
    Write-Host "✅ API Client Registration: OK" -ForegroundColor Green
    Write-Host "   Username: $($clientResponse.username)" -ForegroundColor Cyan
    Write-Host "   Role: $($clientResponse.role)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ API Client Registration: ÉCHEC" -ForegroundColor Red
    Write-Host "   Erreur: $($_.Exception.Message)" -ForegroundColor Yellow
    if ($_.ErrorDetails) {
        Write-Host "   Détails: $($_.ErrorDetails.Message)" -ForegroundColor Yellow
    }
}

# Test 5: Vérifier les ports utilisés
Write-Host ""
Write-Host "5️⃣ Vérification Ports..." -ForegroundColor Yellow
$port8080 = netstat -an | findstr :8080
$port4200 = netstat -an | findstr :4200

if ($port8080) {
    Write-Host "✅ Port 8080 (Backend): En écoute" -ForegroundColor Green
} else {
    Write-Host "❌ Port 8080 (Backend): Libre" -ForegroundColor Red
}

if ($port4200) {
    Write-Host "✅ Port 4200 (Frontend): En écoute" -ForegroundColor Green
} else {
    Write-Host "❌ Port 4200 (Frontend): Libre" -ForegroundColor Red
}

Write-Host ""
Write-Host "🔍 DIAGNOSTIC CONSOLE BROWSER" -ForegroundColor Yellow
Write-Host "=============================" -ForegroundColor Yellow
Write-Host "Pour diagnostiquer les problèmes frontend:" -ForegroundColor White
Write-Host "1. Ouvrir http://localhost:4200 dans le navigateur" -ForegroundColor White
Write-Host "2. Appuyer F12 pour ouvrir les outils développeur" -ForegroundColor White
Write-Host "3. Aller dans l'onglet Console" -ForegroundColor White
Write-Host "4. Essayer de se connecter et noter les erreurs" -ForegroundColor White
Write-Host "5. Vérifier l'onglet Network pour les requêtes HTTP" -ForegroundColor White

Write-Host ""
Write-Host "🚨 ACTIONS URGENTES RECOMMANDÉES" -ForegroundColor Red
Write-Host "=================================" -ForegroundColor Red

if (-not $port8080) {
    Write-Host "❗ DÉMARRER LE BACKEND:" -ForegroundColor Red
    Write-Host "   cd 'Ega backend/Ega-backend'" -ForegroundColor White
    Write-Host "   ./start-backend-fixed.ps1" -ForegroundColor White
}

if (-not $port4200) {
    Write-Host "❗ DÉMARRER LE FRONTEND:" -ForegroundColor Red
    Write-Host "   cd frontend-angular" -ForegroundColor White
    Write-Host "   ng serve --port 4200" -ForegroundColor White
}

if ($port8080 -and $port4200) {
    Write-Host "❗ PROBLÈME DE CONFIGURATION:" -ForegroundColor Red
    Write-Host "   Les deux services semblent démarrés" -ForegroundColor White
    Write-Host "   Le problème est probablement dans le code" -ForegroundColor White
    Write-Host "   Vérifiez la console du navigateur" -ForegroundColor White
}

Write-Host ""
Write-Host "Appuyez sur une touche pour continuer..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")