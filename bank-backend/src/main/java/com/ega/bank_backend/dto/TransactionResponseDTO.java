package com.ega.bank_backend.dto;

import com.ega.bank_backend.entity.Transaction;
import com.ega.bank_backend.entity.TransactionType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO de réponse pour les transactions.
 * Évite la récursion infinie en ne contenant que des données sérialisables
 * simples.
 */
public record TransactionResponseDTO(
        Long id,
        TransactionType type,
        BigDecimal amount,
        LocalDateTime timestamp,
        String description,
        String accountNumber,
        String targetAccountNumber,
        String ownerName) {
    /**
     * Convertit une entité Transaction en DTO.
     * Mapping manuel propre et explicite.
     */
    public static TransactionResponseDTO fromEntity(Transaction transaction) {
        String accountNum = null;
        String owner = null;

        if (transaction.getAccount() != null) {
            accountNum = transaction.getAccount().getAccountNumber();
            if (transaction.getAccount().getOwner() != null) {
                owner = transaction.getAccount().getOwner().getFirstName() + " "
                        + transaction.getAccount().getOwner().getLastName();
            }
        }

        return new TransactionResponseDTO(
                transaction.getId(),
                transaction.getType(),
                transaction.getAmount(),
                transaction.getTimestamp(),
                transaction.getDescription(),
                accountNum,
                transaction.getTargetAccountNumber(),
                owner);
    }
}
