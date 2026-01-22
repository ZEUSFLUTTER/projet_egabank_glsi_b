-- Script complet à copier-coller dans phpMyAdmin
-- Sélectionnez d'abord la base bank_db puis exécutez ce script

USE bank_db;

-- Suppression des tables si elles existent (pour repartir proprement)
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS comptes;
DROP TABLE IF EXISTS clients;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

-- Table des utilisateurs pour l'authentification
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    account_non_expired BOOLEAN DEFAULT TRUE,
    account_non_locked BOOLEAN DEFAULT TRUE,
    credentials_non_expired BOOLEAN DEFAULT TRUE,
    enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
);

-- Table des clients
CREATE TABLE clients (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(50) NOT NULL,
    prenom VARCHAR(50) NOT NULL,
    date_naissance DATE NOT NULL,
    sexe CHAR(1) NOT NULL,
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
CREATE TABLE comptes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    numero_compte VARCHAR(34) NOT NULL UNIQUE,
    type_compte VARCHAR(20) NOT NULL,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    solde DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    proprietaire_id BIGINT NOT NULL,
    FOREIGN KEY (proprietaire_id) REFERENCES clients(id) ON DELETE CASCADE,
    INDEX idx_numero_compte (numero_compte),
    INDEX idx_proprietaire (proprietaire_id),
    INDEX idx_type_compte (type_compte)
);

-- Table des transactions
CREATE TABLE transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    type_transaction VARCHAR(30) NOT NULL,
    montant DECIMAL(15,2) NOT NULL,
    date_transaction TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description VARCHAR(200),
    compte_id BIGINT NOT NULL,
    compte_destinataire VARCHAR(34),
    solde_avant DECIMAL(15,2),
    solde_apres DECIMAL(15,2),
    FOREIGN KEY (compte_id) REFERENCES comptes(id) ON DELETE CASCADE,
    INDEX idx_compte_date (compte_id, date_transaction),
    INDEX idx_type_transaction (type_transaction),
    INDEX idx_date_transaction (date_transaction)
);

-- Insertion des données de test
-- Utilisateurs (mot de passe: "password" pour tous, encodé en BCrypt)
INSERT INTO users (username, email, password, role) VALUES 
('admin', 'admin@ega-bank.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'ADMIN'),
('user', 'user@ega-bank.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'USER');

-- Clients de test
INSERT INTO clients (nom, prenom, date_naissance, sexe, adresse, numero_telephone, courriel, nationalite) VALUES 
('Diop', 'Amadou', '1985-03-15', 'M', '123 Rue de la Paix, Dakar', '+221771234567', 'amadou.diop@email.com', 'Sénégalaise'),
('Fall', 'Fatou', '1990-07-22', 'F', '456 Avenue Bourguiba, Dakar', '+221772345678', 'fatou.fall@email.com', 'Sénégalaise'),
('Ndiaye', 'Moussa', '1988-11-10', 'M', '789 Boulevard de la République, Thiès', '+221773456789', 'moussa.ndiaye@email.com', 'Sénégalaise');

-- Comptes de test
INSERT INTO comptes (numero_compte, type_compte, solde, proprietaire_id) VALUES 
('SN12K00100152000025000000268', 'COURANT', 150000.00, 1),
('SN12K00100152000025000000269', 'EPARGNE', 75000.00, 1),
('SN12K00100152000025000000270', 'COURANT', 200000.00, 2),
('SN12K00100152000025000000271', 'EPARGNE', 120000.00, 3);

-- Transactions de test
INSERT INTO transactions (type_transaction, montant, description, compte_id, solde_avant, solde_apres) VALUES 
('DEPOT', 50000.00, 'Dépôt initial', 1, 100000.00, 150000.00),
('DEPOT', 25000.00, 'Dépôt initial', 2, 50000.00, 75000.00),
('DEPOT', 100000.00, 'Dépôt initial', 3, 100000.00, 200000.00),
('DEPOT', 70000.00, 'Dépôt initial', 4, 50000.00, 120000.00);

-- Vérification des données insérées
SELECT 'Base de données créée avec succès!' as message;
SELECT COUNT(*) as nb_users FROM users;
SELECT COUNT(*) as nb_clients FROM clients;
SELECT COUNT(*) as nb_comptes FROM comptes;
SELECT COUNT(*) as nb_transactions FROM transactions;