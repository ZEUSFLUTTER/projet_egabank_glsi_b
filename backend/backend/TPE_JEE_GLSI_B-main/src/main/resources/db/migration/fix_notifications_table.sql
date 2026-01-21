-- Script de migration pour corriger la table notifications
-- Si la colonne date_creation existe, la renommer en date_notification
-- Si la colonne date_notification n'existe pas, la créer

-- Vérifier et renommer si nécessaire (à exécuter manuellement si besoin)
-- ALTER TABLE notifications CHANGE COLUMN date_creation date_notification DATETIME NOT NULL;

-- Ou créer la colonne si elle n'existe pas
-- ALTER TABLE notifications ADD COLUMN date_notification DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;
