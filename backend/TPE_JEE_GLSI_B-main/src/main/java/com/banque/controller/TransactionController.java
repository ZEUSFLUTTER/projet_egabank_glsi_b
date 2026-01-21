package com.banque.controller;

import com.banque.dto.TransactionDTO;
import com.banque.service.TransactionService;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {
    
    private final TransactionService transactionService;
    
    @PostMapping("/depot")
    public ResponseEntity<?> effectuerDepot(
            @RequestParam Long compteId,
            @RequestParam BigDecimal montant,
            @RequestParam(required = false) String description) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(transactionService.effectuerDepot(compteId, montant, description));
        } catch (RuntimeException e) {
            if (e.getMessage().contains("non trouvé")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ErrorResponse(e.getMessage()));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Erreur interne du serveur"));
        }
    }
    
    @PostMapping("/retrait")
    public ResponseEntity<?> effectuerRetrait(
            @RequestParam Long compteId,
            @RequestParam BigDecimal montant,
            @RequestParam(required = false) String description) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(transactionService.effectuerRetrait(compteId, montant, description));
        } catch (RuntimeException e) {
            if (e.getMessage().contains("non trouvé")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ErrorResponse(e.getMessage()));
            }
            if (e.getMessage().contains("Solde insuffisant")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ErrorResponse(e.getMessage()));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Erreur interne du serveur"));
        }
    }
    
    @PostMapping("/transfert")
    public ResponseEntity<?> effectuerTransfert(
            @RequestParam Long compteSourceId,
            @RequestParam Long compteDestinationId,
            @RequestParam BigDecimal montant,
            @RequestParam(required = false) String description) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(transactionService.effectuerTransfert(compteSourceId, compteDestinationId, montant, description));
        } catch (RuntimeException e) {
            if (e.getMessage().contains("non trouvé")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ErrorResponse(e.getMessage()));
            }
            if (e.getMessage().contains("Solde insuffisant") || e.getMessage().contains("doivent être différents")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ErrorResponse(e.getMessage()));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Erreur interne du serveur"));
        }
    }
    
    @GetMapping("/compte/{compteId}")
    public ResponseEntity<List<TransactionDTO>> getTransactionsByCompte(
            @PathVariable Long compteId,
            @RequestParam(required = false) String dateDebut,
            @RequestParam(required = false) String dateFin) {
        try {
            if (dateDebut != null || dateFin != null) {
                java.time.LocalDateTime debut = dateDebut != null ? 
                    java.time.LocalDateTime.parse(dateDebut) : null;
                java.time.LocalDateTime fin = dateFin != null ? 
                    java.time.LocalDateTime.parse(dateFin) : null;
                return ResponseEntity.ok(transactionService.getTransactionsByCompteAndPeriod(compteId, debut, fin));
            } else {
                return ResponseEntity.ok(transactionService.getTransactionsByCompte(compteId));
            }
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<TransactionDTO> getTransactionById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(transactionService.getTransactionById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping
    public ResponseEntity<List<TransactionDTO>> getAllTransactions() {
        try {
            return ResponseEntity.ok(transactionService.getAllTransactions());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Classe interne pour les réponses d'erreur
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    private static class ErrorResponse {
        private String message;
    }
}

