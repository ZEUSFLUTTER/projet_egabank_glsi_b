#!/usr/bin/env pwsh

Write-Host "🔍 VÉRIFICATION UTILISATEURS MONGODB" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green

# Test avec différents mots de passe possibles pour admin
$passwords = @("admin123", "Admin@123", "password123", "admin", "123456")

foreach ($password in $passwords) {
    Write-Host "🧪 Test avec mot de passe: $password" -ForegroundColor Yellow
    
    $loginData = @{
        username = "admin"
        password = $password
    } | ConvertTo-Json
    
    $headers = @{
        "Content-Type" = "application/json"
    }
    
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -Body $loginData -Headers $headers
        Write-Host "✅ SUCCÈS avec $password !" -ForegroundColor Green
        Write-Host "   Token: $($response.token.Substring(0, 30))..." -ForegroundColor White
        Write-Host "   Role: $($response.role)" -ForegroundColor White
        break
    } catch {
        Write-Host "❌ Échec avec $password" -ForegroundColor Red
    }
}

Write-Host "" -ForegroundColor White
Write-Host "💡 Si aucun mot de passe ne fonctionne, nous devrons recréer l'admin" -ForegroundColor Cyan