-- =====================================================
-- SCRIPT DE CRÉATION COMPLÈTE - BASE DE DONNÉES EGA BANK
-- =====================================================
-- Version: MySQL 8.0+
-- Projet: EGA BANK - Application Bancaire
-- Date: 2024
-- =====================================================

-- 1. CRÉATION DE LA BASE DE DONNÉES
-- ===================================
DROP DATABASE IF EXISTS ega_bank;
CREATE DATABASE ega_bank 
    CHARACTER SET utf8mb4 
    COLLATE utf8mb4_unicode_ci;

USE ega_bank;

-- 2. CRÉATION DES TABLES
-- ======================

-- Table CLIENTS
-- -------------
CREATE TABLE clients (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL COMMENT 'Nom de famille du client',
    prenom VARCHAR(100) NOT NULL COMMENT 'Prénom du client',
    date_naissance DATE NOT NULL COMMENT 'Date de naissance',
    sexe CHAR(1) NOT NULL COMMENT 'Sexe: M=Masculin, F=Feminin',
    adresse TEXT NOT NULL COMMENT 'Adresse complète',
    telephone VARCHAR(15) NOT NULL COMMENT 'Numéro de téléphone (8-15 chiffres)',
    courriel VARCHAR(255) NOT NULL UNIQUE COMMENT 'Adresse email unique',
    nationalite VARCHAR(100) NOT NULL COMMENT 'Nationalité du client',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Date de création',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Date de modification',
    
    -- Contraintes
    CONSTRAINT chk_clients_sexe CHECK (sexe IN ('M', 'F')),
    
    -- Index pour optimiser les recherches
    INDEX idx_clients_courriel (courriel),
    INDEX idx_clients_nom_prenom (nom, prenom),
    INDEX idx_clients_telephone (telephone)
) ENGINE=InnoDB COMMENT='Table des clients de la banque';

-- Table USERS (Authentification)
-- -------------------------------
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE COMMENT 'Nom d\'utilisateur unique',
    password VARCHAR(255) NOT NULL COMMENT 'Mot de passe hashé',
    client_id BIGINT NULL COMMENT 'Référence vers le client (NULL pour admin)',
    role VARCHAR(20) NOT NULL DEFAULT 'ROLE_CLIENT' COMMENT 'Rôle: ROLE_CLIENT ou ROLE_ADMIN',
    enabled BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'Compte activé',
    account_non_expired BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'Compte non expiré',
    account_non_locked BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'Compte non verrouillé',
    credentials_non_expired BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'Identifiants non expirés',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Date de création',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Date de modification',
    
    -- Clés étrangères
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    
    -- Index
    INDEX idx_users_username (username),
    INDEX idx_users_role (role),
    INDEX idx_users_client_id (client_id)
) ENGINE=InnoDB COMMENT='Table d\'authentification des utilisateurs';

-- Table COMPTES
-- -------------
CREATE TABLE comptes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    numero_compte VARCHAR(50) NOT NULL UNIQUE COMMENT 'Numéro de compte unique',
    type_compte ENUM('COURANT', 'EPARGNE') NOT NULL COMMENT 'Type de compte',
    date_creation DATE NOT NULL COMMENT 'Date de création du compte',
    solde DECIMAL(15,2) NOT NULL DEFAULT 0.00 COMMENT 'Solde actuel du compte',
    client_id BIGINT NOT NULL COMMENT 'Propriétaire du compte',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Date de création',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Date de modification',
    
    -- Clés étrangères
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    
    -- Contraintes
    CONSTRAINT chk_comptes_solde CHECK (solde >= 0),
    
    -- Index
    INDEX idx_comptes_numero (numero_compte),
    INDEX idx_comptes_client_id (client_id),
    INDEX idx_comptes_type (type_compte),
    INDEX idx_comptes_solde (solde)
) ENGINE=InnoDB COMMENT='Table des comptes bancaires';

-- Table TRANSACTIONS
-- ------------------
CREATE TABLE transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    type_transaction ENUM('DEPOT', 'RETRAIT', 'VIREMENT') NOT NULL COMMENT 'Type de transaction',
    montant DECIMAL(15,2) NOT NULL COMMENT 'Montant de la transaction',
    date_transaction DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Date et heure de la transaction',
    compte_id BIGINT NOT NULL COMMENT 'Compte source de la transaction',
    compte_destinataire_id BIGINT NULL COMMENT 'Compte destinataire (pour virements)',
    description TEXT NULL COMMENT 'Description de la transaction',
    solde_apres DECIMAL(15,2) NOT NULL COMMENT 'Solde du compte après la transaction',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Date de création',
    
    -- Clés étrangères
    FOREIGN KEY (compte_id) REFERENCES comptes(id) ON DELETE CASCADE,
    FOREIGN KEY (compte_destinataire_id) REFERENCES comptes(id) ON DELETE SET NULL,
    
    -- Contraintes
    CONSTRAINT chk_transactions_montant CHECK (montant > 0),
    CONSTRAINT chk_transactions_solde CHECK (solde_apres >= 0),
    
    -- Index pour optimiser les requêtes
    INDEX idx_transactions_compte_id (compte_id),
    INDEX idx_transactions_date (date_transaction),
    INDEX idx_transactions_type (type_transaction),
    INDEX idx_transactions_montant (montant),
    INDEX idx_transactions_compte_date (compte_id, date_transaction)
) ENGINE=InnoDB COMMENT='Table des transactions bancaires';

