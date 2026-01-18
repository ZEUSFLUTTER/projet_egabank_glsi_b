-- ========================================
-- Script de création de l'utilisateur administrateur
-- ========================================
-- Base de données: ega_bank
-- Username: admin
-- Password: admin123
-- ========================================

-- Optionnel: Supprimer l'admin s'il existe déjà
-- DELETE FROM users WHERE username = 'admin';

-- Créer ou mettre à jour l'utilisateur admin
INSERT INTO users (username, password, email, role, enabled, created_at, updated_at)
VALUES (
    'admin',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'admin@egabank.com',
    'ROLE_ADMIN',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (username) DO UPDATE 
SET 
    password = EXCLUDED.password,
    email = EXCLUDED.email,
    role = EXCLUDED.role,
    enabled = EXCLUDED.enabled,
    updated_at = CURRENT_TIMESTAMP;

-- Vérifier que l'admin a été créé
SELECT id, username, email, role, created_at 
FROM users 
WHERE username = 'admin';
