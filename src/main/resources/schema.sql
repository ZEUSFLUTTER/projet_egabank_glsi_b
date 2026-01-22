-- Script de création de la base de données pour le système bancaire EGA
-- Compatible MySQL et H2

-- Création de la base de données (pour MySQL)
-- CREATE DATABASE IF NOT EXISTS bank_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE bank_db;

-- Table des utilisateurs pour l'authentification
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    account_non_expired BOOLEAN DEFAULT TRUE,
    account_non_locked BOOLEAN DEFAULT TRUE,
    credentials_non_expired BOOLEAN DEFAULT TRUE,
    enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
);

-- Table des clients
CREATE TABLE IF NOT EXISTS clients (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(50) NOT NULL,
    prenom VARCHAR(50) NOT NULL,
    date_naissance DATE NOT NULL,
    sexe CHAR(1) NOT NULL CHECK (sexe IN ('M', 'F')),
    adresse VARCHAR(200) NOT NULL,
    numero_telephone VARCHAR(20) NOT NULL UNIQUE,
    courriel VARCHAR(100) NOT NULL UNIQUE,
    nationalite VARCHAR(50) NOT NULL,
    date_creation DATE DEFAULT (CURRENT_DATE),
    INDEX idx_nom_prenom (nom, prenom),
    INDEX idx_courriel (courriel),
    INDEX idx_telephone (numero_telephone)
);

-- Table des comptes
CREATE TABLE IF NOT EXISTS comptes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    numero_compte VARCHAR(34) NOT NULL UNIQUE, -- IBAN format
    type_compte ENUM('COURANT', 'EPARGNE') NOT NULL,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    solde DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    proprietaire_id BIGINT NOT NULL,
    FOREIGN KEY (proprietaire_id) REFERENCES clients(id) ON DELETE CASCADE,
    INDEX idx_numero_compte (numero_compte),
    INDEX idx_proprietaire (proprietaire_id),
    INDEX idx_type_compte (type_compte)
);

-- Table des transactions
CREATE TABLE IF NOT EXISTS transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    type_transaction ENUM('DEPOT', 'RETRAIT', 'VIREMENT_SORTANT', 'VIREMENT_ENTRANT') NOT NULL,
    montant DECIMAL(15,2) NOT NULL,
    date_transaction TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description VARCHAR(200),
    compte_id BIGINT NOT NULL,
    compte_destinataire VARCHAR(34), -- Pour les virements
    solde_avant DECIMAL(15,2),
    solde_apres DECIMAL(15,2),
    FOREIGN KEY (compte_id) REFERENCES comptes(id) ON DELETE CASCADE,
    INDEX idx_compte_date (compte_id, date_transaction),
    INDEX idx_type_transaction (type_transaction),
    INDEX idx_date_transaction (date_transaction)
);

-- Contraintes supplémentaires
ALTER TABLE comptes ADD CONSTRAINT chk_solde_positif CHECK (solde >= 0);
ALTER TABLE transactions ADD CONSTRAINT chk_montant_positif CHECK (montant > 0);