package com.ega.banque.controller;

import com.ega.banque.dto.DepotRequest;
import com.ega.banque.dto.RetraitRequest;
import com.ega.banque.dto.VirementRequest;
import com.ega.banque.entity.Transaction;
import com.ega.banque.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin("*")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    // =========================
    // DÉPÔT
    // =========================
    @PostMapping("/depot")
    public ResponseEntity<Transaction> effectuerDepot(
            @Valid @RequestBody DepotRequest request) {
        // Utiliser le compteId depuis le body ou le path
        Long compteId = request.getCompteId();

        Transaction transaction = transactionService.effectuerDepot(compteId, request.getMontant());
        return ResponseEntity.ok(transaction);
    }

    // =========================
    // RETRAIT
    // =========================
    @PostMapping("/retrait")
    public ResponseEntity<Transaction> effectuerRetrait(
            @Valid @RequestBody RetraitRequest request) {
        Long compteId = request.getCompteId();

        Transaction transaction = transactionService.effectuerRetrait(compteId, request.getMontant());
        return ResponseEntity.ok(transaction);
    }

    // =========================
    // VIREMENT
    // =========================
    @PostMapping("/virement")
    public ResponseEntity<Transaction> effectuerVirement(
            @Valid @RequestBody VirementRequest request) {
        Long compteSourceId = request.getCompteSourceId();
        Long compteDestinationId = request.getCompteDestinationId();

        Transaction transaction = transactionService.effectuerVirement(
                compteSourceId, compteDestinationId, request.getMontant());
        return ResponseEntity.ok(transaction);
    }

    // =========================
    // HISTORIQUE PAR PERIODE
    // =========================
    @GetMapping("/compte/{compteId}")
    public ResponseEntity<List<Transaction>> getTransactionsByCompte(
            @PathVariable Long compteId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime debut,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fin) {
        if (debut != null && fin != null) {
            return ResponseEntity.ok(
                    transactionService.getTransactionsByCompteAndPeriode(
                            compteId, debut, fin));
        } else {
            return ResponseEntity.ok(
                    transactionService.getTransactionsByCompte(compteId));
        }
    }
}
