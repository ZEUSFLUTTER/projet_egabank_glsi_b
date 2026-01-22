-- =====================================================
-- REQUÊTES UTILES - EGA BANK
-- =====================================================
-- Collection de requêtes SQL pratiques pour l'administration
-- et l'analyse de la base de données EGA BANK
-- =====================================================

USE ega_bank;

-- 1. REQUÊTES DE CONSULTATION
-- ============================

-- Afficher tous les clients avec leurs informations
SELECT 
    id,
    CONCAT(prenom, ' ', nom) as nom_complet,
    courriel,
    telephone,
    DATE_FORMAT(date_naissance, '%d/%m/%Y') as date_naissance,
    CASE sexe WHEN 'M' THEN 'Masculin' ELSE 'Féminin' END as sexe,
    nationalite,
    DATE_FORMAT(created_at, '%d/%m/%Y %H:%i') as date_inscription
FROM clients
ORDER BY nom, prenom;

-- Afficher tous les comptes avec les informations clients
SELECT 
    cpt.numero_compte,
    CONCAT(c.prenom, ' ', c.nom) as proprietaire,
    cpt.type_compte,
    FORMAT(cpt.solde, 2) as solde_euros,
    DATE_FORMAT(cpt.date_creation, '%d/%m/%Y') as date_ouverture,
    COUNT(t.id) as nb_transactions
FROM comptes cpt
JOIN clients c ON cpt.client_id = c.id
LEFT JOIN transactions t ON cpt.id = t.compte_id
GROUP BY cpt.id, c.id
ORDER BY cpt.date_creation DESC;

-- Afficher les transactions récentes (30 derniers jours)
SELECT 
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
WHERE t.date_transaction >= DATE_SUB(NOW(), INTERVAL 30 DAY)
ORDER BY t.date_transaction DESC
LIMIT 50;

-- 2. REQUÊTES STATISTIQUES
-- =========================

-- Dashboard administrateur complet
SELECT 
    'Statistiques Générales' as categorie,
    'Total Clients' as metrique,
    COUNT(*) as valeur
FROM clients
UNION ALL
SELECT 
    'Statistiques Générales',
    'Total Comptes',
    COUNT(*)
FROM comptes
UNION ALL
SELECT 
    'Statistiques Générales',
    'Total Transactions',
    COUNT(*)
FROM transactions
UNION ALL
SELECT 
    'Statistiques Financières',
    'Solde Total Banque (€)',
    FORMAT(SUM(solde), 2)
FROM comptes
UNION ALL
SELECT 
    'Statistiques Aujourd\'hui',
    'Transactions Aujourd\'hui',
    COUNT(*)
FROM transactions
WHERE DATE(date_transaction) = CURDATE()
UNION ALL
SELECT 
    'Statistiques Aujourd\'hui',
    'Volume Aujourd\'hui (€)',
    FORMAT(SUM(montant), 2)
FROM transactions
WHERE DATE(date_transaction) = CURDATE();

-- Répartition des comptes par type
SELECT 
    type_compte,
    COUNT(*) as nombre_comptes,
    FORMAT(AVG(solde), 2) as solde_moyen,
    FORMAT(SUM(solde), 2) as solde_total
FROM comptes
GROUP BY type_compte;

-- Top 10 des clients par solde total
SELECT 
    CONCAT(c.prenom, ' ', c.nom) as client,
    c.courriel,
    COUNT(cpt.id) as nb_comptes,
    FORMAT(SUM(cpt.solde), 2) as solde_total_euros
FROM clients c
JOIN comptes cpt ON c.id = cpt.client_id
GROUP BY c.id
ORDER BY SUM(cpt.solde) DESC
LIMIT 10;

-- Analyse des transactions par type et période
SELECT 
    type_transaction,
    COUNT(*) as nombre,
    FORMAT(SUM(montant), 2) as volume_total,
    FORMAT(AVG(montant), 2) as montant_moyen,
    FORMAT(MIN(montant), 2) as montant_min,
    FORMAT(MAX(montant), 2) as montant_max
FROM transactions
WHERE date_transaction >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY type_transaction;

-- 3. REQUÊTES D'ANALYSE AVANCÉE
-- ==============================

