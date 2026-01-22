# Système Bancaire "EGA" - Script de démarrage complet
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   DEMARRAGE SYSTEME BANCAIRE 'EGA'" -ForegroundColor Cyan  
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Vérification des prérequis
Write-Host "[1/3] Vérification des prérequis..." -ForegroundColor Yellow

try {
    $javaVersion = java -version 2>&1 | Select-String "version"
    Write-Host "✓ Java détecté: $($javaVersion -split '"')[1]" -ForegroundColor Green
} catch {
    Write-Host "❌ ERREUR: Java n'est pas installé ou pas dans le PATH" -ForegroundColor Red
    Read-Host "Appuyez sur Entrée pour quitter"
    exit 1
}

try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js détecté: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ ERREUR: Node.js n'est pas installé ou pas dans le PATH" -ForegroundColor Red
    Read-Host "Appuyez sur Entrée pour quitter"
    exit 1
}

Write-Host ""

# Démarrage du backend
Write-Host "[2/3] Démarrage du backend Spring Boot..." -ForegroundColor Yellow
Write-Host "URL Backend: http://localhost:8080" -ForegroundColor Cyan

$backendJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    & .\mvnw.cmd spring-boot:run
}

Write-Host "Backend démarré en arrière-plan (Job ID: $($backendJob.Id))" -ForegroundColor Green
Write-Host "Attente du démarrage du backend (15 secondes)..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

Write-Host ""

# Démarrage du frontend
Write-Host "[3/3] Démarrage du frontend Angular..." -ForegroundColor Yellow
Write-Host "URL Frontend: http://localhost:4200" -ForegroundColor Cyan

Set-Location "bank-frontend-angular"

$frontendJob = Start-Job -ScriptBlock {
    Set-Location "$using:PWD\bank-frontend-angular"
    ng serve --open
}

Write-Host "Frontend démarré en arrière-plan (Job ID: $($frontendJob.Id))" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   SYSTEME BANCAIRE 'EGA' DEMARRE !" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "🌐 Backend:  http://localhost:8080" -ForegroundColor Green
Write-Host "🌐 Frontend: http://localhost:4200" -ForegroundColor Green
Write-Host ""
Write-Host "👤 Comptes de test:" -ForegroundColor Yellow
Write-Host "   - Admin: admin / admin123" -ForegroundColor White
Write-Host "   - Client: user / user123" -ForegroundColor White
Write-Host ""
Write-Host "📋 Fonctionnalités disponibles:" -ForegroundColor Yellow
Write-Host "   ✓ Tableau de bord" -ForegroundColor White
Write-Host "   ✓ Opérations bancaires (dépôt, retrait, virement)" -ForegroundColor White
Write-Host "   ✓ Relevé de compte et transactions" -ForegroundColor White
Write-Host "   ✓ Gestion clients et comptes" -ForegroundColor White
Write-Host ""
Write-Host "🔧 Pour arrêter les services:" -ForegroundColor Yellow
Write-Host "   Stop-Job $($backendJob.Id), $($frontendJob.Id)" -ForegroundColor White
Write-Host ""

# Attendre que l'utilisateur appuie sur une touche
Read-Host "Appuyez sur Entrée pour voir le statut des services"

# Afficher le statut des jobs
Write-Host "Statut des services:" -ForegroundColor Yellow
Get-Job | Format-Table Id, Name, State

Write-Host ""
Write-Host "Le système est maintenant opérationnel !" -ForegroundColor Green
Write-Host "Consultez les URLs ci-dessus pour accéder aux interfaces." -ForegroundColor Cyan