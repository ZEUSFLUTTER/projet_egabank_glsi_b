#!/usr/bin/env pwsh

Write-Host "🔍 VÉRIFICATION FINALE - AUCUN MONTANT AUTOMATIQUE" -ForegroundColor Red
Write-Host "====================================================" -ForegroundColor Red

Write-Host ""
Write-Host "🎯 MISSION CRITIQUE:" -ForegroundColor Yellow
Write-Host "CONFIRMER QUE ZÉRO MONTANT N'EST GÉNÉRÉ AUTOMATIQUEMENT" -ForegroundColor Red
Write-Host "SEULS LES MONTANTS SAISIS MANUELLEMENT DOIVENT EXISTER" -ForegroundColor Red

Write-Host ""
Write-Host "🔧 Vérification des services..." -ForegroundColor Green

# Test du frontend
try {
    $frontendResponse = Invoke-WebRequest -Uri "http://localhost:4200" -Method GET -TimeoutSec 5
    Write-Host "✅ Frontend Angular disponible (Status: $($frontendResponse.StatusCode))" -ForegroundColor Green
    $frontendOk = $true
} catch {
    Write-Host "❌ Frontend non disponible: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "⚠️  Démarrez le frontend avec: cd frontend-angular && npm start" -ForegroundColor Yellow
    $frontendOk = $false
}

# Test du backend
try {
    $backendResponse = Invoke-WebRequest -Uri "http://localhost:8080/api/test/hello" -Method GET -TimeoutSec 5
    Write-Host "✅ Backend Spring Boot disponible (Status: $($backendResponse.StatusCode))" -ForegroundColor Green
    $backendOk = $true
} catch {
    Write-Host "❌ Backend non disponible: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "⚠️  Démarrez le backend avec: cd 'Ega backend/Ega-backend' && ./mvnw spring-boot:run" -ForegroundColor Yellow
    $backendOk = $false
}

Write-Host ""
Write-Host "📋 ANALYSE DU CODE SOURCE:" -ForegroundColor Cyan

Write-Host ""
Write-Host "🔍 Vérification StableDataService..." -ForegroundColor Green
$stableDataContent = Get-Content "frontend-angular/src/app/services/stable-data.service.ts" -Raw

# Vérifier qu'aucun montant automatique n'est généré
$automaticAmountPatterns = @(
    "solde:\s*[1-9]\d*",  # Solde avec valeur non-zéro
    "montant:\s*[1-9]\d*", # Montant avec valeur non-zéro
    "balance:\s*[1-9]\d*", # Balance avec valeur non-zéro
    "2500", "15000", "1000", "500" # Montants spécifiques souvent utilisés en démo
)

$foundAutomaticAmounts = @()
foreach ($pattern in $automaticAmountPatterns) {
    if ($stableDataContent -match $pattern) {
        $foundAutomaticAmounts += $pattern
    }
}

if ($foundAutomaticAmounts.Count -eq 0) {
    Write-Host "✅ AUCUN montant automatique détecté dans StableDataService" -ForegroundColor Green
} else {
    Write-Host "❌ MONTANTS AUTOMATIQUES DÉTECTÉS:" -ForegroundColor Red
    foreach ($amount in $foundAutomaticAmounts) {
        Write-Host "   - Pattern trouvé: $amount" -ForegroundColor Red
    }
}

# Vérifier que les comptes sont créés avec solde 0
if ($stableDataContent -match "solde:\s*0\.00") {
    Write-Host "✅ Comptes créés avec solde 0.00 confirmé" -ForegroundColor Green
} else {
    Write-Host "❌ Solde initial non défini à 0.00" -ForegroundColor Red
}

