@echo off
echo ========================================
echo Test Rapide - Creation Client Backend
echo ========================================
echo.

echo 1. Test de connexion au backend...
curl -s -o nul -w "Status: %%{http_code}\n" http://localhost:8080/api/clients
echo.

echo 2. Liste des clients existants...
curl -s http://localhost:8080/api/clients
echo.
echo.

echo 3. Creation d'un client de test...
curl -X POST http://localhost:8080/api/clients ^
  -H "Content-Type: application/json" ^
  -d "{\"nom\":\"Diop\",\"prenom\":\"Amadou\",\"dateNaissance\":\"1990-05-15\",\"sexe\":\"M\",\"adresse\":\"123 Rue de la Paix, Dakar\",\"numeroTelephone\":\"+221771234567\",\"courriel\":\"amadou.diop@test.com\",\"nationalite\":\"Senegalaise\"}"
echo.
echo.

echo 4. Verification - Liste des clients apres creation...
curl -s http://localhost:8080/api/clients
echo.
echo.

echo ========================================
echo Test termine !
echo ========================================
pause