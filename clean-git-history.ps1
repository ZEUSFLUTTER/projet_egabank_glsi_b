# ================================================================
# Script de nettoyage de l'historique Git pour EGA Bank
# ================================================================
# Ce script supprime les secrets hardcodes de l'historique Git
#
# ATTENTION: Cette operation reecrit l'historique et necessite
# un git push --force. Tous les membres doivent re-cloner!
# ================================================================

param(
    [switch]$Execute = $false
)

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Nettoyage Git - EGA Bank" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verification
if (-not (Test-Path ".git")) {
    Write-Host "ERREUR: Executez ce script depuis la racine du depot Git" -ForegroundColor Red
    exit 1
}

Write-Host "AVERTISSEMENT:" -ForegroundColor Yellow
Write-Host "- Cette operation reecrit l'historique Git complet" -ForegroundColor White
Write-Host "- Necessite 'git push --force'" -ForegroundColor White
Write-Host "- L'equipe devra re-cloner le depot" -ForegroundColor White
Write-Host ""

if (-not $Execute) {
    Write-Host "MODE SIMULATION - Aucune modification" -ForegroundColor Yellow
    Write-Host "Pour executer: .\clean-git-history.ps1 -Execute" -ForegroundColor Yellow
    Write-Host ""
    exit 0
}

$response = Read-Host "Tapez 'CONFIRMER' pour continuer"
if ($response -ne "CONFIRMER") {
    Write-Host "Operation annulee" -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "=== Etape 1: Sauvegarde ===" -ForegroundColor Green
$backupBranch = "backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
git branch $backupBranch
Write-Host "Branche de sauvegarde: $backupBranch" -ForegroundColor Gray
Write-Host ""

Write-Host "=== Etape 2: Verification des secrets actuels ===" -ForegroundColor Green
$secretsFound = git log --all -p -S "admin123" 2>&1
if ($secretsFound) {
    Write-Host "Secrets trouves dans l'historique - nettoyage necessaire" -ForegroundColor Yellow
} else {
    Write-Host "Aucun secret trouve - historique deja propre!" -ForegroundColor Green
    exit 0
}
Write-Host ""

Write-Host "=== Etape 3: Nettoyage avec git filter-branch ===" -ForegroundColor Green
Write-Host "Cette etape peut prendre plusieurs minutes..." -ForegroundColor Gray
Write-Host ""

# Configurer la variable d'environnement pour supprimer l'avertissement
$env:FILTER_BRANCH_SQUELCH_WARNING = "1"

# Utiliser git filter-branch avec un script PowerShell inline
$scriptContent = @'
$file = "backend/ega-bank/src/main/java/com/ega/egabank/config/DataInitializer.java"
if (Test-Path $file) {
    $content = Get-Content $file -Raw -ErrorAction SilentlyContinue
    if ($content) {
        $content = $content -replace "admin123", "***REMOVED***"
        $content = $content -replace '\.username\("admin"\)', '.username("***REMOVED***")'
        $content = $content -replace "admin@egabank\.com", "***REMOVED***"
        Set-Content -Path $file -Value $content -NoNewline
    }
}
'@

$tempScript = "temp-filter.ps1"
Set-Content -Path $tempScript -Value $scriptContent

try {
    git filter-branch --force --tree-filter "powershell -NoProfile -ExecutionPolicy Bypass -File $tempScript" --prune-empty --tag-name-filter cat -- --all
    Write-Host "Nettoyage termine!" -ForegroundColor Green
} catch {
    Write-Host "Erreur: $_" -ForegroundColor Red
    Remove-Item $tempScript -Force -ErrorAction SilentlyContinue
    exit 1
}

Remove-Item $tempScript -Force -ErrorAction SilentlyContinue
Write-Host ""

Write-Host "=== Etape 4: Nettoyage des references ===" -ForegroundColor Green
git reflog expire --expire=now --all 2>&1 | Out-Null
git gc --prune=now --aggressive 2>&1 | Out-Null
Write-Host "References nettoyees" -ForegroundColor Gray
Write-Host ""

Write-Host "=== Etape 5: Verification ===" -ForegroundColor Green
$secrets = @("admin123", "EgaBankSecretKey2026")
$stillFound = $false

foreach ($secret in $secrets) {
    Write-Host "Recherche: $secret" -ForegroundColor Gray
    $result = git log --all -p -S $secret 2>&1
    if ($result -and $result.Length -gt 0 -and $result -notmatch "no matches found") {
        Write-Host "  ATTENTION: Encore present!" -ForegroundColor Yellow
        $stillFound = $true
    } else {
        Write-Host "  OK: Introuvable" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
if ($stillFound) {
    Write-Host "ATTENTION: Des secrets subsistent" -ForegroundColor Yellow
} else {
    Write-Host "SUCCES: Historique nettoye!" -ForegroundColor Green
}
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "PROCHAINES ETAPES:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Verifier le resultat:" -ForegroundColor White
Write-Host "   git log -p --all | Select-String admin123" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Pousser les changements (IRREVERSIBLE!):" -ForegroundColor White
Write-Host "   git push origin --force --all" -ForegroundColor Gray
Write-Host "   git push origin --force --tags" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Informer l'equipe de re-cloner:" -ForegroundColor White
Write-Host "   rm -rf repo-local" -ForegroundColor Gray
Write-Host "   git clone URL_DU_REPO" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Branche de sauvegarde: $backupBranch" -ForegroundColor White
Write-Host "   (Supprimer apres verification)" -ForegroundColor Gray
Write-Host ""
