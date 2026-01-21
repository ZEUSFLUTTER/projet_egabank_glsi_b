# Configuration de JAVA_HOME sur Windows

## Méthode rapide (Temporaire - pour cette session uniquement)

Dans votre terminal, exécutez :

```cmd
set JAVA_HOME=C:\Program Files\Java\jdk-17
set PATH=%JAVA_HOME%\bin;%PATH%
```

**Note :** Cette configuration est valide uniquement pour la session en cours du terminal.

## Méthode permanente (Recommandée)

### Étape 1 : Trouver le chemin d'installation de Java

Exécutez dans votre terminal :
```cmd
where java
```

Cela vous donnera le chemin complet, par exemple :
`C:\Program Files\Java\jdk-17.0.12\bin\java.exe`

Le chemin JAVA_HOME sera alors : `C:\Program Files\Java\jdk-17.0.12` (sans le `\bin`)

### Étape 2 : Configurer JAVA_HOME

1. **Ouvrir les Variables d'environnement :**
   - Appuyez sur `Windows + R`
   - Tapez `sysdm.cpl` et appuyez sur Entrée
   - Cliquez sur l'onglet "Avancé"
   - Cliquez sur "Variables d'environnement"

2. **Ajouter JAVA_HOME :**
   - Dans "Variables système", cliquez sur "Nouveau"
   - Nom de la variable : `JAVA_HOME`
   - Valeur de la variable : `C:\Program Files\Java\jdk-17.0.12` (remplacez par votre chemin)
   - Cliquez sur "OK"

3. **Mettre à jour PATH (si nécessaire) :**
   - Sélectionnez la variable "Path" dans "Variables système"
   - Cliquez sur "Modifier"
   - Vérifiez que `%JAVA_HOME%\bin` est présent
   - Si ce n'est pas le cas, cliquez sur "Nouveau" et ajoutez `%JAVA_HOME%\bin`
   - Cliquez sur "OK" sur toutes les fenêtres

4. **Redémarrer le terminal :**
   - Fermez tous les terminaux
   - Ouvrez un nouveau terminal
   - Testez avec : `echo %JAVA_HOME%`

### Étape 3 : Vérifier la configuration

Dans un nouveau terminal :
```cmd
java -version
echo %JAVA_HOME%
```

## Solution alternative rapide (Script batch)

Créez un fichier `start-backend.bat` dans le dossier `backend` avec ce contenu :

```batch
@echo off
set JAVA_HOME=C:\Program Files\Java\jdk-17
set PATH=%JAVA_HOME%\bin;%PATH%
call mvnw.cmd spring-boot:run
```

Puis lancez simplement :
```cmd
start-backend.bat
```



