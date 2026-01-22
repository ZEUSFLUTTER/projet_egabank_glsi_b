# Script de démarrage complet EGA BANK
Write-Host "🚀 Démarrage de l'application EGA BANK..." -ForegroundColor Green

# Configuration Java
[System.Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Java\jdk-23", "Process")

Write-Host "📡 Démarrage du Backend Spring Boot..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'Ega backend/Ega-backend'; [System.Environment]::SetEnvironmentVariable('JAVA_HOME', 'C:\Program Files\Java\jdk-23', 'Process'); ./mvnw.cmd spring-boot:run"

Write-Host "⏳ Attente du démarrage du backend (15 secondes)..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

Write-Host "🌐 Démarrage du Frontend Angular..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend-angular; npm start"

Write-Host "⏳ Attente du démarrage du frontend (10 secondes)..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host "🧪 Test des services..." -ForegroundColor Yellow

# Test Backend
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/init-admin" -Method POST -ContentType "application/json"
    Write-Host "✅ Backend OK: $response" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend non accessible" -ForegroundColor Red
}

# Test Frontend
try {
    $response = Invoke-WebRequest -Uri "http://localhost:4200" -Method GET
    if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 302) {
        Write-Host "✅ Frontend OK: Status $($response.StatusCode)" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Frontend non accessible" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 APPLICATION EGA BANK DÉMARRÉE !" -ForegroundColor Green
Write-Host "📱 Frontend: http://localhost:4200" -ForegroundColor Cyan
Write-Host "📡 Backend: http://localhost:8080" -ForegroundColor Cyan
Write-Host "🔐 Admin: username=admin, password=Admin@123" -ForegroundColor Cyan
Write-Host ""
Write-Host "Appuyez sur une touche pour continuer..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")