#!/usr/bin/env pwsh

Write-Host "🧪 TEST SIMPLE BACKEND MONGODB" -ForegroundColor Green
Write-Host "==============================" -ForegroundColor Green

$baseUrl = "http://localhost:8080/api"

# Test simple avec curl
Write-Host "🔍 Test de base..." -ForegroundColor Yellow

try {
    # Test endpoint clients (devrait retourner 401 sans auth)
    $response = Invoke-WebRequest -Uri "$baseUrl/clients" -Method GET -UseBasicParsing
    Write-Host "✅ API accessible - Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "✅ API accessible - Authentification requise (normal)" -ForegroundColor Green
    } else {
        Write-Host "❌ Erreur: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "   Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Yellow
    }
}

# Test création admin
Write-Host "👑 Test création admin..." -ForegroundColor Cyan

$adminData = @{
    username = "admin"
    password = "admin123"
} | ConvertTo-Json

try {
    $headers = @{
        "Content-Type" = "application/json"
    }
    
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method POST -Body $adminData -Headers $headers
    Write-Host "✅ Admin créé avec succès!" -ForegroundColor Green
    Write-Host "   Username: $($response.username)" -ForegroundColor White
    Write-Host "   Role: $($response.role)" -ForegroundColor White
} catch {
    Write-Host "⚠️ Erreur création admin: $($_.Exception.Message)" -ForegroundColor Yellow
    # Essayer de se connecter si l'admin existe déjà
    try {
        $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $adminData -Headers $headers
        Write-Host "✅ Admin existe déjà - Connexion réussie!" -ForegroundColor Green
        Write-Host "   Token: $($loginResponse.token.Substring(0, 20))..." -ForegroundColor White
    } catch {
        Write-Host "❌ Impossible de se connecter: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "" -ForegroundColor White
Write-Host "📋 RÉSUMÉ:" -ForegroundColor Cyan
Write-Host "🌐 Backend: http://localhost:8080" -ForegroundColor White
Write-Host "🗃️ MongoDB: localhost:27017/egabank" -ForegroundColor White
Write-Host "👑 Admin: admin / admin123" -ForegroundColor White
Write-Host "" -ForegroundColor White
Write-Host "🎯 PROCHAINE ÉTAPE: Démarrer le frontend" -ForegroundColor Green
Write-Host "   cd frontend-angular && npm start" -ForegroundColor Yellow