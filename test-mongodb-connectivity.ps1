# Test de connectivité MongoDB pour EGA BANK
Write-Host "🗄️ TEST DE CONNECTIVITÉ MONGODB" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

# Configuration MongoDB d'après application.properties
$mongoHost = "localhost"
$mongoPort = 27017
$mongoDatabase = "ega_bank"
$mongoUri = "mongodb://${mongoHost}:${mongoPort}/${mongoDatabase}"

Write-Host "`n📋 CONFIGURATION DÉTECTÉE:" -ForegroundColor Yellow
Write-Host "   Host: $mongoHost" -ForegroundColor White
Write-Host "   Port: $mongoPort" -ForegroundColor White
Write-Host "   Database: $mongoDatabase" -ForegroundColor White
Write-Host "   URI: $mongoUri" -ForegroundColor Gray

Write-Host "`n🔍 TESTS DE CONNECTIVITÉ:" -ForegroundColor Yellow
Write-Host "----------------------------"

# Test 1: Vérifier si le port MongoDB est ouvert
Write-Host "🔌 Test 1: Port MongoDB ($mongoPort)..."
try {
    $connection = Test-NetConnection -ComputerName $mongoHost -Port $mongoPort -WarningAction SilentlyContinue
    if ($connection.TcpTestSucceeded) {
        Write-Host "✅ Port $mongoPort accessible" -ForegroundColor Green
        $portOk = $true
    } else {
        Write-Host "❌ Port $mongoPort non accessible" -ForegroundColor Red
        $portOk = $false
    }
} catch {
    Write-Host "❌ Erreur test port: $($_.Exception.Message)" -ForegroundColor Red
    $portOk = $false
}

# Test 2: Vérifier si MongoDB est installé (commande mongo/mongosh)
Write-Host "`n🛠️ Test 2: Installation MongoDB..."
$mongoInstalled = $false

# Test avec mongosh (version récente)
try {
    $mongoshVersion = & mongosh --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ mongosh installé: $mongoshVersion" -ForegroundColor Green
        $mongoInstalled = $true
        $mongoCommand = "mongosh"
    }
} catch {
    # Ignore l'erreur et teste mongo classique
}

# Test avec mongo (version classique) si mongosh pas trouvé
if (-not $mongoInstalled) {
    try {
        $mongoVersion = & mongo --version 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ mongo installé: $($mongoVersion[0])" -ForegroundColor Green
            $mongoInstalled = $true
            $mongoCommand = "mongo"
        }
    } catch {
        Write-Host "❌ MongoDB CLI non installé (ni mongo ni mongosh)" -ForegroundColor Red
        $mongoInstalled = $false
    }
}

# Test 3: Connexion à MongoDB si installé
if ($mongoInstalled -and $portOk) {
    Write-Host "`n🔗 Test 3: Connexion MongoDB..."
    try {
        if ($mongoCommand -eq "mongosh") {
            $testResult = & mongosh --quiet --eval "db.adminCommand('ping')" $mongoDatabase 2>$null
        } else {
            $testResult = & mongo --quiet --eval "db.adminCommand('ping')" $mongoDatabase 2>$null
        }
        
        if ($LASTEXITCODE -eq 0 -and $testResult -match "ok.*1") {
            Write-Host "✅ Connexion MongoDB réussie" -ForegroundColor Green
            $connectionOk = $true
        } else {
            Write-Host "❌ Échec connexion MongoDB" -ForegroundColor Red
            $connectionOk = $false
        }
    } catch {
        Write-Host "❌ Erreur connexion: $($_.Exception.Message)" -ForegroundColor Red
        $connectionOk = $false
    }
} else {
    $connectionOk = $false
}

