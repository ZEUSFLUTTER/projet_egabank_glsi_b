# Test de connectivité MySQL pour EGA BANK
Write-Host "🗄️ TEST DE CONNECTIVITÉ MYSQL" -ForegroundColor Cyan
Write-Host "===============================" -ForegroundColor Cyan

# Configuration MySQL d'après application.properties
$mysqlHost = "localhost"
$mysqlPort = 3306
$mysqlDatabase = "ega_bank"
$mysqlUser = "root"
$mysqlPassword = ""

Write-Host "`n📋 CONFIGURATION DÉTECTÉE:" -ForegroundColor Yellow
Write-Host "   Host: $mysqlHost" -ForegroundColor White
Write-Host "   Port: $mysqlPort" -ForegroundColor White
Write-Host "   Database: $mysqlDatabase" -ForegroundColor White
Write-Host "   User: $mysqlUser" -ForegroundColor White
Write-Host "   Password: $(if($mysqlPassword){'[CONFIGURÉ]'}else{'[VIDE]'})" -ForegroundColor Gray

Write-Host "`n🔍 TESTS DE CONNECTIVITÉ:" -ForegroundColor Yellow
Write-Host "----------------------------"

# Test 1: Vérifier si le port MySQL est ouvert
Write-Host "🔌 Test 1: Port MySQL ($mysqlPort)..."
try {
    $connection = Test-NetConnection -ComputerName $mysqlHost -Port $mysqlPort -WarningAction SilentlyContinue
    if ($connection.TcpTestSucceeded) {
        Write-Host "✅ Port $mysqlPort accessible" -ForegroundColor Green
        $portOk = $true
    } else {
        Write-Host "❌ Port $mysqlPort non accessible" -ForegroundColor Red
        $portOk = $false
    }
} catch {
    Write-Host "❌ Erreur test port: $($_.Exception.Message)" -ForegroundColor Red
    $portOk = $false
}

# Test 2: Vérifier si MySQL est installé
Write-Host "`n🛠️ Test 2: Installation MySQL..."
$mysqlInstalled = $false

# Test avec mysql command line
try {
    $mysqlVersion = & mysql --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ MySQL CLI installé: $mysqlVersion" -ForegroundColor Green
        $mysqlInstalled = $true
    }
} catch {
    Write-Host "❌ MySQL CLI non installé" -ForegroundColor Red
    $mysqlInstalled = $false
}

# Test alternatif avec mysqladmin
if (-not $mysqlInstalled) {
    try {
        $mysqladminVersion = & mysqladmin --version 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ MySQL Admin installé: $mysqladminVersion" -ForegroundColor Green
            $mysqlInstalled = $true
        }
    } catch {
        # Ignore
    }
}

# Test 3: Connexion à MySQL si installé
if ($mysqlInstalled -and $portOk) {
    Write-Host "`n🔗 Test 3: Connexion MySQL..."
    try {
        if ($mysqlPassword) {
            $testResult = & mysql -h $mysqlHost -P $mysqlPort -u $mysqlUser -p$mysqlPassword -e "SELECT 1;" 2>$null
        } else {
            $testResult = & mysql -h $mysqlHost -P $mysqlPort -u $mysqlUser -e "SELECT 1;" 2>$null
        }
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Connexion MySQL réussie" -ForegroundColor Green
            $connectionOk = $true
        } else {
            Write-Host "❌ Échec connexion MySQL" -ForegroundColor Red
            $connectionOk = $false
        }
    } catch {
        Write-Host "❌ Erreur connexion: $($_.Exception.Message)" -ForegroundColor Red
        $connectionOk = $false
    }
} else {
    $connectionOk = $false
}

