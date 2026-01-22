@echo off
echo Initialisation de l'utilisateur admin...
echo.
echo Username: admin
echo Password: Admin@123
echo.
curl -X POST "http://localhost:8080/api/auth/init-admin?username=admin&password=Admin@123"
echo.
echo.
echo Si vous voyez "Admin cree avec succes !", l'admin est cree.
echo.
pause
