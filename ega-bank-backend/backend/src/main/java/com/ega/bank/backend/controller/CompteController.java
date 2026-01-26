package com.ega.bank.backend.controller;

import com.ega.bank.backend.dto.compte.CompteRequestDto;
import com.ega.bank.backend.dto.compte.CompteResponseDto;
import com.ega.bank.backend.entity.Compte;
import com.ega.bank.backend.service.CompteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/comptes")
public class CompteController {

    private final CompteService compteService;

    public CompteController(CompteService compteService) {
        this.compteService = compteService;
    }

    // CREATE COMPTE
    // ADMIN / AGENT
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','AGENT')")
    public ResponseEntity<CompteResponseDto> creerCompte(
            @Valid @RequestBody CompteRequestDto dto) {

        Compte compte = compteService.creerCompte(
                dto.getClientId(),
                dto.getTypeCompte());

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(toResponseDto(compte));
    }

    // CLIENT et SES COMPTES
    @GetMapping("/me")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<List<CompteResponseDto>> getMesComptes() {

        List<CompteResponseDto> comptes = compteService.getComptesDuClientConnecte()
                .stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(comptes);
    }

    // ADMIN / AGENT / COMPTES D’UN CLIENT
    @GetMapping("/client/{clientId}")
    @PreAuthorize("hasAnyRole('ADMIN','AGENT')")
    public ResponseEntity<List<CompteResponseDto>> getComptesClient(
            @PathVariable Long clientId) {

        List<CompteResponseDto> comptes = compteService.getComptesByClient(clientId)
                .stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(comptes);
    }

    // MAPPER
    private CompteResponseDto toResponseDto(Compte compte) {
        CompteResponseDto dto = new CompteResponseDto();
        dto.setId(compte.getId());
        dto.setIban(compte.getNumeroCompte());
        dto.setTypeCompte(compte.getTypeCompte());
        dto.setSolde(compte.getSolde());
        dto.setDateCreation(compte.getDateCreation().atStartOfDay());
        dto.setClientId(compte.getClient().getId());
        dto.setActif(true);
        return dto;
    }
}
