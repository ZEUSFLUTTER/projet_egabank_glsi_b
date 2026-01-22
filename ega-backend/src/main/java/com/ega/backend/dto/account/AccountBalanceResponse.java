package com.ega.backend.dto.account;

import java.math.BigDecimal;

public record AccountBalanceResponse(
        Long accountId,
        BigDecimal balance
) {}
