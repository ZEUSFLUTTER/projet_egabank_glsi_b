@echo off
echo ========================================
echo   Configuration PATH Node.js
echo ========================================
echo.

REM Ajouter Node.js au PATH de maniere permanente
echo Ajout de Node.js au PATH systeme...

REM Ajouter au PATH utilisateur (plus sur)
setx PATH "%PATH%;C:\Program Files\nodejs" /M

echo.
echo PATH mis a jour avec succes !
echo Redemarrez votre invite de commandes pour que les changements prennent effet.
echo.

pause