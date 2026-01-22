#!/usr/bin/env pwsh

Write-Host "🧪 TEST NAVIGATION DEBUG" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan

# Vérifier que le backend est démarré
Write-Host "`n1. Vérification du backend..." -ForegroundColor Yellow
try {
    $backendResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/test" -Method GET -ErrorAction SilentlyContinue
    Write-Host "✅ Backend accessible" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend non accessible - Démarrez le backend d'abord" -ForegroundColor Red
    Write-Host "Utilisez: cd 'Ega backend/Ega-backend' && ./mvnw spring-boot:run" -ForegroundColor Yellow
    exit 1
}

# Vérifier que le frontend est démarré
Write-Host "`n2. Vérification du frontend..." -ForegroundColor Yellow
try {
    $frontendResponse = Invoke-WebRequest -Uri "http://localhost:4200" -Method GET -ErrorAction SilentlyContinue
    Write-Host "✅ Frontend accessible" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend non accessible - Démarrez le frontend d'abord" -ForegroundColor Red
    Write-Host "Utilisez: cd frontend-angular && npm start" -ForegroundColor Yellow
    exit 1
}

Write-Host "`n3. Instructions de test:" -ForegroundColor Yellow
Write-Host "   1. Ouvrez http://localhost:4200/test-client" -ForegroundColor White
Write-Host "   2. Vérifiez que l'authentification est ✅ OUI" -ForegroundColor White
Write-Host "   3. Si NON, connectez-vous d'abord via /login" -ForegroundColor White
Write-Host "   4. Cliquez sur 'Aller au Profil'" -ForegroundColor White
Write-Host "   5. Observez les logs dans la console du navigateur" -ForegroundColor White

Write-Host "`n4. Logs à surveiller:" -ForegroundColor Yellow
Write-Host "   - 🛡️ Auth Guard logs" -ForegroundColor White
Write-Host "   - 🧪 Test navigation logs" -ForegroundColor White
Write-Host "   - ProfilComponent logs" -ForegroundColor White

Write-Host "`n5. Si le problème persiste:" -ForegroundColor Yellow
Write-Host "   - Vérifiez la console pour les erreurs" -ForegroundColor White
Write-Host "   - Vérifiez que le token est valide" -ForegroundColor White
Write-Host "   - Vérifiez que le clientId est présent" -ForegroundColor White

Write-Host "`n🚀 Ouvrez maintenant: http://localhost:4200/test-client" -ForegroundColor Green

# Ouvrir automatiquement le navigateur
Start-Process "http://localhost:4200/test-client"