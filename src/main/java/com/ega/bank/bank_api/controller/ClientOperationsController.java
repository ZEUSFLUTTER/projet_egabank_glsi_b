package com.ega.bank.bank_api.controller;

import com.ega.bank.bank_api.dto.*;
import com.ega.bank.bank_api.service.ClientOperationsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Contrôleur pour les opérations bancaires spécifiques au client connecté
 * Conforme au cahier des charges : "possibilités pour un client de..."
 */
@RestController
@RequestMapping("/api/client")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ClientOperationsController {
    
    private final ClientOperationsService clientOperationsService;
    
    /**
     * Permet au client de faire un versement sur son compte
     */
    @PostMapping("/mes-comptes/{numeroCompte}/depot")
    @PreAuthorize("hasRole('CLIENT') or hasRole('ADMIN')")
    public ResponseEntity<TransactionDto> effectuerDepotSurMonCompte(
            @PathVariable String numeroCompte,
            @Valid @RequestBody OperationClientDto operationDto,
            Authentication authentication) {
        
        String username = authentication.getName();
        TransactionDto transaction = clientOperationsService.effectuerDepotClient(
            username, numeroCompte, operationDto);
        return new ResponseEntity<>(transaction, HttpStatus.CREATED);
    }
    
    /**
     * Permet au client de faire un retrait sur son compte si le solde le permet
     */
    @PostMapping("/mes-comptes/{numeroCompte}/retrait")
    @PreAuthorize("hasRole('CLIENT') or hasRole('ADMIN')")
    public ResponseEntity<TransactionDto> effectuerRetraitSurMonCompte(
            @PathVariable String numeroCompte,
            @Valid @RequestBody OperationClientDto operationDto,
            Authentication authentication) {
        
        String username = authentication.getName();
        TransactionDto transaction = clientOperationsService.effectuerRetraitClient(
            username, numeroCompte, operationDto);
        return new ResponseEntity<>(transaction, HttpStatus.CREATED);
    }
    
    /**
     * Permet au client de faire un virement d'un de ses comptes à un autre
     */
    @PostMapping("/mes-comptes/virement")
    @PreAuthorize("hasRole('CLIENT') or hasRole('ADMIN')")
    public ResponseEntity<List<TransactionDto>> effectuerVirementEntreComptes(
            @Valid @RequestBody VirementClientDto virementDto,
            Authentication authentication) {
        
        String username = authentication.getName();
        List<TransactionDto> transactions = clientOperationsService.effectuerVirementClient(
            username, virementDto);
        return new ResponseEntity<>(transactions, HttpStatus.CREATED);
    }
    
    /**
     * Afficher toutes les transactions effectuées sur un compte du client au cours d'une période donnée
     */
    @GetMapping("/mes-comptes/{numeroCompte}/transactions")
    @PreAuthorize("hasRole('CLIENT') or hasRole('ADMIN')")
    public ResponseEntity<List<TransactionDto>> getTransactionsDeMonCompte(
            @PathVariable String numeroCompte,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateDebut,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateFin,
            Authentication authentication) {
        
        String username = authentication.getName();
        List<TransactionDto> transactions;
        
        if (dateDebut != null && dateFin != null) {
            transactions = clientOperationsService.getTransactionsClientPeriode(
                username, numeroCompte, dateDebut, dateFin);
        } else {
            transactions = clientOperationsService.getTransactionsClient(username, numeroCompte);
        }
        
        return ResponseEntity.ok(transactions);
    }
    
    /**
     * Permet au client d'imprimer son relevé
     */
    @GetMapping("/mes-comptes/{numeroCompte}/releve")
    @PreAuthorize("hasRole('CLIENT') or hasRole('ADMIN')")
    public ResponseEntity<String> imprimerMonReleve(
            @PathVariable String numeroCompte,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateDebut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateFin,
            Authentication authentication) {
        
        String username = authentication.getName();
        String releve = clientOperationsService.genererReleveClient(
            username, numeroCompte, dateDebut, dateFin);
        
        return ResponseEntity.ok()
                .header("Content-Type", "text/plain; charset=UTF-8")
                .header("Content-Disposition", "attachment; filename=releve_" + numeroCompte + ".txt")
                .body(releve);
    }
    
    /**
     * Lister tous les comptes du client connecté
     */
    @GetMapping("/mes-comptes")
    @PreAuthorize("hasRole('CLIENT') or hasRole('ADMIN')")
    public ResponseEntity<List<CompteDto>> getMesComptes(Authentication authentication) {
        String username = authentication.getName();
        List<CompteDto> comptes = clientOperationsService.getComptesClient(username);
        return ResponseEntity.ok(comptes);
    }
    
    /**
     * Obtenir les informations du client connecté
     */
    @GetMapping("/mon-profil")
    @PreAuthorize("hasRole('CLIENT') or hasRole('ADMIN')")
    public ResponseEntity<ClientDto> getMonProfil(Authentication authentication) {
        String username = authentication.getName();
        ClientDto client = clientOperationsService.getProfilClient(username);
        return ResponseEntity.ok(client);
    }
}