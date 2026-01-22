package com.ega.backend.dto.transaction;

import com.ega.backend.domain.enums.TransactionType;

import java.math.BigDecimal;
import java.time.Instant;

public record TransactionResponse(
        Long id,
        TransactionType type,
        BigDecimal amount,
        Instant operationDate,
        String sourceAccount,
        String destinationAccount
) {}
