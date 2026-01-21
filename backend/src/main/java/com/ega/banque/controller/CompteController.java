package com.ega.banque.controller;

import com.ega.banque.dto.CompteCreateDTO;
import com.ega.banque.dto.CompteResponseDTO;
import com.ega.banque.entity.Compte;
import com.ega.banque.repository.CompteRepository;
import com.ega.banque.service.CompteService;
import com.ega.banque.service.ReleveService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/comptes")
@CrossOrigin("*")
public class CompteController {

    private final CompteService compteService;
    private final CompteRepository compteRepository;
    private final ReleveService releveService;

    public CompteController(CompteService compteService,
            CompteRepository compteRepository,
            ReleveService releveService) {
        this.compteService = compteService;
        this.compteRepository = compteRepository;
        this.releveService = releveService;
    }

    // =========================
    // READ ALL
    // =========================
    @GetMapping
    public ResponseEntity<List<CompteResponseDTO>> getAllComptes() {
        List<Compte> comptes = compteRepository.findAll();
        List<CompteResponseDTO> response = comptes.stream()
                .map(compte -> new CompteResponseDTO(
                        compte.getId(),
                        compte.getNumeroCompte(),
                        compte.getTypeCompte(),
                        compte.getSolde(),
                        compte.getDateCreation(),
                        compte.getClient().getId()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    // =========================
    // READ BY ID
    // =========================
    @GetMapping("/{id}")
    public ResponseEntity<CompteResponseDTO> getCompteById(@PathVariable Long id) {
        Compte compte = compteService.findById(id);
        CompteResponseDTO response = new CompteResponseDTO(
                compte.getId(),
                compte.getNumeroCompte(),
                compte.getTypeCompte(),
                compte.getSolde(),
                compte.getDateCreation(),
                compte.getClient().getId());
        return ResponseEntity.ok(response);
    }

    // =========================
    // READ BY NUMERO
    // =========================
    @GetMapping("/numero/{numeroCompte}")
    public ResponseEntity<CompteResponseDTO> getCompteByNumero(@PathVariable String numeroCompte) {
        Compte compte = compteService.findByNumeroCompte(numeroCompte);
        if (compte == null) {
            return ResponseEntity.notFound().build();
        }
        CompteResponseDTO response = new CompteResponseDTO(
                compte.getId(),
                compte.getNumeroCompte(),
                compte.getTypeCompte(),
                compte.getSolde(),
                compte.getDateCreation(),
                compte.getClient().getId());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<CompteResponseDTO>> getComptesByClient(@PathVariable Long clientId) {
        System.out.println("DEBUG: Fetching comptes for client ID: " + clientId);
        List<Compte> comptes = compteRepository.findByClientId(clientId);
        System.out.println("DEBUG: Found " + comptes.size() + " comptes");
        for (Compte c : comptes) {
            System.out.println("DEBUG: Compte " + c.getNumeroCompte() + " Solde: " + c.getSolde());
        }
        List<CompteResponseDTO> response = comptes.stream()
                .map(compte -> new CompteResponseDTO(
                        compte.getId(),
                        compte.getNumeroCompte(),
                        compte.getTypeCompte(),
                        compte.getSolde(),
                        compte.getDateCreation(),
                        compte.getClient().getId()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    // =========================
    // CREATE
    // =========================
    @PostMapping
    public ResponseEntity<CompteResponseDTO> createCompte(
            @Valid @RequestBody CompteCreateDTO dto) {

        Compte compte = compteService.creerCompte(
                dto.getClientId(),
                dto.getTypeCompte());

        CompteResponseDTO response = new CompteResponseDTO(
                compte.getId(),
                compte.getNumeroCompte(),
                compte.getTypeCompte(),
                compte.getSolde(),
                compte.getDateCreation(),
                compte.getClient().getId());

        return ResponseEntity.ok(response);
    }

    // =========================
    // DELETE
    // =========================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCompte(@PathVariable Long id) {
        if (!compteRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        compteRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // =========================
    // IMPRESSION RELEVÉ
    // =========================
    @GetMapping("/{id}/releve")
    public ResponseEntity<byte[]> imprimerReleve(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateDebut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateFin) {

        byte[] pdfBytes = releveService.genererRelevePdf(id, dateDebut, dateFin);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "releve_compte.pdf");

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }
}
