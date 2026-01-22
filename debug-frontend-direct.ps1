# Debug direct du frontend - Vérification des erreurs exactes
Write-Host "🔍 DEBUG FRONTEND DIRECT" -ForegroundColor Red
Write-Host "========================" -ForegroundColor Red
Write-Host ""

# Test 1: Vérifier si Angular compile sans erreurs
Write-Host "1️⃣ Vérification compilation Angular..." -ForegroundColor Yellow
try {
    $ngBuild = Start-Process -FilePath "ng" -ArgumentList "build", "--configuration=development" -WorkingDirectory "frontend-angular" -PassThru -Wait -WindowStyle Hidden
    if ($ngBuild.ExitCode -eq 0) {
        Write-Host "✅ Compilation Angular: OK" -ForegroundColor Green
    } else {
        Write-Host "❌ Compilation Angular: ERREURS" -ForegroundColor Red
    }
} catch {
    Write-Host "⚠️ Impossible de tester la compilation: $($_.Exception.Message)" -ForegroundColor Yellow
}

# Test 2: Vérifier les erreurs TypeScript
Write-Host ""
Write-Host "2️⃣ Vérification TypeScript..." -ForegroundColor Yellow
try {
    $tscCheck = Start-Process -FilePath "npx" -ArgumentList "tsc", "--noEmit", "--project", "tsconfig.json" -WorkingDirectory "frontend-angular" -PassThru -Wait -WindowStyle Hidden
    if ($tscCheck.ExitCode -eq 0) {
        Write-Host "✅ TypeScript: OK" -ForegroundColor Green
    } else {
        Write-Host "❌ TypeScript: ERREURS" -ForegroundColor Red
    }
} catch {
    Write-Host "⚠️ Impossible de vérifier TypeScript: $($_.Exception.Message)" -ForegroundColor Yellow
}

# Test 3: Vérifier les routes Angular
Write-Host ""
Write-Host "3️⃣ Vérification routes Angular..." -ForegroundColor Yellow
$routesFile = "frontend-angular/src/app/app.routes.ts"
if (Test-Path $routesFile) {
    Write-Host "✅ Fichier routes trouvé" -ForegroundColor Green
    $routesContent = Get-Content $routesFile -Raw
    if ($routesContent -match "/login" -and $routesContent -match "/register" -and $routesContent -match "/dashboard") {
        Write-Host "✅ Routes principales configurées" -ForegroundColor Green
    } else {
        Write-Host "❌ Routes manquantes dans la configuration" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Fichier routes non trouvé" -ForegroundColor Red
}

# Test 4: Vérifier les composants existent
Write-Host ""
Write-Host "4️⃣ Vérification composants..." -ForegroundColor Yellow
$components = @(
    "frontend-angular/src/app/components/login/login.component.ts",
    "frontend-angular/src/app/components/register/register.component.ts",
    "frontend-angular/src/app/components/dashboard/dashboard.component.ts"
)

foreach ($component in $components) {
    if (Test-Path $component) {
        $componentName = Split-Path $component -Leaf
        Write-Host "✅ $componentName trouvé" -ForegroundColor Green
    } else {
        $componentName = Split-Path $component -Leaf
        Write-Host "❌ $componentName manquant" -ForegroundColor Red
    }
}

# Test 5: Vérifier les services
Write-Host ""
Write-Host "5️⃣ Vérification services..." -ForegroundColor Yellow
$services = @(
    "frontend-angular/src/app/services/auth.service.ts",
    "frontend-angular/src/app/guards/auth.guard.ts"
)

foreach ($service in $services) {
    if (Test-Path $service) {
        $serviceName = Split-Path $service -Leaf
        Write-Host "✅ $serviceName trouvé" -ForegroundColor Green
    } else {
        $serviceName = Split-Path $service -Leaf
        Write-Host "❌ $serviceName manquant" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "🌐 TEST DIRECT DANS LE NAVIGATEUR" -ForegroundColor Yellow
Write-Host "==================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "ÉTAPES À SUIVRE MAINTENANT:" -ForegroundColor White
Write-Host "1. Ouvrir http://localhost:4200 dans Chrome/Edge" -ForegroundColor Cyan
Write-Host "2. Appuyer F12 pour ouvrir DevTools" -ForegroundColor Cyan
Write-Host "3. Aller dans l'onglet Console" -ForegroundColor Cyan
Write-Host "4. Essayer de naviguer vers /login" -ForegroundColor Cyan
Write-Host "5. Noter TOUTES les erreurs en rouge" -ForegroundColor Cyan
Write-Host "6. Aller dans l'onglet Network" -ForegroundColor Cyan
Write-Host "7. Essayer de se connecter avec admin/Admin@123" -ForegroundColor Cyan
Write-Host "8. Vérifier si la requête POST vers /api/auth/login est envoyée" -ForegroundColor Cyan
Write-Host ""
Write-Host "ERREURS COMMUNES À CHERCHER:" -ForegroundColor Yellow
Write-Host "- 'Cannot resolve all parameters'" -ForegroundColor White
Write-Host "- 'No provider for...'" -ForegroundColor White
Write-Host "- 'Cannot read property of undefined'" -ForegroundColor White
Write-Host "- 'CORS error'" -ForegroundColor White
Write-Host "- '404 Not Found'" -ForegroundColor White
Write-Host "- 'Failed to load resource'" -ForegroundColor White

Write-Host ""
Write-Host "Appuyez sur une touche pour continuer..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")