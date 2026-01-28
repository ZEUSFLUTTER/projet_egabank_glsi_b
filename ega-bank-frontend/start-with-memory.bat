@echo off
echo Démarrage du frontend Angular avec plus de mémoire...
set NODE_OPTIONS=--max-old-space-size=4096
npm start