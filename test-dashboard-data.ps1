#!/usr/bin/env pwsh

Write-Host "🔍 Test des données du dashboard..." -ForegroundColor Cyan

# Test de connexion au backend
Write-Host "`n1. Test de connexion au backend..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/actuator/health" -Method GET -ErrorAction Stop
    Write-Host "✅ Backend accessible: $($response.status)" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend non accessible: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "💡 Assurez-vous que le backend est démarré sur le port 8080" -ForegroundColor Yellow
    exit 1
}

# Test avec un token d'admin (si disponible)
Write-Host "`n2. Test des endpoints avec authentification..." -ForegroundColor Yellow

# Essayer de se connecter en tant qu'admin
$loginData = @{
    username = "admin"
    password = "admin123"
} | ConvertTo-Json

try {
    Write-Host "🔐 Tentative de connexion admin..." -ForegroundColor Cyan
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -Body $loginData -ContentType "application/json" -ErrorAction Stop
    $token = $loginResponse.token
    Write-Host "✅ Connexion admin réussie" -ForegroundColor Green
    
    # Headers avec token
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    # Test des clients
    Write-Host "`n3. Test des clients..." -ForegroundColor Yellow
    try {
        $clients = Invoke-RestMethod -Uri "http://localhost:8080/api/clients" -Method GET -Headers $headers -ErrorAction Stop
        Write-Host "✅ Clients trouvés: $($clients.Count)" -ForegroundColor Green
        if ($clients.Count -gt 0) {
            Write-Host "   Premier client: $($clients[0].nom) $($clients[0].prenom)" -ForegroundColor Gray
        }
    } catch {
        Write-Host "❌ Erreur clients: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    # Test des comptes
    Write-Host "`n4. Test des comptes..." -ForegroundColor Yellow
    try {
        $comptes = Invoke-RestMethod -Uri "http://localhost:8080/api/comptes" -Method GET -Headers $headers -ErrorAction Stop
        Write-Host "✅ Comptes trouvés: $($comptes.Count)" -ForegroundColor Green
        $soldeTotal = 0
        foreach ($compte in $comptes) {
            $soldeTotal += $compte.solde
            Write-Host "   Compte $($compte.numeroCompte): $($compte.solde)€" -ForegroundColor Gray
        }
        Write-Host "   Solde total: $soldeTotal€" -ForegroundColor Green
    } catch {
        Write-Host "❌ Erreur comptes: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    # Test des transactions (pour le premier compte)
    if ($comptes -and $comptes.Count -gt 0) {
        Write-Host "`n5. Test des transactions..." -ForegroundColor Yellow
        try {
            $premierCompte = $comptes[0].numeroCompte
            $transactions = Invoke-RestMethod -Uri "http://localhost:8080/api/transactions/compte/$premierCompte" -Method GET -Headers $headers -ErrorAction Stop
            Write-Host "✅ Transactions trouvées pour le compte $premierCompte : $($transactions.Count)" -ForegroundColor Green
            if ($transactions.Count -gt 0) {
                Write-Host "   Dernière transaction: $($transactions[0].typeTransaction) - $($transactions[0].montant)€" -ForegroundColor Gray
            }
        } catch {
            Write-Host "❌ Erreur transactions: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    
} catch {
    Write-Host "❌ Erreur de connexion admin: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "💡 Vérifiez que l'admin existe avec les identifiants admin/admin123" -ForegroundColor Yellow
}

Write-Host "`n🏁 Test terminé" -ForegroundColor Cyan