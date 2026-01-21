@echo off
REM Script pour démarrer le backend avec configuration automatique de JAVA_HOME

REM Chercher Java dans les emplacements communs
if exist "C:\Program Files\Java\jdk-17" (
    set JAVA_HOME=C:\Program Files\Java\jdk-17
    goto :found
)

if exist "C:\Program Files\Java\jdk-17.0.12" (
    set JAVA_HOME=C:\Program Files\Java\jdk-17.0.12
    goto :found
)

if exist "C:\Program Files (x86)\Java\jdk-17" (
    set JAVA_HOME=C:\Program Files (x86)\Java\jdk-17
    goto :found
)

REM Si Java n'est pas trouvé, utiliser where java pour le trouver
for /f "tokens=*" %%i in ('where java 2^>nul') do (
    set JAVA_EXE=%%i
    goto :extract
)

:extract
if defined JAVA_EXE (
    REM Extraire le chemin depuis le chemin complet de java.exe
    for %%j in ("%JAVA_EXE%") do (
        set JAVA_HOME=%%~dpj
        REM Enlever \bin à la fin
        set JAVA_HOME=%JAVA_HOME:~0,-1%
        for %%k in ("%JAVA_HOME%") do set JAVA_HOME=%%~dpk
        set JAVA_HOME=%JAVA_HOME:~0,-1%
    )
    goto :found
)

echo Erreur: Java JDK non trouve. Veuillez installer Java 17 ou configurer JAVA_HOME manuellement.
pause
exit /b 1

:found
echo JAVA_HOME configure: %JAVA_HOME%
set PATH=%JAVA_HOME%\bin;%PATH%

REM Lancer Spring Boot
call mvnw.cmd spring-boot:run



