package com.bank.ega.controller;

import com.bank.ega.entity.Client;
import com.bank.ega.entity.Compte;
import com.bank.ega.entity.Transaction;
import com.bank.ega.entity.Utilisateur;
import com.bank.ega.service.ClientService;
import com.bank.ega.service.CompteService;
import com.bank.ega.service.TransactionService;
import com.bank.ega.service.UtilisateurService;
import com.bank.ega.config.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final ClientService clientService;
    private final CompteService compteService;
    private final TransactionService transactionService;
    private final UtilisateurService utilisateurService;
    private final JwtUtil jwtUtil;

    public AdminController(ClientService clientService,
                           CompteService compteService,
                           TransactionService transactionService,
                           UtilisateurService utilisateurService,
                           JwtUtil jwtUtil) {
        this.clientService = clientService;
        this.compteService = compteService;
        this.transactionService = transactionService;
        this.utilisateurService = utilisateurService;
        this.jwtUtil = jwtUtil;
    }

    // Vérifier si l'utilisateur est admin
    private boolean isAdmin(String token) {
        try {
            String username = jwtUtil.getUsernameFromToken(token.replace("Bearer ", ""));
            Utilisateur user = utilisateurService.findByUsername(username);
            return "ADMIN".equals(user.getRole());
        } catch (Exception e) {
            return false;
        }
    }

    // Récupérer tous les clients avec leurs comptes et transactions
    @GetMapping("/clients")
    public ResponseEntity<List<Client>> getAllClients(@RequestHeader("Authorization") String token) {
        if (!isAdmin(token)) {
            return ResponseEntity.status(403).build();
        }
        List<Client> clients = clientService.listerClients();
        return ResponseEntity.ok(clients);
    }

    // Récupérer tous les comptes
    @GetMapping("/comptes")
    public ResponseEntity<List<Compte>> getAllComptes(@RequestHeader("Authorization") String token) {
        if (!isAdmin(token)) {
            return ResponseEntity.status(403).build();
        }
        // On peut créer une méthode dans CompteService pour récupérer tous les comptes
        return ResponseEntity.ok(compteService.getAllComptes());
    }

    // Récupérer toutes les transactions
    @GetMapping("/transactions")
    public ResponseEntity<List<Transaction>> getAllTransactions(@RequestHeader("Authorization") String token) {
        if (!isAdmin(token)) {
            return ResponseEntity.status(403).build();
        }
        List<Transaction> transactions = transactionService.getAllTransactions();
        return ResponseEntity.ok(transactions);
    }

    // Récupérer les statistiques globales
    @GetMapping("/statistiques")
    public ResponseEntity<Map<String, Object>> getStatistiques(@RequestHeader("Authorization") String token) {
        if (!isAdmin(token)) {
            return ResponseEntity.status(403).build();
        }
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("nombreClients", clientService.listerClients().size());
        stats.put("nombreComptes", compteService.getAllComptes().size());
        stats.put("nombreTransactions", transactionService.getAllTransactions().size());
        
        return ResponseEntity.ok(stats);
    }

    // Récupérer les détails d'un client avec ses comptes et transactions
    @GetMapping("/clients/{clientId}/details")
    public ResponseEntity<Map<String, Object>> getClientDetails(
            @PathVariable Long clientId,
            @RequestHeader("Authorization") String token) {
        
        if (!isAdmin(token)) {
            return ResponseEntity.status(403).build();
        }
        
        Client client = clientService.trouverClient(clientId);
        List<Compte> comptes = compteService.getComptesByClient(clientId);
        List<Transaction> transactions = transactionService.getTransactionsByClientId(clientId);
        
        Map<String, Object> details = new HashMap<>();
        details.put("client", client);
        details.put("comptes", comptes);
        details.put("transactions", transactions);
        
        return ResponseEntity.ok(details);
    }
}
