package com.egabank.Backend.dto;

import jakarta.validation.constraints.*;

/**
 *
 * @author HP
 */
public record OperationClientDTO(
    @NotNull(message = "L'ID du compte est obligatoire")
    Long compteId,
    
    @NotNull(message = "Le montant est obligatoire")
    @Positive(message = "Le montant doit être positif")
    Double montant,
    
    String description
) {}