-- 3. CRÉATION DES VUES UTILES
-- ============================

-- Vue: Informations complètes des clients avec leurs comptes
CREATE VIEW v_clients_comptes AS
SELECT 
    c.id as client_id,
    c.nom,
    c.prenom,
    c.courriel,
    c.telephone,
    COUNT(cpt.id) as nombre_comptes,
    COALESCE(SUM(cpt.solde), 0) as solde_total
FROM clients c
LEFT JOIN comptes cpt ON c.id = cpt.client_id
GROUP BY c.id, c.nom, c.prenom, c.courriel, c.telephone;

-- Vue: Résumé des transactions par compte
CREATE VIEW v_transactions_resume AS
SELECT 
    cpt.numero_compte,
    cpt.client_id,
    COUNT(t.id) as nombre_transactions,
    COALESCE(SUM(CASE WHEN t.type_transaction = 'DEPOT' THEN t.montant ELSE 0 END), 0) as total_depots,
    COALESCE(SUM(CASE WHEN t.type_transaction = 'RETRAIT' THEN t.montant ELSE 0 END), 0) as total_retraits,
    COALESCE(SUM(CASE WHEN t.type_transaction = 'VIREMENT' THEN t.montant ELSE 0 END), 0) as total_virements,
    cpt.solde as solde_actuel
FROM comptes cpt
LEFT JOIN transactions t ON cpt.id = t.compte_id
GROUP BY cpt.id, cpt.numero_compte, cpt.client_id, cpt.solde;

-- Vue: Dashboard administrateur
CREATE VIEW v_dashboard_admin AS
SELECT 
    (SELECT COUNT(*) FROM clients) as total_clients,
    (SELECT COUNT(*) FROM comptes) as total_comptes,
    (SELECT COUNT(*) FROM transactions) as total_transactions,
    (SELECT COALESCE(SUM(solde), 0) FROM comptes) as solde_total_banque,
    (SELECT COUNT(*) FROM transactions WHERE DATE(date_transaction) = CURDATE()) as transactions_aujourd_hui,
    (SELECT COALESCE(SUM(montant), 0) FROM transactions WHERE DATE(date_transaction) = CURDATE()) as volume_aujourd_hui;

-- 4. PROCÉDURES STOCKÉES
-- =======================

-- Procédure: Effectuer un dépôt
DELIMITER //
CREATE PROCEDURE sp_effectuer_depot(
    IN p_numero_compte VARCHAR(50),
    IN p_montant DECIMAL(15,2),
    IN p_description TEXT
)
BEGIN
    DECLARE v_compte_id BIGINT;
    DECLARE v_solde_actuel DECIMAL(15,2);
    DECLARE v_nouveau_solde DECIMAL(15,2);
    
    -- Vérifier que le compte existe
    SELECT id, solde INTO v_compte_id, v_solde_actuel
    FROM comptes 
    WHERE numero_compte = p_numero_compte;
    
    IF v_compte_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Compte non trouvé';
    END IF;
    
    -- Calculer le nouveau solde
    SET v_nouveau_solde = v_solde_actuel + p_montant;
    
    -- Mettre à jour le solde du compte
    UPDATE comptes 
    SET solde = v_nouveau_solde 
    WHERE id = v_compte_id;
    
    -- Enregistrer la transaction
    INSERT INTO transactions (type_transaction, montant, compte_id, description, solde_apres)
    VALUES ('DEPOT', p_montant, v_compte_id, p_description, v_nouveau_solde);
    
END //
DELIMITER ;

