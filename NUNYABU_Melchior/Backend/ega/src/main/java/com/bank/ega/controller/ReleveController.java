package com.bank.ega.controller;

import com.bank.ega.entity.Compte;
import com.bank.ega.entity.Transaction;
import com.bank.ega.entity.Utilisateur;
import com.bank.ega.repository.CompteRepository;
import com.bank.ega.service.TransactionService;
import com.bank.ega.service.UtilisateurService;
import com.bank.ega.config.JwtUtil;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/releve")
public class ReleveController {

    private final TransactionService transactionService;
    private final UtilisateurService utilisateurService;
    private final CompteRepository compteRepository;
    private final JwtUtil jwtUtil;

    public ReleveController(TransactionService transactionService,
                            UtilisateurService utilisateurService,
                            CompteRepository compteRepository,
                            JwtUtil jwtUtil) {
        this.transactionService = transactionService;
        this.utilisateurService = utilisateurService;
        this.compteRepository = compteRepository;
        this.jwtUtil = jwtUtil;
    }

    // Générer un relevé de compte (retourne les données pour impression)
    @GetMapping("/compte/{numeroCompte}")
    public ResponseEntity<Map<String, Object>> genererReleve(
            @PathVariable String numeroCompte,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime debut,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fin,
            @RequestHeader("Authorization") String token) {
        
        try {
            String username = jwtUtil.getUsernameFromToken(token.replace("Bearer ", ""));
            Utilisateur user = utilisateurService.findByUsername(username);
            
            Compte compte = compteRepository.findByNumeroCompte(numeroCompte)
                    .orElseThrow(() -> new RuntimeException("Compte introuvable"));
            
            // Vérifier que le compte appartient au client connecté (sauf si admin)
            if (!"ADMIN".equals(user.getRole())) {
                if (user.getClient() == null || !user.getClient().getId().equals(compte.getClient().getId())) {
                    return ResponseEntity.status(403).build();
                }
            }
            
            List<Transaction> transactions;
            if (debut != null && fin != null) {
                transactions = transactionService.getTransactionsByNumeroCompteAndPeriod(numeroCompte, debut, fin);
            } else {
                transactions = transactionService.getTransactionsByNumeroCompte(numeroCompte);
            }
            
            Map<String, Object> releve = new HashMap<>();
            releve.put("compte", compte);
            releve.put("client", compte.getClient());
            releve.put("transactions", transactions);
            releve.put("dateGeneration", LocalDateTime.now());
            releve.put("periode", Map.of(
                    "debut", debut != null ? debut.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : "Début",
                    "fin", fin != null ? fin.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : "Fin"
            ));
            
            return ResponseEntity.ok(releve);
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }

    // Générer un relevé au format PDF (retourne les données JSON, le frontend peut utiliser une librairie pour PDF)
    @GetMapping("/compte/{numeroCompte}/pdf")
    public ResponseEntity<Map<String, Object>> genererRelevePDF(
            @PathVariable String numeroCompte,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime debut,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fin,
            @RequestHeader("Authorization") String token) {
        
        // Même logique que genererReleve mais avec headers pour PDF
        ResponseEntity<Map<String, Object>> response = genererReleve(numeroCompte, debut, fin, token);
        
        if (response.getStatusCode().is2xxSuccessful()) {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            // Le frontend peut utiliser ces données pour générer un PDF côté client
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(response.getBody());
        }
        
        return response;
    }
}
