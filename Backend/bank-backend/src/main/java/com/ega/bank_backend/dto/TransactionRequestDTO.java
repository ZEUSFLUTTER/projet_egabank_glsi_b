package com.ega.bank_backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record TransactionRequestDTO(
        @NotBlank(message = "Le numéro de compte est obligatoire") String accountNumber,

        @NotNull(message = "Le montant est obligatoire") @DecimalMin(value = "0.01", message = "Le montant doit être supérieur à 0") BigDecimal amount,

        String description,

        String targetAccountNumber // Uniquement pour les virements
) {
}
