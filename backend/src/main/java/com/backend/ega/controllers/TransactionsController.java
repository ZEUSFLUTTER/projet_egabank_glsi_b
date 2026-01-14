package com.backend.ega.controllers;

import com.backend.ega.entities.Transaction;
import com.backend.ega.services.TransactionsService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionsController {

    private final TransactionsService transactionsService;

    public TransactionsController(TransactionsService transactionsService) {
        this.transactionsService = transactionsService;
    }

    @GetMapping
    public List<Transaction> getAllTransactions() {
        return transactionsService.getAllTransactions();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Transaction> getTransactionById(@PathVariable Long id) {
        return transactionsService.getTransactionById(id);
    }

    @PostMapping
    public ResponseEntity<Transaction> createTransaction(@Valid @RequestBody Transaction transaction) {
        return transactionsService.createTransaction(transaction);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable Long id) {
        return transactionsService.deleteTransaction(id);
    }

    @GetMapping("/account/{accountId}")
    public List<Transaction> getTransactionsByAccount(@PathVariable Long accountId) {
        return transactionsService.getTransactionsByAccount(accountId);
    }
    
    /**
     * Get transactions for an account within a specific period
     * @param accountId The account ID
     * @param startDate Start date in ISO format (e.g., 2024-01-01T00:00:00)
     * @param endDate End date in ISO format (e.g., 2024-12-31T23:59:59)
     * @return List of transactions within the period
     */
    @GetMapping("/account/{accountId}/period")
    public ResponseEntity<List<Transaction>> getTransactionsByAccountAndPeriod(
            @PathVariable Long accountId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return transactionsService.getTransactionsByAccountAndPeriod(accountId, startDate, endDate);
    }
}
