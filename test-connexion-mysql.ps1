# Script de test de connexion MySQL pour EGA BANK
Write-Host "🔌 TEST CONNEXION MYSQL - EGA BANK" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan

$mysqlPath = "C:\xampp\mysql\bin\mysql.exe"
$mysqlHost = "localhost"
$mysqlPort = 3306
$mysqlUser = "root"
$mysqlPassword = ""
$database = "ega_bank"

Write-Host "`n📋 INFORMATIONS DE CONNEXION:" -ForegroundColor Yellow
Write-Host "   Host: $mysqlHost" -ForegroundColor White
Write-Host "   Port: $mysqlPort" -ForegroundColor White
Write-Host "   User: $mysqlUser" -ForegroundColor White
Write-Host "   Database: $database" -ForegroundColor White

# Test de connexion de base
Write-Host "`n🔌 Test de connexion MySQL..." -ForegroundColor Yellow
try {
    $testResult = & $mysqlPath -h $mysqlHost -P $mysqlPort -u $mysqlUser -e "SELECT 'Connexion réussie!' as message;" 2>$null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Connexion MySQL réussie" -ForegroundColor Green
    } else {
        Write-Host "❌ Échec connexion MySQL" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Erreur: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test de connexion à la base ega_bank
Write-Host "`n🗄️ Test connexion base ega_bank..." -ForegroundColor Yellow
try {
    $dbTest = & $mysqlPath -h $mysqlHost -P $mysqlPort -u $mysqlUser -D $database -e "SELECT 'Base EGA BANK accessible!' as message;" 2>$null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Base de données ega_bank accessible" -ForegroundColor Green
    } else {
        Write-Host "❌ Base ega_bank non accessible" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Erreur accès base: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Afficher les tables
Write-Host "`n📋 Tables disponibles:" -ForegroundColor Yellow
try {
    $tables = & $mysqlPath -h $mysqlHost -P $mysqlPort -u $mysqlUser -D $database -e "SHOW TABLES;" 2>$null
    
    if ($LASTEXITCODE -eq 0) {
        $tables -split "`n" | Where-Object { $_ -and $_ -notmatch "Tables_in_" } | ForEach-Object {
            Write-Host "   ✅ $_" -ForegroundColor Green
        }
    }
} catch {
    Write-Host "⚠️ Impossible de lister les tables" -ForegroundColor Yellow
}

# Test des données
Write-Host "`n📊 Vérification des données:" -ForegroundColor Yellow
try {
    $clientCount = & $mysqlPath -h $mysqlHost -P $mysqlPort -u $mysqlUser -D $database -e "SELECT COUNT(*) FROM clients;" 2>$null
    $userCount = & $mysqlPath -h $mysqlHost -P $mysqlPort -u $mysqlUser -D $database -e "SELECT COUNT(*) FROM users;" 2>$null
    $compteCount = & $mysqlPath -h $mysqlHost -P $mysqlPort -u $mysqlUser -D $database -e "SELECT COUNT(*) FROM comptes;" 2>$null
    $transactionCount = & $mysqlPath -h $mysqlHost -P $mysqlPort -u $mysqlUser -D $database -e "SELECT COUNT(*) FROM transactions;" 2>$null
    
    Write-Host "   👥 Clients: $(($clientCount -split "`n")[-1])" -ForegroundColor White
    Write-Host "   🔐 Utilisateurs: $(($userCount -split "`n")[-1])" -ForegroundColor White
    Write-Host "   🏦 Comptes: $(($compteCount -split "`n")[-1])" -ForegroundColor White
    Write-Host "   💳 Transactions: $(($transactionCount -split "`n")[-1])" -ForegroundColor White
    
} catch {
    Write-Host "⚠️ Impossible de vérifier les données" -ForegroundColor Yellow
}

# Test de l'admin
Write-Host "`n👤 Test compte administrateur:" -ForegroundColor Yellow
try {
    $adminTest = & $mysqlPath -h $mysqlHost -P $mysqlPort -u $mysqlUser -D $database -e "SELECT username, role FROM users WHERE username='admin';" 2>$null
    
    if ($adminTest -match "admin") {
        Write-Host "   ✅ Compte admin trouvé" -ForegroundColor Green
        Write-Host "   📝 Username: admin" -ForegroundColor Gray
        Write-Host "   🔑 Password: password" -ForegroundColor Gray
    } else {
        Write-Host "   ❌ Compte admin non trouvé" -ForegroundColor Red
    }
} catch {
    Write-Host "⚠️ Impossible de vérifier l'admin" -ForegroundColor Yellow
}

Write-Host "`n🎉 TEST DE CONNEXION TERMINÉ" -ForegroundColor Green
Write-Host "===================================" -ForegroundColor Cyan

Write-Host "`n📋 COMMANDES DE CONNEXION DIRECTE:" -ForegroundColor Yellow
Write-Host "1. Via ligne de commande:" -ForegroundColor White
Write-Host "   mysql -h localhost -P 3306 -u root -p" -ForegroundColor Gray
Write-Host "`n2. Via XAMPP:" -ForegroundColor White
Write-Host "   C:\xampp\mysql\bin\mysql.exe -h localhost -P 3306 -u root -p" -ForegroundColor Gray
Write-Host "`n3. Puis exécuter:" -ForegroundColor White
Write-Host "   USE ega_bank;" -ForegroundColor Gray
Write-Host "   SOURCE CONNEXION_MYSQL_EGA_BANK.sql;" -ForegroundColor Gray

Write-Host "`n🚀 POUR SPRING BOOT:" -ForegroundColor Cyan
Write-Host "   URL: jdbc:mysql://localhost:3306/ega_bank" -ForegroundColor Gray
Write-Host "   Username: root" -ForegroundColor Gray
Write-Host "   Password: (vide)" -ForegroundColor Gray