@echo off
echo Creation de l'admin EgaBank...
echo.

curl -X POST "http://localhost:8080/api/auth/init-admin" ^
     -H "Content-Type: application/x-www-form-urlencoded" ^
     -d "username=admin&password=Admin@123"

echo.
echo.
echo Si la creation a reussi, vous pouvez vous connecter avec:
echo Username: admin
echo Password: Admin@123
echo.
pause