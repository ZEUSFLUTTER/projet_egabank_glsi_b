#!/usr/bin/env pwsh

Write-Host "🔍 DIAGNOSTIC INTERFACE CLIENT EGA BANK" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan

Write-Host "`n1️⃣ Test de la route client-dashboard..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:4200/client-dashboard" -Method GET -TimeoutSec 10
    Write-Host "✅ Route accessible - Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Route inaccessible: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Vérifiez que le frontend Angular est démarré sur port 4200" -ForegroundColor Yellow
}

Write-Host "`n2️⃣ Test de connexion avec redirection..." -ForegroundColor Yellow
$loginData = @{
    username = "testclient"
    password = "Test@123"
} | ConvertTo-Json

try {
    $authResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -Body $loginData -ContentType "application/json" -TimeoutSec 10
    Write-Host "✅ Connexion réussie:" -ForegroundColor Green
    Write-Host "   Username: $($authResponse.username)" -ForegroundColor White
    Write-Host "   Role: $($authResponse.role)" -ForegroundColor White
    Write-Host "   ClientId: $($authResponse.clientId)" -ForegroundColor White
    
    if ($authResponse.role -eq "ROLE_CLIENT") {
        Write-Host "✅ Rôle CLIENT confirmé - Redirection vers /client-dashboard attendue" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Rôle non-client: $($authResponse.role)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Erreur de connexion: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n3️⃣ Vérification des fichiers de l'interface..." -ForegroundColor Yellow
$files = @(
    "frontend-angular/src/app/components/client-dashboard/client-dashboard.component.ts",
    "frontend-angular/src/app/components/client-dashboard/client-dashboard.component.html",
    "frontend-angular/src/app/components/client-dashboard/client-dashboard.component.css"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "✅ $file existe" -ForegroundColor Green
    } else {
        Write-Host "❌ $file manquant" -ForegroundColor Red
    }
}

Write-Host "`n4️⃣ Instructions de test manuel:" -ForegroundColor Yellow
Write-Host "1. Ouvrez la console du navigateur (F12)" -ForegroundColor White
Write-Host "2. Allez sur http://localhost:4200/login" -ForegroundColor White
Write-Host "3. Connectez-vous avec testclient / Test@123" -ForegroundColor White
Write-Host "4. Vérifiez les erreurs dans la console" -ForegroundColor White
Write-Host "5. Vérifiez l'URL après connexion" -ForegroundColor White

Write-Host "`n5️⃣ Test direct de l'URL:" -ForegroundColor Yellow
Write-Host "Essayez d'aller directement sur:" -ForegroundColor White
Write-Host "http://localhost:4200/client-dashboard" -ForegroundColor Cyan

Write-Host "`n🔧 SOLUTIONS POSSIBLES:" -ForegroundColor Yellow
Write-Host "1. Redémarrer le serveur Angular (Ctrl+C puis npm start)" -ForegroundColor White
Write-Host "2. Vider le cache du navigateur (Ctrl+Shift+R)" -ForegroundColor White
Write-Host "3. Vérifier les erreurs de compilation Angular" -ForegroundColor White
Write-Host "4. Vérifier que la route est bien configurée" -ForegroundColor White

Write-Host "`n=======================================" -ForegroundColor Cyan