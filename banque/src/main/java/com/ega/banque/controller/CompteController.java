package com.ega.banque.controller;

import com.ega.banque.model.Compte;
import com.ega.banque.service.BanqueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/banque")
@CrossOrigin(origins = "http://localhost:4200") 
public class CompteController {

    @Autowired
    private BanqueService banqueService;

    // Route pour ouvrir un compte
    @PostMapping("/ouvrir")
    public Compte ouvrir(@RequestBody Compte compte) {
        return banqueService.ouvrirCompte(compte);
    }

    
    @PostMapping("/verser/{numero}")
    public Compte verser(@PathVariable String numero, @RequestBody Map<String, Double> request) {
        Double montant = request.get("montant");
        return banqueService.verser(numero, montant);
    }

    // Route pour le retrait
    @PostMapping("/retirer/{numero}")
    public Compte retirer(@PathVariable String numero, @RequestBody Map<String, Double> request) {
        Double montant = request.get("montant");
        return banqueService.retirer(numero, montant);
    }
}