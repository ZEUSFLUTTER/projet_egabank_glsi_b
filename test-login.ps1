# Test de connexion directe
Write-Host "Test de connexion admin..." -ForegroundColor Yellow

$loginUrl = "http://localhost:8080/api/auth/login"
$body = @{
    username = "admin"
    password = "Admin@123"
} | ConvertTo-Json

Write-Host "URL: $loginUrl" -ForegroundColor Gray
Write-Host "Body: $body" -ForegroundColor Gray

try {
    $response = Invoke-RestMethod -Uri $loginUrl -Method POST -Body $body -ContentType "application/json"
    Write-Host "SUCCESS: Connexion reussie !" -ForegroundColor Green
    Write-Host "Token: $($response.token)" -ForegroundColor Cyan
    Write-Host "Role: $($response.role)" -ForegroundColor Cyan
    Write-Host "Username: $($response.username)" -ForegroundColor Cyan
}
catch {
    Write-Host "ERROR: Connexion echouee" -ForegroundColor Red
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "Message: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body: $responseBody" -ForegroundColor Red
    }
}