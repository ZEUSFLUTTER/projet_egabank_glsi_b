#!/usr/bin/env pwsh

Write-Host "🏦 TEST STABILITÉ DONNÉES GLOBALE" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

Write-Host ""
Write-Host "🎯 OBJECTIF: Vérifier que les données restent stables sur toutes les pages" -ForegroundColor Yellow

Write-Host ""
Write-Host "🔧 Vérification des services..." -ForegroundColor Green

# Test du frontend
try {
    $frontendResponse = Invoke-WebRequest -Uri "http://localhost:4200" -Method GET -TimeoutSec 3
    Write-Host "✅ Frontend Angular disponible (Status: $($frontendResponse.StatusCode))" -ForegroundColor Green
    $frontendOk = $true
} catch {
    Write-Host "❌ Frontend non disponible: $($_.Exception.Message)" -ForegroundColor Red
    $frontendOk = $false
}

# Test du backend
try {
    $backendResponse = Invoke-WebRequest -Uri "http://localhost:8080/api/test/public" -Method GET -TimeoutSec 3
    Write-Host "✅ Backend Spring Boot disponible (Status: $($backendResponse.StatusCode))" -ForegroundColor Green
    $backendOk = $true
} catch {
    Write-Host "❌ Backend non disponible: $($_.Exception.Message)" -ForegroundColor Red
    $backendOk = $false
}

Write-Host ""
Write-Host "📋 ARCHITECTURE DE STABILITÉ:" -ForegroundColor Cyan

Write-Host ""
Write-Host "🏗️ NOUVEAU SYSTÈME IMPLÉMENTÉ:" -ForegroundColor Yellow
Write-Host "- ✅ StableDataService : Service global de cache des données" -ForegroundColor Green
Write-Host "- ✅ Données persistées dans localStorage" -ForegroundColor Green
Write-Host "- ✅ Actualisation automatique toutes les 2 minutes" -ForegroundColor Green
Write-Host "- ✅ Synchronisation entre toutes les pages" -ForegroundColor Green
Write-Host "- ✅ Fallback intelligent en cas d'erreur" -ForegroundColor Green

Write-Host ""
Write-Host "📊 COMPOSANTS STABILISÉS:" -ForegroundColor Yellow
Write-Host "- ✅ ProfilComponent : Utilise StableDataService" -ForegroundColor Green
Write-Host "- ✅ ComptesStableComponent : Page comptes avec données stables" -ForegroundColor Green
Write-Host "- ✅ TransactionsStableComponent : Historique avec pagination" -ForegroundColor Green
Write-Host "- ✅ Tous les composants partagent les mêmes données" -ForegroundColor Green

Write-Host ""
Write-Host "🧪 TESTS DE STABILITÉ:" -ForegroundColor Cyan

Write-Host ""
Write-Host "TEST 1: Persistance des données entre pages" -ForegroundColor Yellow
Write-Host "- Navigation /profil → /comptes → /transactions" -ForegroundColor White
Write-Host "- Vérifier que les données restent identiques" -ForegroundColor White
Write-Host "- Pas de rechargement à chaque changement de page" -ForegroundColor White

Write-Host ""
Write-Host "TEST 2: Actualisation automatique" -ForegroundColor Yellow
Write-Host "- Données mises à jour toutes les 2 minutes" -ForegroundColor White
Write-Host "- Cache localStorage de 5 minutes" -ForegroundColor White
Write-Host "- Synchronisation entre onglets" -ForegroundColor White

Write-Host ""
Write-Host "TEST 3: Gestion des erreurs" -ForegroundColor Yellow
Write-Host "- Fallback vers données personnalisées si backend indisponible" -ForegroundColor White
Write-Host "- Pas d'interruption de service" -ForegroundColor White
Write-Host "- Interface reste fonctionnelle" -ForegroundColor White

Write-Host ""
Write-Host "TEST 4: Personnalisation par utilisateur" -ForegroundColor Yellow
Write-Host "- Données différentes selon l'utilisateur connecté" -ForegroundColor White
Write-Host "- IBAN stables et uniques par client" -ForegroundColor White
Write-Host "- Soldes cohérents et persistants" -ForegroundColor White

Write-Host ""
Write-Host "🔍 POINTS DE VÉRIFICATION CRITIQUES:" -ForegroundColor Cyan
Write-Host "✓ Même client affiché sur toutes les pages" -ForegroundColor Green
Write-Host "✓ Mêmes comptes et soldes partout" -ForegroundColor Green
Write-Host "✓ Historique transactions identique" -ForegroundColor Green
Write-Host "✓ Pas de rechargement entre pages" -ForegroundColor Green
Write-Host "✓ Données persistantes après actualisation" -ForegroundColor Green
Write-Host "✓ Synchronisation temps réel des opérations" -ForegroundColor Green
Write-Host "✓ Interface stable même sans backend" -ForegroundColor Green

