#!/usr/bin/env pwsh

Write-Host "🧪 TEST BACKEND MONGODB - EGA BANK" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green

$baseUrl = "http://localhost:8080/api"

# Fonction pour tester une URL
function Test-ApiEndpoint {
    param(
        [string]$Url,
        [string]$Description
    )
    
    Write-Host "🔍 Test: $Description" -ForegroundColor Yellow
    try {
        $response = Invoke-RestMethod -Uri $Url -Method GET -TimeoutSec 5
        Write-Host "   ✅ Succès" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "   ❌ Échec: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Attendre que le backend soit prêt
Write-Host "⏳ Attente du backend..." -ForegroundColor Cyan
Start-Sleep -Seconds 3

# Tests de base
$tests = @(
    @{ Url = "$baseUrl/clients"; Description = "API Clients" },
    @{ Url = "$baseUrl/comptes"; Description = "API Comptes" },
    @{ Url = "$baseUrl/transactions"; Description = "API Transactions" }
)

$successCount = 0
foreach ($test in $tests) {
    if (Test-ApiEndpoint -Url $test.Url -Description $test.Description) {
        $successCount++
    }
}

Write-Host "" -ForegroundColor White
if ($successCount -eq $tests.Count) {
    Write-Host "🎉 TOUS LES TESTS RÉUSSIS!" -ForegroundColor Green
    Write-Host "✅ Backend MongoDB opérationnel" -ForegroundColor Green
} else {
    Write-Host "⚠️ $successCount/$($tests.Count) tests réussis" -ForegroundColor Yellow
}

Write-Host "" -ForegroundColor White
Write-Host "📋 PROCHAINES ÉTAPES:" -ForegroundColor Cyan
Write-Host "1. Exécuter: ./init-mongodb-data.ps1" -ForegroundColor White
Write-Host "2. Démarrer le frontend: cd frontend-angular && npm start" -ForegroundColor White
Write-Host "3. Tester sur: http://localhost:4200" -ForegroundColor White