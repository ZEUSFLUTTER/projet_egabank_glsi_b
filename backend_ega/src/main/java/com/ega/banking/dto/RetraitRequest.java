package com.ega.banking.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RetraitRequest {
    
    @NotNull(message = "L'ID du compte est obligatoire")
    private Long compteId;
    
    @NotNull(message = "Le montant est obligatoire")
    @DecimalMin(value = "0.01", message = "Le montant doit être supérieur à 0")
    private BigDecimal montant;
    
    @Size(max = 255, message = "La description ne doit pas dépasser 255 caractères")
    private String description;
}
