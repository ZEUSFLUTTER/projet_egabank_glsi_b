@echo off
echo 🔧 Configuration JAVA_HOME...

REM Détecter Java automatiquement
for /f "tokens=*" %%i in ('where java 2^>nul') do set JAVA_EXE=%%i
if "%JAVA_EXE%"=="" (
    echo ❌ Java non trouvé dans le PATH!
    echo Veuillez installer Java ou l'ajouter au PATH
    pause
    exit /b 1
)

REM Extraire JAVA_HOME du chemin de java.exe
for %%i in ("%JAVA_EXE%") do set JAVA_DIR=%%~dpi
for %%i in ("%JAVA_DIR%..") do set JAVA_HOME=%%~fi

echo ☕ Java détecté: %JAVA_EXE%
echo 🏠 JAVA_HOME configuré: %JAVA_HOME%
echo ✅ Configuration réussie!
echo.

echo 🚀 Démarrage du Backend Spring Boot...
echo 📍 Répertoire: %CD%
echo 🌐 URL: http://localhost:8080
echo.

REM Démarrer le backend
mvnw.cmd spring-boot:run

if errorlevel 1 (
    echo.
    echo ❌ Erreur lors du démarrage!
    echo 💡 Solutions possibles:
    echo 1. Vérifier que MySQL est démarré
    echo 2. Vérifier que le port 8080 est libre
    echo 3. Exécuter: netstat -ano ^| findstr :8080
    echo.
    pause
)