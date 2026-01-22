#!/usr/bin/env pwsh

Write-Host "🔧 CORRECTION JAVA ET DÉMARRAGE MONGODB" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green

# Nettoyer
Get-Process -Name "java" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

Set-Location "Ega backend/Ega-backend"

# Recherche intelligente de Java
Write-Host "🔍 Recherche de Java..." -ForegroundColor Yellow

$javaLocations = @()

# Chercher dans les emplacements standards
$searchPaths = @(
    "${env:ProgramFiles}\Java",
    "${env:ProgramFiles(x86)}\Java",
    "${env:ProgramFiles}\Eclipse Adoptium",
    "${env:ProgramFiles}\Eclipse Foundation",
    "${env:ProgramFiles}\OpenJDK",
    "${env:ProgramFiles}\Amazon Corretto"
)

foreach ($basePath in $searchPaths) {
    if (Test-Path $basePath) {
        $jdkDirs = Get-ChildItem $basePath -Directory | Where-Object { $_.Name -match "jdk" }
        foreach ($jdkDir in $jdkDirs) {
            $javaExe = Join-Path $jdkDir.FullName "bin\java.exe"
            if (Test-Path $javaExe) {
                $javaLocations += @{
                    Path = $jdkDir.FullName
                    Version = $jdkDir.Name
                    Exe = $javaExe
                }
            }
        }
    }
}

if ($javaLocations.Count -eq 0) {
    Write-Host "❌ Aucune installation Java trouvée!" -ForegroundColor Red
    Write-Host "💡 Veuillez installer Java 17 ou plus récent" -ForegroundColor Yellow
    Write-Host "💡 Téléchargez depuis: https://adoptium.net/" -ForegroundColor Cyan
    exit 1
}

# Utiliser la première installation trouvée
$selectedJava = $javaLocations[0]
$env:JAVA_HOME = $selectedJava.Path
$env:PATH = "$($selectedJava.Path)\bin;$env:PATH"

Write-Host "✅ Java sélectionné:" -ForegroundColor Green
Write-Host "   Version: $($selectedJava.Version)" -ForegroundColor White
Write-Host "   Chemin: $($selectedJava.Path)" -ForegroundColor White

# Vérifier Java
try {
    $javaVersion = & "$($selectedJava.Exe)" -version 2>&1 | Select-String "version" | Select-Object -First 1
    Write-Host "☕ $javaVersion" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Erreur lors du test Java!" -ForegroundColor Red
    exit 1
}

# Vérifier MongoDB
Write-Host "🔍 Vérification MongoDB..." -ForegroundColor Yellow
$mongoProcess = Get-Process -Name "mongod" -ErrorAction SilentlyContinue
if ($mongoProcess) {
    Write-Host "✅ MongoDB actif (PID: $($mongoProcess.Id))" -ForegroundColor Green
} else {
    Write-Host "⚠️ MongoDB non détecté, mais continuons..." -ForegroundColor Yellow
}

# Compiler avec Maven
Write-Host "🔨 Compilation Maven..." -ForegroundColor Yellow

if (Get-Command "mvn" -ErrorAction SilentlyContinue) {
    Write-Host "📦 Utilisation de Maven système" -ForegroundColor Cyan
    
    # Nettoyer et compiler
    & mvn clean compile -q
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erreur de compilation!" -ForegroundColor Red
        Write-Host "💡 Vérifiez les erreurs ci-dessus" -ForegroundColor Yellow
        exit 1
    }
    
    Write-Host "✅ Compilation réussie!" -ForegroundColor Green
    
    # Démarrer
    Write-Host "🚀 Démarrage Spring Boot avec MongoDB..." -ForegroundColor Green
    Write-Host "🌐 Backend: http://localhost:8080" -ForegroundColor Cyan
    Write-Host "🗃️ MongoDB: localhost:27017/egabank" -ForegroundColor Cyan
    Write-Host "" -ForegroundColor White
    Write-Host "⏹️ Pour arrêter: Ctrl+C" -ForegroundColor Yellow
    Write-Host "" -ForegroundColor White
    
    & mvn spring-boot:run
    
} else {
    Write-Host "❌ Maven non trouvé dans le PATH!" -ForegroundColor Red
    Write-Host "💡 Installez Maven ou utilisez votre IDE" -ForegroundColor Yellow
    Write-Host "💡 Téléchargez Maven: https://maven.apache.org/download.cgi" -ForegroundColor Cyan
    exit 1
}