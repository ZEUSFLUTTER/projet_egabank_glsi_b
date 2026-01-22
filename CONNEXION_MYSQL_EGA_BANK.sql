-- =====================================================
-- CONNEXION ET REQUÊTES SQL - EGA BANK PROJECT
-- =====================================================
-- Base de données: ega_bank
-- Serveur: localhost:3306
-- Utilisateur: root
-- =====================================================

-- 1. CONNEXION À LA BASE DE DONNÉES
-- ==================================
USE ega_bank;

-- Vérifier la connexion
SELECT 'Connexion réussie à EGA BANK !' as message, NOW() as date_connexion;

-- 2. REQUÊTES DE VÉRIFICATION DU PROJET
-- =====================================

-- Afficher toutes les tables du projet
SHOW TABLES;

-- Vérifier la structure des tables principales
DESCRIBE clients;
DESCRIBE users;
DESCRIBE comptes;
DESCRIBE transactions;

-- 3. REQUÊTES D'AUTHENTIFICATION (LOGIN)
-- ======================================

-- Vérifier l'admin par défaut
SELECT 
    id,
    username,
    role,
    enabled,
    'Admin par défaut' as description
FROM users 
WHERE username = 'admin' AND role = 'ROLE_ADMIN';

-- Vérifier tous les utilisateurs disponibles
SELECT 
    u.id,
    u.username,
    u.role,
    u.enabled,
    CASE 
        WHEN c.id IS NOT NULL THEN CONCAT(c.prenom, ' ', c.nom)
        ELSE 'Administrateur'
    END as nom_complet,
    CASE 
        WHEN c.id IS NOT NULL THEN c.courriel
        ELSE 'admin@egabank.com'
    END as email
FROM users u
LEFT JOIN clients c ON u.client_id = c.id
ORDER BY u.role DESC, u.username;

-- 4. REQUÊTES CLIENTS ET COMPTES
-- ==============================

-- Afficher tous les clients avec leurs comptes
SELECT 
    c.id as client_id,
    CONCAT(c.prenom, ' ', c.nom) as nom_complet,
    c.courriel,
    c.telephone,
    DATE_FORMAT(c.date_naissance, '%d/%m/%Y') as date_naissance,
    COUNT(cpt.id) as nombre_comptes,
    COALESCE(SUM(cpt.solde), 0) as solde_total
FROM clients c
LEFT JOIN comptes cpt ON c.id = cpt.client_id
GROUP BY c.id
ORDER BY c.nom, c.prenom;

-- Détail des comptes par client
SELECT 
    CONCAT(c.prenom, ' ', c.nom) as proprietaire,
    cpt.numero_compte,
    cpt.type_compte,
    FORMAT(cpt.solde, 2) as solde_euros,
    DATE_FORMAT(cpt.date_creation, '%d/%m/%Y') as date_ouverture
FROM comptes cpt
JOIN clients c ON cpt.client_id = c.id
ORDER BY c.nom, cpt.type_compte;

-- 5. REQUÊTES TRANSACTIONS
-- ========================

-- Historique complet des transactions
SELECT 
    t.id,
    DATE_FORMAT(t.date_transaction, '%d/%m/%Y %H:%i:%s') as date_heure,
    CONCAT(c.prenom, ' ', c.nom) as client,
    cpt.numero_compte,
    t.type_transaction,
    FORMAT(t.montant, 2) as montant_euros,
    FORMAT(t.solde_apres, 2) as solde_apres_euros,
    t.description
FROM transactions t
JOIN comptes cpt ON t.compte_id = cpt.id
JOIN clients c ON cpt.client_id = c.id
ORDER BY t.date_transaction DESC;

-- Transactions par type
SELECT 
    t.type_transaction,
    COUNT(*) as nombre,
    FORMAT(SUM(t.montant), 2) as volume_total,
    FORMAT(AVG(t.montant), 2) as montant_moyen
FROM transactions t
GROUP BY t.type_transaction
ORDER BY volume_total DESC;

-- 6. DASHBOARD ADMINISTRATEUR
-- ===========================

-- Statistiques générales (pour dashboard admin)
SELECT 
    (SELECT COUNT(*) FROM clients) as total_clients,
    (SELECT COUNT(*) FROM comptes) as total_comptes,
    (SELECT COUNT(*) FROM transactions) as total_transactions,
    (SELECT FORMAT(SUM(solde), 2) FROM comptes) as solde_total_banque,
    (SELECT COUNT(*) FROM transactions WHERE DATE(date_transaction) = CURDATE()) as transactions_aujourd_hui;

