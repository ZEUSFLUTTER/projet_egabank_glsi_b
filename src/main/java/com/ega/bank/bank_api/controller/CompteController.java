package com.ega.bank.bank_api.controller;

import com.ega.bank.bank_api.dto.CompteDto;
import com.ega.bank.bank_api.entity.Compte;
import com.ega.bank.bank_api.service.CompteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comptes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CompteController {
    
    private final CompteService compteService;
    
    @GetMapping
    public ResponseEntity<List<CompteDto>> getAllComptes() {
        List<CompteDto> comptes = compteService.getAllComptes();
        return ResponseEntity.ok(comptes);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<CompteDto> getCompteById(@PathVariable Long id) {
        CompteDto compte = compteService.getCompteById(id);
        return ResponseEntity.ok(compte);
    }
    
    @GetMapping("/numero/{numeroCompte}")
    public ResponseEntity<CompteDto> getCompteByNumero(@PathVariable String numeroCompte) {
        CompteDto compte = compteService.getCompteByNumero(numeroCompte);
        return ResponseEntity.ok(compte);
    }
    
    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<CompteDto>> getComptesByClientId(@PathVariable Long clientId) {
        List<CompteDto> comptes = compteService.getComptesByClientId(clientId);
        return ResponseEntity.ok(comptes);
    }
    
    @GetMapping("/client/{clientId}/type/{typeCompte}")
    public ResponseEntity<List<CompteDto>> getComptesByClientIdAndType(
            @PathVariable Long clientId, 
            @PathVariable Compte.TypeCompte typeCompte) {
        List<CompteDto> comptes = compteService.getComptesByClientIdAndType(clientId, typeCompte);
        return ResponseEntity.ok(comptes);
    }
    
    @PostMapping
    public ResponseEntity<CompteDto> createCompte(@Valid @RequestBody CompteDto compteDto) {
        CompteDto createdCompte = compteService.createCompte(compteDto);
        return new ResponseEntity<>(createdCompte, HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<CompteDto> updateCompte(@PathVariable Long id, @Valid @RequestBody CompteDto compteDto) {
        CompteDto updatedCompte = compteService.updateCompte(id, compteDto);
        return ResponseEntity.ok(updatedCompte);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCompte(@PathVariable Long id) {
        compteService.deleteCompte(id);
        return ResponseEntity.noContent().build();
    }
}