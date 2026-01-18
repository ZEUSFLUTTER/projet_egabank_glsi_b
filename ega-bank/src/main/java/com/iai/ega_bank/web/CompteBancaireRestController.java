package com.iai.ega_bank.web;


import com.iai.ega_bank.dto.CompteDto;
import com.iai.ega_bank.entities.CompteBancaire;
import com.iai.ega_bank.entities.CompteCourant;
import com.iai.ega_bank.entities.CompteEpargne;
import com.iai.ega_bank.services.CompteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/comptes")
public class CompteBancaireRestController {
    private final CompteService compteService;
    public CompteBancaireRestController(CompteService compteService) {
        this.compteService = compteService;
    }

    // CREATE
    @PostMapping
    public void createAccount(@RequestBody CompteDto compteDto) {
        compteService.createAccount(compteDto);
    }

    @GetMapping("/type/{type}")
    List<?> findAll(@PathVariable("type")String type){
        if (type.equals("CC")){
            this.compteService.findComptesCourant();
        }
        if (type.equals("CE")){
            this.compteService.findComptesEpargne();
        }
        return List.of();
    }

    @GetMapping("/{numCompte}/{type}")
    public ResponseEntity<?> findCompte(
            @PathVariable("numCompte") String numCompte,
            @PathVariable("type") String type) {

        // Vérifier que le numéro de compte est fourni
        if (numCompte == null || numCompte.isEmpty()) {
            return ResponseEntity.badRequest().body("Numéro de compte manquant");
        }
        // Récupérer le compte depuis le service
        CompteBancaire compteBancaire = this.compteService.findOne(numCompte);

        // Vérifier que le compte existe
        if (compteBancaire == null) {
            return ResponseEntity.badRequest().body("Compte introuvable");
        }
        // TYPE = COMPTE COURANT
        if (type.equalsIgnoreCase("CC") && compteBancaire instanceof CompteCourant) {
            return ResponseEntity.ok((CompteCourant) compteBancaire);
        }
        // TYPE = COMPTE EPARGNE
        if (type.equalsIgnoreCase("CE") && compteBancaire instanceof CompteEpargne) {
            return ResponseEntity.ok((CompteEpargne) compteBancaire);
        }
        // Si le type ne correspond pas au compte
        return ResponseEntity.badRequest().body("Type de compte invalide (CC ou CE attendu)");
    }

    @GetMapping("/{numCompte}/active")
    public boolean activeCompte(@PathVariable("numCompte") String numCompte){
        return this.compteService.activateCompte(numCompte);
    }

    @PutMapping("/{numCompte}/suspendre")
    public ResponseEntity<?> suspend(@PathVariable String numCompte) {
        return compteService.suspendCompte(numCompte)
                ? ResponseEntity.ok(true)
                : ResponseEntity.badRequest().body(false);
    }

}
