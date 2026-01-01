#!/bin/bash

# Script de configuration de l'environnement EGA Banking System
# Ce script configure Java 17 et compile le projet

echo "========================================="
echo "Configuration de l'environnement EGA"
echo "========================================="
echo ""

# Couleurs pour les messages
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\\033[1;33m'
NC='\033[0m' # No Color

# Vérifier Java 17
echo "1. Vérification de Java 17..."
if pacman -Q jdk17-openjdk &>/dev/null; then
    echo -e "${GREEN}✓ Java 17 est installé${NC}"
else
    echo -e "${RED}✗ Java 17 n'est PAS installé${NC}"
    echo "Installation de Java 17..."
    sudo pacman -S --needed jdk17-openjdk
fi

echo ""
echo "2. Activation de Java 17..."
echo -e "${YELLOW}Vous devez entrer votre mot de passe sudo${NC}"
sudo archlinux-java set java-17-openjdk

echo ""
echo "3. Vérification de la version Java active..."
java -version

echo ""
echo "4. Compilation du projet..."
mvn clean package -DskipTests

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}=========================================${NC}"
    echo -e "${GREEN}✓ PROJET COMPILÉ AVEC SUCCÈS !${NC}"
    echo -e "${GREEN}=========================================${NC}"
    echo ""
    echo "Pour démarrer l'application:"
    echo "  mvn spring-boot:run"
    echo ""
    echo "Ou avec le JAR:"
    echo "  java -jar target/banking-1.0.0.jar"
    echo ""
    echo "Swagger UI: http://localhost:8080/swagger-ui.html"
    echo "H2 Console: http://localhost:8080/h2-console"
else
    echo ""
    echo -e "${RED}=========================================${NC}"
    echo -e "${RED}✗ ERREUR DE COMPILATION${NC}"
    echo -e "${RED}=========================================${NC}"
    echo "Vérifiez les erreurs ci-dessus"
fi
