#!/bin/bash

# Script pour basculer vers Java 17 et compiler le projet
# Usage: ./switch-to-java17.sh

echo "🔍 Vérification de la version Java actuelle..."
current_java=$(java -version 2>&1 | head -n 1)
echo "Version actuelle: $current_java"

# Vérifier si Java 17 est installé
if ! command -v archlinux-java &> /dev/null; then
    echo "⚠️  Ce script est conçu pour Arch Linux / Manjaro"
    echo "Pour d'autres distributions, consultez SETUP.md lignes 31-49"
    exit 1
fi

echo ""
echo "📦 Listing des versions Java installées:"
archlinux-java status

echo ""
echo "🔧 Installation de Java 17 si nécessaire..."
if ! pacman -Q jdk17-openjdk &> /dev/null; then
    echo "Java 17 n'est pas installé. Installation en cours..."
    sudo pacman -S --needed jdk17-openjdk
else
    echo "✅ Java 17 est déjà installé"
fi

echo ""
echo "🔄 Basculement vers Java 17..."
sudo archlinux-java set java-17-openjdk

echo ""
echo "✅ Version Java après changement:"
java -version

echo ""
echo "🧹 Nettoyage du projet Maven..."
mvn clean

echo ""
echo "🏗️  Compilation du projet..."
if mvn clean install -DskipTests; then
    echo ""
    echo "✅ ============================================="
    echo "✅ SUCCÈS! Le projet est compilé avec succès!"
    echo "✅ ============================================="
    echo ""
    echo "🚀 Pour démarrer l'application:"
    echo "   mvn spring-boot:run"
    echo ""
    echo "🐳 Ou avec Docker:"
    echo "   docker compose up -d"
    echo ""
else
    echo ""
    echo "❌ ============================================="
    echo "❌ ERREUR: La compilation a échoué"
    echo "❌ ============================================="
    echo ""
    echo "Consultez les erreurs ci-dessus pour plus de détails"
    exit 1
fi
