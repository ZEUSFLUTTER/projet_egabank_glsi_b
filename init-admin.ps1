Write-Host "Initialisation de l'utilisateur admin..." -ForegroundColor Green
Write-Host ""
Write-Host "Username: admin" -ForegroundColor Yellow
Write-Host "Password: Admin@123" -ForegroundColor Yellow
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/init-admin?username=admin&password=Admin@123" -Method POST
    Write-Host $response -ForegroundColor Green
    Write-Host ""
    Write-Host "Admin cree avec succes !" -ForegroundColor Green
} catch {
    Write-Host "Erreur: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Assurez-vous que le backend est demarre sur http://localhost:8080" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Appuyez sur une touche pour continuer..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
