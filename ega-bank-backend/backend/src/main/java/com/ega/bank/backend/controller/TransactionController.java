package com.ega.bank.backend.controller;

import com.ega.bank.backend.service.TransactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    // CLIENT / DEPOT
    @PostMapping("/depot")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<Void> depot(
            @RequestParam String numeroCompte,
            @RequestParam Double montant) {

        transactionService.depot(
                numeroCompte,
                BigDecimal.valueOf(montant));

        return ResponseEntity.ok().build();
    }

    // CLIENT / RETRAIT
    @PostMapping("/retrait")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<Void> retrait(
            @RequestParam String numeroCompte,
            @RequestParam Double montant) {

        transactionService.retrait(
                numeroCompte,
                BigDecimal.valueOf(montant));

        return ResponseEntity.ok().build();
    }

    // CLIENT / VIREMENT
    @PostMapping("/virement")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<Void> virement(
            @RequestParam String source,
            @RequestParam String destination,
            @RequestParam Double montant) {

        transactionService.virement(
                source,
                destination,
                BigDecimal.valueOf(montant));

        return ResponseEntity.ok().build();
    }
}