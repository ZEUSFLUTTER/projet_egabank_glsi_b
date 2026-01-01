package com.ega.banking.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VirementRequest {
    
    @NotNull(message = "L'ID du compte source est obligatoire")
    private Long compteSourceId;
    
    @NotNull(message = "L'ID du compte destination est obligatoire")
    private Long compteDestinationId;
    
    @NotNull(message = "Le montant est obligatoire")
    @DecimalMin(value = "0.01", message = "Le montant doit être supérieur à 0")
    private BigDecimal montant;
    
    @Size(max = 255, message = "La description ne doit pas dépasser 255 caractères")
    private String description;
}
