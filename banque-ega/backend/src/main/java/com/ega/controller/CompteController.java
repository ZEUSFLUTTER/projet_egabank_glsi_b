package com.ega.controller;

import com.ega.dto.CompteDTO;
import com.ega.model.TypeCompte;
import com.ega.service.CompteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comptes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CompteController {

    private final CompteService compteService;

    @GetMapping
    public ResponseEntity<List<CompteDTO>> getAllComptes() {
        List<CompteDTO> comptes = compteService.getAllComptes();
        return ResponseEntity.ok(comptes);
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

    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<CompteDTO>> getComptesByClientId(@PathVariable Long clientId) {
        List<CompteDTO> comptes = compteService.getComptesByClientId(clientId);
        return ResponseEntity.ok(comptes);
    }

    @GetMapping("/client/{clientId}/type/{typeCompte}")
    public ResponseEntity<List<CompteDTO>> getComptesByClientIdAndType(
            @PathVariable Long clientId,
            @PathVariable TypeCompte typeCompte) {
        List<CompteDTO> comptes = compteService.getComptesByClientIdAndType(clientId, typeCompte);
        return ResponseEntity.ok(comptes);
    }

    @PostMapping
    public ResponseEntity<CompteDTO> createCompte(@Valid @RequestBody CompteDTO compteDTO) {
        CompteDTO createdCompte = compteService.createCompte(compteDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCompte);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CompteDTO> updateCompte(@PathVariable Long id, @Valid @RequestBody CompteDTO compteDTO) {
        CompteDTO updatedCompte = compteService.updateCompte(id, compteDTO);
        return ResponseEntity.ok(updatedCompte);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCompte(@PathVariable Long id) {
        compteService.deleteCompte(id);
        return ResponseEntity.noContent().build();
    }
}

