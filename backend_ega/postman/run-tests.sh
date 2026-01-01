#!/bin/bash

# Script pour exécuter les tests Postman automatiquement
# Nécessite Newman: npm install -g newman newman-reporter-htmlextra

set -e

# Couleurs pour le terminal
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  EGA Banking - Tests Postman${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Vérifier si Newman est installé
if ! command -v newman &> /dev/null; then
    echo -e "${YELLOW}Newman n'est pas installé. Installation...${NC}"
    npm install -g newman newman-reporter-htmlextra
fi

# Vérifier si l'application est démarrée
echo -e "${YELLOW}Vérification que l'application est démarrée...${NC}"
if ! curl -s http://localhost:8080/actuator/health > /dev/null 2>&1; then
    echo -e "${RED}L'application n'est pas démarrée sur http://localhost:8080${NC}"
    echo -e "${YELLOW}Démarrage de l'application...${NC}"
    
    # Vérifier si le JAR existe
    if [ -f "../target/banking-1.0.0.jar" ]; then
        echo -e "${GREEN}Démarrage du JAR...${NC}"
        java -jar ../target/banking-1.0.0.jar &
        APP_PID=$!
        echo "PID de l'application: $APP_PID"
        
        # Attendre que l'application démarre
        echo "Attente du démarrage de l'application..."
        for i in {1..30}; do
            if curl -s http://localhost:8080/actuator/health > /dev/null 2>&1; then
                echo -e "${GREEN}Application démarrée !${NC}"
                break
            fi
            echo -n "."
            sleep 2
        done
    else
        echo -e "${RED}Aucun JAR trouvé. Veuillez compiler l'application d'abord:${NC}"
        echo "cd .. && mvn clean package -DskipTests"
        exit 1
    fi
fi

echo ""
echo -e "${GREEN}Exécution des tests Postman...${NC}"
echo ""

# Créer le dossier pour les rapports
mkdir -p reports

# Exécuter les tests avec Newman
newman run EGA_Banking_API.postman_collection.json \
    -e EGA_Banking.postman_environment.json \
    -r cli,html,json \
    --reporter-html-export reports/test-report-$(date +%Y%m%d-%H%M%S).html \
    --reporter-json-export reports/test-report-$(date +%Y%m%d-%H%M%S).json \
    --bail \
    --color on \
    --delay-request 500

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Tests terminés !${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "Rapports générés dans: ${YELLOW}postman/reports/${NC}"
echo ""

# Si l'application a été démarrée par ce script, la stopper
if [ ! -z "$APP_PID" ]; then
    echo -e "${YELLOW}Arrêt de l'application...${NC}"
    kill $APP_PID
fi
