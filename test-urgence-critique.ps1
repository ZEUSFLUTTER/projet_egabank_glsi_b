# 🚨 TEST URGENCE CRITIQUE - AUTHENTIFICATION
Write-Host "🚨 TEST URGENCE CRITIQUE - AUTHENTIFICATION" -ForegroundColor Red
Write-Host "=============================================" -ForegroundColor Red
Write-Host ""

Write-Host "🔧 CORRECTIONS D'URGENCE APPLIQUÉES:" -ForegroundColor Yellow
Write-Host "- ✅ Contournement des Observables défaillants" -ForegroundColor Green
Write-Host "- ✅ Appels HTTP directs dans les composants" -ForegroundColor Green
Write-Host "- ✅ Redirections forcées avec window.location" -ForegroundColor Green
Write-Host "- ✅ Logs détaillés pour debugging" -ForegroundColor Green
Write-Host "- ✅ Double sécurité router + window.location" -ForegroundColor Green
Write-Host ""

# Test backend immédiat
Write-Host "1️⃣ VÉRIFICATION BACKEND CRITIQUE:" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan

# Test admin
$adminData = @{
    username = "admin"
    password = "Admin@123"
} | ConvertTo-Json

Write-Host "Test Admin Login..." -ForegroundColor White
try {
    $adminResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -Body $adminData -ContentType "application/json"
    Write-Host "✅ BACKEND ADMIN: FONCTIONNEL" -ForegroundColor Green
    Write-Host "   Token: $($adminResponse.token.Substring(0,30))..." -ForegroundColor Cyan
    Write-Host "   Role: $($adminResponse.role)" -ForegroundColor Cyan
    $backendOK = $true
} catch {
    Write-Host "❌ BACKEND ADMIN: ÉCHEC CRITIQUE" -ForegroundColor Red
    Write-Host "   Erreur: $($_.Exception.Message)" -ForegroundColor Yellow
    $backendOK = $false
}

# Test inscription
Write-Host ""
Write-Host "Test Client Registration..." -ForegroundColor White
$timestamp = Get-Date -Format "HHmmss"
$clientData = @{
    nom = "TestUrgent"
    prenom = "User"
    dateNaissance = "1990-01-01"
    sexe = "M"
    adresse = "123 Urgent St"
    telephone = "12345678"
    courriel = "urgent$timestamp@test.com"
    nationalite = "Test"
    username = "urgent$timestamp"
    password = "urgent123"
} | ConvertTo-Json

try {
    $clientResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/register" -Method POST -Body $clientData -ContentType "application/json"
    Write-Host "✅ BACKEND CLIENT: FONCTIONNEL" -ForegroundColor Green
    Write-Host "   Username: $($clientResponse.username)" -ForegroundColor Cyan
    Write-Host "   Role: $($clientResponse.role)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ BACKEND CLIENT: ÉCHEC CRITIQUE" -ForegroundColor Red
    Write-Host "   Erreur: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "2️⃣ TESTS FRONTEND URGENTS À EFFECTUER:" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

if ($backendOK) {
    Write-Host "🎯 BACKEND OPÉRATIONNEL - TESTEZ LE FRONTEND:" -ForegroundColor Green
    Write-Host ""
    Write-Host "A. TEST ADMIN LOGIN URGENT:" -ForegroundColor Yellow
    Write-Host "   1. Ouvrir: http://localhost:4200/login" -ForegroundColor White
    Write-Host "   2. Username: admin" -ForegroundColor White
    Write-Host "   3. Password: Admin@123" -ForegroundColor White
    Write-Host "   4. Ouvrir F12 → Console AVANT de cliquer" -ForegroundColor White
    Write-Host "   5. Cliquer 'Se connecter'" -ForegroundColor White
    Write-Host "   6. Vérifier les logs '🚨 URGENCE'" -ForegroundColor White
    Write-Host ""
    Write-Host "B. TEST CLIENT REGISTRATION URGENT:" -ForegroundColor Yellow
    Write-Host "   1. Ouvrir: http://localhost:4200/register" -ForegroundColor White
    Write-Host "   2. Remplir le formulaire" -ForegroundColor White
    Write-Host "   3. Ouvrir F12 → Console AVANT de cliquer" -ForegroundColor White
    Write-Host "   4. Cliquer 'S'inscrire'" -ForegroundColor White
    Write-Host "   5. Vérifier les logs '🚨 URGENCE'" -ForegroundColor White
    Write-Host ""
    Write-Host "C. LOGS À SURVEILLER:" -ForegroundColor Yellow
    Write-Host "   - '🚨 URGENCE - Tentative de connexion'" -ForegroundColor White
    Write-Host "   - '🚨 URGENCE - Réponse reçue'" -ForegroundColor White
    Write-Host "   - '🚨 URGENCE - Token reçu, sauvegarde'" -ForegroundColor White
    Write-Host "   - '🚨 URGENCE - Redirection forcée'" -ForegroundColor White
    Write-Host ""
    Write-Host "D. SI ÇA NE FONCTIONNE TOUJOURS PAS:" -ForegroundColor Red
    Write-Host "   - Copier TOUS les logs de la console" -ForegroundColor White
    Write-Host "   - Vérifier l'onglet Network pour les requêtes HTTP" -ForegroundColor White
    Write-Host "   - Noter si les redirections se font" -ForegroundColor White
    Write-Host ""
    Write-Host "🚀 RÉSULTAT ATTENDU:" -ForegroundColor Green
    Write-Host "- Admin → Redirection immédiate vers /dashboard" -ForegroundColor White
    Write-Host "- Client → Redirection immédiate vers /profil" -ForegroundColor White
    Write-Host "- Logs détaillés dans la console" -ForegroundColor White
    Write-Host "- Pas de spinner infini" -ForegroundColor White
} else {
    Write-Host "🚨 BACKEND DÉFAILLANT - ACTIONS URGENTES:" -ForegroundColor Red
    Write-Host ""
    Write-Host "1. Redémarrer le backend:" -ForegroundColor Yellow
    Write-Host "   cd 'Ega backend/Ega-backend'" -ForegroundColor White
    Write-Host "   ./start-backend-fixed.ps1" -ForegroundColor White
    Write-Host ""
    Write-Host "2. Recréer l'admin:" -ForegroundColor Yellow
    Write-Host "   Invoke-RestMethod -Uri 'http://localhost:8080/api/auth/init-admin' -Method POST" -ForegroundColor White
    Write-Host ""
    Write-Host "3. Retester ce script" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📞 RAPPORT D'URGENCE REQUIS:" -ForegroundColor Yellow
Write-Host "============================" -ForegroundColor Yellow
Write-Host "Après les tests, rapportez IMMÉDIATEMENT:" -ForegroundColor White
Write-Host "1. Les logs '🚨 URGENCE' apparaissent-ils ?" -ForegroundColor Cyan
Write-Host "2. Les redirections se font-elles ?" -ForegroundColor Cyan
Write-Host "3. Y a-t-il encore des spinners infinis ?" -ForegroundColor Cyan
Write-Host "4. Quelles erreurs dans la console ?" -ForegroundColor Cyan

Write-Host ""
Write-Host "⚡ CETTE SOLUTION CONTOURNE LE PROBLÈME DES OBSERVABLES" -ForegroundColor Green
Write-Host "⚡ ELLE DEVRAIT RÉSOUDRE LE PROBLÈME IMMÉDIATEMENT" -ForegroundColor Green

Write-Host ""
Write-Host "Appuyez sur une touche pour continuer..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")