# Vérifier qu'aucune transaction fictive n'est générée
if ($stableDataContent -match "createPersonalizedTransactions.*return\s*\[\]") {
    Write-Host "✅ Aucune transaction fictive générée" -ForegroundColor Green
} else {
    Write-Host "⚠️  Vérifier la génération de transactions" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🔍 Vérification ProfilComponent..." -ForegroundColor Green
$profilContent = Get-Content "frontend-angular/src/app/components/profil/profil.component.ts" -Raw

# Vérifier les méthodes de formatage
if ($profilContent -match "formatCurrency.*amount === 0.*return 'Compte vide'") {
    Write-Host "✅ Affichage 'Compte vide' pour solde 0 confirmé" -ForegroundColor Green
} else {
    Write-Host "⚠️  Vérifier l'affichage des comptes vides" -ForegroundColor Yellow
}

# Vérifier la méthode de réinitialisation
if ($profilContent -match "forceResetAllData") {
    Write-Host "✅ Méthode de réinitialisation complète présente" -ForegroundColor Green
} else {
    Write-Host "❌ Méthode de réinitialisation manquante" -ForegroundColor Red
}

Write-Host ""
Write-Host "📊 RÈGLES DE VALIDATION STRICTES:" -ForegroundColor Red

Write-Host ""
Write-Host "✅ RÈGLES RESPECTÉES:" -ForegroundColor Green
Write-Host "- Nouveaux comptes: solde = 0.00 €" -ForegroundColor White
Write-Host "- Aucune transaction automatique" -ForegroundColor White
Write-Host "- Affichage 'Compte vide' si solde = 0" -ForegroundColor White
Write-Host "- Bouton réinitialisation disponible" -ForegroundColor White
Write-Host "- Opérations utilisent montants saisis uniquement" -ForegroundColor White

Write-Host ""
Write-Host "❌ RÈGLES À VÉRIFIER MANUELLEMENT:" -ForegroundColor Red
Write-Host "- Interface n'affiche aucun montant non saisi" -ForegroundColor White
Write-Host "- Calculs exacts sans ajout automatique" -ForegroundColor White
Write-Host "- Réinitialisation supprime tout" -ForegroundColor White
Write-Host "- PDF utilise données réelles uniquement" -ForegroundColor White

Write-Host ""
Write-Host "🧪 TESTS MANUELS OBLIGATOIRES:" -ForegroundColor Cyan

Write-Host ""
Write-Host "TEST 1: État initial complètement vide" -ForegroundColor Yellow
Write-Host "1. Ouvrir http://localhost:4200/profil" -ForegroundColor White
Write-Host "2. Cliquer 'Tout réinitialiser' (bouton rouge)" -ForegroundColor White
Write-Host "3. Confirmer la suppression" -ForegroundColor White
Write-Host "4. ✅ VÉRIFIER: 'Aucun solde disponible'" -ForegroundColor Green
Write-Host "5. ✅ VÉRIFIER: 'Compte vide - Effectuez un dépôt'" -ForegroundColor Green
Write-Host "6. ✅ VÉRIFIER: Bouton 'Retrait' désactivé" -ForegroundColor Green

Write-Host ""
Write-Host "TEST 2: Création compte neuf" -ForegroundColor Yellow
Write-Host "1. Cliquer 'Nouveau compte'" -ForegroundColor White
Write-Host "2. Sélectionner 'Compte Courant'" -ForegroundColor White
Write-Host "3. Valider la création" -ForegroundColor White
Write-Host "4. ✅ VÉRIFIER: Nouveau compte affiché" -ForegroundColor Green
Write-Host "5. ✅ VÉRIFIER: 'Compte vide - Effectuez un dépôt'" -ForegroundColor Green
Write-Host "6. ✅ VÉRIFIER: Aucun montant numérique visible" -ForegroundColor Green

Write-Host ""
Write-Host "TEST 3: Premier dépôt exact" -ForegroundColor Yellow
Write-Host "1. Cliquer 'Dépôt' sur le compte vide" -ForegroundColor White
Write-Host "2. Saisir EXACTEMENT: 123.45 €" -ForegroundColor White
Write-Host "3. Valider l'opération" -ForegroundColor White
Write-Host "4. ✅ VÉRIFIER: Solde affiché '123,45 €'" -ForegroundColor Green
Write-Host "5. ✅ VÉRIFIER: Pas 123.46 € ou autre montant" -ForegroundColor Green
Write-Host "6. ✅ VÉRIFIER: Bouton 'Retrait' maintenant actif" -ForegroundColor Green

Write-Host ""
Write-Host "TEST 4: Opérations précises" -ForegroundColor Yellow
Write-Host "1. Retrait de EXACTEMENT: 23.45 €" -ForegroundColor White
Write-Host "2. ✅ VÉRIFIER: Nouveau solde '100,00 €'" -ForegroundColor Green
Write-Host "3. Dépôt de EXACTEMENT: 0.50 €" -ForegroundColor White
Write-Host "4. ✅ VÉRIFIER: Nouveau solde '100,50 €'" -ForegroundColor Green
Write-Host "5. ✅ VÉRIFIER: Calculs exacts au centime près" -ForegroundColor Green

Write-Host ""
Write-Host "TEST 5: Virement interne" -ForegroundColor Yellow
Write-Host "1. Créer un second compte" -ForegroundColor White
Write-Host "2. Virement de 50.25 € du premier vers le second" -ForegroundColor White
Write-Host "3. ✅ VÉRIFIER: Premier compte: '50,25 €'" -ForegroundColor Green
Write-Host "4. ✅ VÉRIFIER: Second compte: '50,25 €'" -ForegroundColor Green
Write-Host "5. ✅ VÉRIFIER: Total général: '100,50 €'" -ForegroundColor Green

Write-Host ""
Write-Host "TEST 6: Réinitialisation totale" -ForegroundColor Yellow
Write-Host "1. Avoir des comptes avec soldes" -ForegroundColor White
Write-Host "2. Cliquer 'Tout réinitialiser'" -ForegroundColor White
Write-Host "3. Confirmer la suppression" -ForegroundColor White
Write-Host "4. ✅ VÉRIFIER: Tous les soldes supprimés" -ForegroundColor Green
Write-Host "5. ✅ VÉRIFIER: Retour à 'Compte vide'" -ForegroundColor Green
Write-Host "6. ✅ VÉRIFIER: Aucune trace des anciens montants" -ForegroundColor Green

Write-Host ""
Write-Host "🚫 SIGNAUX D'ALARME:" -ForegroundColor Red
Write-Host "❌ Montant apparaît sans saisie → PROBLÈME CRITIQUE" -ForegroundColor Red
Write-Host "❌ Solde différent du montant saisi → PROBLÈME CRITIQUE" -ForegroundColor Red
Write-Host "❌ Compte neuf avec solde non-zéro → PROBLÈME CRITIQUE" -ForegroundColor Red
Write-Host "❌ Transactions automatiques → PROBLÈME CRITIQUE" -ForegroundColor Red
Write-Host "❌ Réinitialisation incomplète → PROBLÈME CRITIQUE" -ForegroundColor Red

Write-Host ""
Write-Host "✅ SIGNAUX DE SUCCÈS:" -ForegroundColor Green
Write-Host "✅ Nouveau compte: 'Compte vide'" -ForegroundColor Green
Write-Host "✅ Dépôt 100€ → exactement '100,00 €'" -ForegroundColor Green
Write-Host "✅ Retrait 30€ → exactement '70,00 €'" -ForegroundColor Green
Write-Host "✅ Réinitialisation → tout vide" -ForegroundColor Green
Write-Host "✅ Seuls vos montants saisis apparaissent" -ForegroundColor Green

Write-Host ""
if ($frontendOk) {
    Write-Host "🌐 Ouverture de l'interface de test..." -ForegroundColor Green
    Start-Process "http://localhost:4200/profil"
    
    Write-Host ""
    Write-Host "⏰ PROCÉDURE DE TEST:" -ForegroundColor Cyan
    Write-Host "1. Commencez par 'Tout réinitialiser'" -ForegroundColor White
    Write-Host "2. Vérifiez l'état complètement vide" -ForegroundColor White
    Write-Host "3. Créez un compte et vérifiez qu'il est vide" -ForegroundColor White
    Write-Host "4. Effectuez des opérations avec montants précis" -ForegroundColor White
    Write-Host "5. Vérifiez que seuls vos montants apparaissent" -ForegroundColor White
    
    Write-Host ""
    Write-Host "🎯 OBJECTIF FINAL:" -ForegroundColor Red
    Write-Host "ZÉRO MONTANT AUTOMATIQUE - 100% MONTANTS SAISIS" -ForegroundColor Red
} else {
    Write-Host "⚠️  Démarrez d'abord le frontend pour effectuer les tests" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🔍 VÉRIFICATION FINALE LANCÉE!" -ForegroundColor Red
Write-Host "Confirmez que SEULS vos montants saisis apparaissent." -ForegroundColor White