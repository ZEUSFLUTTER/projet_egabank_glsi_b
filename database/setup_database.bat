@echo off
echo ========================================
echo Configuration de la base de donnees EGA
echo ========================================
echo.

echo Verification de MySQL...
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo MySQL n'est pas dans le PATH. Utilisation du chemin XAMPP...
    set MYSQL_PATH=C:\xampp\mysql\bin\mysql.exe
) else (
    set MYSQL_PATH=mysql
)

echo Connexion a MySQL et execution du script...
echo.
echo IMPORTANT: 
echo 1. Assurez-vous que XAMPP MySQL est demarre
echo 2. Le mot de passe par defaut est vide (appuyez juste sur Entree)
echo.

%MYSQL_PATH% -u root -p < create_bank_db.sql

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo Base de donnees creee avec succes !
    echo ========================================
    echo.
    echo Vous pouvez maintenant:
    echo 1. Redemarrer votre application Spring Boot
    echo 2. Acceder a phpMyAdmin: http://localhost/phpmyadmin
    echo 3. Tester l'API avec les comptes:
    echo    - admin / admin123
    echo    - user / user123
    echo.
) else (
    echo.
    echo ========================================
    echo ERREUR lors de la creation de la base !
    echo ========================================
    echo.
    echo Verifiez que:
    echo 1. XAMPP MySQL est demarre
    echo 2. Le mot de passe root est correct
    echo.
)

pause