package com.ega.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OperationDTO {
    @NotNull(message = "L'ID du compte est obligatoire")
    private Long compteId;
    
    @NotNull(message = "Le montant est obligatoire")
    @DecimalMin(value = "0.01", message = "Le montant doit être supérieur à 0")
    @Digits(integer = 15, fraction = 2, message = "Le montant doit avoir au maximum 15 chiffres avant la virgule et 2 après")
    private BigDecimal montant;
    
    @Size(max = 500, message = "La description ne peut pas dépasser 500 caractères")
    private String description;
}

