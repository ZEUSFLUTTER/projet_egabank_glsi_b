package com.bank.ega.controller;

import com.bank.ega.entity.Client;
import com.bank.ega.entity.Compte;
import com.bank.ega.entity.TypeCompte;
import com.bank.ega.entity.Utilisateur;
import com.bank.ega.service.ClientService;
import com.bank.ega.service.CompteService;
import com.bank.ega.service.UtilisateurService;
import com.bank.ega.config.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comptes")
public class CompteController {

    private final CompteService compteService;
    private final ClientService clientService;
    private final UtilisateurService utilisateurService;
    private final JwtUtil jwtUtil;

    public CompteController(CompteService compteService, ClientService clientService, 
                           UtilisateurService utilisateurService, JwtUtil jwtUtil) {
        this.compteService = compteService;
        this.clientService = clientService;
        this.utilisateurService = utilisateurService;
        this.jwtUtil = jwtUtil;
    }

    // Récupérer les comptes de l'utilisateur connecté
    @GetMapping
    public ResponseEntity<List<Compte>> getComptesUtilisateur(
            @RequestHeader("Authorization") String token) {
        
        try {
            // 1. Extraire le username du JWT
            String username = jwtUtil.getUsernameFromToken(token.replace("Bearer ", ""));
            
            // 2. Récupérer l'utilisateur et son client_id
            Utilisateur user = utilisateurService.findByUsername(username);
            if (user == null || user.getClient() == null) {
                return ResponseEntity.status(404).build(); // User ou Client not found
            }
            
            Long clientId = user.getClient().getId();
            
            // 3. Retourner les comptes du client
            List<Compte> comptes = compteService.getComptesByClient(clientId);
            return ResponseEntity.ok(comptes);
            
        } catch (Exception e) {
            return ResponseEntity.status(401).build(); // Unauthorized
        }
    }

    // Créer un compte pour un client existant
    @PostMapping("/creer")
    public ResponseEntity<Map<String, Object>> creerCompte(@RequestBody CreerCompteRequest request) {
        try {
            // Vérifier que clientId est présent
            if (request.getClientId() == null) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "Client ID requis");
                return ResponseEntity.status(400).body(error);
            }

            // On récupère le client existant par ID
            Client client = clientService.trouverClient(request.getClientId());
            if (client == null) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "Client non trouvé avec l'ID: " + request.getClientId());
                return ResponseEntity.status(404).body(error);
            }

            TypeCompte typeCompte = TypeCompte.valueOf(request.getTypeCompte());
            Compte nouveauCompte = compteService.creerCompte(client, typeCompte);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Compte créé avec succès");
            response.put("data", nouveauCompte);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Type de compte invalide: " + request.getTypeCompte());
            return ResponseEntity.status(400).body(error);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Erreur lors de la création du compte: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    // Dépôt sur un compte
    @PostMapping("/depot")
    public ResponseEntity<Map<String, Object>> depot(@RequestBody CompteOperation operation) {
        try {
            com.bank.ega.entity.SourceDepot source = operation.getSource() != null ? 
                com.bank.ega.entity.SourceDepot.valueOf(operation.getSource()) : null;
            compteService.depot(operation.getNumeroCompte(), operation.getMontant(), source);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Dépôt effectué avec succès");
            response.put("numeroCompte", operation.getNumeroCompte());
            response.put("montant", operation.getMontant());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(400).body(error);
        }
    }

    // Retrait sur un compte
    @PostMapping("/retrait")
    public ResponseEntity<Map<String, Object>> retrait(@RequestBody CompteOperation operation) {
        try {
            compteService.retrait(operation.getNumeroCompte(), operation.getMontant());
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Retrait effectué avec succès");
            response.put("numeroCompte", operation.getNumeroCompte());
            response.put("montant", operation.getMontant());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(400).body(error);
        }
    }

    // Virement entre comptes
    @PostMapping("/virement")
    public ResponseEntity<Map<String, Object>> virement(@RequestBody VirementOperation operation) {
        try {
            compteService.virement(operation.getSource(), operation.getDestination(), operation.getMontant());
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Virement effectué avec succès");
            response.put("compteSource", operation.getSource());
            response.put("compteDestination", operation.getDestination());
            response.put("montant", operation.getMontant());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(400).body(error);
        }
    }

    // Classes internes pour les opérations
    public static class CreerCompteRequest {
        private Long clientId;
        private String typeCompte;

        public Long getClientId() { return clientId; }
        public void setClientId(Long clientId) { this.clientId = clientId; }
        public String getTypeCompte() { return typeCompte; }
        public void setTypeCompte(String typeCompte) { this.typeCompte = typeCompte; }
    }

    public static class CompteOperation {
        private String numeroCompte;
        private Double montant;
        private String source; // Pour le dépôt (MOBILE_MONEY, ESPECES, etc.)

        public String getNumeroCompte() { return numeroCompte; }
        public void setNumeroCompte(String numeroCompte) { this.numeroCompte = numeroCompte; }
        public Double getMontant() { return montant; }
        public void setMontant(Double montant) { this.montant = montant; }
        public String getSource() { return source; }
        public void setSource(String source) { this.source = source; }
    }

    public static class VirementOperation {
        private String source;
        private String destination;
        private Double montant;

        public String getSource() { return source; }
        public void setSource(String source) { this.source = source; }
        public String getDestination() { return destination; }
        public void setDestination(String destination) { this.destination = destination; }
        public Double getMontant() { return montant; }
        public void setMontant(Double montant) { this.montant = montant; }
    }
}
