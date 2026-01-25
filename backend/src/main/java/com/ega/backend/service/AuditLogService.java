package com.ega.backend.service;

import com.ega.backend.model.AuditLog;
import com.ega.backend.model.AuditLogDto; // <--- Importe le DTO
import com.ega.backend.model.Client;
import com.ega.backend.repository.AuditLogRepository;
import com.ega.backend.repository.ClientRepository; // <--- Ajout
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class AuditLogService {

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Autowired
    private ClientRepository clientRepository; // <--- Injection du ClientRepository

    // ✅ Méthode mise à jour pour renvoyer des DTOs enrichis
    public List<AuditLogDto> findAllAsDto() {
        List<AuditLog> rawLogs = auditLogRepository.findAll();
        List<AuditLogDto> enrichedLogs = new ArrayList<>();

        for (AuditLog log : rawLogs) {
            // Récupérer les informations enrichies
            String userName = getUserNameFromLog(log);
            String entityType = getEntityTypeFromLog(log);
            String entityId = getEntityIdFromLog(log);

            // Créer le DTO enrichi
            AuditLogDto dto = new AuditLogDto(
                log.getId(),
                log.getAction(),
                log.getUserId(),
                userName,
                entityType,
                entityId,
                log.getDetails(),
                log.getTimestamp()
            );

            enrichedLogs.add(dto);
        }

        return enrichedLogs;
    }

    public List<AuditLog> findAll() {
        // Ancienne méthode, si encore utilisée ailleurs
        return auditLogRepository.findAll();
    }

    public AuditLog save(AuditLog log) {
        return auditLogRepository.save(log);
    }

    // ✅ Méthode mise à jour : Logguer une action avec enrichissement
    public void logAction(String action, String userId, String userName, String entityType, String entityId, String details) {
        AuditLog logEntry = new AuditLog();
        logEntry.setAction(action);
        logEntry.setUserId(userId);

        // ✅ Récupérer le userName depuis la base de données si non fourni
        if (userName == null || userName.isEmpty()) {
            Optional<Client> clientOpt = clientRepository.findById(userId);
            if (clientOpt.isPresent()) {
                Client client = clientOpt.get();
                logEntry.setUserName(client.getPrenom() + " " + client.getNom()); // Exemple
            } else {
                logEntry.setUserName("Utilisateur Inconnu (ID: " + userId + ")");
            }
        } else {
            logEntry.setUserName(userName);
        }

        logEntry.setEntityType(entityType);
        logEntry.setEntityId(entityId);
        logEntry.setDetails(details);
        logEntry.setTimestamp(LocalDateTime.now());

        auditLogRepository.save(logEntry);
    }

    // Méthodes d'enrichissement (inchangées)
    private String getUserNameFromLog(AuditLog log) {
        String userId = log.getUserId();
        String email = log.getEmail();

        if (userId != null) {
            Optional<Client> clientOpt = clientRepository.findById(userId);
            if (clientOpt.isPresent()) {
                Client client = clientOpt.get();
                return client.getPrenom() + " " + client.getNom();
            }
        } else if (email != null) {
            Optional<Client> clientOpt = clientRepository.findByEmail(email);
            if (clientOpt.isPresent()) {
                Client client = clientOpt.get();
                return client.getPrenom() + " " + client.getNom();
            }
        }
        return "Utilisateur Inconnu";
    }

    private String getEntityTypeFromLog(AuditLog log) {
        String action = log.getAction();
        if (action != null) {
            if (action.startsWith("CREATE_COMPTE") || action.startsWith("GET_COMPTE") || action.startsWith("UPDATE_COMPTE") || action.startsWith("DELETE_COMPTE")) {
                return "Compte";
            } else if (action.startsWith("CREATE_CLIENT") || action.startsWith("GET_CLIENT") || action.startsWith("UPDATE_CLIENT") || action.startsWith("DELETE_CLIENT")) {
                return "Client";
            } else if (action.startsWith("DEPOT") || action.startsWith("RETRAIT") || action.startsWith("VIREMENT")) {
                return "Transaction";
            }
        }
        return "Autre";
    }

    private String getEntityIdFromLog(AuditLog log) {
        String details = log.getDetails();
        if (details != null) {
            java.util.regex.Pattern pattern = java.util.regex.Pattern.compile("(ACC|CLI|TXN)[0-9A-Z]+");
            java.util.regex.Matcher matcher = pattern.matcher(details);
            if (matcher.find()) {
                 return matcher.group();
            }
        }
        return "-";
    }
}