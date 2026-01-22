package com.ega.backend.dto.account;

import jakarta.validation.constraints.DecimalMin;
import java.math.BigDecimal;

public record AccountCreateRequest(
        Long ownerId, // Peut être null pour les clients (récupéré automatiquement)
        String type, // Validation manuelle dans le controller
        @DecimalMin(value = "0.0", message = "Le solde initial doit être positif ou nul")
        BigDecimal initialBalance
) {}