-- Procédure: Effectuer un retrait
DELIMITER //
CREATE PROCEDURE sp_effectuer_retrait(
    IN p_numero_compte VARCHAR(50),
    IN p_montant DECIMAL(15,2),
    IN p_description TEXT
)
BEGIN
    DECLARE v_compte_id BIGINT;
    DECLARE v_solde_actuel DECIMAL(15,2);
    DECLARE v_nouveau_solde DECIMAL(15,2);
    
    -- Vérifier que le compte existe
    SELECT id, solde INTO v_compte_id, v_solde_actuel
    FROM comptes 
    WHERE numero_compte = p_numero_compte;
    
    IF v_compte_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Compte non trouvé';
    END IF;
    
    -- Vérifier que le solde est suffisant
    IF v_solde_actuel < p_montant THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Solde insuffisant';
    END IF;
    
    -- Calculer le nouveau solde
    SET v_nouveau_solde = v_solde_actuel - p_montant;
    
    -- Mettre à jour le solde du compte
    UPDATE comptes 
    SET solde = v_nouveau_solde 
    WHERE id = v_compte_id;
    
    -- Enregistrer la transaction
    INSERT INTO transactions (type_transaction, montant, compte_id, description, solde_apres)
    VALUES ('RETRAIT', p_montant, v_compte_id, p_description, v_nouveau_solde);
    
END //
DELIMITER ;

-- Procédure: Effectuer un virement
DELIMITER //
CREATE PROCEDURE sp_effectuer_virement(
    IN p_compte_source VARCHAR(50),
    IN p_compte_destinataire VARCHAR(50),
    IN p_montant DECIMAL(15,2),
    IN p_description TEXT
)
BEGIN
    DECLARE v_compte_source_id BIGINT;
    DECLARE v_compte_dest_id BIGINT;
    DECLARE v_solde_source DECIMAL(15,2);
    DECLARE v_solde_dest DECIMAL(15,2);
    DECLARE v_nouveau_solde_source DECIMAL(15,2);
    DECLARE v_nouveau_solde_dest DECIMAL(15,2);
    
    -- Vérifier que les comptes existent
    SELECT id, solde INTO v_compte_source_id, v_solde_source
    FROM comptes WHERE numero_compte = p_compte_source;
    
    SELECT id, solde INTO v_compte_dest_id, v_solde_dest
    FROM comptes WHERE numero_compte = p_compte_destinataire;
    
    IF v_compte_source_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Compte source non trouvé';
    END IF;
    
    IF v_compte_dest_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Compte destinataire non trouvé';
    END IF;
    
    -- Vérifier que le solde est suffisant
    IF v_solde_source < p_montant THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Solde insuffisant';
    END IF;
    
    -- Calculer les nouveaux soldes
    SET v_nouveau_solde_source = v_solde_source - p_montant;
    SET v_nouveau_solde_dest = v_solde_dest + p_montant;
    
    -- Transaction atomique
    START TRANSACTION;
    
    -- Mettre à jour les soldes
    UPDATE comptes SET solde = v_nouveau_solde_source WHERE id = v_compte_source_id;
    UPDATE comptes SET solde = v_nouveau_solde_dest WHERE id = v_compte_dest_id;
    
    -- Enregistrer les transactions
    INSERT INTO transactions (type_transaction, montant, compte_id, compte_destinataire_id, description, solde_apres)
    VALUES ('VIREMENT', p_montant, v_compte_source_id, v_compte_dest_id, p_description, v_nouveau_solde_source);
    
    INSERT INTO transactions (type_transaction, montant, compte_id, description, solde_apres)
    VALUES ('DEPOT', p_montant, v_compte_dest_id, CONCAT('Virement reçu: ', p_description), v_nouveau_solde_dest);
    
    COMMIT;
    
END //
DELIMITER ;

-- 5. FONCTIONS UTILES
-- ====================

-- Fonction: Générer un numéro de compte unique
DELIMITER //
CREATE FUNCTION fn_generer_numero_compte(p_type_compte VARCHAR(10))
RETURNS VARCHAR(50)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE v_numero VARCHAR(50);
    DECLARE v_prefix VARCHAR(5);
    DECLARE v_sequence INT;
    
    -- Définir le préfixe selon le type
    IF p_type_compte = 'COURANT' THEN
        SET v_prefix = 'CC';
    ELSE
        SET v_prefix = 'CE';
    END IF;
    
    -- Obtenir le prochain numéro de séquence
    SELECT COALESCE(MAX(CAST(SUBSTRING(numero_compte, 3) AS UNSIGNED)), 0) + 1
    INTO v_sequence
    FROM comptes
    WHERE numero_compte LIKE CONCAT(v_prefix, '%');
    
    -- Générer le numéro complet
    SET v_numero = CONCAT(v_prefix, LPAD(v_sequence, 10, '0'));
    
    RETURN v_numero;
END //
DELIMITER ;

-- 6. TRIGGERS
-- ============

