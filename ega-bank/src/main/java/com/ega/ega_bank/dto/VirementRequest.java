package com.ega.ega_bank.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VirementRequest {

    @NotBlank(message = "Le numéro de compte source est obligatoire")
    private String compteSource;

    @NotBlank(message = "Le numéro de compte destinataire est obligatoire")
    private String compteDestinataire;

    @NotNull(message = "Le montant est obligatoire")
    @DecimalMin(value = "0.01", message = "Le montant doit être supérieur à 0")
    private BigDecimal montant;

    private String description;
}
