package com.ega.backend.dto.account;

import java.math.BigDecimal;
import java.time.Instant;

public record AccountResponse(
        Long id,
        String accountNumber,
        String type,
        Instant createdAt,
        BigDecimal balance,
        Long ownerId,
        String ownerFirstName,
        String ownerLastName,
        String ownerEmail
) {}
