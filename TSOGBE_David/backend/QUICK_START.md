# Démarrage rapide du backend

## Configuration JAVA_HOME (une seule fois par session)

```cmd
set JAVA_HOME=C:\Program Files\Java\jdk-17
set PATH=%JAVA_HOME%\bin;%PATH%
```

## Lancer l'application

```cmd
cd backend
.\mvnw.cmd spring-boot:run
```

OU utilisez le script automatique :

```cmd
cd backend
fix-and-run.bat
```

## Si erreur de dépendance iban4j

Le problème a été corrigé dans le pom.xml. Si vous avez encore des erreurs, nettoyez le cache :

```cmd
rmdir /s /q %USERPROFILE%\.m2\repository\org\iban4j
rmdir /s /q %USERPROFILE%\.m2\repository\com\iban4j
.\mvnw.cmd clean
.\mvnw.cmd spring-boot:run -U
```

## Configuration permanente de JAVA_HOME

Pour éviter de configurer JAVA_HOME à chaque session :

1. Windows + R → `sysdm.cpl` → Onglet "Avancé" → "Variables d'environnement"
2. Nouvelle variable système : `JAVA_HOME` = `C:\Program Files\Java\jdk-17`
3. Vérifier que `%JAVA_HOME%\bin` est dans PATH
4. Redémarrer le terminal



