# Script pour tester le backend et creer l'admin
Write-Host "Test de connexion au backend EgaBank..." -ForegroundColor Cyan

$backendUrl = "http://localhost:8080"
$adminUrl = "$backendUrl/api/auth/init-admin"

# Test de connexion au backend
try {
    Write-Host "Test de connexion au backend..." -ForegroundColor Yellow
    $healthCheck = Invoke-WebRequest -Uri $backendUrl -Method GET -TimeoutSec 5
    Write-Host "Backend accessible !" -ForegroundColor Green
}
catch {
    Write-Host "Backend non accessible sur le port 8080" -ForegroundColor Red
    Write-Host "Veuillez demarrer le backend d'abord" -ForegroundColor Yellow
    Write-Host "Commande: cd 'Ega backend/Ega-backend'; ./mvnw spring-boot:run" -ForegroundColor Gray
    exit 1
}

# Creation de l'admin
try {
    Write-Host "Creation de l'admin..." -ForegroundColor Yellow
    
    $body = @{
        username = "admin"
        password = "Admin@123"
    }
    
    $response = Invoke-RestMethod -Uri $adminUrl -Method POST -Body $body -ContentType "application/x-www-form-urlencoded"
    
    Write-Host "Admin cree avec succes !" -ForegroundColor Green
    Write-Host $response -ForegroundColor Green
    Write-Host ""
    Write-Host "Configuration terminee ! Vous pouvez maintenant :" -ForegroundColor Green
    Write-Host "   1. Aller sur http://localhost:4201" -ForegroundColor White
    Write-Host "   2. Cliquer sur 'Connexion'" -ForegroundColor White
    Write-Host "   3. Utiliser les identifiants :" -ForegroundColor White
    Write-Host "      Username: admin" -ForegroundColor Cyan
    Write-Host "      Password: Admin@123" -ForegroundColor Cyan
}
catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 400) {
        Write-Host "L'admin existe deja !" -ForegroundColor Yellow
        Write-Host "Vous pouvez vous connecter avec :" -ForegroundColor Green
        Write-Host "   Username: admin" -ForegroundColor Cyan
        Write-Host "   Password: Admin@123" -ForegroundColor Cyan
    }
    else {
        Write-Host "Erreur lors de la creation de l'admin:" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Appuyez sur une touche pour continuer..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")