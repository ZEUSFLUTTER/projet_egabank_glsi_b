# 🚀 DÉMARRAGE TEST CLIENT - GUIDE RAPIDE
Write-Host "🚀 DÉMARRAGE TEST CLIENT - GUIDE RAPIDE" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green
Write-Host ""

# Vérification rapide
Write-Host "📊 VÉRIFICATION RAPIDE:" -ForegroundColor Yellow
$port8080 = netstat -an | findstr :8080
$port4200 = netstat -an | findstr :4200

if ($port8080 -and $port4200) {
    Write-Host "✅ Backend et Frontend en cours" -ForegroundColor Green
    
    # Test backend client rapide
    $timestamp = Get-Date -Format "HHmmss"
    $clientData = @{
        nom = "Test"
        prenom = "Client"
        dateNaissance = "1990-01-01"
        sexe = "M"
        adresse = "123 Test St"
        telephone = "12345678"
        courriel = "test$timestamp@test.com"
        nationalite = "Test"
        username = "test$timestamp"
        password = "test123"
    } | ConvertTo-Json
    
    try {
        $clientResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/register" -Method POST -Body $clientData -ContentType "application/json"
        Write-Host "✅ Backend client: OK" -ForegroundColor Green
        $backendOK = $true
    } catch {
        Write-Host "❌ Backend client: Problème" -ForegroundColor Red
        $backendOK = $false
    }
} else {
    Write-Host "❌ Services non démarrés" -ForegroundColor Red
    $backendOK = $false
}

Write-Host ""

if ($backendOK) {
    Write-Host "🎯 TESTS À EFFECTUER MAINTENANT:" -ForegroundColor Green
    Write-Host "================================" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "1️⃣ PAGE DE DIAGNOSTIC:" -ForegroundColor Yellow
    Write-Host "   🌐 http://localhost:4200/test-client" -ForegroundColor Cyan
    Write-Host "   Cette page montre l'état d'authentification" -ForegroundColor White
    Write-Host ""
    
    Write-Host "2️⃣ INSCRIPTION CLIENT:" -ForegroundColor Yellow
    Write-Host "   🌐 http://localhost:4200/register" -ForegroundColor Cyan
    Write-Host "   Données de test:" -ForegroundColor White
    Write-Host "   - Username: clienttest" -ForegroundColor Gray
    Write-Host "   - Password: test123" -ForegroundColor Gray
    Write-Host "   - Email: client@test.com" -ForegroundColor Gray
    Write-Host "   - Autres champs: remplir avec des données simples" -ForegroundColor Gray
    Write-Host ""
    
    Write-Host "3️⃣ TEST PAGES CLIENT:" -ForegroundColor Yellow
    Write-Host "   Après inscription, tester:" -ForegroundColor White
    Write-Host "   🌐 http://localhost:4200/profil" -ForegroundColor Cyan
    Write-Host "   🌐 http://localhost:4200/comptes" -ForegroundColor Cyan
    Write-Host "   🌐 http://localhost:4200/transactions" -ForegroundColor Cyan
    Write-Host ""
    
    Write-Host "🔍 DEBUGGING:" -ForegroundColor Yellow
    Write-Host "=============" -ForegroundColor Yellow
    Write-Host "- Ouvrir F12 → Console sur chaque page" -ForegroundColor White
    Write-Host "- Chercher les messages '🚨 URGENCE'" -ForegroundColor White
    Write-Host "- Chercher les messages '🛡️ Auth Guard'" -ForegroundColor White
    Write-Host "- Noter toutes les erreurs" -ForegroundColor White
    Write-Host ""
    
    Write-Host "📞 RAPPORTEZ-MOI:" -ForegroundColor Red
    Write-Host "=================" -ForegroundColor Red
    Write-Host "1. La page /test-client s'affiche-t-elle ?" -ForegroundColor Cyan
    Write-Host "2. Après inscription, êtes-vous authentifié ?" -ForegroundColor Cyan
    Write-Host "3. Les pages /profil, /comptes, /transactions s'affichent-elles ?" -ForegroundColor Cyan
    Write-Host "4. Quelles erreurs dans la console ?" -ForegroundColor Cyan
    
    # Ouvrir automatiquement la page de diagnostic
    Write-Host ""
    Write-Host "🚀 OUVERTURE PAGE DE DIAGNOSTIC..." -ForegroundColor Green
    Start-Process "http://localhost:4200/test-client"
    
} else {
    Write-Host "❌ PROBLÈME DE DÉMARRAGE" -ForegroundColor Red
    Write-Host "Relancez: ./run-project-complete.ps1" -ForegroundColor White
}

Write-Host ""
Write-Host "⚡ COMMENCEZ PAR LA PAGE DE DIAGNOSTIC QUI VIENT DE S'OUVRIR" -ForegroundColor Green

Write-Host ""
Write-Host "Appuyez sur une touche pour continuer..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")