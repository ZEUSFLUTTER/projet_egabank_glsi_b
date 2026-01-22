package com.ega.bank.bank_api.dto;

import com.ega.bank.bank_api.entity.Client;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO pour l'entité Client de la société bancaire "Ega"
 * Conforme à l'énoncé avec tous les champs requis
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClientDto {
    
    private Long id;
    
    @NotBlank(message = "Le nom est obligatoire")
    @Size(min = 2, max = 50, message = "Le nom doit contenir entre 2 et 50 caractères")
    private String nom;
    
    @NotBlank(message = "Le prénom est obligatoire")
    @Size(min = 2, max = 50, message = "Le prénom doit contenir entre 2 et 50 caractères")
    private String prenom;
    
    @NotNull(message = "La date de naissance est obligatoire")
    @Past(message = "La date de naissance doit être dans le passé")
    private LocalDate dateNaissance;
    
    @NotNull(message = "Le sexe est obligatoire")
    @Pattern(regexp = "^[MF]$", message = "Le sexe doit être M ou F")
    private String sexe;
    
    @NotBlank(message = "L'adresse est obligatoire")
    @Size(max = 200, message = "L'adresse ne peut pas dépasser 200 caractères")
    private String adresse;
    
    @NotBlank(message = "Le numéro de téléphone est obligatoire")
    @Pattern(regexp = "^\\+?[0-9\\s\\-\\(\\)]{8,20}$", message = "Format de numéro de téléphone invalide")
    private String numeroTelephone;
    
    @NotBlank(message = "Le courriel est obligatoire")
    @Email(message = "Format d'email invalide")
    private String courriel;
    
    @NotBlank(message = "La nationalité est obligatoire")
    @Size(min = 2, max = 50, message = "La nationalité doit contenir entre 2 et 50 caractères")
    private String nationalite;
    
    private LocalDateTime dateCreation;
    
    // Nombre de comptes du client (information utile)
    private int nombreComptes;
}