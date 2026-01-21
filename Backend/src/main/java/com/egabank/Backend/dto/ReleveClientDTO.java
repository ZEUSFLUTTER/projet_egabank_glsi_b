package com.egabank.Backend.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

/**
 *
 * @author HP
 */
public record ReleveClientDTO(
    @NotNull(message = "L'ID du compte est obligatoire")
    Long compteId,
    
    @NotNull(message = "La date de début est obligatoire")
    LocalDate dateDebut,
    
    @NotNull(message = "La date de fin est obligatoire")
    LocalDate dateFin
) {}