-- Évolution du solde total par mois (12 derniers mois)
SELECT 
    DATE_FORMAT(date_creation, '%Y-%m') as mois,
    COUNT(*) as nouveaux_comptes,
    FORMAT(SUM(solde), 2) as solde_total_mois
FROM comptes
WHERE date_creation >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
GROUP BY DATE_FORMAT(date_creation, '%Y-%m')
ORDER BY mois;

-- Clients les plus actifs (par nombre de transactions)
SELECT 
    CONCAT(c.prenom, ' ', c.nom) as client,
    c.courriel,
    COUNT(t.id) as nb_transactions,
    FORMAT(SUM(CASE WHEN t.type_transaction = 'DEPOT' THEN t.montant ELSE 0 END), 2) as total_depots,
    FORMAT(SUM(CASE WHEN t.type_transaction = 'RETRAIT' THEN t.montant ELSE 0 END), 2) as total_retraits,
    FORMAT(SUM(CASE WHEN t.type_transaction = 'VIREMENT' THEN t.montant ELSE 0 END), 2) as total_virements
FROM clients c
JOIN comptes cpt ON c.id = cpt.client_id
JOIN transactions t ON cpt.id = t.compte_id
WHERE t.date_transaction >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY c.id
HAVING nb_transactions > 0
ORDER BY nb_transactions DESC
LIMIT 10;

-- Analyse des heures de pointe des transactions
SELECT 
    HOUR(date_transaction) as heure,
    COUNT(*) as nb_transactions,
    FORMAT(SUM(montant), 2) as volume_total
FROM transactions
WHERE date_transaction >= DATE_SUB(NOW(), INTERVAL 7 DAY)
GROUP BY HOUR(date_transaction)
ORDER BY heure;

-- 4. REQUÊTES DE CONTRÔLE ET AUDIT
-- =================================

-- Vérifier la cohérence des soldes
SELECT 
    cpt.numero_compte,
    CONCAT(c.prenom, ' ', c.nom) as client,
    FORMAT(cpt.solde, 2) as solde_actuel,
    FORMAT(COALESCE(t.dernier_solde_calcule, 0), 2) as dernier_solde_transaction,
    CASE 
        WHEN ABS(cpt.solde - COALESCE(t.dernier_solde_calcule, 0)) > 0.01 
        THEN '❌ INCOHÉRENT' 
        ELSE '✅ OK' 
    END as statut
FROM comptes cpt
JOIN clients c ON cpt.client_id = c.id
LEFT JOIN (
    SELECT 
        compte_id,
        solde_apres as dernier_solde_calcule
    FROM transactions t1
    WHERE t1.date_transaction = (
        SELECT MAX(t2.date_transaction)
        FROM transactions t2
        WHERE t2.compte_id = t1.compte_id
    )
) t ON cpt.id = t.compte_id;

-- Détecter les transactions suspectes (montants élevés)
SELECT 
    DATE_FORMAT(t.date_transaction, '%d/%m/%Y %H:%i:%s') as date_heure,
    CONCAT(c.prenom, ' ', c.nom) as client,
    cpt.numero_compte,
    t.type_transaction,
    FORMAT(t.montant, 2) as montant_euros,
    t.description,
    '⚠️ MONTANT ÉLEVÉ' as alerte
FROM transactions t
JOIN comptes cpt ON t.compte_id = cpt.id
JOIN clients c ON cpt.client_id = c.id
WHERE t.montant > 5000
ORDER BY t.date_transaction DESC;

-- Comptes avec solde négatif (ne devrait pas arriver)
SELECT 
    cpt.numero_compte,
    CONCAT(c.prenom, ' ', c.nom) as client,
    FORMAT(cpt.solde, 2) as solde_negatif,
    '❌ SOLDE NÉGATIF' as alerte
FROM comptes cpt
JOIN clients c ON cpt.client_id = c.id
WHERE cpt.solde < 0;

-- 5. REQUÊTES DE MAINTENANCE
-- ===========================

-- Nettoyer les anciennes sessions (si table existe)
-- DELETE FROM user_sessions WHERE last_activity < DATE_SUB(NOW(), INTERVAL 30 DAY);

-- Archiver les anciennes transactions (plus de 2 ans)
-- CREATE TABLE transactions_archive LIKE transactions;
-- INSERT INTO transactions_archive SELECT * FROM transactions WHERE date_transaction < DATE_SUB(NOW(), INTERVAL 2 YEAR);
-- DELETE FROM transactions WHERE date_transaction < DATE_SUB(NOW(), INTERVAL 2 YEAR);

