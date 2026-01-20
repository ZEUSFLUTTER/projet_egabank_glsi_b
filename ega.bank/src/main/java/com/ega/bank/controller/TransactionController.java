package com.ega.bank.controller;

import com.ega.bank.dto.TransactionDTO;
import com.ega.bank.entity.TypeTransaction;
import com.ega.bank.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * Controller pour la gestion des transactions
 */
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class TransactionController {
    
    private final TransactionService transactionService;
    
    // ==================== ENDPOINTS ADMIN ====================
    
    /**
     * Récupère toutes les transactions d'un compte
     * GET /api/admin/comptes/{compteId}/transactions
     */
    @GetMapping("/admin/comptes/{compteId}/transactions")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<TransactionDTO>> getTransactionsByCompte(@PathVariable Long compteId) {
        List<TransactionDTO> transactions = transactionService.getTransactionsByCompte(compteId);
        return ResponseEntity.ok(transactions);
    }
    
    /**
     * Récupère les transactions d'un compte pour une période donnée
     * GET /api/admin/comptes/{compteId}/transactions/periode
     * Paramètres: dateDebut, dateFin (format: yyyy-MM-dd)
     */
    @GetMapping("/admin/comptes/{compteId}/transactions/periode")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<TransactionDTO>> getTransactionsByPeriode(
            @PathVariable Long compteId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateDebut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFin
    ) {
        List<TransactionDTO> transactions = transactionService.getTransactionsByPeriode(compteId, dateDebut, dateFin);
        return ResponseEntity.ok(transactions);
    }
    
    // ==================== ENDPOINTS CLIENT ====================
    
    /**
     * Récupère toutes les transactions d'un compte (client)
     * GET /api/client/comptes/{compteId}/transactions
     */
    @GetMapping("/client/comptes/{compteId}/transactions")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<List<TransactionDTO>> getMesTransactions(@PathVariable Long compteId) {
        // TODO: Vérifier que le compte appartient bien au client connecté
        List<TransactionDTO> transactions = transactionService.getTransactionsByCompte(compteId);
        return ResponseEntity.ok(transactions);
    }
    
    /**
     * Récupère les transactions d'un compte pour une période donnée (client)
     * GET /api/client/comptes/{compteId}/transactions/periode
     * Paramètres: dateDebut, dateFin (format: yyyy-MM-dd)
     */
    @GetMapping("/client/comptes/{compteId}/transactions/periode")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<List<TransactionDTO>> getMesTransactionsPeriode(
            @PathVariable Long compteId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateDebut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFin
    ) {
        // TODO: Vérifier que le compte appartient bien au client connecté
        List<TransactionDTO> transactions = transactionService.getTransactionsByPeriode(compteId, dateDebut, dateFin);
        return ResponseEntity.ok(transactions);
    }
    
    /**
     * Récupère les transactions par type
     * GET /api/client/comptes/{compteId}/transactions/type/{type}
     */
    @GetMapping("/client/comptes/{compteId}/transactions/type/{type}")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<List<TransactionDTO>> getMesTransactionsParType(
            @PathVariable Long compteId,
            @PathVariable TypeTransaction type
    ) {
        List<TransactionDTO> transactions = transactionService.getTransactionsByType(compteId, type);
        return ResponseEntity.ok(transactions);
    }
}