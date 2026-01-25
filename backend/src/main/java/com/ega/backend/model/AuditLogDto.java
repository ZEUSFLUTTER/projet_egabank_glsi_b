package com.ega.backend.model;

import java.time.LocalDateTime;

// DTO pour les logs d'audit destiné à l'interface admin
public class AuditLogDto {

    private String id;
    private String action;
    private String userId;
    private String userName;
    private String entityType;
    private String entityId;
    private String details;
    private LocalDateTime timestamp;

    // Constructeurs
    public AuditLogDto() {}

    public AuditLogDto(String id, String action, String userId, String userName, String entityType, String entityId, String details, LocalDateTime timestamp) {
        this.id = id;
        this.action = action;
        this.userId = userId;
        this.userName = userName;
        this.entityType = entityType;
        this.entityId = entityId;
        this.details = details;
        this.timestamp = timestamp;
    }

    // Getters et Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getEntityType() {
        return entityType;
    }

    public void setEntityType(String entityType) {
        this.entityType = entityType;
    }

    public String getEntityId() {
        return entityId;
    }

    public void setEntityId(String entityId) {
        this.entityId = entityId;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}