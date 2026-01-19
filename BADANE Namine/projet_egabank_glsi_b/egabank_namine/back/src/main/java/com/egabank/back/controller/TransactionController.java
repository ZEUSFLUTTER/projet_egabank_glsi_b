package com.egabank.back.controller;

import com.egabank.back.model.User;
import com.egabank.back.repository.UserRepository;
import com.egabank.back.model.Transaction;
import com.egabank.back.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "*")
public class TransactionController {
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    @PostMapping("/depot")
    public ResponseEntity<?> faireDepot(@RequestBody TransactionRequest request) {
        Transaction transaction = new Transaction();
        transaction.setTypeTransaction(Transaction.TypeTransaction.DEPOT); // ACCÈS VIA Transaction.TypeTransaction        
        transaction.setMontant(request.getMontant());
        transaction.setDescription("Dépôt via API");
        
        transactionRepository.save(transaction);
        return ResponseEntity.ok(Map.of("message", "Dépôt effectué"));
    }
    
    @PostMapping("/retrait")
    public ResponseEntity<?> faireRetrait(@RequestBody TransactionRequest request) {
        Transaction transaction = new Transaction();
        transaction.setTypeTransaction(Transaction.TypeTransaction.RETRAIT); // ACCÈS VIA Transaction.TypeTransaction        
        transaction.setMontant(request.getMontant());
        transaction.setDescription("Retrait via API");
        
        try {
            transactionRepository.save(transaction);
            return ResponseEntity.ok(Map.of("message", "Retrait effectué"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/virement")
    public ResponseEntity<?> faireVirement(@RequestBody VirementRequest request) {
        Transaction transaction = new Transaction();
        transaction.setTypeTransaction(Transaction.TypeTransaction.VIREMENT); // ACCÈS VIA Transaction.TypeTransaction        
        transaction.setMontant(request.getMontant());
        transaction.setDescription("Virement via API");
        
        try {
            transactionRepository.save(transaction);
            return ResponseEntity.ok(Map.of("message", "Virement effectué"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/compte/{accountId}")
    public List<Transaction> getTransactionsByAccount(@PathVariable Long accountId) {
        return transactionRepository.findAll().stream()
            .filter(t -> (t.getCompteSource() != null && t.getCompteSource().getId().equals(accountId)) ||
                        (t.getCompteDestination() != null && t.getCompteDestination().getId().equals(accountId)))
            .toList();
    }
    
    @GetMapping("/compte/{accountId}/periode")
    public List<Transaction> getTransactionsByPeriod(
            @PathVariable Long accountId,
            @RequestParam String startDate,
            @RequestParam String endDate) {
        
        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
        LocalDateTime start = LocalDateTime.parse(startDate, formatter);
        LocalDateTime end = LocalDateTime.parse(endDate, formatter);
        
        return transactionRepository.findByAccountAndPeriod(accountId, start, end);
    }
    
    @GetMapping("/releve/{accountId}")
    public List<Object[]> getReleveCompte(
            @PathVariable Long accountId,
            @RequestParam String startDate,
            @RequestParam String endDate) {
        
        return transactionRepository.getReleveCompte(accountId, startDate, endDate);
    }
    
    @GetMapping("/detail/{accountNumber}")
    public List<Object[]> getTransactionDetails(@PathVariable String accountNumber) {
        return transactionRepository.findTransactionsByAccountNumber(accountNumber);
    }
}

class TransactionRequest {
    private Long compteId;
    private java.math.BigDecimal montant;
    
    public Long getCompteId() { return compteId; }
    public void setCompteId(Long compteId) { this.compteId = compteId; }
    public java.math.BigDecimal getMontant() { return montant; }
    public void setMontant(java.math.BigDecimal montant) { this.montant = montant; }
}

class VirementRequest {
    private Long compteSourceId;
    private Long compteDestinationId;
    private java.math.BigDecimal montant;
    
    public Long getCompteSourceId() { return compteSourceId; }
    public void setCompteSourceId(Long compteSourceId) { this.compteSourceId = compteSourceId; }
    public Long getCompteDestinationId() { return compteDestinationId; }
    public void setCompteDestinationId(Long compteDestinationId) { this.compteDestinationId = compteDestinationId; }
    public java.math.BigDecimal getMontant() { return montant; }
    public void setMontant(java.math.BigDecimal montant) { this.montant = montant; }
}