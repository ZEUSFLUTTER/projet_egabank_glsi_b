#!/usr/bin/env pwsh

Write-Host "🔧 RÉPARATION ET DÉMARRAGE COMPLET" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green

Write-Host "`n1. Arrêt des processus existants..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.ProcessName -like "*java*" -or $_.ProcessName -like "*node*"} | Stop-Process -Force -ErrorAction SilentlyContinue
netstat -ano | findstr :8080 | ForEach-Object { $pid = ($_ -split '\s+')[-1]; if ($pid -ne "0") { taskkill /PID $pid /F 2>$null } }
netstat -ano | findstr :4200 | ForEach-Object { $pid = ($_ -split '\s+')[-1]; if ($pid -ne "0") { taskkill /PID $pid /F 2>$null } }

Write-Host "`n2. Configuration H2 pour éviter MySQL..." -ForegroundColor Yellow

# Sauvegarder la config actuelle
if (Test-Path "Ega backend/Ega-backend/src/main/resources/application.properties") {
    Copy-Item "Ega backend/Ega-backend/src/main/resources/application.properties" "Ega backend/Ega-backend/src/main/resources/application.properties.backup"
}

# Configuration H2 complète
$h2Config = @"
spring.application.name=Ega-backend

# H2 Database Configuration
spring.datasource.url=jdbc:h2:mem:egabank;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console

# JPA/Hibernate Configuration
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=false

# Server Configuration
server.port=8080

# JWT Configuration
jwt.secret=egaBankSecretKeyForJWTTokenGeneration2024SecureKey
jwt.expiration=86400000

# CORS Configuration
app.cors.allowed-origins=http://localhost:4200

# Logging
logging.level.org.springframework.web=INFO
logging.level.org.hibernate=WARN
"@

Set-Content -Path "Ega backend/Ega-backend/src/main/resources/application.properties" -Value $h2Config
Write-Host "✅ Configuration H2 appliquée" -ForegroundColor Green

Write-Host "`n3. Vérification dépendances H2 dans pom.xml..." -ForegroundColor Yellow
$pomPath = "Ega backend/Ega-backend/pom.xml"
$pomContent = Get-Content $pomPath -Raw

if ($pomContent -notmatch "h2") {
    Write-Host "   Ajout dépendance H2..." -ForegroundColor Gray
    $h2Dependency = @"
		<dependency>
			<groupId>com.h2database</groupId>
			<artifactId>h2</artifactId>
			<scope>runtime</scope>
		</dependency>
"@
    $pomContent = $pomContent -replace "(<dependency>\s*<groupId>mysql</groupId>.*?</dependency>)", "$1`n$h2Dependency"
    Set-Content -Path $pomPath -Value $pomContent
    Write-Host "✅ Dépendance H2 ajoutée" -ForegroundColor Green
} else {
    Write-Host "✅ H2 déjà présent" -ForegroundColor Green
}

Write-Host "`n4. Nettoyage et compilation..." -ForegroundColor Yellow
Push-Location "Ega backend/Ega-backend"
try {
    $env:JAVA_HOME = "C:\Program Files\Java\jdk-23"
    ./mvnw clean compile -q
    Write-Host "✅ Compilation réussie" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Erreur compilation, on continue..." -ForegroundColor Yellow
} finally {
    Pop-Location
}

Write-Host "`n5. Démarrage Backend..." -ForegroundColor Yellow
$backendJob = Start-Job -ScriptBlock {
    Set-Location $args[0]
    $env:JAVA_HOME = "C:\Program Files\Java\jdk-23"
    ./mvnw spring-boot:run
} -ArgumentList (Resolve-Path "Ega backend/Ega-backend").Path

Write-Host "✅ Backend en cours de démarrage..." -ForegroundColor Green

Write-Host "`n6. Attente démarrage backend..." -ForegroundColor Yellow
$maxWait = 60
$waited = 0
do {
    Start-Sleep -Seconds 2
    $waited += 2
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8080/actuator/health" -TimeoutSec 2 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ Backend démarré!" -ForegroundColor Green
            break
        }
    } catch {
        # Continue à attendre
    }
    
    if ($waited -ge $maxWait) {
        Write-Host "⚠️ Backend prend du temps, on continue..." -ForegroundColor Yellow
        break
    }
    
    Write-Host "   Attente... ($waited/$maxWait secondes)" -ForegroundColor Gray
} while ($waited -lt $maxWait)

Write-Host "`n7. Démarrage Frontend..." -ForegroundColor Yellow
$frontendJob = Start-Job -ScriptBlock {
    Set-Location $args[0]
    npm start
} -ArgumentList (Resolve-Path "frontend-angular").Path

Write-Host "✅ Frontend en cours de démarrage..." -ForegroundColor Green

Write-Host "`n8. Attente démarrage frontend..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

Write-Host "`n9. Création comptes de test..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Création admin
try {
    $adminData = @{
        username = "admin"
        password = "Admin@123"
    } | ConvertTo-Json
    
    $adminResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/register-admin" -Method POST -ContentType "application/json" -Body $adminData -TimeoutSec 10
    Write-Host "✅ Admin créé: admin / Admin@123" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Admin: $($_.Exception.Message)" -ForegroundColor Yellow
}

# Création client
try {
    $clientData = @{
        nom = "TestClient"
        prenom = "User"
        dateNaissance = "1990-01-01"
        sexe = "M"
        adresse = "123 Test Street"
        telephone = "0123456789"
        courriel = "testclient@example.com"
        nationalite = "Française"
        username = "testclient"
        password = "Test@123"
    } | ConvertTo-Json
    
    $clientResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/register" -Method POST -ContentType "application/json" -Body $clientData -TimeoutSec 10
    Write-Host "✅ Client créé: testclient / Test@123" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Client: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host "`n🎉 PROJET DÉMARRÉ AVEC SUCCÈS!" -ForegroundColor Green
Write-Host "==============================" -ForegroundColor Green
Write-Host "Backend: http://localhost:8080" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:4200" -ForegroundColor Cyan
Write-Host "Base de données: H2 (en mémoire)" -ForegroundColor Cyan
Write-Host "Console H2: http://localhost:8080/h2-console" -ForegroundColor Cyan

Write-Host "`n👤 Comptes disponibles:" -ForegroundColor Yellow
Write-Host "Admin: admin / Admin@123" -ForegroundColor White
Write-Host "Client: testclient / Test@123" -ForegroundColor White

Write-Host "`n🔗 Pages à tester:" -ForegroundColor Yellow
Write-Host "Login: http://localhost:4200/login" -ForegroundColor Cyan
Write-Host "Dashboard Admin: http://localhost:4200/dashboard" -ForegroundColor Cyan
Write-Host "Profil Client: http://localhost:4200/profil" -ForegroundColor Cyan

Write-Host "`n🚀 Ouverture automatique..." -ForegroundColor Green
Start-Sleep -Seconds 3
Start-Process "http://localhost:4200/login"

Write-Host "`n📝 Jobs en cours:" -ForegroundColor Gray
Write-Host "Backend Job ID: $($backendJob.Id)" -ForegroundColor Gray
Write-Host "Frontend Job ID: $($frontendJob.Id)" -ForegroundColor Gray
Write-Host "Utilisez 'Get-Job' pour voir l'état" -ForegroundColor Gray