package com.ega.banking.controller;

import com.ega.banking.dto.CompteDTO;
import com.ega.banking.model.TypeCompte;
import com.ega.banking.service.CompteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comptes")
@RequiredArgsConstructor
@Tag(name = "Comptes", description = "API de gestion des comptes bancaires")
public class CompteController {

    private final CompteService compteService;

    @PostMapping("/epargne")
    @Operation(summary = "Créer un compte épargne")
    public ResponseEntity<CompteDTO> creerCompteEpargne(@RequestBody Map<String, Object> request) {
        Long clientId = Long.valueOf(request.get("clientId").toString());
        BigDecimal tauxInteret = request.containsKey("tauxInteret")
                ? new BigDecimal(request.get("tauxInteret").toString())
                : null;

        return new ResponseEntity<>(
                compteService.creerCompteEpargne(clientId, tauxInteret),
                HttpStatus.CREATED);
    }

    @PostMapping("/courant")
    @Operation(summary = "Créer un compte courant")
    public ResponseEntity<CompteDTO> creerCompteCourant(@RequestBody Map<String, Object> request) {
        Long clientId = Long.valueOf(request.get("clientId").toString());
        BigDecimal decouvertAutorise = request.containsKey("decouvertAutorise")
                ? new BigDecimal(request.get("decouvertAutorise").toString())
                : null;

        return new ResponseEntity<>(
                compteService.creerCompteCourant(clientId, decouvertAutorise),
                HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Obtenir tous les comptes")
    public ResponseEntity<List<CompteDTO>> obtenirTousLesComptes() {
        return ResponseEntity.ok(compteService.obtenirTousLesComptes());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtenir un compte par ID")
    public ResponseEntity<CompteDTO> obtenirCompteParId(@PathVariable Long id) {
        return ResponseEntity.ok(compteService.obtenirCompteParId(id));
    }

    @GetMapping("/numero/{numeroCompte}")
    @Operation(summary = "Obtenir un compte par numéro IBAN")
    public ResponseEntity<CompteDTO> obtenirCompteParNumero(@PathVariable String numeroCompte) {
        return ResponseEntity.ok(compteService.obtenirCompteParNumero(numeroCompte));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer un compte")
    public ResponseEntity<Void> supprimerCompte(@PathVariable Long id) {
        compteService.supprimerCompte(id);
        return ResponseEntity.noContent().build();
    }
}
