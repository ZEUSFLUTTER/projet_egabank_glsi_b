# Script pour corriger les erreurs de compilation Spring Boot
Write-Host "🔧 CORRECTION DES ERREURS DE COMPILATION" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

$backendPath = "Ega backend/Ega-backend"

Write-Host "`n📝 Correction des erreurs de types String/Long..." -ForegroundColor Yellow

# Corriger CompteService
$compteServicePath = "$backendPath/src/main/java/com/example/Ega/backend/service/CompteService.java"
if (Test-Path $compteServicePath) {
    Write-Host "   ✅ Correction CompteService..." -ForegroundColor Green
    
    # Lire le contenu
    $content = Get-Content $compteServicePath -Raw
    
    # Remplacer String par Long pour les IDs
    $content = $content -replace 'public List<CompteDTO> getComptesByClientId\(String clientId\)', 'public List<CompteDTO> getComptesByClientId(Long clientId)'
    $content = $content -replace 'public void deleteCompte\(String id\)', 'public void deleteCompte(Long id)'
    $content = $content -replace 'findByClientId\(clientId\)', 'findByClientId(clientId)'
    $content = $content -replace 'findById\(id\)', 'findById(id)'
    $content = $content -replace 'deleteById\(id\)', 'deleteById(id)'
    
    # Sauvegarder
    Set-Content $compteServicePath -Value $content -Encoding UTF8
}

# Corriger SecurityUtil
$securityUtilPath = "$backendPath/src/main/java/com/example/Ega/backend/util/SecurityUtil.java"
if (Test-Path $securityUtilPath) {
    Write-Host "   ✅ Correction SecurityUtil..." -ForegroundColor Green
    
    $content = Get-Content $securityUtilPath -Raw
    $content = $content -replace 'return user\.getClient\(\)\.getId\(\);', 'return user.getClient().getId().toString();'
    Set-Content $securityUtilPath -Value $content -Encoding UTF8
}

Write-Host "`n🔨 Nettoyage et recompilation..." -ForegroundColor Yellow

# Nettoyer le cache Maven
Set-Location $backendPath
$env:JAVA_HOME = "C:\Program Files\Java\jdk-23"

Write-Host "   🧹 Nettoyage Maven..." -ForegroundColor Gray
& ./mvnw clean -q

Write-Host "   📦 Compilation..." -ForegroundColor Gray
$compileResult = & ./mvnw compile 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Compilation réussie!" -ForegroundColor Green
} else {
    Write-Host "   ⚠️ Erreurs de compilation restantes:" -ForegroundColor Yellow
    $compileResult | Where-Object { $_ -match "ERROR" } | ForEach-Object {
        Write-Host "      $_" -ForegroundColor Red
    }
}

Set-Location "../.."

Write-Host "`n🎯 CORRECTION TERMINÉE" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Cyan