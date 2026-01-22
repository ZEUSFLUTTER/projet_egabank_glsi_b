@echo off
echo ========================================
echo   Demarrage Angular avec reponse auto
echo ========================================

REM Ajouter Node.js au PATH
set PATH=C:\Program Files\nodejs;%PATH%

REM Aller dans le repertoire Angular
cd bank-frontend-angular

echo Demarrage du serveur Angular...
echo Reponse automatique 'N' pour les analytics...

REM Repondre automatiquement 'N' aux analytics
echo N | npm start