# Test 4: Vérifier la base de données ega_bank
if ($connectionOk) {
    Write-Host "`n📊 Test 4: Base de données 'ega_bank'..."
    try {
        if ($mongoCommand -eq "mongosh") {
            $dbStats = & mongosh --quiet --eval "db.stats()" $mongoDatabase 2>$null
        } else {
            $dbStats = & mongo --quiet --eval "db.stats()" $mongoDatabase 2>$null
        }
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Base 'ega_bank' accessible" -ForegroundColor Green
            Write-Host "   Statistiques: $($dbStats | Select-String -Pattern 'db|collections|objects' | Select-Object -First 3)" -ForegroundColor Gray
        } else {
            Write-Host "❌ Base 'ega_bank' non accessible" -ForegroundColor Red
        }
    } catch {
        Write-Host "❌ Erreur accès base: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 5: Vérifier les collections Spring Boot
if ($connectionOk) {
    Write-Host "`n📋 Test 5: Collections EGA BANK..."
    try {
        if ($mongoCommand -eq "mongosh") {
            $collections = & mongosh --quiet --eval "db.getCollectionNames()" $mongoDatabase 2>$null
        } else {
            $collections = & mongo --quiet --eval "db.getCollectionNames()" $mongoDatabase 2>$null
        }
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Collections trouvées:" -ForegroundColor Green
            $collections -split ',' | ForEach-Object {
                $collection = $_.Trim(' "[]')
                if ($collection -and $collection -ne '') {
                    Write-Host "   - $collection" -ForegroundColor Gray
                }
            }
        } else {
            Write-Host "⚠️ Aucune collection trouvée (base vide)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "❌ Erreur lecture collections: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n📊 RÉSUMÉ DES TESTS:" -ForegroundColor Yellow
Write-Host "--------------------"
Write-Host "Port MongoDB ($mongoPort): $(if($portOk){'✅ OK'}else{'❌ KO'})" -ForegroundColor $(if($portOk){'Green'}else{'Red'})
Write-Host "MongoDB installé: $(if($mongoInstalled){'✅ OK'}else{'❌ KO'})" -ForegroundColor $(if($mongoInstalled){'Green'}else{'Red'})
Write-Host "Connexion MongoDB: $(if($connectionOk){'✅ OK'}else{'❌ KO'})" -ForegroundColor $(if($connectionOk){'Green'}else{'Red'})

Write-Host "`n🎯 DIAGNOSTIC:" -ForegroundColor Cyan
if ($portOk -and $mongoInstalled -and $connectionOk) {
    Write-Host "✅ MongoDB fonctionne correctement !" -ForegroundColor Green
    Write-Host "   Votre application Spring Boot peut se connecter à MongoDB" -ForegroundColor Green
} elseif (-not $portOk) {
    Write-Host "❌ MongoDB n'est pas démarré ou pas installé" -ForegroundColor Red
    Write-Host "   Solutions:" -ForegroundColor Yellow
    Write-Host "   1. Installer MongoDB: https://www.mongodb.com/try/download/community" -ForegroundColor Gray
    Write-Host "   2. Démarrer MongoDB: net start MongoDB (Windows)" -ForegroundColor Gray
    Write-Host "   3. Ou utiliser MongoDB Compass pour gérer MongoDB" -ForegroundColor Gray
} elseif (-not $mongoInstalled) {
    Write-Host "❌ MongoDB CLI non installé" -ForegroundColor Red
    Write-Host "   Solutions:" -ForegroundColor Yellow
    Write-Host "   1. Installer MongoDB Shell: https://www.mongodb.com/try/download/shell" -ForegroundColor Gray
    Write-Host "   2. Ou utiliser MongoDB Compass (interface graphique)" -ForegroundColor Gray
} else {
    Write-Host "❌ Problème de connexion MongoDB" -ForegroundColor Red
    Write-Host "   Vérifiez la configuration dans application.properties" -ForegroundColor Yellow
}

Write-Host "`n🔧 CONFIGURATION SPRING BOOT:" -ForegroundColor Cyan
Write-Host "   spring.data.mongodb.uri=$mongoUri" -ForegroundColor Gray
Write-Host "   spring.data.mongodb.database=$mongoDatabase" -ForegroundColor Gray

Write-Host "`n=================================" -ForegroundColor Cyan