package com.ega.backend.dto.transaction;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record TransferRequest(
        @NotBlank String fromAccount,
        @NotBlank String toAccount,
        @Positive BigDecimal amount
) {}
