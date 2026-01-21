package com.egabank.Backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChangementMotDePasseDTO(
    @NotBlank(message = "L'ancien mot de passe est obligatoire")
    String ancienMotDePasse,
    
    @NotBlank(message = "Le nouveau mot de passe est obligatoire")
    @Size(min = 6, message = "Le nouveau mot de passe doit contenir au moins 6 caractères")
    String nouveauMotDePasse
) {}