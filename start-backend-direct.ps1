#!/usr/bin/env pwsh

Write-Host "🚀 DÉMARRAGE DIRECT BACKEND MONGODB" -ForegroundColor Green
Write-Host "===================================" -ForegroundColor Green

# Nettoyer les processus
Get-Process -Name "java" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

# Vérifier MongoDB
Write-Host "🔍 MongoDB..." -ForegroundColor Yellow
$mongoProcess = Get-Process -Name "mongod" -ErrorAction SilentlyContinue
if ($mongoProcess) {
    Write-Host "✅ MongoDB actif" -ForegroundColor Green
} else {
    Write-Host "⚠️ MongoDB non détecté" -ForegroundColor Yellow
}

Set-Location "Ega backend/Ega-backend"

# Essayer de définir JAVA_HOME automatiquement
$javaExe = Get-Command java -ErrorAction SilentlyContinue
if ($javaExe) {
    $javaPath = $javaExe.Source
    $javaBinDir = Split-Path $javaPath -Parent
    $javaHomeDir = Split-Path $javaBinDir -Parent
    
    Write-Host "🔧 Configuration Java..." -ForegroundColor Cyan
    Write-Host "   Java exe: $javaPath" -ForegroundColor White
    Write-Host "   Java home: $javaHomeDir" -ForegroundColor White
    
    $env:JAVA_HOME = $javaHomeDir
    $env:PATH = "$javaBinDir;$env:PATH"
}

# Vérifier Java
try {
    $javaVersion = & java -version 2>&1 | Select-String "version" | Select-Object -First 1
    Write-Host "☕ $javaVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Java non disponible!" -ForegroundColor Red
    exit 1
}

# Essayer Maven système d'abord
Write-Host "🔨 Compilation..." -ForegroundColor Yellow

$mavenCmd = $null
if (Get-Command "mvn" -ErrorAction SilentlyContinue) {
    $mavenCmd = "mvn"
    Write-Host "📦 Maven système trouvé" -ForegroundColor Cyan
} elseif (Test-Path "./mvnw.cmd") {
    $mavenCmd = "./mvnw.cmd"
    Write-Host "📦 Maven Wrapper trouvé" -ForegroundColor Cyan
} else {
    Write-Host "❌ Aucun Maven trouvé!" -ForegroundColor Red
    exit 1
}

# Nettoyer et compiler
Write-Host "🧹 Nettoyage..." -ForegroundColor Yellow
& $mavenCmd clean -q
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur nettoyage!" -ForegroundColor Red
    exit 1
}

Write-Host "🔨 Compilation..." -ForegroundColor Yellow
& $mavenCmd compile -q
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur compilation!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Compilation réussie!" -ForegroundColor Green

# Démarrer
Write-Host "🚀 Démarrage Spring Boot..." -ForegroundColor Green
Write-Host "🌐 http://localhost:8080" -ForegroundColor Cyan
Write-Host "🗃️ MongoDB: localhost:27017/egabank" -ForegroundColor Cyan
Write-Host "" -ForegroundColor White

& $mavenCmd spring-boot:run