# Script PowerShell robuste pour démarrer Angular
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Démarrage Frontend Angular - EGA Bank" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Définir le chemin Node.js
$nodePath = "C:\Program Files\nodejs"
$currentPath = $env:PATH

# Ajouter Node.js au PATH si pas déjà présent
if ($currentPath -notlike "*$nodePath*") {
    $env:PATH = "$nodePath;$currentPath"
    Write-Host "✅ Node.js ajouté au PATH" -ForegroundColor Green
} else {
    Write-Host "✅ Node.js déjà dans le PATH" -ForegroundColor Green
}

# Vérifier Node.js
Write-Host "🔍 Vérification de Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = & node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Erreur: Node.js non trouvé" -ForegroundColor Red
    Write-Host "Vérifiez que Node.js est installé dans: $nodePath" -ForegroundColor Red
    pause
    exit 1
}

# Vérifier npm
Write-Host "🔍 Vérification de npm..." -ForegroundColor Yellow
try {
    $npmVersion = & npm --version
    Write-Host "✅ npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Erreur: npm non trouvé" -ForegroundColor Red
    pause
    exit 1
}

# Aller dans le répertoire Angular
$angularPath = Join-Path $PSScriptRoot "bank-frontend-angular"
if (Test-Path $angularPath) {
    Set-Location $angularPath
    Write-Host "✅ Répertoire Angular trouvé: $angularPath" -ForegroundColor Green
} else {
    Write-Host "❌ Erreur: Répertoire Angular non trouvé: $angularPath" -ForegroundColor Red
    pause
    exit 1
}

Write-Host ""
Write-Host "🚀 Démarrage du serveur Angular..." -ForegroundColor Yellow
Write-Host "⏳ Cela peut prendre 1-2 minutes..." -ForegroundColor Yellow
Write-Host "📱 L'application sera accessible sur: http://localhost:4200" -ForegroundColor Cyan
Write-Host ""

# Démarrer le serveur Angular
try {
    # Désactiver les analytics automatiquement et démarrer
    & npm config set @angular/cli.analytics false
    & npm start
} catch {
    Write-Host "❌ Erreur lors du démarrage d'Angular" -ForegroundColor Red
    Write-Host "Détails de l'erreur: $_" -ForegroundColor Red
    pause
}

Write-Host ""
Write-Host "Appuyez sur une touche pour fermer..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")