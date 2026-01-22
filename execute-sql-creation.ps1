# Script d'exécution du SQL de création de la base EGA BANK
Write-Host "🗄️ EXÉCUTION CRÉATION BASE EGA BANK" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan

$sqlFile = "CREATE_DATABASE_EGA_BANK.sql"
$mysqlHost = "localhost"
$mysqlPort = 3306
$mysqlUser = "root"
$mysqlPassword = ""
$mysqlPath = "C:\xampp\mysql\bin\mysql.exe"

Write-Host "`n📋 CONFIGURATION:" -ForegroundColor Yellow
Write-Host "   Fichier SQL: $sqlFile" -ForegroundColor White
Write-Host "   Host: $mysqlHost" -ForegroundColor White
Write-Host "   Port: $mysqlPort" -ForegroundColor White
Write-Host "   User: $mysqlUser" -ForegroundColor White

# Vérifier que le fichier SQL existe
if (-not (Test-Path $sqlFile)) {
    Write-Host "❌ Fichier SQL non trouvé: $sqlFile" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Fichier SQL trouvé" -ForegroundColor Green

# Test de connexion MySQL
Write-Host "`n🔌 Test de connexion MySQL..." -ForegroundColor Yellow
try {
    if ($mysqlPassword) {
        $testConnection = & $mysqlPath -h $mysqlHost -P $mysqlPort -u $mysqlUser -p$mysqlPassword -e "SELECT 1;" 2>$null
    } else {
        $testConnection = & $mysqlPath -h $mysqlHost -P $mysqlPort -u $mysqlUser -e "SELECT 1;" 2>$null
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Connexion MySQL réussie" -ForegroundColor Green
    } else {
        Write-Host "❌ Échec connexion MySQL" -ForegroundColor Red
        Write-Host "   Vérifiez que MySQL est démarré et les identifiants corrects" -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "❌ Erreur connexion MySQL: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Exécution du script SQL
Write-Host "`n🚀 Exécution du script SQL..." -ForegroundColor Yellow
Write-Host "   Cela peut prendre quelques secondes..." -ForegroundColor Gray

try {
    if ($mysqlPassword) {
        $result = Get-Content $sqlFile | & $mysqlPath -h $mysqlHost -P $mysqlPort -u $mysqlUser -p$mysqlPassword 2>&1
    } else {
        $result = Get-Content $sqlFile | & $mysqlPath -h $mysqlHost -P $mysqlPort -u $mysqlUser 2>&1
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Script SQL exécuté avec succès!" -ForegroundColor Green
        
        # Afficher le résultat s'il y en a un
        if ($result) {
            Write-Host "`n📊 Résultat:" -ForegroundColor White
            $result | ForEach-Object { Write-Host "   $_" -ForegroundColor Gray }
        }
    } else {
        Write-Host "❌ Erreur lors de l'exécution du script SQL" -ForegroundColor Red
        if ($result) {
            Write-Host "`n❌ Détails de l'erreur:" -ForegroundColor Red
            $result | ForEach-Object { Write-Host "   $_" -ForegroundColor Red }
        }
        exit 1
    }
} catch {
    Write-Host "❌ Exception lors de l'exécution: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Vérification de la création
Write-Host "`n🔍 Vérification de la base créée..." -ForegroundColor Yellow

try {
    if ($mysqlPassword) {
        $databases = & $mysqlPath -h $mysqlHost -P $mysqlPort -u $mysqlUser -p$mysqlPassword -e "SHOW DATABASES;" 2>$null
        $tables = & $mysqlPath -h $mysqlHost -P $mysqlPort -u $mysqlUser -p$mysqlPassword -D ega_bank -e "SHOW TABLES;" 2>$null
    } else {
        $databases = & $mysqlPath -h $mysqlHost -P $mysqlPort -u $mysqlUser -e "SHOW DATABASES;" 2>$null
        $tables = & $mysqlPath -h $mysqlHost -P $mysqlPort -u $mysqlUser -D ega_bank -e "SHOW TABLES;" 2>$null
    }
    
    if ($databases -match "ega_bank") {
        Write-Host "✅ Base de données 'ega_bank' créée" -ForegroundColor Green
        
        if ($tables) {
            Write-Host "`n📋 Tables créées:" -ForegroundColor Green
            $tables -split "`n" | Where-Object { $_ -and $_ -notmatch "Tables_in_" } | ForEach-Object {
                Write-Host "   ✅ $_" -ForegroundColor Green
            }
        }
    } else {
        Write-Host "❌ Base de données 'ega_bank' non trouvée" -ForegroundColor Red
    }
} catch {
    Write-Host "⚠️ Impossible de vérifier la création: $($_.Exception.Message)" -ForegroundColor Yellow
}

# Vérification des données de test
Write-Host "`n📊 Vérification des données de test..." -ForegroundColor Yellow

try {
    if ($mysqlPassword) {
        $clientCount = & $mysqlPath -h $mysqlHost -P $mysqlPort -u $mysqlUser -p$mysqlPassword -D ega_bank -e "SELECT COUNT(*) FROM clients;" 2>$null
        $userCount = & $mysqlPath -h $mysqlHost -P $mysqlPort -u $mysqlUser -p$mysqlPassword -D ega_bank -e "SELECT COUNT(*) FROM users;" 2>$null
        $compteCount = & $mysqlPath -h $mysqlHost -P $mysqlPort -u $mysqlUser -p$mysqlPassword -D ega_bank -e "SELECT COUNT(*) FROM comptes;" 2>$null
        $transactionCount = & $mysqlPath -h $mysqlHost -P $mysqlPort -u $mysqlUser -p$mysqlPassword -D ega_bank -e "SELECT COUNT(*) FROM transactions;" 2>$null
    } else {
        $clientCount = & $mysqlPath -h $mysqlHost -P $mysqlPort -u $mysqlUser -D ega_bank -e "SELECT COUNT(*) FROM clients;" 2>$null
        $userCount = & $mysqlPath -h $mysqlHost -P $mysqlPort -u $mysqlUser -D ega_bank -e "SELECT COUNT(*) FROM users;" 2>$null
        $compteCount = & $mysqlPath -h $mysqlHost -P $mysqlPort -u $mysqlUser -D ega_bank -e "SELECT COUNT(*) FROM comptes;" 2>$null
        $transactionCount = & $mysqlPath -h $mysqlHost -P $mysqlPort -u $mysqlUser -D ega_bank -e "SELECT COUNT(*) FROM transactions;" 2>$null
    }
    
    Write-Host "   👥 Clients: $(($clientCount -split "`n")[-1])" -ForegroundColor White
    Write-Host "   🔐 Utilisateurs: $(($userCount -split "`n")[-1])" -ForegroundColor White
    Write-Host "   🏦 Comptes: $(($compteCount -split "`n")[-1])" -ForegroundColor White
    Write-Host "   💳 Transactions: $(($transactionCount -split "`n")[-1])" -ForegroundColor White
    
} catch {
    Write-Host "⚠️ Impossible de vérifier les données: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host "`n🎉 CRÉATION TERMINÉE AVEC SUCCÈS!" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Cyan

Write-Host "`n📋 RÉSUMÉ DE CE QUI A ÉTÉ CRÉÉ:" -ForegroundColor Yellow
Write-Host "✅ Base de données: ega_bank" -ForegroundColor Green
Write-Host "✅ Tables principales:" -ForegroundColor Green
Write-Host "   - clients (informations clients)" -ForegroundColor Gray
Write-Host "   - users (authentification)" -ForegroundColor Gray
Write-Host "   - comptes (comptes bancaires)" -ForegroundColor Gray
Write-Host "   - transactions (historique)" -ForegroundColor Gray
Write-Host "✅ Vues utiles pour reporting" -ForegroundColor Green
Write-Host "✅ Procédures stockées (dépôt, retrait, virement)" -ForegroundColor Green
Write-Host "✅ Fonctions utiles (génération numéros de compte)" -ForegroundColor Green
Write-Host "✅ Triggers (audit, auto-génération)" -ForegroundColor Green
Write-Host "✅ Données de test (admin + 3 clients)" -ForegroundColor Green

Write-Host "`n🚀 PROCHAINES ÉTAPES:" -ForegroundColor Cyan
Write-Host "1. Démarrer Spring Boot: ./mvnw spring-boot:run" -ForegroundColor Gray
Write-Host "2. Tester avec Postman (collection EGA-BANK-COMPLETE)" -ForegroundColor Gray
Write-Host "3. Connexion admin: username=admin, password=password" -ForegroundColor Gray
Write-Host "4. Connexion client: username=jean.dupont, password=password" -ForegroundColor Gray

Write-Host "`n====================================" -ForegroundColor Cyan