-- Trigger: Générer automatiquement le numéro de compte
DELIMITER //
CREATE TRIGGER tr_comptes_before_insert
BEFORE INSERT ON comptes
FOR EACH ROW
BEGIN
    IF NEW.numero_compte IS NULL OR NEW.numero_compte = '' THEN
        SET NEW.numero_compte = fn_generer_numero_compte(NEW.type_compte);
    END IF;
END //
DELIMITER ;

-- Trigger: Audit des modifications de solde
CREATE TABLE audit_soldes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    compte_id BIGINT NOT NULL,
    ancien_solde DECIMAL(15,2),
    nouveau_solde DECIMAL(15,2),
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    utilisateur VARCHAR(100)
);

DELIMITER //
CREATE TRIGGER tr_comptes_audit_solde
AFTER UPDATE ON comptes
FOR EACH ROW
BEGIN
    IF OLD.solde != NEW.solde THEN
        INSERT INTO audit_soldes (compte_id, ancien_solde, nouveau_solde, utilisateur)
        VALUES (NEW.id, OLD.solde, NEW.solde, USER());
    END IF;
END //
DELIMITER ;

-- 7. DONNÉES DE TEST
-- ==================

-- Insertion d'un administrateur par défaut
INSERT INTO users (username, password, role, client_id) 
VALUES ('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ROLE_ADMIN', NULL);
-- Mot de passe: password (hashé avec BCrypt)

-- Insertion de clients de test
INSERT INTO clients (nom, prenom, date_naissance, sexe, adresse, telephone, courriel, nationalite) VALUES
('Dupont', 'Jean', '1990-05-15', 'M', '123 Rue de la Paix, 75001 Paris', '0123456789', 'jean.dupont@email.com', 'Française'),
('Martin', 'Marie', '1985-03-20', 'F', '456 Avenue des Champs-Élysées, 75008 Paris', '0987654321', 'marie.martin@email.com', 'Française'),
('Durand', 'Pierre', '1988-12-05', 'M', '789 Boulevard Saint-Germain, 75007 Paris', '0567891234', 'pierre.durand@email.com', 'Française');

-- Insertion d'utilisateurs pour les clients
INSERT INTO users (username, password, role, client_id) VALUES
('jean.dupont', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ROLE_CLIENT', 1),
('marie.martin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ROLE_CLIENT', 2),
('pierre.durand', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ROLE_CLIENT', 3);

-- Insertion de comptes de test
INSERT INTO comptes (numero_compte, type_compte, date_creation, solde, client_id) VALUES
('CC0000000001', 'COURANT', '2024-01-15', 1500.00, 1),
('CE0000000001', 'EPARGNE', '2024-01-15', 5000.00, 1),
('CC0000000002', 'COURANT', '2024-02-01', 2300.50, 2),
('CC0000000003', 'COURANT', '2024-02-10', 800.75, 3);

-- Insertion de transactions de test
INSERT INTO transactions (type_transaction, montant, compte_id, description, solde_apres) VALUES
('DEPOT', 1000.00, 1, 'Dépôt initial', 1000.00),
('DEPOT', 500.00, 1, 'Salaire', 1500.00),
('DEPOT', 5000.00, 2, 'Épargne initiale', 5000.00),
('DEPOT', 2500.00, 3, 'Dépôt initial', 2500.00),
('RETRAIT', 200.00, 3, 'Retrait DAB', 2300.00),
('DEPOT', 1000.00, 4, 'Dépôt initial', 1000.00),
('RETRAIT', 200.00, 4, 'Courses', 800.00);

-- 8. REQUÊTES D'ANALYSE UTILES
-- =============================

-- Afficher le résumé de tous les comptes
SELECT 
    c.nom,
    c.prenom,
    cpt.numero_compte,
    cpt.type_compte,
    cpt.solde,
    COUNT(t.id) as nb_transactions
FROM clients c
JOIN comptes cpt ON c.id = cpt.client_id
LEFT JOIN transactions t ON cpt.id = t.compte_id
GROUP BY c.id, cpt.id
ORDER BY c.nom, c.prenom;

-- Afficher les transactions récentes (7 derniers jours)
SELECT 
    c.nom,
    c.prenom,
    cpt.numero_compte,
    t.type_transaction,
    t.montant,
    t.date_transaction,
    t.description
FROM transactions t
JOIN comptes cpt ON t.compte_id = cpt.id
JOIN clients c ON cpt.client_id = c.id
WHERE t.date_transaction >= DATE_SUB(NOW(), INTERVAL 7 DAY)
ORDER BY t.date_transaction DESC;

-- =====================================================
-- FIN DU SCRIPT DE CRÉATION
-- =====================================================

-- Afficher un message de confirmation
SELECT 'Base de données EGA BANK créée avec succès!' as message;