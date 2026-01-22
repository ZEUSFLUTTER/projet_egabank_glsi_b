#!/usr/bin/env pwsh

Write-Host "🔍 Test de l'authentification et du localStorage..." -ForegroundColor Cyan

Write-Host "`n📋 CHECKLIST DE VÉRIFICATION:" -ForegroundColor Yellow
Write-Host "=============================" -ForegroundColor Yellow

Write-Host "`n1. ✅ Connectez-vous sur http://localhost:4200" -ForegroundColor White
Write-Host "   - Username: admin" -ForegroundColor Cyan
Write-Host "   - Password: Admin@123" -ForegroundColor Cyan

Write-Host "`n2. ✅ Vérifiez le localStorage (F12 → Application → Local Storage):" -ForegroundColor White
Write-Host "   - Clé 'token' doit exister et contenir un JWT" -ForegroundColor Gray
Write-Host "   - Clé 'currentUser' doit exister avec les infos utilisateur" -ForegroundColor Gray

Write-Host "`n3. ✅ Testez les boutons de debug:" -ForegroundColor White
Write-Host "   - Dashboard → Cliquez sur 'Test Connexion'" -ForegroundColor Gray
Write-Host "   - Clients → Cliquez sur 'Test'" -ForegroundColor Gray

Write-Host "`n4. ✅ Regardez la console (F12 → Console):" -ForegroundColor White
Write-Host "   - Messages 🚀 au chargement des pages" -ForegroundColor Gray
Write-Host "   - Messages 🔐 pour l'interceptor" -ForegroundColor Gray
Write-Host "   - Messages ✅ pour les succès" -ForegroundColor Gray
Write-Host "   - Messages ❌ pour les erreurs" -ForegroundColor Gray

Write-Host "`n🔧 SOLUTIONS SELON LES SYMPTÔMES:" -ForegroundColor Red
Write-Host "=================================" -ForegroundColor Red

Write-Host "`n🔴 Si le localStorage est vide:" -ForegroundColor Yellow
Write-Host "   1. Déconnectez-vous et reconnectez-vous" -ForegroundColor Gray
Write-Host "   2. Vérifiez que la connexion fonctionne" -ForegroundColor Gray
Write-Host "   3. Actualisez la page après connexion" -ForegroundColor Gray

Write-Host "`n🔴 Si les boutons de test ne fonctionnent pas:" -ForegroundColor Yellow
Write-Host "   1. Vérifiez les erreurs JavaScript dans la console" -ForegroundColor Gray
Write-Host "   2. Actualisez la page (F5)" -ForegroundColor Gray
Write-Host "   3. Videz le cache du navigateur" -ForegroundColor Gray

Write-Host "`n🔴 Si les requêtes HTTP échouent:" -ForegroundColor Yellow
Write-Host "   1. Vérifiez l'onglet Network (F12 → Network)" -ForegroundColor Gray
Write-Host "   2. Regardez les codes de statut des requêtes" -ForegroundColor Gray
Write-Host "   3. Vérifiez que le header Authorization est présent" -ForegroundColor Gray

Write-Host "`n🔴 Si l'interceptor ne fonctionne pas:" -ForegroundColor Yellow
Write-Host "   1. Vérifiez les logs 🔐 dans la console" -ForegroundColor Gray
Write-Host "   2. Redémarrez le serveur Angular (Ctrl+C puis ng serve)" -ForegroundColor Gray

Write-Host "`n💡 COMMANDES DE DÉPANNAGE:" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan

Write-Host "`nSi rien ne fonctionne, essayez dans l'ordre:" -ForegroundColor White
Write-Host "1. Actualisez la page (F5)" -ForegroundColor Gray
Write-Host "2. Videz le cache (Ctrl+Shift+R)" -ForegroundColor Gray
Write-Host "3. Ouvrez en navigation privée" -ForegroundColor Gray
Write-Host "4. Redémarrez le serveur Angular" -ForegroundColor Gray

Write-Host "`n🎯 RÉSULTAT ATTENDU:" -ForegroundColor Green
Write-Host "===================" -ForegroundColor Green
Write-Host "Après connexion, vous devriez voir:" -ForegroundColor White
Write-Host "   📊 Dashboard: 8 clients, 11 comptes, 29,631,200€" -ForegroundColor Green
Write-Host "   👥 Clients: Liste de 8 clients" -ForegroundColor Green
Write-Host "   🏦 Comptes: Liste de 11 comptes" -ForegroundColor Green
Write-Host "   💳 Transactions: Historique des transactions" -ForegroundColor Green

Write-Host "`n🏁 Testez maintenant dans le navigateur!" -ForegroundColor Cyan