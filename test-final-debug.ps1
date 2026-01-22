#!/usr/bin/env pwsh

Write-Host "🔍 Test final avec debugging avancé..." -ForegroundColor Cyan

# Vérifier que le frontend est accessible
Write-Host "`n1. Vérification du frontend..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:4200" -Method GET -UseBasicParsing -ErrorAction Stop
    Write-Host "✅ Frontend accessible (status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend non accessible: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Vérifier que le backend est accessible
Write-Host "`n2. Vérification du backend..." -ForegroundColor Yellow
try {
    $loginData = @{ username = "admin"; password = "Admin@123" } | ConvertTo-Json
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -Body $loginData -ContentType "application/json" -ErrorAction Stop
    Write-Host "✅ Backend accessible et admin connecté" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend non accessible: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "`n🎯 CORRECTIONS APPLIQUÉES:" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan

Write-Host "`n✅ Dashboard:" -ForegroundColor Green
Write-Host "   - Logs de debug détaillés ajoutés" -ForegroundColor Gray
Write-Host "   - Bouton 'Test Connexion' ajouté" -ForegroundColor Gray
Write-Host "   - Gestion d'erreur améliorée" -ForegroundColor Gray

Write-Host "`n✅ Page Clients:" -ForegroundColor Green
Write-Host "   - Logs de debug détaillés ajoutés" -ForegroundColor Gray
Write-Host "   - Bouton 'Test' ajouté" -ForegroundColor Gray
Write-Host "   - AuthService injecté" -ForegroundColor Gray

Write-Host "`n✅ Auth Interceptor:" -ForegroundColor Green
Write-Host "   - Logs de debug ajoutés" -ForegroundColor Gray
Write-Host "   - Vérification du token améliorée" -ForegroundColor Gray

Write-Host "`n🧪 INSTRUCTIONS DE TEST DÉTAILLÉES:" -ForegroundColor Yellow
Write-Host "===================================" -ForegroundColor Yellow

Write-Host "`n1. Ouvrez http://localhost:4200 dans votre navigateur" -ForegroundColor White

Write-Host "`n2. Ouvrez les outils de développement (F12)" -ForegroundColor White
Write-Host "   - Allez dans l'onglet Console" -ForegroundColor Gray
Write-Host "   - Gardez la console ouverte pendant tous les tests" -ForegroundColor Gray

Write-Host "`n3. Connectez-vous avec admin/Admin@123" -ForegroundColor White
Write-Host "   - Regardez les logs dans la console pendant la connexion" -ForegroundColor Gray

Write-Host "`n4. Testez le Dashboard:" -ForegroundColor White
Write-Host "   - Allez sur le Dashboard" -ForegroundColor Gray
Write-Host "   - Regardez les logs commençant par 🚀, 🔄, 👥, 🏦" -ForegroundColor Gray
Write-Host "   - Cliquez sur 'Test Connexion' et regardez le résultat" -ForegroundColor Gray
Write-Host "   - Cliquez sur 'Actualiser' et vérifiez qu'il fonctionne" -ForegroundColor Gray

Write-Host "`n5. Testez la page Clients:" -ForegroundColor White
Write-Host "   - Allez sur la page Clients" -ForegroundColor Gray
Write-Host "   - Regardez les logs commençant par 🚀, 👥" -ForegroundColor Gray
Write-Host "   - Cliquez sur 'Test' et regardez le résultat" -ForegroundColor Gray

Write-Host "`n6. Vérifiez l'Auth Interceptor:" -ForegroundColor White
Write-Host "   - Regardez les logs commençant par 🔐" -ForegroundColor Gray
Write-Host "   - Vérifiez que le token est ajouté aux requêtes" -ForegroundColor Gray

Write-Host "`n🔍 MESSAGES DE DEBUG À RECHERCHER:" -ForegroundColor Yellow
Write-Host "==================================" -ForegroundColor Yellow

Write-Host "`nDashboard:" -ForegroundColor Cyan
Write-Host "   🚀 Dashboard ngOnInit - DÉBUT" -ForegroundColor Gray
Write-Host "   🔄 loadDashboardData - DÉBUT" -ForegroundColor Gray
Write-Host "   ✅ Clients chargés avec succès: X" -ForegroundColor Gray
Write-Host "   ✅ Comptes chargés avec succès: X" -ForegroundColor Gray

Write-Host "`nClients:" -ForegroundColor Cyan
Write-Host "   🚀 Clients ngOnInit - DÉBUT" -ForegroundColor Gray
Write-Host "   👥 loadClients - DÉBUT" -ForegroundColor Gray
Write-Host "   ✅ Clients reçus avec succès: [...]" -ForegroundColor Gray

Write-Host "`nAuth Interceptor:" -ForegroundColor Cyan
Write-Host "   🔐 Auth Interceptor - URL: http://localhost:8080/api/..." -ForegroundColor Gray
Write-Host "   🔐 Auth Interceptor - Token présent: true" -ForegroundColor Gray

Write-Host "`n❌ ERREURS À SURVEILLER:" -ForegroundColor Red
Write-Host "========================" -ForegroundColor Red

Write-Host "   ❌ ERREUR complète clients: {...}" -ForegroundColor Gray
Write-Host "   ❌ Status: 401, 403, 500" -ForegroundColor Gray
Write-Host "   ⚠️ Auth Interceptor - Aucun token disponible" -ForegroundColor Gray
Write-Host "   ❌ Utilisateur non authentifié - ARRÊT" -ForegroundColor Gray

Write-Host "`n💡 SI LES PROBLÈMES PERSISTENT:" -ForegroundColor Red
Write-Host "===============================" -ForegroundColor Red

Write-Host "`n1. Vérifiez le localStorage:" -ForegroundColor Yellow
Write-Host "   - F12 → Application → Local Storage → http://localhost:4200" -ForegroundColor Gray
Write-Host "   - Vérifiez que 'token' et 'currentUser' existent" -ForegroundColor Gray

Write-Host "`n2. Testez les boutons de debug:" -ForegroundColor Yellow
Write-Host "   - Utilisez 'Test Connexion' sur le dashboard" -ForegroundColor Gray
Write-Host "   - Utilisez 'Test' sur la page clients" -ForegroundColor Gray

Write-Host "`n3. Vérifiez les erreurs réseau:" -ForegroundColor Yellow
Write-Host "   - F12 → Network → Regardez les requêtes HTTP" -ForegroundColor Gray
Write-Host "   - Vérifiez les codes de statut (200, 401, 403, 500)" -ForegroundColor Gray

Write-Host "`n🏁 Bonne chance pour le debugging!" -ForegroundColor Cyan