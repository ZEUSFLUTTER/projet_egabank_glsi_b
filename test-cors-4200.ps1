# Test CORS depuis le port 4200
Write-Host "Test CORS depuis le port 4200..." -ForegroundColor Yellow

$loginUrl = "http://localhost:8080/api/auth/login"
$headers = @{
    "Content-Type" = "application/json"
    "Origin" = "http://localhost:4200"
}

$body = @{
    username = "admin"
    password = "Admin@123"
} | ConvertTo-Json

Write-Host "URL: $loginUrl" -ForegroundColor Gray
Write-Host "Origin: http://localhost:4200" -ForegroundColor Gray

try {
    $response = Invoke-RestMethod -Uri $loginUrl -Method POST -Body $body -Headers $headers
    Write-Host "SUCCESS: Connexion reussie depuis le port 4200 !" -ForegroundColor Green
    Write-Host "Token: $($response.token)" -ForegroundColor Cyan
    Write-Host "Role: $($response.role)" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Le frontend est maintenant accessible sur:" -ForegroundColor Green
    Write-Host "http://localhost:4200" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Testez la connexion admin avec:" -ForegroundColor Yellow
    Write-Host "Username: admin" -ForegroundColor White
    Write-Host "Password: Admin@123" -ForegroundColor White
}
catch {
    Write-Host "ERROR: Probleme de connexion" -ForegroundColor Red
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "Message: $($_.Exception.Message)" -ForegroundColor Red
}