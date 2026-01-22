package com.ega.backend.dto.transaction;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record GenericTransactionRequest(
        @NotNull String type,
        @NotNull BigDecimal amount,
        String accountNumber,
        String fromAccount,
        String toAccount
) {}
