# Solution au problème iban4j

Le problème vient du cache Maven qui a mémorisé une ancienne tentative avec `org.iban4j:iban4j:jar:3.2.3`.

Le pom.xml utilise correctement :
- groupId: `com.iban4j` (pas `org.iban4j`)
- version: `3.2.1` (pas 3.2.3)

## Solution : Nettoyer le cache Maven

Dans votre terminal, exécutez :

```cmd
set JAVA_HOME=C:\Program Files\Java\jdk-17
set PATH=%JAVA_HOME%\bin;%PATH%
.\mvnw.cmd clean
rmdir /s /q %USERPROFILE%\.m2\repository\org\iban4j
.\mvnw.cmd spring-boot:run -U
```

L'option `-U` force Maven à mettre à jour les dépendances.

## Alternative : Supprimer tout le cache Maven

Si le problème persiste, supprimez tout le cache :

```cmd
rmdir /s /q %USERPROFILE%\.m2\repository
.\mvnw.cmd clean install
.\mvnw.cmd spring-boot:run
```

Attention : Cela téléchargera à nouveau toutes les dépendances.