-- Vue dashboard (utilise la vue créée)
SELECT * FROM v_dashboard_admin;

-- 7. REQUÊTES POUR TESTS DE CONNEXION SPRING BOOT
-- ================================================

-- Test de connexion pour l'application (admin)
SELECT 
    u.id,
    u.username,
    u.password,
    u.role,
    u.enabled,
    u.account_non_expired,
    u.account_non_locked,
    u.credentials_non_expired
FROM users u 
WHERE u.username = 'admin';

-- Test de connexion pour client
SELECT 
    u.id,
    u.username,
    u.password,
    u.role,
    u.client_id,
    c.nom,
    c.prenom,
    c.courriel
FROM users u
LEFT JOIN clients c ON u.client_id = c.id
WHERE u.username = 'jean.dupont';

-- 8. REQUÊTES DE VALIDATION DES DONNÉES
-- =====================================

-- Vérifier l'intégrité des données
SELECT 'Test 1: Clients sans utilisateur' as test,
    COUNT(*) as problemes
FROM clients c
LEFT JOIN users u ON c.id = u.client_id
WHERE u.id IS NULL;

SELECT 'Test 2: Comptes sans client' as test,
    COUNT(*) as problemes
FROM comptes cpt
LEFT JOIN clients c ON cpt.client_id = c.id
WHERE c.id IS NULL;

SELECT 'Test 3: Transactions sans compte' as test,
    COUNT(*) as problemes
FROM transactions t
LEFT JOIN comptes cpt ON t.compte_id = cpt.id
WHERE cpt.id IS NULL;

-- 9. REQUÊTES POUR OPÉRATIONS BANCAIRES
-- =====================================

-- Effectuer un dépôt (exemple)
-- CALL sp_effectuer_depot('CC0000000001', 100.00, 'Test dépôt via SQL');

-- Effectuer un retrait (exemple)
-- CALL sp_effectuer_retrait('CC0000000001', 50.00, 'Test retrait via SQL');

-- Effectuer un virement (exemple)
-- CALL sp_effectuer_virement('CC0000000001', 'CC0000000002', 25.00, 'Test virement via SQL');

-- 10. REQUÊTES DE RECHERCHE SPÉCIFIQUES
-- =====================================

-- Rechercher un client par email
SELECT 
    c.*,
    u.username,
    u.role
FROM clients c
LEFT JOIN users u ON c.id = u.client_id
WHERE c.courriel = 'jean.dupont@email.com';

-- Rechercher un compte par numéro
SELECT 
    cpt.*,
    CONCAT(c.prenom, ' ', c.nom) as proprietaire,
    c.courriel
FROM comptes cpt
JOIN clients c ON cpt.client_id = c.id
WHERE cpt.numero_compte = 'CC0000000001';

-- Rechercher transactions d'un compte
SELECT 
    t.*,
    FORMAT(t.montant, 2) as montant_formate,
    FORMAT(t.solde_apres, 2) as solde_formate
FROM transactions t
JOIN comptes cpt ON t.compte_id = cpt.id
WHERE cpt.numero_compte = 'CC0000000001'
ORDER BY t.date_transaction DESC;

-- =====================================================
-- COMMANDES DE CONNEXION DIRECTE
-- =====================================================

/*
CONNEXION VIA LIGNE DE COMMANDE:
mysql -h localhost -P 3306 -u root -p

CONNEXION VIA XAMPP:
C:\xampp\mysql\bin\mysql.exe -h localhost -P 3306 -u root -p

PUIS EXÉCUTER:
USE ega_bank;
SOURCE CONNEXION_MYSQL_EGA_BANK.sql;
*/

-- =====================================================
-- INFORMATIONS DE CONNEXION POUR L'APPLICATION
-- =====================================================

/*
SPRING BOOT (application.properties):
spring.datasource.url=jdbc:mysql://localhost:3306/ega_bank
spring.datasource.username=root
spring.datasource.password=
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

COMPTES DE TEST:
- Admin: username=admin, password=password
- Client 1: username=jean.dupont, password=password
- Client 2: username=marie.martin, password=password
- Client 3: username=pierre.durand, password=password
*/

SELECT 'Script de connexion EGA BANK terminé !' as message;