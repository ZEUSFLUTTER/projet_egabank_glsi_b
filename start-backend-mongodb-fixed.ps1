#!/usr/bin/env pwsh

Write-Host "🚀 DÉMARRAGE BACKEND MONGODB - CORRIGÉ" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Arrêter les processus existants
Write-Host "🛑 Nettoyage des processus..." -ForegroundColor Yellow
try {
    Get-Process -Name "java" -ErrorAction SilentlyContinue | Stop-Process -Force
    Start-Sleep -Seconds 2
} catch {}

# Vérifier MongoDB
Write-Host "🔍 Vérification de MongoDB..." -ForegroundColor Yellow
try {
    $mongoProcess = Get-Process -Name "mongod" -ErrorAction SilentlyContinue
    if ($mongoProcess) {
        Write-Host "✅ MongoDB actif (PID: $($mongoProcess.Id))" -ForegroundColor Green
    } else {
        Write-Host "⚠️ MongoDB non détecté, continuons..." -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️ Vérification MongoDB impossible" -ForegroundColor Yellow
}

# Aller dans le répertoire backend
Set-Location "Ega backend/Ega-backend"
Write-Host "📁 Répertoire: $(Get-Location)" -ForegroundColor Cyan

# Configurer Java (essayer plusieurs chemins possibles)
$javaPaths = @(
    "${env:JAVA_HOME}\bin",
    "${env:ProgramFiles}\Java\jdk-17\bin",
    "${env:ProgramFiles}\Java\jdk-11\bin",
    "${env:ProgramFiles}\Eclipse Adoptium\jdk-17.0.2.8-hotspot\bin",
    "${env:ProgramFiles}\Eclipse Foundation\jdk-17.0.2.8-hotspot\bin"
)

$javaFound = $false
foreach ($path in $javaPaths) {
    if (Test-Path "$path\java.exe") {
        $env:JAVA_HOME = Split-Path $path -Parent
        $env:PATH = "$path;$env:PATH"
        Write-Host "✅ Java trouvé: $path" -ForegroundColor Green
        $javaFound = $true
        break
    }
}

if (-not $javaFound) {
    Write-Host "⚠️ Java non trouvé, utilisation du système par défaut" -ForegroundColor Yellow
}

# Vérifier Java
try {
    $javaVersion = & java -version 2>&1 | Select-String "version"
    Write-Host "☕ Java: $javaVersion" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Java non disponible!" -ForegroundColor Red
    Write-Host "💡 Installez Java 17 ou configurez JAVA_HOME" -ForegroundColor Yellow
    exit 1
}

# Utiliser Maven directement avec Java
Write-Host "🔨 Compilation avec Maven..." -ForegroundColor Yellow

# Essayer mvnw d'abord
if (Test-Path "./mvnw.cmd") {
    Write-Host "📦 Utilisation de Maven Wrapper..." -ForegroundColor Cyan
    & ./mvnw.cmd clean compile -q
} elseif (Get-Command "mvn" -ErrorAction SilentlyContinue) {
    Write-Host "📦 Utilisation de Maven système..." -ForegroundColor Cyan
    & mvn clean compile -q
} else {
    Write-Host "❌ Maven non trouvé!" -ForegroundColor Red
    exit 1
}

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur de compilation!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Compilation réussie!" -ForegroundColor Green

# Démarrer l'application
Write-Host "🚀 Démarrage Spring Boot..." -ForegroundColor Green
Write-Host "🌐 URL: http://localhost:8080" -ForegroundColor Cyan
Write-Host "🗃️ MongoDB: localhost:27017/egabank" -ForegroundColor Cyan
Write-Host "" -ForegroundColor White

if (Test-Path "./mvnw.cmd") {
    & ./mvnw.cmd spring-boot:run
} else {
    & mvn spring-boot:run
}