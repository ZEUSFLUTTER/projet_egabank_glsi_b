package com.ega.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Document(collection = "clients")
public class Client {

    @Id
    private String id;

    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    @NotBlank(message = "Le prénom est obligatoire")
    private String prenom;

    @NotNull(message = "La date de naissance est obligatoire")
    private LocalDate dateNaissance;

    @NotBlank(message = "Le sexe est obligatoire")
    private String sexe;

    @NotBlank(message = "L'adresse est obligatoire")
    private String adresse;

    @NotBlank(message = "Le téléphone est obligatoire")
    private String telephone;

    @Email(message = "L'email doit être valide")
    @NotBlank(message = "L'email est obligatoire")
    private String email;

    @NotBlank(message = "La nationalité est obligatoire")
    private String nationalite;

    @NotBlank(message = "Le mot de passe est obligatoire")
    private String password;

    @NotNull(message = "Le rôle est obligatoire")
    private String role; // CLIENT ou ADMIN

    // ✅ Ajouts pour la sécurité et l'audit
    private Boolean isActive = true;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime lastLoginAt;
    private Integer failedLoginAttempts = 0;
    private LocalDateTime lockedUntil;
    private String statutKYC = "EN_ATTENTE"; // EN_ATTENTE, VALIDE, REFUSE

    // ✅ Méthodes explicites pour éviter les erreurs de compilation
    public Boolean getActive() {
        return isActive;
    }

    public void setActive(Boolean active) {
        this.isActive = active;
    }

    public Boolean isActive() {
        return isActive != null && isActive;
    }
}