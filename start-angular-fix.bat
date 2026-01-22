@echo off
echo ========================================
echo   Demarrage Frontend Angular - EGA Bank
echo ========================================
echo.

REM Ajouter Node.js au PATH pour cette session
set PATH=C:\Program Files\nodejs;%PATH%

REM Aller dans le repertoire Angular
cd /d "%~dp0bank-frontend-angular"

echo Configuration du PATH Node.js...
echo PATH mis a jour: %PATH%
echo.

echo Verification de Node.js...
node --version
echo.

echo Verification de npm...
npm --version
echo.

echo Demarrage du serveur Angular...
echo Cela peut prendre 1-2 minutes...
echo.

REM Desactiver les analytics Angular automatiquement
echo n | npm start

pause