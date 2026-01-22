#!/usr/bin/env pwsh

Write-Host "🔍 Test complet du dashboard..." -ForegroundColor Cyan

# 1. Vérifier que le backend est accessible
Write-Host "`n1. Test du backend..." -ForegroundColor Yellow
try {
    $loginData = @{ username = "admin"; password = "Admin@123" } | ConvertTo-Json
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -Body $loginData -ContentType "application/json" -ErrorAction Stop
    Write-Host "✅ Backend accessible et admin connecté" -ForegroundColor Green
    
    $token = $loginResponse.token
    $headers = @{ "Authorization" = "Bearer $token" }
    
    # Test des données
    $clients = Invoke-RestMethod -Uri "http://localhost:8080/api/clients" -Method GET -Headers $headers
    $comptes = Invoke-RestMethod -Uri "http://localhost:8080/api/comptes" -Method GET -Headers $headers
    $soldeTotal = ($comptes | Measure-Object -Property solde -Sum).Sum
    
    Write-Host "   📊 Données disponibles:" -ForegroundColor Gray
    Write-Host "      - Clients: $($clients.Count)" -ForegroundColor Green
    Write-Host "      - Comptes: $($comptes.Count)" -ForegroundColor Green
    Write-Host "      - Solde total: $soldeTotal€" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Erreur backend: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 2. Vérifier que le frontend est accessible
Write-Host "`n2. Test du frontend..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:4200" -Method GET -UseBasicParsing -ErrorAction Stop
    Write-Host "✅ Frontend accessible (status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend non accessible: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "💡 Démarrez le frontend avec: ng serve --port 4200" -ForegroundColor Yellow
    exit 1
}

Write-Host "`n🎯 INSTRUCTIONS POUR TESTER LE DASHBOARD:" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

Write-Host "`n1. Ouvrez votre navigateur sur: http://localhost:4200" -ForegroundColor White
Write-Host "`n2. Connectez-vous avec les identifiants admin:" -ForegroundColor White
Write-Host "   Username: admin" -ForegroundColor Yellow
Write-Host "   Password: Admin@123" -ForegroundColor Yellow

Write-Host "`n3. Allez sur le Dashboard et vérifiez que vous voyez:" -ForegroundColor White
Write-Host "   ✅ Clients: $($clients.Count)" -ForegroundColor Green
Write-Host "   ✅ Comptes: $($comptes.Count)" -ForegroundColor Green
Write-Host "   ✅ Solde total: $([math]::Round($soldeTotal, 2))€" -ForegroundColor Green
Write-Host "   ✅ Transactions: (nombre variable selon les comptes)" -ForegroundColor Green

Write-Host "`n4. Testez le bouton 'Actualiser' pour recharger les données" -ForegroundColor White

Write-Host "`n5. Ouvrez les outils de développement (F12) pour voir les logs:" -ForegroundColor White
Write-Host "   - Recherchez les messages commençant par 🚀, 👥, 🏦, 💰, 📊" -ForegroundColor Gray
Write-Host "   - Vérifiez qu'il n'y a pas d'erreurs 403 ou 401" -ForegroundColor Gray

Write-Host "`n6. Si les statistiques affichent 0:" -ForegroundColor Yellow
Write-Host "   - Vérifiez que vous êtes bien connecté (token dans localStorage)" -ForegroundColor Gray
Write-Host "   - Regardez la console pour les erreurs d'authentification" -ForegroundColor Gray
Write-Host "   - Essayez de vous déconnecter et reconnecter" -ForegroundColor Gray

Write-Host "`n🔧 DÉPANNAGE:" -ForegroundColor Red
Write-Host "=============" -ForegroundColor Red
Write-Host "Si le dashboard affiche toujours 0:" -ForegroundColor Yellow
Write-Host "1. Vérifiez dans la console du navigateur (F12)" -ForegroundColor Gray
Write-Host "2. Recherchez les erreurs HTTP (401, 403, 500)" -ForegroundColor Gray
Write-Host "3. Vérifiez que le token est présent dans localStorage" -ForegroundColor Gray
Write-Host "4. Testez les API directement avec les scripts PowerShell" -ForegroundColor Gray

Write-Host "`n🏁 Bonne chance pour les tests!" -ForegroundColor Cyan