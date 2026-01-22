#!/usr/bin/env pwsh

Write-Host "🚀 DÉMARRAGE PROJET COMPLET (H2)" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

Write-Host "`n1. Configuration H2 temporaire..." -ForegroundColor Yellow

# Sauvegarder la config MySQL actuelle
Copy-Item "Ega backend/Ega-backend/src/main/resources/application.properties" "Ega backend/Ega-backend/src/main/resources/application.properties.mysql.backup"

# Créer une config H2 temporaire
$h2Config = @"
spring.application.name=Ega-backend

# H2 Database Configuration (pour tests)
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=password
spring.h2.console.enabled=true

# JPA/Hibernate Configuration
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=true

# Server Configuration
server.port=8080

# JWT Configuration
jwt.secret=egaBankSecretKeyForJWTTokenGeneration2024SecureKey
jwt.expiration=86400000

# CORS Configuration
app.cors.allowed-origins=http://localhost:4200
"@

Set-Content -Path "Ega backend/Ega-backend/src/main/resources/application.properties" -Value $h2Config
Write-Host "✅ Configuration H2 appliquée" -ForegroundColor Green

Write-Host "`n2. Démarrage Backend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'Ega backend/Ega-backend'; `$env:JAVA_HOME = 'C:\Program Files\Java\jdk-23'; ./mvnw spring-boot:run"

Write-Host "`n3. Attente démarrage backend..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

Write-Host "`n4. Démarrage Frontend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend-angular; npm start"

Write-Host "`n5. Attente démarrage frontend..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host "`n✅ PROJET DÉMARRÉ!" -ForegroundColor Green
Write-Host "   - Backend: http://localhost:8080" -ForegroundColor Cyan
Write-Host "   - Frontend: http://localhost:4200" -ForegroundColor Cyan
Write-Host "   - Base de données: H2 en mémoire" -ForegroundColor Cyan

Write-Host "`n👤 Comptes de test:" -ForegroundColor Yellow
Write-Host "   - Admin: admin / Admin@123" -ForegroundColor White
Write-Host "   - Client: testclient / Test@123" -ForegroundColor White

Write-Host "`n🔗 Pages à tester:" -ForegroundColor Yellow
Write-Host "   - Login: http://localhost:4200/login" -ForegroundColor Cyan
Write-Host "   - Dashboard Admin: http://localhost:4200/dashboard" -ForegroundColor Cyan
Write-Host "   - Profil Client: http://localhost:4200/profil" -ForegroundColor Cyan
Write-Host "   - Comptes: http://localhost:4200/comptes" -ForegroundColor Cyan
Write-Host "   - Transactions: http://localhost:4200/transactions" -ForegroundColor Cyan

Write-Host "`n🚀 Ouverture automatique..." -ForegroundColor Green
Start-Sleep -Seconds 5
Start-Process "http://localhost:4200/login"

Write-Host "`n📝 Note:" -ForegroundColor Yellow
Write-Host "   La base H2 est temporaire et sera recréée à chaque redémarrage." -ForegroundColor White
Write-Host "   Pour revenir à MySQL, restaurez le fichier application.properties.mysql.backup" -ForegroundColor White