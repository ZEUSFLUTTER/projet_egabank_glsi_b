#!/usr/bin/env pwsh

Write-Host "🧪 TEST SERVICES SIMPLE" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan

# Test Backend
Write-Host "`n1. Test Backend (port 8080)..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/auth/login" -Method POST -ContentType "application/json" -Body '{"username":"test","password":"test"}' -ErrorAction SilentlyContinue
    Write-Host "✅ Backend accessible (status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "✅ Backend accessible (401 attendu pour mauvais credentials)" -ForegroundColor Green
    } else {
        Write-Host "❌ Backend non accessible: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
}

# Test Frontend
Write-Host "`n2. Test Frontend (port 4200)..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:4200" -ErrorAction SilentlyContinue
    Write-Host "✅ Frontend accessible" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend non accessible: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "`n✅ Les deux services sont accessibles!" -ForegroundColor Green
Write-Host "`n🔗 URLs de test:" -ForegroundColor Yellow
Write-Host "   - Test Client: http://localhost:4200/test-client" -ForegroundColor White
Write-Host "   - Debug Navigation: http://localhost:4200/debug-nav" -ForegroundColor White
Write-Host "   - Login: http://localhost:4200/login" -ForegroundColor White

Write-Host "`n📋 Instructions:" -ForegroundColor Yellow
Write-Host "   1. Ouvrez http://localhost:4200/login" -ForegroundColor White
Write-Host "   2. Connectez-vous avec un compte client" -ForegroundColor White
Write-Host "   3. Puis testez http://localhost:4200/test-client" -ForegroundColor White
Write-Host "   4. Cliquez sur 'Aller au Profil' et observez les logs" -ForegroundColor White

# Ouvrir le navigateur
Start-Process "http://localhost:4200/login"