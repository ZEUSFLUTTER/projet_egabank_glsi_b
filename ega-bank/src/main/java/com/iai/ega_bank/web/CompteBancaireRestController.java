package com.iai.ega_bank.web;

import com.iai.ega_bank.dto.CompteDto;
import com.iai.ega_bank.entities.CompteBancaire;
import com.iai.ega_bank.entities.CompteCourant;
import com.iai.ega_bank.entities.CompteEpargne;
import com.iai.ega_bank.services.CompteService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/comptes")
public class CompteBancaireRestController {

    private final CompteService compteService;

    public CompteBancaireRestController(CompteService compteService) {
        this.compteService = compteService;
    }

    // ================= CREATE =================
    @PostMapping
    public void createAccount(@RequestBody CompteDto compteDto) {
        compteService.createAccount(compteDto);
    }

    // ================= LIST ALL (ADMIN) =================
    @GetMapping
    public List<?> findAllComptes() {
        return compteService.findAll()
                .stream()
                .map(c -> Map.of(
                        "clientId", c.getClient().getId(),
                        "numCompte", c.getNumCompte(),
                        "balance", c.getBalance()
                ))
                .toList();
    }

    // ================= LIST BY TYPE (ADMIN) =================
    @GetMapping("/type/{type}")
    public List<?> findAllByType(@PathVariable String type){
        if (type.equalsIgnoreCase("CC")) {
            return compteService.findComptesCourant()
                    .stream()
                    .map(c -> Map.of(
                            "clientId", c.getClient().getId(),
                            "numCompte", c.getNumCompte(),
                            "balance", c.getBalance()
                    ))
                    .toList();
        }
        if (type.equalsIgnoreCase("CE")) {
            return compteService.findComptesEpargne()
                    .stream()
                    .map(c -> Map.of(
                            "clientId", c.getClient().getId(),
                            "numCompte", c.getNumCompte(),
                            "balance", c.getBalance()
                    ))
                    .toList();
        }
        return List.of();
    }

    // ================= GET ONE ACCOUNT =================
    @GetMapping("/{numCompte}")
    public ResponseEntity<?> getCompte(
            @PathVariable String numCompte,
            Authentication authentication
    ) {
        CompteBancaire compte = compteService.findOne(numCompte);

        if (compte == null) {
            return ResponseEntity.badRequest().body("Compte introuvable");
        }

        // ADMIN → accès libre
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (isAdmin) {
            return ResponseEntity.ok(Map.of(
                    "clientId", compte.getClient().getId(),
                    "numCompte", compte.getNumCompte(),
                    "balance", compte.getBalance()
            ));
        }

        // CLIENT → vérifier qu'il est propriétaire
        String username = authentication.getName(); // username = email ou login
        if (!compte.getClient().getUser().getUsername().equals(username)) {
            return ResponseEntity.status(403).body("Accès interdit à ce compte");
        }

        return ResponseEntity.ok(Map.of(
                "clientId", compte.getClient().getId(),
                "numCompte", compte.getNumCompte(),
                "balance", compte.getBalance()
        ));
    }

    // ================= ACTIVER / SUSPENDRE =================
    @GetMapping("/{numCompte}/active")
    public boolean activeCompte(@PathVariable String numCompte){
        return this.compteService.activateCompte(numCompte);
    }

    @PutMapping("/{numCompte}/suspendre")
    public ResponseEntity<?> suspend(@PathVariable String numCompte) {
        return compteService.suspendCompte(numCompte)
                ? ResponseEntity.ok(true)
                : ResponseEntity.badRequest().body(false);
    }

}
