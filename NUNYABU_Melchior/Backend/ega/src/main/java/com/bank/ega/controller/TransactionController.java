package com.bank.ega.controller;

import com.bank.ega.entity.Transaction;
import com.bank.ega.entity.Utilisateur;
import com.bank.ega.repository.CompteRepository;
import com.bank.ega.service.TransactionService;
import com.bank.ega.service.UtilisateurService;
import com.bank.ega.config.JwtUtil;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;
    private final UtilisateurService utilisateurService;
    private final CompteRepository compteRepository;
    private final JwtUtil jwtUtil;

    public TransactionController(TransactionService transactionService,
                                UtilisateurService utilisateurService,
                                CompteRepository compteRepository,
                                JwtUtil jwtUtil) {
        this.transactionService = transactionService;
        this.utilisateurService = utilisateurService;
        this.compteRepository = compteRepository;
        this.jwtUtil = jwtUtil;
    }

    // Récupérer les transactions d'un compte par numéro de compte
    @GetMapping("/compte/{numeroCompte}")
    public ResponseEntity<List<Transaction>> getTransactionsByCompte(
            @PathVariable String numeroCompte,
            @RequestHeader("Authorization") String token) {
        
        try {
            String username = jwtUtil.getUsernameFromToken(token.replace("Bearer ", ""));
            Utilisateur user = utilisateurService.findByUsername(username);
            
            // Vérifier que le compte appartient au client connecté (sauf si admin)
            if (!"ADMIN".equals(user.getRole())) {
                var compte = compteRepository.findByNumeroCompte(numeroCompte)
                        .orElseThrow(() -> new RuntimeException("Compte introuvable"));
                if (user.getClient() == null || !user.getClient().getId().equals(compte.getClient().getId())) {
                    return ResponseEntity.status(403).build();
                }
            }
            
            List<Transaction> transactions = transactionService.getTransactionsByNumeroCompte(numeroCompte);
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }

    // Récupérer les transactions d'un compte sur une période
    @GetMapping("/compte/{numeroCompte}/periode")
    public ResponseEntity<List<Transaction>> getTransactionsByPeriod(
            @PathVariable String numeroCompte,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime debut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fin,
            @RequestHeader("Authorization") String token) {
        
        try {
            String username = jwtUtil.getUsernameFromToken(token.replace("Bearer ", ""));
            Utilisateur user = utilisateurService.findByUsername(username);
            
            // Vérifier que le compte appartient au client connecté (sauf si admin)
            if (!"ADMIN".equals(user.getRole())) {
                var compte = compteRepository.findByNumeroCompte(numeroCompte)
                        .orElseThrow(() -> new RuntimeException("Compte introuvable"));
                if (user.getClient() == null || !user.getClient().getId().equals(compte.getClient().getId())) {
                    return ResponseEntity.status(403).build();
                }
            }
            
            List<Transaction> transactions = transactionService
                    .getTransactionsByNumeroCompteAndPeriod(numeroCompte, debut, fin);
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }

    // Récupérer toutes les transactions du client connecté
    @GetMapping("/mes-transactions")
    public ResponseEntity<List<Transaction>> getMesTransactions(
            @RequestHeader("Authorization") String token) {
        
        try {
            String username = jwtUtil.getUsernameFromToken(token.replace("Bearer ", ""));
            Utilisateur user = utilisateurService.findByUsername(username);
            
            if (user.getClient() == null) {
                return ResponseEntity.status(404).build();
            }
            
            List<Transaction> transactions = transactionService.getTransactionsByClientId(user.getClient().getId());
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }
}
