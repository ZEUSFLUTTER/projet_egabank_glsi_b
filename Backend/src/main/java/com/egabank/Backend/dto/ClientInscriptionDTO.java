package com.egabank.Backend.dto;

import com.egabank.Backend.entity.enums.Sexe;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

public record ClientInscriptionDTO(
    @NotBlank(message = "Le nom est obligatoire")
    String nom,
    
    @NotBlank(message = "Le prénom est obligatoire")
    String prenom,
    
    @NotNull(message = "La date de naissance est obligatoire")
    LocalDate dateNaissance,
    
    @NotNull(message = "Le sexe est obligatoire")
    Sexe sexe,
    
    @NotBlank(message = "L'adresse est obligatoire")
    String adresse,
    
    @NotBlank(message = "Le numéro de téléphone est obligatoire")
    String numeroTelephone,
    
    @Email(message = "Format d'email invalide")
    @NotBlank(message = "L'email est obligatoire")
    String courriel,
    
    @NotBlank(message = "La nationalité est obligatoire")
    String nationalite,
    
    @NotBlank(message = "Le mot de passe est obligatoire")
    @Size(min = 6, message = "Le mot de passe doit contenir au moins 6 caractères")
    String motDePasse
) {}