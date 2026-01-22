#!/usr/bin/env pwsh

Write-Host "🗃️ INITIALISATION DONNÉES MONGODB - EGA BANK" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

$baseUrl = "http://localhost:8080/api"

# Fonction pour faire des requêtes HTTP
function Invoke-ApiRequest {
    param(
        [string]$Url,
        [string]$Method = "GET",
        [hashtable]$Body = $null,
        [hashtable]$Headers = @{"Content-Type" = "application/json"}
    )
    
    try {
        $params = @{
            Uri = $Url
            Method = $Method
            Headers = $Headers
        }
        
        if ($Body) {
            $params.Body = ($Body | ConvertTo-Json -Depth 10)
        }
        
        $response = Invoke-RestMethod @params
        return $response
    } catch {
        Write-Host "❌ Erreur API: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

Write-Host "⏳ Attente du démarrage du backend..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Test de connexion
Write-Host "🔍 Test de connexion au backend..." -ForegroundColor Yellow
$healthCheck = Invoke-ApiRequest -Url "$baseUrl/auth/test" -Method "GET"

if (-not $healthCheck) {
    Write-Host "❌ Backend non accessible. Assurez-vous qu'il est démarré sur le port 8080" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Backend accessible!" -ForegroundColor Green

# 1. Créer un administrateur
Write-Host "👑 Création de l'administrateur..." -ForegroundColor Cyan
$adminData = @{
    username = "admin"
    password = "admin123"
    role = "ROLE_ADMIN"
}

$adminResponse = Invoke-ApiRequest -Url "$baseUrl/auth/create-admin" -Method "POST" -Body $adminData

if ($adminResponse) {
    Write-Host "✅ Administrateur créé avec succès!" -ForegroundColor Green
    Write-Host "   Username: admin" -ForegroundColor White
    Write-Host "   Password: admin123" -ForegroundColor White
} else {
    Write-Host "⚠️ Erreur lors de la création de l'administrateur (peut-être déjà existant)" -ForegroundColor Yellow
}

# 2. Créer des clients de test
Write-Host "👥 Création de clients de test..." -ForegroundColor Cyan

$clients = @(
    @{
        nom = "Dupont"
        prenom = "Jean"
        dateNaissance = "1985-05-15"
        sexe = "M"
        adresse = "123 Rue de la Paix, Paris"
        telephone = "0123456789"
        courriel = "jean.dupont@email.com"
        nationalite = "Française"
        username = "jean.dupont"
        password = "password123"
    },
    @{
        nom = "Martin"
        prenom = "Marie"
        dateNaissance = "1990-08-22"
        sexe = "F"
        adresse = "456 Avenue des Champs, Lyon"
        telephone = "0987654321"
        courriel = "marie.martin@email.com"
        nationalite = "Française"
        username = "marie.martin"
        password = "password123"
    },
    @{
        nom = "Durand"
        prenom = "Pierre"
        dateNaissance = "1978-12-03"
        sexe = "M"
        adresse = "789 Boulevard Saint-Germain, Marseille"
        telephone = "0147258369"
        courriel = "pierre.durand@email.com"
        nationalite = "Française"
        username = "pierre.durand"
        password = "password123"
    }
)

foreach ($client in $clients) {
    Write-Host "   Création de $($client.prenom) $($client.nom)..." -ForegroundColor White
    $clientResponse = Invoke-ApiRequest -Url "$baseUrl/auth/register" -Method "POST" -Body $client
    
    if ($clientResponse) {
        Write-Host "   ✅ Client créé: $($client.username)" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️ Erreur pour $($client.username)" -ForegroundColor Yellow
    }
}

Write-Host "" -ForegroundColor White
Write-Host "🎉 INITIALISATION TERMINÉE!" -ForegroundColor Green
Write-Host "============================" -ForegroundColor Green
Write-Host "" -ForegroundColor White
Write-Host "📋 COMPTES CRÉÉS:" -ForegroundColor Cyan
Write-Host "👑 Admin: admin / admin123" -ForegroundColor Yellow
Write-Host "👤 Client 1: jean.dupont / password123" -ForegroundColor White
Write-Host "👤 Client 2: marie.martin / password123" -ForegroundColor White
Write-Host "👤 Client 3: pierre.durand / password123" -ForegroundColor White
Write-Host "" -ForegroundColor White
Write-Host "🌐 Vous pouvez maintenant tester l'application sur http://localhost:4200" -ForegroundColor Green