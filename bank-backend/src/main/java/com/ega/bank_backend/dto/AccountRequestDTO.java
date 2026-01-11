package com.ega.bank_backend.dto;

import com.ega.bank_backend.entity.AccountType;
import jakarta.validation.constraints.NotNull;

public record AccountRequestDTO(
        @NotNull(message = "Le type de compte est obligatoire") AccountType accountType,
        @NotNull(message = "L'ID du client est obligatoire") Long clientId) {
}
