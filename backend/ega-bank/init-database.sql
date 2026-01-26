-- ========================================
-- EGA BANK - Initialisation complète de la base de données
-- ========================================

-- ========================================
-- 1. DROP des tables existantes (cascade)
-- ========================================
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS accounts CASCADE;
DROP TABLE IF EXISTS clients CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ========================================
-- 2. Création de la table CLIENTS
-- ========================================
CREATE TABLE clients (
    id BIGSERIAL PRIMARY KEY,
    nom VARCHAR(255),
    prenom VARCHAR(255),
    date_naissance DATE,
    sexe VARCHAR(255),
    adresse VARCHAR(255),
    telephone VARCHAR(255),
    courriel VARCHAR(255),
    nationalite VARCHAR(255),
    avatar TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- 3. Création de la table USERS
-- ========================================
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT true,
    must_change_password BOOLEAN NOT NULL DEFAULT false,
    client_id BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_users_client FOREIGN KEY (client_id) REFERENCES clients(id)
);

-- ========================================
-- 4. Création de la table ACCOUNTS
-- ========================================
CREATE TABLE accounts (
    id BIGSERIAL PRIMARY KEY,
    numero_compte VARCHAR(34) NOT NULL UNIQUE,
    type_compte VARCHAR(20) NOT NULL,
    date_creation TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    solde NUMERIC(19, 2) NOT NULL DEFAULT 0,
    actif BOOLEAN NOT NULL DEFAULT true,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    client_id BIGINT NOT NULL,
    CONSTRAINT fk_accounts_client FOREIGN KEY (client_id) REFERENCES clients(id)
);

-- ========================================
-- 5. Création de la table TRANSACTIONS
-- ========================================
CREATE TABLE transactions (
    id BIGSERIAL PRIMARY KEY,
    type_transaction VARCHAR(20) NOT NULL,
    montant NUMERIC(19, 2) NOT NULL,
    date_transaction TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    description VARCHAR(255),
    compte_destination VARCHAR(34),
    solde_avant NUMERIC(19, 2),
    solde_apres NUMERIC(19, 2),
    account_id BIGINT NOT NULL,
    CONSTRAINT fk_transactions_account FOREIGN KEY (account_id) REFERENCES accounts(id)
);

-- ========================================
-- 6. Créer les index sur transactions
-- ========================================
CREATE INDEX idx_transaction_date ON transactions(date_transaction);
CREATE INDEX idx_transaction_compte ON transactions(account_id);

-- ========================================
-- 7. Insérer un utilisateur administrateur par défaut
-- ========================================
-- Password: admin123 (hash bcrypt)
INSERT INTO users (username, email, password, role, enabled, must_change_password)
VALUES (
    'admin',
    'admin@egabank.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'ROLE_ADMIN',
    true,
    false
)
ON CONFLICT (username) DO UPDATE 
SET 
    password = EXCLUDED.password,
    email = EXCLUDED.email,
    role = EXCLUDED.role,
    enabled = EXCLUDED.enabled,
    updated_at = CURRENT_TIMESTAMP;

-- ========================================
-- 8. Insertion de données de test (clients et comptes)
-- ========================================

-- Insérer un client de test
INSERT INTO clients (nom, prenom, date_naissance, sexe, adresse, telephone, courriel, nationalite)
VALUES 
    ('Dupont', 'Jean', '1990-05-15', 'HOMME', '123 Rue de la Paix, Paris', '0612345678', 'jean.dupont@email.com', 'Française'),
    ('Martin', 'Marie', '1985-03-22', 'FEMME', '456 Avenue des Champs, Lyon', '0687654321', 'marie.martin@email.com', 'Française'),
    ('Bernard', 'Pierre', '1992-07-10', 'HOMME', '789 Boulevard Saint-Germain, Marseille', '0698765432', 'pierre.bernard@email.com', 'Française');

-- Insérer des comptes pour les clients
INSERT INTO accounts (numero_compte, type_compte, solde, actif, client_id)
VALUES 
    ('FR1420041010050500013M02606', 'COURANT', 5000.00, true, 1),
    ('FR1420041010050500013M02607', 'EPARGNE', 10000.00, true, 1),
    ('FR1420041010050500013M02608', 'COURANT', 3500.50, true, 2),
    ('FR1420041010050500013M02609', 'EPARGNE', 25000.00, true, 3);

-- ========================================
-- 9. Vérification des données
-- ========================================
SELECT 'Tables créées avec succès' as message;

SELECT COUNT(*) as nombre_clients FROM clients;
SELECT COUNT(*) as nombre_utilisateurs FROM users;
SELECT COUNT(*) as nombre_comptes FROM accounts;
SELECT COUNT(*) as nombre_transactions FROM transactions;

-- ========================================
-- 10. Afficher les données de test
-- ========================================
SELECT id, username, email, role, enabled FROM users;
SELECT id, nom, prenom, courriel FROM clients;
SELECT id, numero_compte, type_compte, solde, actif FROM accounts;
