package com.ega.bank.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VirementRequest {
    @NotNull(message = "Le compte source est obligatoire")
    private Long compteSourceId;
    
    @NotBlank(message = "Le compte bénéficiaire est obligatoire")
    private String compteBeneficiaire; // Numéro IBAN
    
    @NotNull(message = "Le montant est obligatoire")
    @DecimalMin(value = "0.01", message = "Le montant doit être supérieur à 0")
    private BigDecimal montant;
    
    @Size(max = 200, message = "La description ne peut pas dépasser 200 caractères")
    private String description;
}