package com.egabank.Backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ClientConnexionDTO(
    @Email(message = "Format d'email invalide")
    @NotBlank(message = "L'email est obligatoire")
    String courriel,
    
    @NotBlank(message = "Le mot de passe est obligatoire")
    String motDePasse
) {}