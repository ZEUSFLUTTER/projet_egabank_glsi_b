package com.ega.backend.controller;

import com.ega.backend.model.Client;
import com.ega.backend.model.Compte;
import com.ega.backend.model.Transaction;
import com.ega.backend.model.TypeCompte;
import com.ega.backend.repository.ClientRepository;
import com.ega.backend.repository.CompteRepository;
import com.ega.backend.repository.TransactionRepository;
import com.ega.backend.service.CompteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/compte")
@Validated
public class CompteController {

    @Autowired
    private CompteService compteService;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private CompteRepository compteRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    // ✅ Créer un compte pour l'utilisateur connecté
    @PostMapping("/create")
    // @PreAuthorize("hasRole('CLIENT') or hasRole('ADMIN')") // Géré par le rôle dans JwtAuthenticationFilter
    public ResponseEntity<?> createCompte(@RequestBody CreateCompteRequest request, Authentication authentication) {
        try {
            String email = authentication.getName();
            Optional<Client> clientOpt = clientRepository.findByEmail(email);
            
            if (clientOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Client introuvable"));
            }

            Client client = clientOpt.get();
            
            Compte compte = new Compte();
            compte.setClientId(client.getId());
            compte.setType(TypeCompte.valueOf(request.getType()));
            compte.setSolde(BigDecimal.ZERO);
            compte.setDevise("F CFA");
            compte.setIsActive(true);
            compte.setNumeroCompte("ACC" + System.currentTimeMillis());
            compte.setDescription(request.getDescription());

            Compte savedCompte = compteService.createCompte(compte);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Compte créé avec succès");
            response.put("compte", savedCompte);
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Type de compte invalide"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Erreur lors de la création du compte"));
        }
    }

    // ✅ Créer un compte pour un client spécifique (admin seulement)
    @PostMapping("/client/{clientId}") // <--- CORRIGÉ : Mapping correct pour l'admin
    // @PreAuthorize("hasRole('ADMIN')") // Géré par le rôle dans JwtAuthenticationFilter
    public ResponseEntity<?> createCompteForClient(@PathVariable String clientId, @RequestBody CreateCompteRequest request) {
        try {
            Optional<Client> clientOpt = clientRepository.findById(clientId);
            
            if (clientOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Client introuvable"));
            }

            Client client = clientOpt.get();
            
            Compte compte = new Compte();
            compte.setClientId(client.getId());
            compte.setType(TypeCompte.valueOf(request.getType()));
            compte.setSolde(BigDecimal.ZERO);
            compte.setDevise("F CFA");
            compte.setIsActive(true);
            compte.setNumeroCompte("ACC" + System.currentTimeMillis());
            compte.setDescription(request.getDescription());

            Compte savedCompte = compteService.createCompte(compte);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Compte créé avec succès pour le client");
            response.put("compte", savedCompte);
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Type de compte invalide"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Erreur lors de la création du compte"));
        }
    }

    @GetMapping
    // @PreAuthorize("hasRole('ADMIN')") // Géré par le rôle dans JwtAuthenticationFilter
    public List<Compte> getAllComptes(Authentication authentication) {
        // Vérifier que l'utilisateur est admin
        if (!authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            return List.of(); // Retourner une liste vide ou une erreur
        }
        return compteService.getAllComptes();
    }

    // ✅ Récupérer un compte par ID
    @GetMapping("/{id}")
    // @PreAuthorize("hasRole('ADMIN') or @compteService.isCompteOwner(authentication.principal.username, #id)") // Désactivé temporairement
    public ResponseEntity<Compte> getCompteById(@PathVariable String id, Authentication authentication) {
        String email = authentication.getName();
        Optional<Client> clientOpt = clientRepository.findByEmail(email);
        if (clientOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Client client = clientOpt.get();

        Optional<Compte> compteOpt = compteRepository.findById(id);
        if (compteOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Compte compte = compteOpt.get();

        // ✅ Vérifier la propriété du compte
        if (!compte.getClientId().equals(client.getId()) && !client.getRole().equals("ADMIN")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(compte);
    }

    // ✅ Mettre à jour un compte
    @PutMapping("/{id}")
    // @PreAuthorize("hasRole('ADMIN') or @compteService.isCompteOwner(authentication.principal.username, #id)") // Désactivé temporairement
    public ResponseEntity<Compte> updateCompte(@PathVariable String id, @RequestBody Compte compte, Authentication authentication) {
        String email = authentication.getName();
        Optional<Client> clientOpt = clientRepository.findByEmail(email);
        if (clientOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Client client = clientOpt.get();

        Optional<Compte> existingCompteOpt = compteRepository.findById(id);
        if (existingCompteOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Compte existingCompte = existingCompteOpt.get();

        // ✅ Vérifier la propriété du compte
        if (!existingCompte.getClientId().equals(client.getId()) && !client.getRole().equals("ADMIN")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Compte updatedCompte = compteService.updateCompte(id, compte);
        if (updatedCompte != null) {
            return ResponseEntity.ok(updatedCompte);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    // @PreAuthorize("hasRole('ADMIN')") // Géré par le rôle dans JwtAuthenticationFilter
    public ResponseEntity<Void> deleteCompte(@PathVariable String id, Authentication authentication) {
        // Vérifier que l'utilisateur est admin
        if (!authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        compteService.deleteCompte(id);
        return ResponseEntity.noContent().build();
    }

    // ✅ Dépôt
    @PostMapping("/{id}/depot")
    // @PreAuthorize("hasRole('ADMIN') or @compteService.isCompteOwner(authentication.principal.username, #id)") // Désactivé temporairement
    public ResponseEntity<?> depot(@PathVariable String id, @RequestParam BigDecimal montant, Authentication authentication) {
        try {
            String email = authentication.getName();
            Optional<Client> clientOpt = clientRepository.findByEmail(email);
            if (clientOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            Client client = clientOpt.get();

            Optional<Compte> compteOpt = compteRepository.findById(id);
            if (compteOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            Compte compte = compteOpt.get();

            // ✅ Vérifier la propriété du compte
            if (!compte.getClientId().equals(client.getId()) && !client.getRole().equals("ADMIN")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            Compte compteMisAJour = compteService.depot(id, montant);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Dépôt effectué avec succès");
            response.put("nouveau_solde", compteMisAJour.getSolde());
            response.put("status", "success");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Erreur lors du dépôt");
            response.put("status", "error");

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // ✅ Retrait
    @PostMapping("/{id}/retrait")
    // @PreAuthorize("hasRole('ADMIN') or @compteService.isCompteOwner(authentication.principal.username, #id)") // Désactivé temporairement
    public ResponseEntity<?> retrait(@PathVariable String id, @RequestParam BigDecimal montant, Authentication authentication) {
        try {
            // ✅ Valide que le montant est positif
            if (montant.compareTo(BigDecimal.ZERO) <= 0) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Le montant doit être positif");
                response.put("status", "error");
                return ResponseEntity.badRequest().body(response);
            }

            String email = authentication.getName();
            Optional<Client> clientOpt = clientRepository.findByEmail(email);
            if (clientOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            Client client = clientOpt.get();

            Optional<Compte> compteOpt = compteRepository.findById(id);
            if (compteOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            Compte compte = compteOpt.get();

            // ✅ Vérifier la propriété du compte
            if (!compte.getClientId().equals(client.getId()) && !client.getRole().equals("ADMIN")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            Compte compteMisAJour = compteService.retrait(id, montant);

            if (compteMisAJour == null) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Solde insuffisant");
                response.put("status", "error");
                return ResponseEntity.badRequest().body(response);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Retrait effectué avec succès");
            response.put("nouveau_solde", compteMisAJour.getSolde());
            response.put("status", "success");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Erreur lors du retrait");
            response.put("status", "error");

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // ✅ Virement avec Query Parameters
    @PostMapping("/virement")
    // @PreAuthorize("hasRole('ADMIN') or @compteService.isCompteOwner(authentication.principal.username, #compteSourceId)") // Désactivé temporairement
    public ResponseEntity<?> virement(
            @RequestParam String compteSourceId,
            @RequestParam String compteDestId,
            @RequestParam BigDecimal montant,
            Authentication authentication) {

        return processVirement(compteSourceId, compteDestId, montant, authentication);
    }

    // ✅ Virement avec Body JSON
    @PostMapping("/virement-json")
    // @PreAuthorize("hasRole('ADMIN') or @compteService.isCompteOwner(authentication.principal.username, #request.compteSourceId)") // Désactivé temporairement
    public ResponseEntity<?> virementJson(@RequestBody VirementRequest request, Authentication authentication) {
        return processVirement(request.getCompteSourceId(), request.getCompteDestId(), request.getMontant(), authentication);
    }

    // Méthode privée pour traiter le virement
    private ResponseEntity<?> processVirement(String compteSourceId, String compteDestId, BigDecimal montant, Authentication authentication) {
        try {
            // ✅ Valide que le montant est positif
            if (montant.compareTo(BigDecimal.ZERO) <= 0) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Le montant doit être positif");
                response.put("status", "error");
                return ResponseEntity.badRequest().body(response);
            }

            String email = authentication.getName();
            Optional<Client> clientOpt = clientRepository.findByEmail(email);
            if (clientOpt.isEmpty()) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Utilisateur non authentifié");
                response.put("status", "unauthorized");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

            Client client = clientOpt.get();

            Optional<Compte> sourceOpt = compteRepository.findById(compteSourceId);
            Optional<Compte> destOpt = compteRepository.findById(compteDestId);

            if (sourceOpt.isEmpty() || destOpt.isEmpty()) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Compte source ou destinataire introuvable");
                response.put("status", "not_found");
                return ResponseEntity.badRequest().body(response);
            }

            Compte source = sourceOpt.get();
            Compte dest = destOpt.get();

            // ✅ Vérifier la propriété du compte source
            if (!client.getRole().equals("ADMIN") && !source.getClientId().equals(client.getId())) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Accès refusé : vous ne pouvez pas accéder à ce compte");
                response.put("status", "forbidden");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
            }

            if (compteService.virement(compteSourceId, compteDestId, montant)) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Virement effectué avec succès");
                response.put("status", "success");
                return ResponseEntity.ok(response);
            } else {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Solde insuffisant");
                response.put("status", "error");
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Erreur lors du virement");
            response.put("status", "error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Récupérer les comptes de l'utilisateur connecté
    @GetMapping("/mes-comptes")
    // @PreAuthorize("hasRole('CLIENT') or hasRole('ADMIN')") // Géré par le rôle dans JwtAuthenticationFilter
    public ResponseEntity<List<Compte>> getMesComptes(Authentication authentication) {
        String email = authentication.getName();
        List<Compte> comptes = compteService.getComptesByEmail(email);
        return ResponseEntity.ok(comptes);
    }

    // Récupérer les comptes d'un client (admin seulement)
    @GetMapping("/client/{clientId}")
    // @PreAuthorize("hasRole('ADMIN')") // Géré par le rôle dans JwtAuthenticationFilter
    public List<Compte> getComptesByClientId(@PathVariable String clientId, Authentication authentication) {
        // Vérifier que l'utilisateur est admin
        if (!authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            return List.of(); // Retourner une liste vide ou une erreur
        }
        return compteService.getComptesByClientId(clientId);
    }

    // DTO pour la création de compte
    public static class CreateCompteRequest {
        private String type; // "COURANT" ou "EPARGNE"
        private String description;

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }
    }

    // ✅ DTO pour le virement JSON
    public static class VirementRequest {
        private String compteSourceId;
        private String compteDestId;
        private BigDecimal montant;

        public String getCompteSourceId() {
            return compteSourceId;
        }

        public void setCompteSourceId(String compteSourceId) {
            this.compteSourceId = compteSourceId;
        }

        public String getCompteDestId() {
            return compteDestId;
        }

        public void setCompteDestId(String compteDestId) {
            this.compteDestId = compteDestId;
        }

        public BigDecimal getMontant() {
            return montant;
        }

        public void setMontant(BigDecimal montant) {
            this.montant = montant;
        }
    }
}