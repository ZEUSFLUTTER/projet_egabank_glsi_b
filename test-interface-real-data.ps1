#!/usr/bin/env pwsh

Write-Host "🧪 TEST INTERFACE CLIENT - DONNÉES RÉELLES" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

Write-Host ""
Write-Host "📋 PLAN DE TEST:" -ForegroundColor Yellow
Write-Host "1. Vérifier que l'interface fonctionne sans backend (mode démo)" -ForegroundColor White
Write-Host "2. Tester la connexion client avec backend (si disponible)" -ForegroundColor White
Write-Host "3. Vérifier le chargement des vraies données" -ForegroundColor White

Write-Host ""
Write-Host "🌐 Vérification du frontend..." -ForegroundColor Green

# Vérifier si le frontend est en cours d'exécution
$frontendProcess = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.ProcessName -eq "node" }
if ($frontendProcess) {
    Write-Host "✅ Frontend Angular détecté (PID: $($frontendProcess.Id))" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend non détecté, démarrage..." -ForegroundColor Red
    Start-Process -FilePath "cmd" -ArgumentList "/c", "cd frontend-angular && npm start" -WindowStyle Minimized
    Write-Host "⏳ Attente du démarrage du frontend..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
}

Write-Host ""
Write-Host "🔧 Vérification du backend..." -ForegroundColor Green

# Tester la connexion au backend
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/test/public" -Method GET -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Backend disponible sur le port 8080" -ForegroundColor Green
        $backendAvailable = $true
    }
} catch {
    Write-Host "❌ Backend non disponible - Mode démo activé" -ForegroundColor Yellow
    $backendAvailable = $false
}

Write-Host ""
Write-Host "🧪 TESTS D'INTERFACE:" -ForegroundColor Cyan

Write-Host ""
Write-Host "TEST 1: Interface sans authentification (mode démo)" -ForegroundColor Yellow
Write-Host "- Ouvrir: http://localhost:4200/profil" -ForegroundColor White
Write-Host "- Vérifier: Affichage des données de démonstration" -ForegroundColor White
Write-Host "- Vérifier: Interface stable et responsive" -ForegroundColor White

if ($backendAvailable) {
    Write-Host ""
    Write-Host "TEST 2: Connexion client avec backend" -ForegroundColor Yellow
    Write-Host "- Ouvrir: http://localhost:4200/login" -ForegroundColor White
    Write-Host "- Identifiants client: testclient / Test@123" -ForegroundColor White
    Write-Host "- Vérifier: Redirection automatique vers /profil" -ForegroundColor White
    Write-Host "- Vérifier: Chargement des vraies données du client" -ForegroundColor White
    
    Write-Host ""
    Write-Host "TEST 3: Opérations bancaires réelles" -ForegroundColor Yellow
    Write-Host "- Tester: Création de compte" -ForegroundColor White
    Write-Host "- Tester: Dépôt d'argent" -ForegroundColor White
    Write-Host "- Tester: Retrait d'argent" -ForegroundColor White
    Write-Host "- Vérifier: Mise à jour automatique des soldes" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "⚠️  Backend non disponible - Tests limités au mode démo" -ForegroundColor Yellow
    Write-Host "Pour tester avec de vraies données:" -ForegroundColor White
    Write-Host "1. Configurer JAVA_HOME" -ForegroundColor White
    Write-Host "2. Démarrer MongoDB" -ForegroundColor White
    Write-Host "3. Exécuter: ./start-backend-mongodb.ps1" -ForegroundColor White
}

Write-Host ""
Write-Host "🔍 POINTS DE VÉRIFICATION:" -ForegroundColor Cyan
Write-Host "✓ Interface se charge rapidement (< 2 secondes)" -ForegroundColor Green
Write-Host "✓ Pas de page blanche qui tourne en rond" -ForegroundColor Green
Write-Host "✓ Données client affichées correctement" -ForegroundColor Green
Write-Host "✓ Comptes et soldes visibles" -ForegroundColor Green
Write-Host "✓ Transactions récentes listées" -ForegroundColor Green
Write-Host "✓ Formulaires d'opérations fonctionnels" -ForegroundColor Green
Write-Host "✓ Messages de succès/erreur appropriés" -ForegroundColor Green

Write-Host ""
Write-Host "🌐 Ouverture automatique du navigateur..." -ForegroundColor Green
Start-Process "http://localhost:4200/profil"

Write-Host ""
Write-Host "📊 RÉSULTATS ATTENDUS:" -ForegroundColor Cyan
if ($backendAvailable) {
    Write-Host "- Avec backend: Vraies données du client connecté" -ForegroundColor Green
    Write-Host "- Opérations: Mises à jour en temps réel" -ForegroundColor Green
} else {
    Write-Host "- Sans backend: Données de démonstration" -ForegroundColor Yellow
    Write-Host "- Fallback: Interface stable et fonctionnelle" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✅ Test d'interface terminé!" -ForegroundColor Green
Write-Host "Vérifiez manuellement les points ci-dessus dans le navigateur." -ForegroundColor White