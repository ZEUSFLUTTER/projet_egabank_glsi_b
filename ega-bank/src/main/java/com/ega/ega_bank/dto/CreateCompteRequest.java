package com.ega.ega_bank.dto;

import com.ega.ega_bank.model.TypeCompte;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateCompteRequest {

    @NotNull(message = "Le type de compte est obligatoire")
    private TypeCompte type;

    @NotNull(message = "Le client ID est obligatoire")
    private Long clientId;

    // Pour compte courant
    @DecimalMin(value = "0.0", message = "Le découvert autorisé ne peut pas être négatif")
    private BigDecimal decouvertAutorise;

    // Pour compte épargne
    @DecimalMin(value = "0.0", message = "Le taux d'intérêt ne peut pas être négatif")
    @DecimalMax(value = "100.0", message = "Le taux d'intérêt ne peut pas dépasser 100")
    private BigDecimal tauxInteret;
}
