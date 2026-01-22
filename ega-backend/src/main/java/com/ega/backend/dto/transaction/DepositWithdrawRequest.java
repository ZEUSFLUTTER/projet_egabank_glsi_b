package com.ega.backend.dto.transaction;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record DepositWithdrawRequest(
        @NotBlank String accountNumber,
        @Positive BigDecimal amount
) {}
