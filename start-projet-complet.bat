@echo off
echo ========================================
echo   DEMARRAGE SYSTEME BANCAIRE "EGA"
echo ========================================
echo.

echo [1/3] Verification des prerequis...
where java >nul 2>nul
if %errorlevel% neq 0 (
    echo ERREUR: Java n'est pas installe ou pas dans le PATH
    pause
    exit /b 1
)

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERREUR: Node.js n'est pas installe ou pas dans le PATH
    pause
    exit /b 1
)

echo ✓ Java detecte
echo ✓ Node.js detecte
echo.

echo [2/3] Demarrage du backend Spring Boot...
echo URL Backend: http://localhost:8080
start "Backend Spring Boot" cmd /k "mvnw.cmd spring-boot:run"

echo Attente du demarrage du backend (15 secondes)...
timeout /t 15 /nobreak >nul

echo.
echo [3/3] Demarrage du frontend Angular...
echo URL Frontend: http://localhost:4200
cd bank-frontend-angular
start "Frontend Angular" cmd /k "ng serve --open"

echo.
echo ========================================
echo   SYSTEME BANCAIRE "EGA" DEMARRE !
echo ========================================
echo.
echo Backend:  http://localhost:8080
echo Frontend: http://localhost:4200
echo.
echo Comptes de test:
echo - Admin: admin / admin123  
echo - Client: user / user123
echo.
echo Appuyez sur une touche pour fermer cette fenetre...
pause >nul