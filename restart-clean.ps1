# Script de redémarrage propre EGA BANK
Write-Host "🧹 Nettoyage des processus existants..." -ForegroundColor Yellow

# Tuer tous les processus Java sur le port 8080
$processes = netstat -ano | findstr :8080
if ($processes) {
    $processes | ForEach-Object {
        $pid = ($_ -split '\s+')[-1]
        if ($pid -match '^\d+$') {
            Write-Host "🔪 Arrêt du processus PID: $pid" -ForegroundColor Red
            taskkill /PID $pid /F 2>$null
        }
    }
}

# Tuer les processus Node.js sur le port 4200
$processes4200 = netstat -ano | findstr :4200
if ($processes4200) {
    $processes4200 | ForEach-Object {
        $pid = ($_ -split '\s+')[-1]
        if ($pid -match '^\d+$') {
            Write-Host "🔪 Arrêt du processus PID: $pid" -ForegroundColor Red
            taskkill /PID $pid /F 2>$null
        }
    }
}

Write-Host "⏳ Attente de libération des ports..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Vérifier que les ports sont libres
$port8080 = netstat -ano | findstr :8080
$port4200 = netstat -ano | findstr :4200

if (-not $port8080) {
    Write-Host "✅ Port 8080 libéré" -ForegroundColor Green
} else {
    Write-Host "❌ Port 8080 encore occupé" -ForegroundColor Red
}

if (-not $port4200) {
    Write-Host "✅ Port 4200 libéré" -ForegroundColor Green
} else {
    Write-Host "❌ Port 4200 encore occupé" -ForegroundColor Red
}

Write-Host ""
Write-Host "🚀 Redémarrage de l'application EGA BANK..." -ForegroundColor Green

# Configuration Java
[System.Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Java\jdk-23", "Process")

Write-Host "📡 Démarrage du Backend Spring Boot..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'Ega backend/Ega-backend'; [System.Environment]::SetEnvironmentVariable('JAVA_HOME', 'C:\Program Files\Java\jdk-23', 'Process'); ./mvnw.cmd spring-boot:run"

Write-Host "⏳ Attente du démarrage du backend (20 secondes)..." -ForegroundColor Yellow
Start-Sleep -Seconds 20

Write-Host "🌐 Démarrage du Frontend Angular..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend-angular; npm start"

Write-Host "⏳ Attente du démarrage du frontend (15 secondes)..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

Write-Host "🧪 Test des services..." -ForegroundColor Yellow

# Test Backend
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/init-admin" -Method POST -ContentType "application/json"
    Write-Host "✅ Backend OK: $response" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend non accessible: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Frontend
try {
    $response = Invoke-WebRequest -Uri "http://localhost:4200" -Method GET
    if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 302) {
        Write-Host "✅ Frontend OK: Status $($response.StatusCode)" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Frontend non accessible: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 APPLICATION EGA BANK REDÉMARRÉE !" -ForegroundColor Green
Write-Host "📱 Frontend: http://localhost:4200" -ForegroundColor Cyan
Write-Host "📡 Backend: http://localhost:8080" -ForegroundColor Cyan
Write-Host "🔐 Admin: username=admin, password=Admin@123" -ForegroundColor Cyan
Write-Host ""
Write-Host "Appuyez sur une touche pour continuer..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")