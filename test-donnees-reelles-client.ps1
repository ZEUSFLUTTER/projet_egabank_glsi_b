#!/usr/bin/env pwsh

Write-Host "🧪 TEST DONNÉES RÉELLES CLIENT" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan

Write-Host ""
Write-Host "📋 Ce script teste le chargement des vraies données client" -ForegroundColor Yellow

# Fonction pour tester une URL
function Test-Url {
    param($url, $description)
    try {
        $response = Invoke-WebRequest -Uri $url -Method GET -TimeoutSec 3
        Write-Host "✅ $description - Status: $($response.StatusCode)" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "❌ $description - Erreur: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

Write-Host ""
Write-Host "🔧 Vérification des services..." -ForegroundColor Green

# Test du frontend
$frontendOk = Test-Url "http://localhost:4200" "Frontend Angular"

# Test du backend
$backendOk = Test-Url "http://localhost:8080/api/test/public" "Backend Spring Boot"

Write-Host ""
if ($backendOk) {
    Write-Host "🎯 SCÉNARIO: Test avec backend disponible" -ForegroundColor Green
    Write-Host ""
    Write-Host "1. 🔐 Test de connexion client:" -ForegroundColor Yellow
    Write-Host "   - URL: http://localhost:4200/login" -ForegroundColor White
    Write-Host "   - Identifiants: testclient / Test@123" -ForegroundColor White
    Write-Host "   - Attendu: Redirection automatique vers /profil" -ForegroundColor White
    
    Write-Host ""
    Write-Host "2. 📊 Vérification des données réelles:" -ForegroundColor Yellow
    Write-Host "   - Informations client réelles (nom, prénom, etc.)" -ForegroundColor White
    Write-Host "   - Comptes bancaires avec vrais soldes" -ForegroundColor White
    Write-Host "   - Transactions historiques réelles" -ForegroundColor White
    
    Write-Host ""
    Write-Host "3. 💰 Test des opérations bancaires:" -ForegroundColor Yellow
    Write-Host "   - Créer un nouveau compte" -ForegroundColor White
    Write-Host "   - Effectuer un dépôt (ex: 100€)" -ForegroundColor White
    Write-Host "   - Vérifier la mise à jour du solde" -ForegroundColor White
    Write-Host "   - Consulter l'historique mis à jour" -ForegroundColor White
    
    # Test de l'API d'authentification
    Write-Host ""
    Write-Host "🧪 Test rapide de l'API d'authentification..." -ForegroundColor Cyan
    try {
        $loginData = @{
            username = "testclient"
            password = "Test@123"
        } | ConvertTo-Json
        
        $headers = @{
            "Content-Type" = "application/json"
        }
        
        $response = Invoke-WebRequest -Uri "http://localhost:8080/api/auth/login" -Method POST -Body $loginData -Headers $headers -TimeoutSec 5
        
        if ($response.StatusCode -eq 200) {
            $authResponse = $response.Content | ConvertFrom-Json
            Write-Host "✅ Authentification réussie!" -ForegroundColor Green
            Write-Host "   - Utilisateur: $($authResponse.username)" -ForegroundColor White
            Write-Host "   - Rôle: $($authResponse.role)" -ForegroundColor White
            Write-Host "   - Client ID: $($authResponse.clientId)" -ForegroundColor White
            
            if ($authResponse.clientId) {
                Write-Host ""
                Write-Host "🔍 Test de récupération des données client..." -ForegroundColor Cyan
                try {
                    $clientHeaders = @{
                        "Authorization" = "Bearer $($authResponse.token)"
                    }
                    $clientResponse = Invoke-WebRequest -Uri "http://localhost:8080/api/clients/$($authResponse.clientId)" -Headers $clientHeaders -TimeoutSec 5
                    
                    if ($clientResponse.StatusCode -eq 200) {
                        $clientData = $clientResponse.Content | ConvertFrom-Json
                        Write-Host "✅ Données client récupérées!" -ForegroundColor Green
                        Write-Host "   - Nom: $($clientData.nom) $($clientData.prenom)" -ForegroundColor White
                        Write-Host "   - Email: $($clientData.courriel)" -ForegroundColor White
                    }
                } catch {
                    Write-Host "❌ Erreur récupération client: $($_.Exception.Message)" -ForegroundColor Red
                }
            }
        }
    } catch {
        Write-Host "❌ Erreur authentification: $($_.Exception.Message)" -ForegroundColor Red
    }
    
} else {
    Write-Host "🎯 SCÉNARIO: Test en mode démo (backend indisponible)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. 📊 Vérification du mode démo:" -ForegroundColor Yellow
    Write-Host "   - URL: http://localhost:4200/profil" -ForegroundColor White
    Write-Host "   - Attendu: Données de démonstration" -ForegroundColor White
    Write-Host "   - Client fictif: Sophie Martin" -ForegroundColor White
    
    Write-Host ""
    Write-Host "2. 🔄 Test du fallback automatique:" -ForegroundColor Yellow
    Write-Host "   - Interface se charge rapidement" -ForegroundColor White
    Write-Host "   - Pas de page blanche qui tourne" -ForegroundColor White
    Write-Host "   - Données cohérentes affichées" -ForegroundColor White
    
    Write-Host ""
    Write-Host "⚠️  Pour tester avec de vraies données:" -ForegroundColor Yellow
    Write-Host "   1. Configurer JAVA_HOME" -ForegroundColor White
    Write-Host "   2. Démarrer MongoDB" -ForegroundColor White
    Write-Host "   3. Exécuter: ./start-backend-mongodb.ps1" -ForegroundColor White
}

Write-Host ""
Write-Host "🌐 Ouverture de l'interface..." -ForegroundColor Green
if ($backendOk) {
    Start-Process "http://localhost:4200/login"
    Write-Host "👉 Connectez-vous avec: testclient / Test@123" -ForegroundColor Cyan
} else {
    Start-Process "http://localhost:4200/profil"
    Write-Host "👉 Interface en mode démonstration" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "✅ Test terminé!" -ForegroundColor Green
Write-Host "Vérifiez manuellement le comportement dans le navigateur." -ForegroundColor White