@ECHO OFF
SETLOCAL

SET DIR=%~dp0
IF "%DIR%"=="" SET DIR=.
IF "%DIR:~-1%"=="\" SET DIR=%DIR:~0,-1%
SET MAVEN_PROJECTBASEDIR=%DIR%
SET WRAPPER_JAR=%DIR%\.mvn\wrapper\maven-wrapper.jar

SET JAVA_EXE=java
"%JAVA_EXE%" -version >NUL 2>&1
IF ERRORLEVEL 1 (
  ECHO Java n'est pas trouvé. Installez Java 17+ et ajoutez 'java' au PATH.
  EXIT /B 1
)

SET WRAPPER_LAUNCHER=org.apache.maven.wrapper.MavenWrapperMain
"%JAVA_EXE%" -Dmaven.multiModuleProjectDirectory="%MAVEN_PROJECTBASEDIR%" -cp "%WRAPPER_JAR%" %WRAPPER_LAUNCHER% %*

ENDLOCAL
