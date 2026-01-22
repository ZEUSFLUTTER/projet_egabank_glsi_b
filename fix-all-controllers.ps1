# Script pour corriger tous les controllers et services
Write-Host "🔧 CORRECTION COMPLÈTE DES CONTROLLERS" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan

$backendPath = "Ega backend/Ega-backend/src/main/java/com/example/Ega/backend"

# Fonction pour remplacer String par Long dans les PathVariable
function Fix-PathVariables {
    param($filePath, $fileName)
    
    if (Test-Path $filePath) {
        Write-Host "   ✅ Correction $fileName..." -ForegroundColor Green
        
        $content = Get-Content $filePath -Raw
        
        # Remplacer @PathVariable String par @PathVariable Long
        $content = $content -replace '@PathVariable String id', '@PathVariable Long id'
        $content = $content -replace '@PathVariable String clientId', '@PathVariable Long clientId'
        $content = $content -replace '@PathVariable String compteId', '@PathVariable Long compteId'
        
        Set-Content $filePath -Value $content -Encoding UTF8
    }
}

# Corriger tous les controllers
Fix-PathVariables "$backendPath/controller/CompteController.java" "CompteController"
Fix-PathVariables "$backendPath/controller/TransactionController.java" "TransactionController"

# Corriger CompteService - méthodes avec String ID
$compteServicePath = "$backendPath/service/CompteService.java"
if (Test-Path $compteServicePath) {
    Write-Host "   ✅ Correction CompteService méthodes..." -ForegroundColor Green
    
    $content = Get-Content $compteServicePath -Raw
    
    # Corriger les signatures de méthodes
    $content = $content -replace 'getComptesByClientId\(String clientId\)', 'getComptesByClientId(Long clientId)'
    $content = $content -replace 'deleteCompte\(String id\)', 'deleteCompte(Long id)'
    
    Set-Content $compteServicePath -Value $content -Encoding UTF8
}

# Corriger TransactionService - méthodes avec String ID  
$transactionServicePath = "$backendPath/service/TransactionService.java"
if (Test-Path $transactionServicePath) {
    Write-Host "   ✅ Correction TransactionService méthodes..." -ForegroundColor Green
    
    $content = Get-Content $transactionServicePath -Raw
    
    # Corriger les signatures de méthodes
    $content = $content -replace 'getTransactionsByCompteId\(String compteId\)', 'getTransactionsByCompteId(Long compteId)'
    
    Set-Content $transactionServicePath -Value $content -Encoding UTF8
}

# Corriger SecurityUtil - conversion Long vers String
$securityUtilPath = "$backendPath/util/SecurityUtil.java"
if (Test-Path $securityUtilPath) {
    Write-Host "   ✅ Correction SecurityUtil conversion..." -ForegroundColor Green
    
    $content = Get-Content $securityUtilPath -Raw
    
    # Corriger la conversion Long vers String
    $content = $content -replace 'return user\.getClient\(\)\.getId\(\);', 'return user.getClient().getId().toString();'
    
    Set-Content $securityUtilPath -Value $content -Encoding UTF8
}

Write-Host "`n🔨 Test de compilation..." -ForegroundColor Yellow

Set-Location "Ega backend/Ega-backend"
$env:JAVA_HOME = "C:\Program Files\Java\jdk-23"

$compileResult = & ./mvnw compile -q 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Compilation réussie!" -ForegroundColor Green
    
    Write-Host "`n🚀 DÉMARRAGE DU BACKEND..." -ForegroundColor Cyan
    Write-Host "Démarrage en cours..." -ForegroundColor Yellow
    
    # Démarrer l'application en arrière-plan
    Start-Process -FilePath "powershell" -ArgumentList "-Command", "`$env:JAVA_HOME = 'C:\Program Files\Java\jdk-23'; ./mvnw spring-boot:run" -WindowStyle Minimized
    
    Write-Host "✅ Backend démarré en arrière-plan!" -ForegroundColor Green
    Write-Host "📍 URL: http://localhost:8080" -ForegroundColor White
    Write-Host "📊 Base de données: MySQL ega_bank" -ForegroundColor White
    
} else {
    Write-Host "   ❌ Erreurs de compilation:" -ForegroundColor Red
    $compileResult | Where-Object { $_ -match "ERROR" } | ForEach-Object {
        Write-Host "      $_" -ForegroundColor Red
    }
}

Set-Location "../.."

Write-Host "`n🎯 CORRECTION TERMINÉE" -ForegroundColor Green