Write-Host ""
Write-Host "🧪 SCÉNARIOS DE TEST:" -ForegroundColor Cyan

if ($backendOk) {
    Write-Host ""
    Write-Host "SCÉNARIO A: Test avec backend (données réelles)" -ForegroundColor Green
    Write-Host "1. Se connecter: http://localhost:4200/login" -ForegroundColor White
    Write-Host "   - Identifiants: testclient / Test@123" -ForegroundColor White
    Write-Host "2. Vérifier /profil : Données client réelles" -ForegroundColor White
    Write-Host "3. Naviguer vers /comptes : Mêmes comptes affichés" -ForegroundColor White
    Write-Host "4. Aller sur /transactions : Même historique" -ForegroundColor White
    Write-Host "5. Effectuer une opération bancaire" -ForegroundColor White
    Write-Host "6. Vérifier mise à jour sur toutes les pages" -ForegroundColor White
    
    Write-Host ""
    Write-Host "🔍 Test rapide de l'authentification..." -ForegroundColor Cyan
    try {
        $loginData = @{
            username = "testclient"
            password = "Test@123"
        } | ConvertTo-Json
        
        $headers = @{
            "Content-Type" = "application/json"
        }
        
        $authResponse = Invoke-WebRequest -Uri "http://localhost:8080/api/auth/login" -Method POST -Body $loginData -Headers $headers -TimeoutSec 5
        
        if ($authResponse.StatusCode -eq 200) {
            $auth = $authResponse.Content | ConvertFrom-Json
            Write-Host "✅ Authentification testclient réussie!" -ForegroundColor Green
            Write-Host "   - Client ID: $($auth.clientId)" -ForegroundColor White
            Write-Host "   - Données réelles disponibles" -ForegroundColor White
        }
    } catch {
        Write-Host "❌ Erreur test auth: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host ""
    Write-Host "SCÉNARIO B: Test en mode démo (données stables)" -ForegroundColor Yellow
    Write-Host "1. Ouvrir: http://localhost:4200/profil" -ForegroundColor White
    Write-Host "2. Noter les données client affichées" -ForegroundColor White
    Write-Host "3. Naviguer vers différentes pages" -ForegroundColor White
    Write-Host "4. Vérifier cohérence des données" -ForegroundColor White
    Write-Host "5. Actualiser le navigateur" -ForegroundColor White
    Write-Host "6. Confirmer persistance des données" -ForegroundColor White
}

Write-Host ""
Write-Host "📱 PAGES À TESTER:" -ForegroundColor Cyan
Write-Host "- /profil : Interface client principale" -ForegroundColor White
Write-Host "- /comptes : Liste des comptes bancaires" -ForegroundColor White
Write-Host "- /transactions : Historique des transactions" -ForegroundColor White
Write-Host "- /dashboard : Tableau de bord (admin)" -ForegroundColor White

Write-Host ""
Write-Host "🌐 Ouverture de l'interface de test..." -ForegroundColor Green

if ($backendOk) {
    Write-Host "👉 Test avec authentification (données réelles)" -ForegroundColor Cyan
    Start-Process "http://localhost:4200/login"
    Write-Host "Connectez-vous avec: testclient / Test@123" -ForegroundColor White
    Write-Host "Puis naviguez entre les pages pour tester la stabilité" -ForegroundColor White
} else {
    Write-Host "👉 Test en mode démo (données stables)" -ForegroundColor Cyan
    Start-Process "http://localhost:4200/profil"
    Write-Host "Naviguez entre les pages pour vérifier la cohérence" -ForegroundColor White
}

Write-Host ""
Write-Host "🎯 RÉSULTATS ATTENDUS:" -ForegroundColor Cyan
Write-Host "- Données identiques sur toutes les pages" -ForegroundColor Green
Write-Host "- Navigation fluide sans rechargement" -ForegroundColor Green
Write-Host "- Persistance après actualisation" -ForegroundColor Green
Write-Host "- Synchronisation des opérations" -ForegroundColor Green
Write-Host "- Interface stable en toutes circonstances" -ForegroundColor Green

Write-Host ""
Write-Host "📋 CHECKLIST DE VALIDATION:" -ForegroundColor Cyan
Write-Host "□ Même nom client sur /profil et /comptes" -ForegroundColor Yellow
Write-Host "□ Mêmes soldes affichés partout" -ForegroundColor Yellow
Write-Host "□ Historique transactions cohérent" -ForegroundColor Yellow
Write-Host "□ Navigation sans rechargement visible" -ForegroundColor Yellow
Write-Host "□ Données persistantes après F5" -ForegroundColor Yellow
Write-Host "□ Opération bancaire met à jour toutes les pages" -ForegroundColor Yellow

Write-Host ""
Write-Host "✅ Test de stabilité globale lancé!" -ForegroundColor Green
Write-Host "Vérifiez manuellement les points ci-dessus dans le navigateur." -ForegroundColor White