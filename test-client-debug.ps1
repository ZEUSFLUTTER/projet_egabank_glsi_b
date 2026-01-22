# 🔍 TEST CLIENT DEBUG - DIAGNOSTIC SIMPLE
Write-Host "🔍 TEST CLIENT DEBUG - DIAGNOSTIC SIMPLE" -ForegroundColor Red
Write-Host "=========================================" -ForegroundColor Red
Write-Host ""

# Test backend client
Write-Host "1️⃣ Test Backend Client..." -ForegroundColor Yellow
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
    Write-Host "✅ Backend Client: OK" -ForegroundColor Green
    Write-Host "   Username: $($clientResponse.username)" -ForegroundColor Cyan
    Write-Host "   Role: $($clientResponse.role)" -ForegroundColor Cyan
    $backendClientOK = $true
} catch {
    Write-Host "❌ Backend Client: ÉCHEC" -ForegroundColor Red
    Write-Host "   Erreur: $($_.Exception.Message)" -ForegroundColor Yellow
    $backendClientOK = $false
}

Write-Host ""
Write-Host "2️⃣ INSTRUCTIONS DE TEST FRONTEND:" -ForegroundColor Yellow
Write-Host "==================================" -ForegroundColor Yellow
Write-Host ""

if ($backendClientOK) {
    Write-Host "🎯 TESTEZ MAINTENANT:" -ForegroundColor Green
    Write-Host ""
    Write-Host "A. PAGE DE TEST CLIENT:" -ForegroundColor Yellow
    Write-Host "   1. Ouvrir: http://localhost:4200/test-client" -ForegroundColor White
    Write-Host "   2. Cette page montre l'état d'authentification" -ForegroundColor White
    Write-Host "   3. Si 'Authentifié: ❌ NON', connectez-vous d'abord" -ForegroundColor White
    Write-Host ""
    Write-Host "B. INSCRIPTION CLIENT:" -ForegroundColor Yellow
    Write-Host "   1. Aller sur: http://localhost:4200/register" -ForegroundColor White
    Write-Host "   2. Remplir le formulaire" -ForegroundColor White
    Write-Host "   3. F12 → Console pour voir les logs" -ForegroundColor White
    Write-Host "   4. Après inscription, aller sur /test-client" -ForegroundColor White
    Write-Host ""
    Write-Host "C. TEST NAVIGATION:" -ForegroundColor Yellow
    Write-Host "   1. Sur /test-client, cliquer 'Aller au Profil'" -ForegroundColor White
    Write-Host "   2. Noter ce qui se passe" -ForegroundColor White
    Write-Host "   3. Vérifier les erreurs dans la console" -ForegroundColor White
    Write-Host ""
    Write-Host "D. TEST DIRECT:" -ForegroundColor Yellow
    Write-Host "   1. Essayer d'aller directement sur /profil" -ForegroundColor White
    Write-Host "   2. Noter l'erreur exacte" -ForegroundColor White
    Write-Host ""
    Write-Host "📞 RAPPORTEZ-MOI:" -ForegroundColor Red
    Write-Host "=================" -ForegroundColor Red
    Write-Host "1. La page /test-client s'affiche-t-elle ?" -ForegroundColor Cyan
    Write-Host "2. Après inscription, êtes-vous 'Authentifié: ✅ OUI' ?" -ForegroundColor Cyan
    Write-Host "3. Quel est votre rôle affiché ?" -ForegroundColor Cyan
    Write-Host "4. Que se passe-t-il quand vous cliquez 'Aller au Profil' ?" -ForegroundColor Cyan
    Write-Host "5. Quelles erreurs dans la console F12 ?" -ForegroundColor Cyan
} else {
    Write-Host "❌ PROBLÈME BACKEND" -ForegroundColor Red
    Write-Host "Le backend ne permet pas l'inscription client" -ForegroundColor White
}

Write-Host ""
Write-Host "⚡ CETTE PAGE DE TEST VOUS DIRA EXACTEMENT QUEL EST LE PROBLÈME" -ForegroundColor Green

Write-Host ""
Write-Host "Appuyez sur une touche pour continuer..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")