-- 6. REQUÊTES POUR RAPPORTS
-- ==========================

-- Rapport mensuel des nouveaux clients
SELECT 
    DATE_FORMAT(created_at, '%Y-%m') as mois,
    COUNT(*) as nouveaux_clients,
    COUNT(CASE WHEN sexe = 'M' THEN 1 END) as hommes,
    COUNT(CASE WHEN sexe = 'F' THEN 1 END) as femmes
FROM clients
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
GROUP BY DATE_FORMAT(created_at, '%Y-%m')
ORDER BY mois DESC;

-- Rapport des comptes inactifs (pas de transaction depuis 90 jours)
SELECT 
    cpt.numero_compte,
    CONCAT(c.prenom, ' ', c.nom) as client,
    c.courriel,
    FORMAT(cpt.solde, 2) as solde,
    DATE_FORMAT(MAX(t.date_transaction), '%d/%m/%Y') as derniere_transaction,
    DATEDIFF(NOW(), MAX(t.date_transaction)) as jours_inactivite
FROM comptes cpt
JOIN clients c ON cpt.client_id = c.id
LEFT JOIN transactions t ON cpt.id = t.compte_id
GROUP BY cpt.id, c.id
HAVING MAX(t.date_transaction) < DATE_SUB(NOW(), INTERVAL 90 DAY) 
    OR MAX(t.date_transaction) IS NULL
ORDER BY jours_inactivite DESC;

-- Rapport de performance par jour de la semaine
SELECT 
    CASE DAYOFWEEK(date_transaction)
        WHEN 1 THEN 'Dimanche'
        WHEN 2 THEN 'Lundi'
        WHEN 3 THEN 'Mardi'
        WHEN 4 THEN 'Mercredi'
        WHEN 5 THEN 'Jeudi'
        WHEN 6 THEN 'Vendredi'
        WHEN 7 THEN 'Samedi'
    END as jour_semaine,
    COUNT(*) as nb_transactions,
    FORMAT(SUM(montant), 2) as volume_total,
    FORMAT(AVG(montant), 2) as montant_moyen
FROM transactions
WHERE date_transaction >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY DAYOFWEEK(date_transaction)
ORDER BY DAYOFWEEK(date_transaction);

-- =====================================================
-- REQUÊTES DE TEST POUR VALIDATION
-- =====================================================

-- Test 1: Vérifier que tous les comptes ont un propriétaire
SELECT 'Test 1: Comptes orphelins' as test,
    CASE WHEN COUNT(*) = 0 THEN '✅ PASS' ELSE '❌ FAIL' END as resultat,
    COUNT(*) as nb_problemes
FROM comptes cpt
LEFT JOIN clients c ON cpt.client_id = c.id
WHERE c.id IS NULL;

-- Test 2: Vérifier que toutes les transactions ont un compte valide
SELECT 'Test 2: Transactions orphelines' as test,
    CASE WHEN COUNT(*) = 0 THEN '✅ PASS' ELSE '❌ FAIL' END as resultat,
    COUNT(*) as nb_problemes
FROM transactions t
LEFT JOIN comptes cpt ON t.compte_id = cpt.id
WHERE cpt.id IS NULL;

-- Test 3: Vérifier l'unicité des emails
SELECT 'Test 3: Emails dupliqués' as test,
    CASE WHEN COUNT(*) = 0 THEN '✅ PASS' ELSE '❌ FAIL' END as resultat,
    COUNT(*) as nb_problemes
FROM (
    SELECT courriel, COUNT(*) as nb
    FROM clients
    GROUP BY courriel
    HAVING COUNT(*) > 1
) duplicates;

-- Test 4: Vérifier l'unicité des numéros de compte
SELECT 'Test 4: Numéros de compte dupliqués' as test,
    CASE WHEN COUNT(*) = 0 THEN '✅ PASS' ELSE '❌ FAIL' END as resultat,
    COUNT(*) as nb_problemes
FROM (
    SELECT numero_compte, COUNT(*) as nb
    FROM comptes
    GROUP BY numero_compte
    HAVING COUNT(*) > 1
) duplicates;

-- =====================================================
-- FIN DES REQUÊTES UTILES
-- =====================================================