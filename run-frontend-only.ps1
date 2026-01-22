#!/usr/bin/env pwsh

Write-Host "🎯 DÉMARRAGE FRONTEND SEUL" -ForegroundColor Green
Write-Host "===========================" -ForegroundColor Green

Write-Host "`n📋 STRATÉGIE:" -ForegroundColor Yellow
Write-Host "   - Démarrage frontend uniquement" -ForegroundColor White
Write-Host "   - Test des pages simplifiées" -ForegroundColor White
Write-Host "   - Simulation d'authentification" -ForegroundColor White

Write-Host "`n1. Vérification port 4200..." -ForegroundColor Yellow
$port4200 = netstat -ano | findstr :4200
if ($port4200) {
    Write-Host "   Port 4200 occupé, nettoyage..." -ForegroundColor Gray
    $pid = ($port4200 -split '\s+')[-1]
    taskkill /PID $pid /F 2>$null
    Start-Sleep -Seconds 2
}

Write-Host "`n2. Démarrage frontend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend-angular; npm start"

Write-Host "`n3. Attente démarrage..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

Write-Host "`n✅ FRONTEND DÉMARRÉ!" -ForegroundColor Green
Write-Host "   URL: http://localhost:4200" -ForegroundColor Cyan

Write-Host "`n🧪 PAGES DE TEST DISPONIBLES:" -ForegroundColor Yellow
Write-Host "   - Test Simple: http://localhost:4200/test-simple" -ForegroundColor Cyan
Write-Host "   - Test Client Browser: http://localhost:4200/test-client-browser" -ForegroundColor Cyan
Write-Host "   - Debug Navigation: http://localhost:4200/debug-nav" -ForegroundColor Cyan

Write-Host "`n📝 POUR TESTER LES PAGES SIMPLIFIÉES:" -ForegroundColor Yellow
Write-Host "   1. Allez sur http://localhost:4200/test-simple" -ForegroundColor White
Write-Host "   2. Cliquez 'Tester Connexion testclient'" -ForegroundColor White
Write-Host "   3. Cliquez 'Tester Navigation /profil'" -ForegroundColor White
Write-Host "   4. Les pages simplifiées devraient s'afficher!" -ForegroundColor White

Write-Host "`n🚀 Ouverture automatique..." -ForegroundColor Green
Start-Sleep -Seconds 3
Start-Process "http://localhost:4200/test-simple"

Write-Host "`n💡 ASTUCE:" -ForegroundColor Cyan
Write-Host "   Si le backend ne fonctionne pas, les pages simplifiées" -ForegroundColor White
Write-Host "   s'afficheront quand même avec des données simulées!" -ForegroundColor White