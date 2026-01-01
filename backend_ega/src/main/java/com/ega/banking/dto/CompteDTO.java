package com.ega.banking.dto;

import com.ega.banking.model.TypeCompte;
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

    @NotNull(message = "Le client est obligatoire")
    private Long clientId;

    private String clientNom;

    private String clientPrenom;

    private BigDecimal solde;

    private LocalDateTime dateCreation;

    // Champs spécifiques CompteEpargne
    private BigDecimal tauxInteret;

    // Champs spécifiques CompteCourant
    private BigDecimal decouvertAutorise;
}
