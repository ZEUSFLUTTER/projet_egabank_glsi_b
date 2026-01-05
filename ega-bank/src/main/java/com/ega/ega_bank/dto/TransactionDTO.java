package com.ega.ega_bank.dto;

import com.ega.ega_bank.model.TypeTransaction;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionDTO {

    private Long id;
    private TypeTransaction typeTransaction;

    @NotNull(message = "Le montant est obligatoire")
    @DecimalMin(value = "0.01", message = "Le montant doit être supérieur à 0")
    private BigDecimal montant;

    private LocalDateTime dateTransaction;
    private String description;
    private Long compteId;
    private String numeroCompte;
    private String compteDestinataire;
}
