# 🚨 TEST FINAL URGENCE - CORRECTIONS HTTPCLIENT
Write-Host "🚨 TEST FINAL URGENCE - CORRECTIONS HTTPCLIENT" -ForegroundColor Red
Write-Host "===============================================" -ForegroundColor Red
Write-Host ""

Write-Host "🔧 CORRECTIONS CRITIQUES APPLIQUÉES:" -ForegroundColor Yellow
Write-Host "- ✅ Configuration HttpClient avec withFetch()" -ForegroundColor Green
Write-Host "- ✅ Contournement de l'intercepteur d'auth" -ForegroundColor Green
Write-Host "- ✅ Headers personnalisés pour debugging" -ForegroundColor Green
Write-Host "- ✅ Appels HTTP directs sans Observable complexe" -ForegroundColor Green
Write-Host "- ✅ Logs détaillés avec préfixe 🚨 URGENCE" -ForegroundColor Green
Write-Host ""

# Vérification backend
Write-Host "1️⃣ VÉRIFICATION BACKEND:" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan

$adminData = @{
    username = "admin"
    password = "Admin@123"
} | ConvertTo-Json

try {
    $adminResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -Body $adminData -ContentType "application/json"
    Write-Host "✅ BACKEND: OPÉRATIONNEL" -ForegroundColor Green
    Write-Host "   Token: $($adminResponse.token.Substring(0,30))..." -ForegroundColor Cyan
    Write-Host "   Role: $($adminResponse.role)" -ForegroundColor Cyan
    $backendOK = $true
} catch {
    Write-Host "❌ BACKEND: PROBLÈME" -ForegroundColor Red
    Write-Host "   Erreur: $($_.Exception.Message)" -ForegroundColor Yellow
    $backendOK = $false
}

Write-Host ""
Write-Host "2️⃣ INSTRUCTIONS DE TEST URGENTES:" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

if ($backendOK) {
    Write-Host "🎯 TESTEZ MAINTENANT LE FRONTEND:" -ForegroundColor Green
    Write-Host ""
    Write-Host "A. PRÉPARATION:" -ForegroundColor Yellow
    Write-Host "   1. Ouvrir Chrome/Edge" -ForegroundColor White
    Write-Host "   2. Aller sur http://localhost:4200" -ForegroundColor White
    Write-Host "   3. Appuyer F12 → Onglet Console" -ForegroundColor White
    Write-Host "   4. Vider la console (Ctrl+L)" -ForegroundColor White
    Write-Host ""
    Write-Host "B. TEST ADMIN LOGIN:" -ForegroundColor Yellow
    Write-Host "   1. Aller sur http://localhost:4200/login" -ForegroundColor White
    Write-Host "   2. Username: admin" -ForegroundColor White
    Write-Host "   3. Password: Admin@123" -ForegroundColor White
    Write-Host "   4. Cliquer 'Se connecter'" -ForegroundColor White
    Write-Host ""
    Write-Host "C. LOGS À SURVEILLER:" -ForegroundColor Yellow
    Write-Host "   - '🚨 URGENCE - Tentative de connexion'" -ForegroundColor White
    Write-Host "   - '🚨 URGENCE - Contournement intercepteur détecté'" -ForegroundColor White
    Write-Host "   - '🚨 URGENCE - Réponse reçue'" -ForegroundColor White
    Write-Host "   - '🚨 URGENCE - Token reçu, sauvegarde'" -ForegroundColor White
    Write-Host "   - '🚨 URGENCE - Redirection forcée'" -ForegroundColor White
    Write-Host "   - '👑 ADMIN - Redirection dashboard'" -ForegroundColor White
    Write-Host ""
    Write-Host "D. RÉSULTAT ATTENDU:" -ForegroundColor Yellow
    Write-Host "   - Pas d'erreur NG02801 (HttpClient fetch)" -ForegroundColor White
    Write-Host "   - Logs détaillés dans la console" -ForegroundColor White
    Write-Host "   - Redirection immédiate vers /dashboard" -ForegroundColor White
    Write-Host "   - Pas de spinner infini" -ForegroundColor White
    Write-Host ""
    Write-Host "E. TEST CLIENT REGISTRATION:" -ForegroundColor Yellow
    Write-Host "   1. Aller sur http://localhost:4200/register" -ForegroundColor White
    Write-Host "   2. Remplir le formulaire" -ForegroundColor White
    Write-Host "   3. Cliquer 'S'inscrire'" -ForegroundColor White
    Write-Host "   4. Vérifier les mêmes logs" -ForegroundColor White
    Write-Host ""
    Write-Host "🚨 SI ÇA NE FONCTIONNE TOUJOURS PAS:" -ForegroundColor Red
    Write-Host "====================================" -ForegroundColor Red
    Write-Host "1. Copier TOUS les logs de la console" -ForegroundColor White
    Write-Host "2. Vérifier l'onglet Network:" -ForegroundColor White
    Write-Host "   - La requête POST est-elle envoyée ?" -ForegroundColor White
    Write-Host "   - Quel est le statut de la réponse ?" -ForegroundColor White
    Write-Host "   - Y a-t-il des erreurs CORS ?" -ForegroundColor White
    Write-Host "3. Vérifier l'onglet Application → Local Storage:" -ForegroundColor White
    Write-Host "   - Le token est-il sauvegardé ?" -ForegroundColor White
    Write-Host "   - Y a-t-il currentUser ?" -ForegroundColor White
    Write-Host ""
    Write-Host "📞 RAPPORT IMMÉDIAT REQUIS:" -ForegroundColor Yellow
    Write-Host "===========================" -ForegroundColor Yellow
    Write-Host "Après le test, rapportez:" -ForegroundColor White
    Write-Host "1. L'erreur NG02801 a-t-elle disparu ?" -ForegroundColor Cyan
    Write-Host "2. Les logs '🚨 URGENCE' apparaissent-ils ?" -ForegroundColor Cyan
    Write-Host "3. La redirection fonctionne-t-elle ?" -ForegroundColor Cyan
    Write-Host "4. Y a-t-il d'autres erreurs ?" -ForegroundColor Cyan
} else {
    Write-Host "🚨 BACKEND DÉFAILLANT:" -ForegroundColor Red
    Write-Host "======================" -ForegroundColor Red
    Write-Host "1. Redémarrer le backend" -ForegroundColor White
    Write-Host "2. Recréer l'admin" -ForegroundColor White
    Write-Host "3. Retester ce script" -ForegroundColor White
}

Write-Host ""
Write-Host "⚡ CETTE SOLUTION CORRIGE LE PROBLÈME HTTPCLIENT" -ForegroundColor Green
Write-Host "⚡ ELLE DEVRAIT ÉLIMINER L'ERREUR NG02801" -ForegroundColor Green
Write-Host "⚡ ET PERMETTRE AUX REQUÊTES DE FONCTIONNER" -ForegroundColor Green

Write-Host ""
Write-Host "Appuyez sur une touche pour continuer..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")