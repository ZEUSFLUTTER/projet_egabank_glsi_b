#!/usr/bin/env pwsh

Write-Host "🧪 TEST ULTRA SIMPLE" -ForegroundColor Cyan
Write-Host "====================" -ForegroundColor Cyan

Write-Host "`n📋 INSTRUCTIONS TRÈS SIMPLES:" -ForegroundColor Yellow
Write-Host "1. Ouvrez: http://localhost:4200/test-simple" -ForegroundColor White
Write-Host "2. Cliquez sur 'Tester Connexion testclient'" -ForegroundColor White
Write-Host "3. Vérifiez que ça dit '✅ Connexion réussie!'" -ForegroundColor White
Write-Host "4. Cliquez sur 'Tester Navigation /profil'" -ForegroundColor White
Write-Host "5. Dites-moi ce qui se passe!" -ForegroundColor White

Write-Host "`n🎯 CE QUE JE VEUX SAVOIR:" -ForegroundColor Red
Write-Host "- La connexion fonctionne-t-elle? (étape 2)" -ForegroundColor White
Write-Host "- localStorage fonctionne-t-il?" -ForegroundColor White
Write-Host "- Que se passe-t-il quand vous cliquez 'Tester Navigation'?" -ForegroundColor White
Write-Host "- Y a-t-il des erreurs dans la console (F12)?" -ForegroundColor White

Write-Host "`n🚀 Ouverture..." -ForegroundColor Green
Start-Process "http://localhost:4200/test-simple"

Write-Host "`n⏳ Testez et dites-moi EXACTEMENT ce qui se passe à chaque étape!" -ForegroundColor Cyan