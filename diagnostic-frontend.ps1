#!/usr/bin/env pwsh

Write-Host "🔍 Diagnostic des problèmes de chargement..." -ForegroundColor Cyan

# Test de connexion admin
Write-Host "`n1. Test de connexion admin..." -ForegroundColor Yellow
try {
    $loginData = @{ username = "admin"; password = "Admin@123" } | ConvertTo-Json
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -Body $loginData -ContentType "application/json" -ErrorAction Stop
    Write-Host "✅ Connexion admin réussie" -ForegroundColor Green
    
    $token = $loginResponse.token
    $headers = @{ "Authorization" = "Bearer $token" }
    
    # Test direct des endpoints
    Write-Host "`n2. Test des endpoints avec token admin..." -ForegroundColor Yellow
    
    # Test clients
    try {
        $clients = Invoke-RestMethod -Uri "http://localhost:8080/api/clients" -Method GET -Headers $headers
        Write-Host "✅ Clients API: $($clients.Count) clients trouvés" -ForegroundColor Green
    } catch {
        Write-Host "❌ Erreur clients API: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    # Test comptes
    try {
        $comptes = Invoke-RestMethod -Uri "http://localhost:8080/api/comptes" -Method GET -Headers $headers
        Write-Host "✅ Comptes API: $($comptes.Count) comptes trouvés" -ForegroundColor Green
    } catch {
        Write-Host "❌ Erreur comptes API: $($_.Exception.Message)" -ForegroundColor Red
    }
    
} catch {
    Write-Host "❌ Erreur de connexion admin: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n3. Instructions de diagnostic dans le navigateur..." -ForegroundColor Yellow
Write-Host "=================================================" -ForegroundColor Yellow

Write-Host "`n🔧 ÉTAPES DE DIAGNOSTIC:" -ForegroundColor Cyan
Write-Host "1. Ouvrez http://localhost:4200" -ForegroundColor White
Write-Host "2. Ouvrez les outils de développement (F12)" -ForegroundColor White
Write-Host "3. Allez dans l'onglet Console" -ForegroundColor White
Write-Host "4. Connectez-vous avec admin/Admin@123" -ForegroundColor White
Write-Host "5. Regardez les messages dans la console" -ForegroundColor White

Write-Host "`n🔍 MESSAGES À RECHERCHER:" -ForegroundColor Yellow
Write-Host "- 🚀 Dashboard ngOnInit" -ForegroundColor Gray
Write-Host "- 👤 Utilisateur actuel" -ForegroundColor Gray
Write-Host "- 🔄 Chargement des données" -ForegroundColor Gray
Write-Host "- ❌ Erreurs HTTP (401, 403, 500)" -ForegroundColor Gray

Write-Host "`n📋 VÉRIFICATIONS À FAIRE:" -ForegroundColor Yellow
Write-Host "1. Le token est-il présent dans localStorage?" -ForegroundColor Gray
Write-Host "2. Y a-t-il des erreurs CORS?" -ForegroundColor Gray
Write-Host "3. Les requêtes HTTP sont-elles envoyées?" -ForegroundColor Gray
Write-Host "4. Le bouton actualiser répond-il?" -ForegroundColor Gray

Write-Host "`n💡 SI LE BOUTON ACTUALISER NE FONCTIONNE PAS:" -ForegroundColor Red
Write-Host "- Vérifiez s'il y a des erreurs JavaScript" -ForegroundColor Gray
Write-Host "- Regardez si la méthode refreshData() est appelée" -ForegroundColor Gray
Write-Host "- Vérifiez que isLoading n'est pas bloqué sur true" -ForegroundColor Gray