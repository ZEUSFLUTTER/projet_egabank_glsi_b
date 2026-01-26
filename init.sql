-- Création de la base de données
CREATE DATABASE IF NOT EXISTS ega_bank_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Création de l'utilisateur avec accès complet
CREATE USER IF NOT EXISTS 'inf'@'localhost' IDENTIFIED BY 'ck11;1b*';
GRANT ALL PRIVILEGES ON ega_bank_db.* TO 'inf'@'localhost';
FLUSH PRIVILEGES;

