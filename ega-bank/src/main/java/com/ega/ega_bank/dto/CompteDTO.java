package com.ega.ega_bank.dto;

import com.ega.ega_bank.model.TypeCompte;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompteDTO {

    private Long id;
    private String numeroCompte;

    @NotNull(message = "Le type de compte est obligatoire")
    private TypeCompte type;

    private LocalDateTime dateCreation;

    @NotNull(message = "Le solde ne peut pas être null")
    @DecimalMin(value = "0.0", message = "Le solde ne peut pas être négatif")
    private BigDecimal solde;

    @NotNull(message = "Le client ID est obligatoire")
    private Long clientId;

    private String clientNom;
    private String clientPrenom;

    // Pour compte courant
    private BigDecimal decouvertAutorise;

    // Pour compte épargne
    private BigDecimal tauxInteret;
}
