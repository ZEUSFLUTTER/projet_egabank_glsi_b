# Test simple et direct de l'authentification
Write-Host "🧪 TEST SIMPLE AUTHENTIFICATION" -ForegroundColor Green
Write-Host "===============================" -ForegroundColor Green
Write-Host ""

# Test 1: Admin Login
Write-Host "1️⃣ Test Admin Login..." -ForegroundColor Yellow
$adminData = @{
    username = "admin"
    password = "Admin@123"
} | ConvertTo-Json

try {
    $adminResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -Body $adminData -ContentType "application/json"
    Write-Host "✅ Admin Login: SUCCÈS" -ForegroundColor Green
    Write-Host "   Username: $($adminResponse.username)" -ForegroundColor Cyan
    Write-Host "   Role: $($adminResponse.role)" -ForegroundColor Cyan
    Write-Host "   Token: $($adminResponse.token.Substring(0,30))..." -ForegroundColor Cyan
} catch {
    Write-Host "❌ Admin Login: ÉCHEC" -ForegroundColor Red
    Write-Host "   Erreur: $($_.Exception.Message)" -ForegroundColor Yellow
    if ($_.ErrorDetails) {
        Write-Host "   Détails: $($_.ErrorDetails.Message)" -ForegroundColor Yellow
    }
}

Write-Host ""

# Test 2: Client Registration
Write-Host "2️⃣ Test Client Registration..." -ForegroundColor Yellow
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
    $clientResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/register" -Method POST -Body $clientData -ContentType "application/json"
    Write-Host "✅ Client Registration: SUCCÈS" -ForegroundColor Green
    Write-Host "   Username: $($clientResponse.username)" -ForegroundColor Cyan
    Write-Host "   Role: $($clientResponse.role)" -ForegroundColor Cyan
    Write-Host "   ClientId: $($clientResponse.clientId)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Client Registration: ÉCHEC" -ForegroundColor Red
    Write-Host "   Erreur: $($_.Exception.Message)" -ForegroundColor Yellow
    if ($_.ErrorDetails) {
        Write-Host "   Détails: $($_.ErrorDetails.Message)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "🌐 INSTRUCTIONS POUR TESTER LE FRONTEND" -ForegroundColor Yellow
Write-Host "=======================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. 👑 TEST ADMIN:" -ForegroundColor Cyan
Write-Host "   - Ouvrir: http://localhost:4200/login" -ForegroundColor White
Write-Host "   - Username: admin" -ForegroundColor White
Write-Host "   - Password: Admin@123" -ForegroundColor White
Write-Host "   - Cliquer 'Se connecter'" -ForegroundColor White
Write-Host "   - Vérifier redirection vers /dashboard" -ForegroundColor White
Write-Host ""
Write-Host "2. 👤 TEST CLIENT:" -ForegroundColor Cyan
Write-Host "   - Ouvrir: http://localhost:4200/register" -ForegroundColor White
Write-Host "   - Remplir tous les champs" -ForegroundColor White
Write-Host "   - Cliquer 'S'inscrire'" -ForegroundColor White
Write-Host "   - Vérifier redirection vers /profil" -ForegroundColor White
Write-Host ""
Write-Host "3. 🔍 EN CAS DE PROBLÈME:" -ForegroundColor Cyan
Write-Host "   - Appuyer F12 dans le navigateur" -ForegroundColor White
Write-Host "   - Aller dans l'onglet Console" -ForegroundColor White
Write-Host "   - Noter les erreurs affichées" -ForegroundColor White
Write-Host "   - Vérifier l'onglet Network pour les requêtes HTTP" -ForegroundColor White

if ($adminResponse -and $clientResponse) {
    Write-Host ""
    Write-Host "🎉 BACKEND FONCTIONNEL !" -ForegroundColor Green
    Write-Host "========================" -ForegroundColor Green
    Write-Host "✅ Admin login: OK" -ForegroundColor Green
    Write-Host "✅ Client registration: OK" -ForegroundColor Green
    Write-Host "✅ API accessible" -ForegroundColor Green
    Write-Host ""
    Write-Host "➡️ Testez maintenant le frontend dans le navigateur" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "❌ PROBLÈMES BACKEND DÉTECTÉS" -ForegroundColor Red
    Write-Host "=============================" -ForegroundColor Red
    Write-Host "Le backend a des problèmes. Vérifiez les logs ci-dessus." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Appuyez sur une touche pour continuer..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")