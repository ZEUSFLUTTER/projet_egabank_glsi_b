#!/usr/bin/env pwsh

Write-Host "🚀 DÉMARRAGE JAVA DIRECT - MONGODB" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green

# Nettoyer
Get-Process -Name "java" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

Set-Location "Ega backend/Ega-backend"

# Vérifier si le JAR existe déjà
$jarPath = "target/Ega-backend-0.0.1-SNAPSHOT.jar"

if (Test-Path $jarPath) {
    Write-Host "✅ JAR trouvé: $jarPath" -ForegroundColor Green
    Write-Host "🚀 Démarrage direct avec Java..." -ForegroundColor Cyan
    Write-Host "🌐 http://localhost:8080" -ForegroundColor Yellow
    Write-Host "🗃️ MongoDB: localhost:27017/egabank" -ForegroundColor Yellow
    Write-Host "" -ForegroundColor White
    
    # Démarrer directement avec Java
    & java -jar $jarPath
} else {
    Write-Host "❌ JAR non trouvé: $jarPath" -ForegroundColor Red
    Write-Host "🔨 Tentative de compilation manuelle..." -ForegroundColor Yellow
    
    # Essayer de compiler manuellement
    if (Test-Path "pom.xml") {
        Write-Host "📦 Fichier pom.xml trouvé" -ForegroundColor Cyan
        
        # Essayer avec Maven système si disponible
        if (Get-Command "mvn" -ErrorAction SilentlyContinue) {
            Write-Host "🔧 Compilation avec Maven système..." -ForegroundColor Yellow
            
            # Définir JAVA_HOME manuellement
            $possibleJavaHomes = @(
                "${env:ProgramFiles}\Java\jdk-17",
                "${env:ProgramFiles}\Java\jdk-11",
                "${env:ProgramFiles}\Eclipse Adoptium\jdk-17.0.2.8-hotspot",
                "${env:ProgramFiles(x86)}\Java\jdk-17",
                "${env:ProgramFiles(x86)}\Java\jdk-11"
            )
            
            foreach ($javaHome in $possibleJavaHomes) {
                if (Test-Path "$javaHome\bin\java.exe") {
                    $env:JAVA_HOME = $javaHome
                    Write-Host "✅ JAVA_HOME défini: $javaHome" -ForegroundColor Green
                    break
                }
            }
            
            # Compiler
            & mvn clean package -DskipTests -q
            
            if ($LASTEXITCODE -eq 0 -and (Test-Path $jarPath)) {
                Write-Host "✅ Compilation réussie!" -ForegroundColor Green
                Write-Host "🚀 Démarrage..." -ForegroundColor Cyan
                & java -jar $jarPath
            } else {
                Write-Host "❌ Compilation échouée!" -ForegroundColor Red
            }
        } else {
            Write-Host "❌ Maven non disponible!" -ForegroundColor Red
            Write-Host "💡 Installez Maven ou utilisez l'IDE pour compiler" -ForegroundColor Yellow
        }
    } else {
        Write-Host "❌ pom.xml non trouvé!" -ForegroundColor Red
    }
}