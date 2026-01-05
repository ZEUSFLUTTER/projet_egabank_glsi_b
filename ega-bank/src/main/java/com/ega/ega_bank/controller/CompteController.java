package com.ega.ega_bank.controller;

import com.ega.ega_bank.dto.CompteDTO;
import com.ega.ega_bank.dto.CreateCompteRequest;
import com.ega.ega_bank.service.CompteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comptes")
@RequiredArgsConstructor
public class CompteController {

    private final CompteService compteService;

    @PostMapping
    public ResponseEntity<CompteDTO> createCompte(@Valid @RequestBody CreateCompteRequest request) {
        CompteDTO createdCompte = compteService.createCompte(request);
        return new ResponseEntity<>(createdCompte, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CompteDTO> getCompteById(@PathVariable Long id) {
        CompteDTO compte = compteService.getCompteById(id);
        return ResponseEntity.ok(compte);
    }

    @GetMapping("/numero/{numeroCompte}")
    public ResponseEntity<CompteDTO> getCompteByNumero(@PathVariable String numeroCompte) {
        CompteDTO compte = compteService.getCompteByNumero(numeroCompte);
        return ResponseEntity.ok(compte);
    }

    @GetMapping
    public ResponseEntity<List<CompteDTO>> getAllComptes() {
        List<CompteDTO> comptes = compteService.getAllComptes();
        return ResponseEntity.ok(comptes);
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<CompteDTO>> getComptesByClientId(@PathVariable Long clientId) {
        List<CompteDTO> comptes = compteService.getComptesByClientId(clientId);
        return ResponseEntity.ok(comptes);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCompte(@PathVariable Long id) {
        compteService.deleteCompte(id);
        return ResponseEntity.noContent().build();
    }
}
