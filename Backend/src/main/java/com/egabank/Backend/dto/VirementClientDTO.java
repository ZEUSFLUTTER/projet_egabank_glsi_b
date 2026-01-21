package com.egabank.Backend.dto;

import jakarta.validation.constraints.*;

/**
 *
 * @author HP
 */
public record VirementClientDTO(
    @NotNull(message = "L'ID du compte source est obligatoire")
    Long compteSourceId,
    
    Long compteDestinationId, // Pour virement interne
    
    String numeroCompteDestination, // Pour virement externe
    
    @NotNull(message = "Le montant est obligatoire")
    @Positive(message = "Le montant doit être positif")
    Double montant,
    
    String description
) {}