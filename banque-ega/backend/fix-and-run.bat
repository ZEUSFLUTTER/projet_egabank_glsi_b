@echo off
REM Script pour nettoyer le cache Maven et lancer l'application

echo Configuration de JAVA_HOME...
set JAVA_HOME=C:\Program Files\Java\jdk-17
set PATH=%JAVA_HOME%\bin;%PATH%

echo Nettoyage du cache Maven pour iban4j...
if exist "%USERPROFILE%\.m2\repository\org\iban4j" (
    rmdir /s /q "%USERPROFILE%\.m2\repository\org\iban4j"
    echo Cache org.iban4j supprime.
)

echo Nettoyage du projet...
call mvnw.cmd clean

echo Lancement de l'application avec mise a jour des dependances...
call mvnw.cmd spring-boot:run -U



