# 🚀 DÉMARRAGE COMPLET DU PROJET EGA BANK
Write-Host "🚀 DÉMARRAGE COMPLET DU PROJET EGA BANK" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green
Write-Host ""

# Étape 1: Vérifier les ports
Write-Host "1️⃣ VÉRIFICATION DES PORTS..." -ForegroundColor Yellow
$port8080 = netstat -an | findstr :8080
$port4200 = netstat -an | findstr :4200

if ($port8080) {
    Write-Host "✅ Backend déjà en cours (port 8080)" -ForegroundColor Green
    $backendRunning = $true
} else {
    Write-Host "❌ Backend non démarré (port 8080)" -ForegroundColor Red
    $backendRunning = $false
}

if ($port4200) {
    Write-Host "✅ Frontend déjà en cours (port 4200)" -ForegroundColor Green
    $frontendRunning = $true
} else {
    Write-Host "❌ Frontend non démarré (port 4200)" -ForegroundColor Red
    $frontendRunning = $false
}

Write-Host ""

# Étape 2: Démarrer le backend si nécessaire
if (-not $backendRunning) {
    Write-Host "2️⃣ DÉMARRAGE DU BACKEND..." -ForegroundColor Yellow
    Write-Host "Démarrage du backend Spring Boot..." -ForegroundColor White
    
    try {
        # Démarrer le backend en arrière-plan
        $backendProcess = Start-Process -FilePath "powershell" -ArgumentList "-Command", "cd 'Ega backend/Ega-backend'; ./start-backend-fixed.ps1" -PassThru -WindowStyle Minimized
        Write-Host "✅ Backend en cours de démarrage (PID: $($backendProcess.Id))" -ForegroundColor Green
        
        # Attendre que le backend soit prêt
        Write-Host "⏳ Attente du démarrage du backend..." -ForegroundColor Yellow
        $attempts = 0
        $maxAttempts = 30
        
        do {
            Start-Sleep -Seconds 2
            $attempts++
            Write-Host "   Tentative $attempts/$maxAttempts..." -ForegroundColor Gray
            
            try {
                $response = Invoke-WebRequest -Uri "http://localhost:8080" -Method GET -TimeoutSec 3
                if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 404) {
                    Write-Host "✅ Backend accessible !" -ForegroundColor Green
                    $backendReady = $true
                    break
                }
            } catch {
                $backendReady = $false
            }
        } while ($attempts -lt $maxAttempts)
        
        if (-not $backendReady) {
            Write-Host "❌ Backend non accessible après $maxAttempts tentatives" -ForegroundColor Red
            Write-Host "💡 Démarrez manuellement: cd 'Ega backend/Ega-backend' && ./start-backend-fixed.ps1" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "❌ Erreur démarrage backend: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "2️⃣ BACKEND DÉJÀ EN COURS" -ForegroundColor Green
    $backendReady = $true
}

Write-Host ""

# Étape 3: Démarrer le frontend si nécessaire
if (-not $frontendRunning) {
    Write-Host "3️⃣ DÉMARRAGE DU FRONTEND..." -ForegroundColor Yellow
    Write-Host "Démarrage du serveur Angular..." -ForegroundColor White
    
    try {
        # Démarrer le frontend en arrière-plan
        $frontendProcess = Start-Process -FilePath "powershell" -ArgumentList "-Command", "cd frontend-angular; ng serve --port 4200 --host 0.0.0.0" -PassThru -WindowStyle Minimized
        Write-Host "✅ Frontend en cours de démarrage (PID: $($frontendProcess.Id))" -ForegroundColor Green
        
        # Attendre que le frontend soit prêt
        Write-Host "⏳ Attente du démarrage du frontend..." -ForegroundColor Yellow
        $attempts = 0
        $maxAttempts = 20
        
        do {
            Start-Sleep -Seconds 3
            $attempts++
            Write-Host "   Tentative $attempts/$maxAttempts..." -ForegroundColor Gray
            
            try {
                $response = Invoke-WebRequest -Uri "http://localhost:4200" -Method GET -TimeoutSec 5
                if ($response.StatusCode -eq 200) {
                    Write-Host "✅ Frontend accessible !" -ForegroundColor Green
                    $frontendReady = $true
                    break
                }
            } catch {
                $frontendReady = $false
            }
        } while ($attempts -lt $maxAttempts)
        
        if (-not $frontendReady) {
            Write-Host "❌ Frontend non accessible après $maxAttempts tentatives" -ForegroundColor Red
            Write-Host "💡 Démarrez manuellement: cd frontend-angular && ng serve" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "❌ Erreur démarrage frontend: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "3️⃣ FRONTEND DÉJÀ EN COURS" -ForegroundColor Green
    $frontendReady = $true
}

Write-Host ""

# Étape 4: Initialiser l'admin
if ($backendReady) {
    Write-Host "4️⃣ INITIALISATION ADMIN..." -ForegroundColor Yellow
    try {
        $adminInit = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/init-admin" -Method POST -ContentType "application/json"
        Write-Host "✅ Admin initialisé: $adminInit" -ForegroundColor Green
    } catch {
        Write-Host "⚠️ Admin déjà existant ou erreur: $($_.Exception.Message)" -ForegroundColor Yellow
    }
    
    # Test de connexion admin
    Write-Host "🧪 Test connexion admin..." -ForegroundColor White
    $adminData = @{ username = "admin"; password = "Admin@123" } | ConvertTo-Json
    try {
        $adminResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -Body $adminData -ContentType "application/json"
        Write-Host "✅ Connexion admin fonctionnelle" -ForegroundColor Green
        Write-Host "   Username: $($adminResponse.username)" -ForegroundColor Cyan
        Write-Host "   Role: $($adminResponse.role)" -ForegroundColor Cyan
    } catch {
        Write-Host "❌ Problème connexion admin: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""

# Étape 5: Résumé et instructions
Write-Host "🎯 STATUT FINAL DU PROJET" -ForegroundColor Green
Write-Host "=========================" -ForegroundColor Green

if ($backendReady -and $frontendReady) {
    Write-Host "🎉 PROJET COMPLÈTEMENT OPÉRATIONNEL !" -ForegroundColor Green
    Write-Host ""
    Write-Host "📱 ACCÈS À L'APPLICATION:" -ForegroundColor Yellow
    Write-Host "   🌐 Frontend: http://localhost:4200" -ForegroundColor Cyan
    Write-Host "   🔧 Backend:  http://localhost:8080" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "👑 CONNEXION ADMIN:" -ForegroundColor Yellow
    Write-Host "   URL: http://localhost:4200/login" -ForegroundColor White
    Write-Host "   Username: admin" -ForegroundColor White
    Write-Host "   Password: Admin@123" -ForegroundColor White
    Write-Host ""
    Write-Host "👤 INSCRIPTION CLIENT:" -ForegroundColor Yellow
    Write-Host "   URL: http://localhost:4200/register" -ForegroundColor White
    Write-Host "   Remplir le formulaire d'inscription" -ForegroundColor White
    Write-Host ""
    Write-Host "🧪 PAGE DE TEST:" -ForegroundColor Yellow
    Write-Host "   URL: http://localhost:4200/test-auth" -ForegroundColor White
    Write-Host "   Pour tester l'authentification directement" -ForegroundColor White
    Write-Host ""
    Write-Host "🔍 DEBUGGING:" -ForegroundColor Yellow
    Write-Host "   - Ouvrir F12 → Console pour voir les logs" -ForegroundColor White
    Write-Host "   - Chercher les messages '🚨 URGENCE'" -ForegroundColor White
    Write-Host "   - Vérifier l'onglet Network pour les requêtes" -ForegroundColor White
    
    # Ouvrir automatiquement le navigateur
    Write-Host ""
    Write-Host "🚀 OUVERTURE AUTOMATIQUE DU NAVIGATEUR..." -ForegroundColor Green
    Start-Process "http://localhost:4200"
    
} elseif ($backendReady -and -not $frontendReady) {
    Write-Host "⚠️ BACKEND OK, FRONTEND PROBLÉMATIQUE" -ForegroundColor Yellow
    Write-Host "   Backend: ✅ http://localhost:8080" -ForegroundColor Green
    Write-Host "   Frontend: ❌ http://localhost:4200" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 DÉMARRER LE FRONTEND MANUELLEMENT:" -ForegroundColor Yellow
    Write-Host "   cd frontend-angular" -ForegroundColor White
    Write-Host "   ng serve --port 4200" -ForegroundColor White
    
} elseif (-not $backendReady -and $frontendReady) {
    Write-Host "⚠️ FRONTEND OK, BACKEND PROBLÉMATIQUE" -ForegroundColor Yellow
    Write-Host "   Frontend: ✅ http://localhost:4200" -ForegroundColor Green
    Write-Host "   Backend: ❌ http://localhost:8080" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 DÉMARRER LE BACKEND MANUELLEMENT:" -ForegroundColor Yellow
    Write-Host "   cd 'Ega backend/Ega-backend'" -ForegroundColor White
    Write-Host "   ./start-backend-fixed.ps1" -ForegroundColor White
    
} else {
    Write-Host "❌ PROBLÈMES DE DÉMARRAGE" -ForegroundColor Red
    Write-Host "   Backend: ❌ http://localhost:8080" -ForegroundColor Red
    Write-Host "   Frontend: ❌ http://localhost:4200" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 DÉMARRAGE MANUEL REQUIS:" -ForegroundColor Yellow
    Write-Host "   1. Backend: cd 'Ega backend/Ega-backend' && ./start-backend-fixed.ps1" -ForegroundColor White
    Write-Host "   2. Frontend: cd frontend-angular && ng serve" -ForegroundColor White
}

Write-Host ""
Write-Host "Appuyez sur une touche pour continuer..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")