#!/usr/bin/env pwsh

Write-Host "🔍 TEST ENDPOINTS PROFIL" -ForegroundColor Green
Write-Host "========================" -ForegroundColor Green

# D'abord, se connecter pour obtenir un token
Write-Host "`n1. Connexion pour obtenir un token..." -ForegroundColor Yellow
$loginData = @{username="zako1"; password="password"} | ConvertTo-Json
try {
    $authResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -Body $loginData -ContentType "application/json"
    Write-Host "✅ Connexion réussie: $($authResponse.username) ($($authResponse.role))" -ForegroundColor Green
    Write-Host "   ClientId: $($authResponse.clientId)" -ForegroundColor Cyan
    $token = $authResponse.token
    $clientId = $authResponse.clientId
} catch {
    Write-Host "❌ Erreur connexion: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test endpoint client
Write-Host "`n2. Test endpoint client..." -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

try {
    $clientResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/clients/$clientId" -Method GET -Headers $headers
    Write-Host "✅ Client trouvé: $($clientResponse.prenom) $($clientResponse.nom)" -ForegroundColor Green
    Write-Host "   Email: $($clientResponse.courriel)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Erreur client: $($_.Exception.Message)" -ForegroundColor Red
}

# Test endpoint comptes
Write-Host "`n3. Test endpoint comptes..." -ForegroundColor Yellow
try {
    $comptesResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/comptes/client/$clientId" -Method GET -Headers $headers
    if ($comptesResponse -and $comptesResponse.Count -gt 0) {
        Write-Host "✅ Comptes trouvés: $($comptesResponse.Count)" -ForegroundColor Green
        foreach ($compte in $comptesResponse) {
            Write-Host "   - $($compte.numeroCompte): $($compte.typeCompte) - Solde: $($compte.solde) €" -ForegroundColor Cyan
        }
    } else {
        Write-Host "⚠️ Aucun compte trouvé pour ce client" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Erreur comptes: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎯 DIAGNOSTIC:" -ForegroundColor Magenta
Write-Host "Si tous les tests réussissent, le problème est dans le frontend Angular" -ForegroundColor White
Write-Host "Si un test échoue, le problème est dans le backend" -ForegroundColor White