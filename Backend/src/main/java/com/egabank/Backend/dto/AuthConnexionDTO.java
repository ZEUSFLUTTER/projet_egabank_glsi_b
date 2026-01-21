package com.egabank.Backend.dto;

import jakarta.validation.constraints.NotBlank;

public record AuthConnexionDTO(
        @NotBlank(message = "Le nom d'utilisateur est requis")
        String nomUtilisateur,

        @NotBlank(message = "Le mot de passe est requis")
        String motDePasse
) {}