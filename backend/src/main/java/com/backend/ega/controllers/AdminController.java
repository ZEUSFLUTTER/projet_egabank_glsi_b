package com.backend.ega.controllers;

import com.backend.ega.entities.Transaction;
import com.backend.ega.services.TransactionsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Admin-specific endpoints for managing clients and viewing their data
 */
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final TransactionsService transactionsService;

    public AdminController(TransactionsService transactionsService) {
        this.transactionsService = transactionsService;
    }

    /**
     * Get all transactions for a specific client
     * Admins can use this to view a client's complete transaction history across all accounts
     * 
     * @param clientId The ID of the client
     * @return List of all transactions for the client
     */
    @GetMapping("/clients/{clientId}/transactions")
    public ResponseEntity<List<Transaction>> getClientTransactions(@PathVariable Long clientId) {
        List<Transaction> transactions = transactionsService.getTransactionsByClient(clientId);
        return ResponseEntity.ok(transactions);
    }
}
