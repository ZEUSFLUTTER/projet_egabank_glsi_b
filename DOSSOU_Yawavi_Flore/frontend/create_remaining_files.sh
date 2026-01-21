#!/bin/bash

# Script pour créer tous les fichiers restants de l'application Angular

BASE_DIR="/home/claude/ega-bank-app"

# Créer les répertoires manquants
mkdir -p "$BASE_DIR/src/app/features/"{users,clients,accounts,transactions,reports,dashboard/home}
mkdir -p "$BASE_DIR/src/assets"
mkdir -p "$BASE_DIR/src/environments"

echo "Structure créée avec succès"
