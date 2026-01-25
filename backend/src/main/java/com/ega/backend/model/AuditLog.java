package com.ega.backend.model;

import lombok.Data; // <--- Importe Lombok Data
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Data  // ✅ Génère automatiquement les getters/setters
@Document(collection = "audit_logs")
public class AuditLog {

    @Id
    private String id;

    @NotNull(message = "L'utilisateur est obligatoire")
    private String userId;

    @NotNull(message = "L'action est obligatoire")
    private String action;

    private String email;        // ✅ Ajouté
    private Boolean success;     // ✅ Ajouté
    private String description;  // ✅ Ajouté
    private String details;
    private String ipAdresse;
    private String userAgent;
    private LocalDateTime timestamp = LocalDateTime.now();

    // ✅ Ajout des champs pour la solution 2
    private String userName; // Le nom de l'utilisateur (recherché via userId)
    private String entityType; // Ex: "Client", "Compte", "Transaction"
    private String entityId;   // L'ID de l'entité concernée
    // Les getters et setters sont générés automatiquement par @Data
}