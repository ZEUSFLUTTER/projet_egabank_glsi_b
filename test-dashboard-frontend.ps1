#!/usr/bin/env pwsh

Write-Host "🔍 Test du dashboard frontend..." -ForegroundColor Cyan

# Vérifier que le frontend est accessible
Write-Host "`n1. Test d'accès au frontend..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:4200" -Method GET -UseBasicParsing -ErrorAction Stop
    Write-Host "✅ Frontend accessible (status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend non accessible: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "💡 Assurez-vous que 'ng serve' est démarré sur le port 4200" -ForegroundColor Yellow
    exit 1
}

# Instructions pour tester manuellement
Write-Host "`n2. Instructions pour tester le dashboard:" -ForegroundColor Yellow
Write-Host "   1. Ouvrez http://localhost:4200 dans votre navigateur" -ForegroundColor Gray
Write-Host "   2. Connectez-vous avec:" -ForegroundColor Gray
Write-Host "      - Username: admin" -ForegroundColor Cyan
Write-Host "      - Password: Admin@123" -ForegroundColor Cyan
Write-Host "   3. Allez sur le dashboard" -ForegroundColor Gray
Write-Host "   4. Vérifiez que les statistiques s'affichent:" -ForegroundColor Gray
Write-Host "      - Clients: 8" -ForegroundColor Green
Write-Host "      - Comptes: 11" -ForegroundColor Green
Write-Host "      - Solde total: 29,631,200€" -ForegroundColor Green
Write-Host "      - Transactions: (nombre variable)" -ForegroundColor Green

Write-Host "`n3. Ouvrez les outils de développement (F12) pour voir les logs de debug" -ForegroundColor Yellow

Write-Host "`n🏁 Test terminé - Testez manuellement dans le navigateur" -ForegroundColor Cyan