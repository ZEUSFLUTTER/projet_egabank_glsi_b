# Script simple pour creer l'admin
$adminUrl = "http://localhost:8080/api/auth/init-admin"

Write-Host "Creation de l'admin EgaBank..." -ForegroundColor Yellow

try {
    $body = @{
        username = "admin"
        password = "Admin@123"
    }
    
    $response = Invoke-RestMethod -Uri $adminUrl -Method POST -Body $body -ContentType "application/x-www-form-urlencoded"
    
    Write-Host "SUCCESS: Admin cree !" -ForegroundColor Green
    Write-Host "Username: admin" -ForegroundColor Cyan
    Write-Host "Password: Admin@123" -ForegroundColor Cyan
}
catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 400) {
        Write-Host "INFO: L'admin existe deja" -ForegroundColor Yellow
        Write-Host "Username: admin" -ForegroundColor Cyan
        Write-Host "Password: Admin@123" -ForegroundColor Cyan
    }
    else {
        Write-Host "ERROR: Impossible de creer l'admin" -ForegroundColor Red
        Write-Host "Verifiez que le backend est demarre sur le port 8080" -ForegroundColor Yellow
    }
}