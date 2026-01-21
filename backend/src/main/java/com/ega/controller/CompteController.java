package com.ega.controller;

import com.ega.dto.CompteDTO;
import com.ega.service.CompteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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
    public ResponseEntity<List<CompteDTO>> getAll() {
        return ResponseEntity.ok(compteService.getAllComptes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CompteDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(compteService.getCompteById(id));
    }

    @PostMapping
    public ResponseEntity<CompteDTO> create(@Valid @RequestBody CompteDTO dto) {
        return ResponseEntity.ok(compteService.createCompte(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CompteDTO> update(@PathVariable Long id, @Valid @RequestBody CompteDTO dto) {
        return ResponseEntity.ok(compteService.updateCompte(id, dto));
    }

    @PutMapping("/{id}/desactiver")
    public ResponseEntity<Void> desactiver(@PathVariable Long id) {
        compteService.desactiverCompte(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/activer")
    public ResponseEntity<Void> activer(@PathVariable Long id) {
        compteService.activerCompte(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        compteService.deleteCompte(id);
        return ResponseEntity.noContent().build();
    }
}
