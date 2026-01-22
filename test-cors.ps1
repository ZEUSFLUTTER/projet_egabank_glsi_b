# Test CORS depuis le port 4201
Write-Host "Test CORS depuis le port 4201..." -ForegroundColor Yellow

$loginUrl = "http://localhost:8080/api/auth/login"
$headers = @{
    "Content-Type" = "application/json"
    "Origin" = "http://localhost:4201"
}

$body = @{
    username = "admin"
    password = "Admin@123"
} | ConvertTo-Json

Write-Host "URL: $loginUrl" -ForegroundColor Gray
Write-Host "Origin: http://localhost:4201" -ForegroundColor Gray
Write-Host "Body: $body" -ForegroundColor Gray

try {
    $response = Invoke-RestMethod -Uri $loginUrl -Method POST -Body $body -Headers $headers
    Write-Host "SUCCESS: Connexion reussie avec CORS !" -ForegroundColor Green
    Write-Host "Token: $($response.token)" -ForegroundColor Cyan
    Write-Host "Role: $($response.role)" -ForegroundColor Cyan
}
catch {
    Write-Host "ERROR: Probleme CORS detecte" -ForegroundColor Red
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "Message: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body: $responseBody" -ForegroundColor Red
    }
}