# Test 4: Vérifier/Créer la base de données ega_bank
if ($connectionOk) {
    Write-Host "`n📊 Test 4: Base de données 'ega_bank'..."
    try {
        if ($mysqlPassword) {
            $dbExists = & mysql -h $mysqlHost -P $mysqlPort -u $mysqlUser -p$mysqlPassword -e "SHOW DATABASES LIKE 'ega_bank';" 2>$null
        } else {
            $dbExists = & mysql -h $mysqlHost -P $mysqlPort -u $mysqlUser -e "SHOW DATABASES LIKE 'ega_bank';" 2>$null
        }
        
        if ($dbExists -match "ega_bank") {
            Write-Host "✅ Base 'ega_bank' existe" -ForegroundColor Green
        } else {
            Write-Host "⚠️ Base 'ega_bank' n'existe pas, création..." -ForegroundColor Yellow
            if ($mysqlPassword) {
                & mysql -h $mysqlHost -P $mysqlPort -u $mysqlUser -p$mysqlPassword -e "CREATE DATABASE IF NOT EXISTS ega_bank;" 2>$null
            } else {
                & mysql -h $mysqlHost -P $mysqlPort -u $mysqlUser -e "CREATE DATABASE IF NOT EXISTS ega_bank;" 2>$null
            }
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ Base 'ega_bank' créée avec succès" -ForegroundColor Green
            } else {
                Write-Host "❌ Échec création base 'ega_bank'" -ForegroundColor Red
            }
        }
    } catch {
        Write-Host "❌ Erreur accès base: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 5: Vérifier les tables (après démarrage Spring Boot)
if ($connectionOk) {
    Write-Host "`n📋 Test 5: Tables EGA BANK..."
    try {
        if ($mysqlPassword) {
            $tables = & mysql -h $mysqlHost -P $mysqlPort -u $mysqlUser -p$mysqlPassword -D $mysqlDatabase -e "SHOW TABLES;" 2>$null
        } else {
            $tables = & mysql -h $mysqlHost -P $mysqlPort -u $mysqlUser -D $mysqlDatabase -e "SHOW TABLES;" 2>$null
        }
        
        if ($LASTEXITCODE -eq 0 -and $tables) {
            Write-Host "✅ Tables trouvées:" -ForegroundColor Green
            $tables -split "`n" | Where-Object { $_ -and $_ -notmatch "Tables_in_" } | ForEach-Object {
                Write-Host "   - $_" -ForegroundColor Gray
            }
        } else {
            Write-Host "⚠️ Aucune table trouvée (normal avant premier démarrage Spring Boot)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "❌ Erreur lecture tables: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n📊 RÉSUMÉ DES TESTS:" -ForegroundColor Yellow
Write-Host "--------------------"
Write-Host "Port MySQL ($mysqlPort): $(if($portOk){'✅ OK'}else{'❌ KO'})" -ForegroundColor $(if($portOk){'Green'}else{'Red'})
Write-Host "MySQL installé: $(if($mysqlInstalled){'✅ OK'}else{'❌ KO'})" -ForegroundColor $(if($mysqlInstalled){'Green'}else{'Red'})
Write-Host "Connexion MySQL: $(if($connectionOk){'✅ OK'}else{'❌ KO'})" -ForegroundColor $(if($connectionOk){'Green'}else{'Red'})

Write-Host "`n🎯 DIAGNOSTIC:" -ForegroundColor Cyan
if ($portOk -and $mysqlInstalled -and $connectionOk) {
    Write-Host "✅ MySQL fonctionne correctement !" -ForegroundColor Green
    Write-Host "   Votre application Spring Boot peut se connecter à MySQL" -ForegroundColor Green
} elseif (-not $portOk) {
    Write-Host "❌ MySQL n'est pas démarré ou pas installé" -ForegroundColor Red
    Write-Host "   Solutions:" -ForegroundColor Yellow
    Write-Host "   1. Installer MySQL: https://dev.mysql.com/downloads/mysql/" -ForegroundColor Gray
    Write-Host "   2. Démarrer MySQL: net start MySQL80 (Windows)" -ForegroundColor Gray
    Write-Host "   3. Ou utiliser XAMPP/WAMP pour MySQL" -ForegroundColor Gray
} elseif (-not $mysqlInstalled) {
    Write-Host "❌ MySQL CLI non installé" -ForegroundColor Red
    Write-Host "   Solutions:" -ForegroundColor Yellow
    Write-Host "   1. Installer MySQL complet avec CLI" -ForegroundColor Gray
    Write-Host "   2. Ou utiliser MySQL Workbench (interface graphique)" -ForegroundColor Gray
} else {
    Write-Host "❌ Problème de connexion MySQL" -ForegroundColor Red
    Write-Host "   Vérifiez les identifiants dans application.properties" -ForegroundColor Yellow
}

Write-Host "`n🔧 CONFIGURATION SPRING BOOT:" -ForegroundColor Cyan
Write-Host "   spring.datasource.url=jdbc:mysql://localhost:3306/ega_bank" -ForegroundColor Gray
Write-Host "   spring.datasource.username=root" -ForegroundColor Gray
Write-Host "   spring.datasource.password=[VIDE]" -ForegroundColor Gray

Write-Host "`n🚀 PROCHAINES ÉTAPES:" -ForegroundColor Cyan
Write-Host "   1. Assurez-vous que MySQL est démarré" -ForegroundColor Gray
Write-Host "   2. Modifiez le mot de passe dans application.properties si nécessaire" -ForegroundColor Gray
Write-Host "   3. Démarrez Spring Boot: ./mvnw spring-boot:run" -ForegroundColor Gray
Write-Host "   4. Les tables seront créées automatiquement (ddl-auto=update)" -ForegroundColor Gray

Write-Host "`n===============================" -ForegroundColor Cyan