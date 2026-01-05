@echo off
if "%1"=="run" (
    echo Demarrage de EGA Bank...
    mvnw.cmd spring-boot:run
) else if "%1"=="clean" (
    echo Nettoyage du projet...
    mvnw.cmd clean
) else if "%1"=="test" (
    echo Execution des tests...
    mvnw.cmd test
) else if "%1"=="build" (
    echo Compilation du projet...
    mvnw.cmd clean package
) else (
    echo Commandes disponibles:
    echo   ega run    - Demarre l'application
    echo   ega build  - Compile le projet
    echo   ega test   - Execute les tests
    echo   ega clean  - Nettoie le projet
)
