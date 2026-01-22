# Script pour initialiser l'admin via HTTP
Write-Host "🔧 Initialisation de l'admin EgaBank..." -ForegroundColor Cyan

$adminUrl = "http://localhost:8080/api/auth/init-admin"
$username = "admin"
$password = "Admin@123"

try {
    Write-Host "📡 Tentative de création de l'admin..." -ForegroundColor Yellow
    
    $response = Invoke-RestMethod -Uri "$adminUrl" -Method POST -Body @{
        username = $username
        password = $password
    } -ContentType "application/x-www-form-urlencoded"
    
    Write-Host "✅ Admin créé avec succès !" -ForegroundColor Green
    Write-Host "👤 Username: $username" -ForegroundColor White
    Write-Host "🔑 Password: $password" -ForegroundColor White
    Write-Host ""
    Write-Host "Vous pouvez maintenant vous connecter avec ces identifiants." -ForegroundColor Green
    
} catch {
    Write-Host "❌ Erreur lors de la création de l'admin:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.Exception.Response.StatusCode -eq 400) {
        Write-Host "ℹ️  L'admin existe peut-être déjà. Essayez de vous connecter avec:" -ForegroundColor Yellow
        Write-Host "👤 Username: admin" -ForegroundColor White
        Write-Host "🔑 Password: Admin@123" -ForegroundColor White
    } else {
        Write-Host "🔧 Vérifiez que le backend est démarré sur le port 8080" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Appuyez sur une touche pour continuer..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")