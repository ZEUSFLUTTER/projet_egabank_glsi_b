package com.ega.backend.dto.account;

import com.ega.backend.dto.client.ClientResponse;
import com.ega.backend.dto.transaction.TransactionResponse;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Builder
public record AccountStatementResponse(
    // Informations du compte
    String accountNumber,
    String accountType,
    Instant createdAt,
    BigDecimal currentBalance,
    
    // Informations du client
    ClientResponse owner,
    
    // Période du relevé
    Instant periodStart,
    Instant periodEnd,
    
    // Transactions
    List<TransactionResponse> transactions,
    
    // Statistiques
    BigDecimal totalCredits,
    BigDecimal totalDebits,
    Integer transactionCount,
    
    // Informations de génération
    Instant generatedAt,
    String generatedBy
) {}