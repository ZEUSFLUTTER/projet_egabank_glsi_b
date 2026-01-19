# 🧹 Guide de Nettoyage de l'Historique Git

## ⚠️ IMPORTANT - Lisez ceci en premier !

GitGuardian a détecté des secrets dans votre historique Git. Même si vous avez corrigé le code, **les secrets restent dans l'historique** et sont toujours accessibles.

## 📋 Fichiers créés pour vous

1. **clean-git-history.ps1** - Script PowerShell automatisé
2. **passwords.txt** - Liste des secrets à supprimer (pour BFG)
3. **.env.example** - Template pour les variables d'environnement

## 🚀 Option 1: Utiliser le script PowerShell (Recommandé pour Windows)

### Étape 1: Test (mode simulation)
```powershell
.\clean-git-history.ps1
```

### Étape 2: Exécution réelle
```powershell
.\clean-git-history.ps1 -Execute
```
> Tapez `CONFIRMER` quand demandé

### Étape 3: Vérifier
```powershell
git log -p --all | Select-String "admin123"
```
> Ne devrait rien retourner

### Étape 4: Pousser (ATTENTION - Irréversible!)
```powershell
git push origin --force --all
git push origin --force --tags
```

## 🔧 Option 2: Utiliser BFG Repo-Cleaner (Alternative)

### Installation
1. Téléchargez BFG: https://rtyley.github.io/bfg-repo-cleaner/
2. Placez `bfg.jar` dans ce dossier

### Exécution
```powershell
# Remplacer les secrets
java -jar bfg.jar --replace-text passwords.txt

# Nettoyer
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Pousser
git push origin --force --all
git push origin --force --tags
```

## 📝 Checklist Post-Nettoyage

### Actions immédiates
- [ ] Vérifier qu'aucun secret n'est trouvé: `git log -p --all | Select-String "admin123"`
- [ ] Pusher avec `--force` sur toutes les branches
- [ ] Informer l'équipe de **NE PAS PULL** mais de **RE-CLONER**

### Communication équipe
```
Subject: ACTION REQUISE - Re-cloner le dépôt EGA Bank

Bonjour,

L'historique Git a été nettoyé pour supprimer des credentials exposés.

ACTIONS REQUISES:
1. Commiter/stasher vos changements locaux
2. Supprimer votre copie locale
3. Re-cloner le dépôt:
   git clone <URL_DU_REPO>
4. Réappliquer vos changements si nécessaire

NE PAS faire git pull - cela créera des conflits!

Deadline: Aujourd'hui avant 17h
```

### Sécurité
- [ ] Régénérer le mot de passe admin en production
- [ ] Changer le JWT secret en production
- [ ] Invalider tous les tokens existants
- [ ] Configurer les variables d'environnement:
  ```bash
  export ADMIN_USERNAME=votre_admin
  export ADMIN_PASSWORD=SecurePassword123!
  ```

### GitGuardian
- [ ] Marquer l'incident comme résolu dans GitGuardian
- [ ] Vérifier qu'aucune nouvelle alerte n'est déclenchée

## 🔍 Vérifications

### Vérifier que les secrets ont été supprimés
```powershell
# Chercher dans l'historique
git log --all -p -S "admin123"

# Chercher dans tous les fichiers de tous les commits
git grep "admin123" $(git rev-list --all)
```

### Si des secrets restent
Si vous trouvez encore des secrets, vous devrez peut-être:
1. Recommencer le nettoyage
2. Utiliser BFG Repo-Cleaner (plus puissant)
3. Utiliser git-filter-repo (alternative moderne)

## ⚡ Commandes rapides

```powershell
# Mode simulation
.\clean-git-history.ps1

# Execution
.\clean-git-history.ps1 -Execute

# Verification
git log -p --all | Select-String "admin123"

# Push force
git push origin --force --all
git push origin --force --tags

# Verifier les branches distantes
git branch -r

# Supprimer la branche de backup (apres verification)
git branch -D backup-YYYYMMDD-HHMMSS
```

## ⏰ Timeline estimée

1. **Préparation** (5 min) - Lire ce guide, prévenir l'équipe
2. **Exécution** (10-30 min) - Dépend de la taille de l'historique
3. **Vérification** (5 min) - Confirmer que les secrets sont supprimés
4. **Push force** (1-5 min) - Pousser les changements
5. **Équipe re-clone** (5 min par personne)

**Total: ~30-60 minutes**

## 🆘 En cas de problème

### "Cannot force update the current branch"
```powershell
# Changer de branche temporairement
git checkout -b temp-branch
git push origin --force --all
git checkout main
git branch -D temp-branch
```

### "Pack size exceeded"
```powershell
# Augmenter la limite
git config http.postBuffer 524288000
```

### L'équipe a déjà fait git pull
```powershell
# Chaque personne doit:
git fetch origin
git reset --hard origin/main  # ou origin/dev
```

## 📞 Support

- Documentation Git: https://git-scm.com/docs/git-filter-branch
- BFG Repo-Cleaner: https://rtyley.github.io/bfg-repo-cleaner/
- GitGuardian Docs: https://docs.gitguardian.com/

---
**Créé le:** 2026-01-19  
**Objectif:** Supprimer les credentials exposés de l'historique Git
