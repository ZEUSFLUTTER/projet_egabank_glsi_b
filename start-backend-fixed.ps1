# Script de démarrage Backend EGA BANK avec JAVA_HOME automatique
Write-Host "🔧 Configuration automatique de JAVA_HOME..." -ForegroundColor Yellow

# Détecter automatiquement Java
try {
    $javaExe = Get-Command java -ErrorAction Stop
    $javaPath = $javaExe.Source
    $javaHome = Split-Path (Split-Path $javaPath)
    
    Write-Host "☕ Java détecté: $javaPath" -ForegroundColor Green
    Write-Host "🏠 JAVA_HOME configuré: $javaHome" -ForegroundColor Green
    
    # Définir JAVA_HOME pour ce processus
    $env:JAVA_HOME = $javaHome
    [System.Environment]::SetEnvironmentVariable("JAVA_HOME", $javaHome, "Process")
    
    Write-Host "✅ JAVA_HOME configuré avec succès!" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Java non trouvé dans le PATH!" -ForegroundColor Red
    Write-Host "Veuillez installer Java ou l'ajouter au PATH" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🚀 Démarrage du Backend Spring Boot..." -ForegroundColor Green
Write-Host "📍 Répertoire: $(Get-Location)" -ForegroundColor Cyan
Write-Host "🌐 URL: http://localhost:8080" -ForegroundColor Cyan
Write-Host ""

# Démarrer le backend
try {
    & .\mvnw.cmd spring-boot:run
} catch {
    Write-Host "❌ Erreur lors du démarrage: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Solutions possibles:" -ForegroundColor Yellow
    Write-Host "1. Vérifier que MySQL est démarré" -ForegroundColor White
    Write-Host "2. Vérifier que le port 8080 est libre" -ForegroundColor White
    Write-Host "3. Exécuter: netstat -ano | findstr :8080" -ForegroundColor White
    Write-Host ""
    pause
}