package com.egabank.Backend.controleur;

import com.egabank.Backend.entity.Transaction;
import com.egabank.Backend.service.TransactionClientService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

/**
 *
 * @author HP
 */
@RestController
@RequestMapping("/api/transactions-client")
public class TransactionClientControleur {
    
    private final TransactionClientService serviceTransactionClient;

    public TransactionClientControleur(TransactionClientService serviceTransactionClient) {
        this.serviceTransactionClient = serviceTransactionClient;
    }

    @GetMapping("/mes-transactions")
    public List<Transaction> listerMesTransactions(Authentication authentication) {
        return serviceTransactionClient.listerMesTransactions(authentication.getName());
    }

    @GetMapping("/compte/{compteId}")
    public List<Transaction> listerTransactionsCompte(@PathVariable Long compteId, 
                                                     Authentication authentication) {
        return serviceTransactionClient.listerTransactionsCompte(compteId, authentication.getName());
    }

    @GetMapping("/compte/{compteId}/periode")
    public List<Transaction> listerTransactionsPeriode(
            @PathVariable Long compteId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateDebut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFin,
            Authentication authentication) {
        return serviceTransactionClient.listerTransactionsPeriode(compteId, dateDebut, dateFin, authentication.getName());
    }
}