package com.ega.ega_bank.controller;

import com.ega.ega_bank.dto.CompteRequestClient;
import com.ega.ega_bank.dto.CompteRequestAdmin;
import com.ega.ega_bank.dto.CompteResponse;
import com.ega.ega_bank.dto.OperationRequest;
import com.ega.ega_bank.dto.ReleveResponse;
import com.ega.ega_bank.entite.Compte;
import com.ega.ega_bank.entite.Transaction;
import com.ega.ega_bank.exception.BusinessException;
import com.ega.ega_bank.service.CompteService;
import com.ega.ega_bank.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/comptes")
public class CompteController {

    private final CompteService service;
    private final TransactionService txService;

    public CompteController(CompteService service, TransactionService txService) {
        this.service = service;
        this.txService = txService;
    }

    // Création de compte par le client connecté
    @PostMapping
    public Compte createForConnectedClient(@Valid @RequestBody CompteRequestClient req) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return service.createForConnectedClient(req, email);
    }

    // Création de compte par l'admin
    @PostMapping("/admin")
    public Compte createForAnyClient(@Valid @RequestBody CompteRequestAdmin req) {
        return service.createForAnyClient(req);
    }

    // ADMIN : afficher les comptes d’un client donné
    @GetMapping("/client/{clientId}")
    public List<Compte> listByClient(@PathVariable Long clientId) {
        return service.listByClient(clientId);
    }

    // CLIENT : afficher uniquement ses propres comptes
    @GetMapping("/mes-comptes")
    public List<CompteResponse> listMyComptes() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println("🔍 Récupération des comptes pour l'email: " + email);
        
        List<Compte> comptes = service.listByClientEmail(email);
        System.out.println("📊 Nombre de comptes trouvés: " + comptes.size());
        
        // Conversion en DTO pour éviter les références circulaires
        List<CompteResponse> comptesResponse = comptes.stream()
            .map(compte -> new CompteResponse(
                compte.getId(),
                compte.getNumeroCompte(),
                compte.getType(),
                compte.getDateCreation(),
                compte.getSolde()
            ))
            .toList();
            
        System.out.println("✅ Comptes convertis en DTO: " + comptesResponse.size());
        return comptesResponse;
    }

    @GetMapping("/{numero}")
    public Compte getByNumero(@PathVariable String numero) {
        return service.getByNumero(numero);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    // Opérations (dépôt, retrait, virement)
    @PostMapping("/operations")
    public Transaction operation(@Valid @RequestBody OperationRequest req) {
        String emailConnecte = SecurityContextHolder.getContext().getAuthentication().getName();

        return switch (req.getType()) {
            case DEPOT ->
                    txService.depot(
                            req.getNumeroCompteSource(),
                            req.getMontant(),
                            req.getDescription(),
                            emailConnecte
                    );
            case RETRAIT ->
                    txService.retrait(
                            req.getNumeroCompteSource(),
                            req.getMontant(),
                            req.getDescription(),
                            emailConnecte
                    );
            case VIREMENT -> {
                if (req.getNumeroCompteDestination() == null) {
                    throw new BusinessException("Destination requise pour virement");
                }
                yield txService.virement(
                        req.getNumeroCompteSource(),
                        req.getNumeroCompteDestination(),
                        req.getMontant(),
                        req.getDescription(),
                        emailConnecte
                );
            }
        };
    }

    // Opérations par l'admin (sans vérification de propriétaire)
    @PostMapping("/admin/operation")
    public Transaction adminOperation(@Valid @RequestBody OperationRequest req) {
        String emailAdmin = SecurityContextHolder.getContext().getAuthentication().getName();

        return switch (req.getType()) {
            case DEPOT ->
                    txService.depotAdmin(
                            req.getNumeroCompteSource(),
                            req.getMontant(),
                            req.getDescription(),
                            emailAdmin
                    );
            case RETRAIT ->
                    txService.retraitAdmin(
                            req.getNumeroCompteSource(),
                            req.getMontant(),
                            req.getDescription(),
                            emailAdmin
                    );
            case VIREMENT -> {
                if (req.getNumeroCompteDestination() == null) {
                    throw new BusinessException("Destination requise pour virement");
                }
                yield txService.virementAdmin(
                        req.getNumeroCompteSource(),
                        req.getNumeroCompteDestination(),
                        req.getMontant(),
                        req.getDescription(),
                        emailAdmin
                );
            }
        };
    }

    @GetMapping("/{numero}/transactions")
    public List<Transaction> transactions(
            @PathVariable String numero,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime debut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fin
    ) {
        Compte compte = service.getByNumero(numero);
        return txService.transactionsParPeriode(compte.getId(), debut, fin);
    }

    // Relevé JSON classique
    @GetMapping("/{numero}/releve")
    public ReleveResponse releve(
            @PathVariable String numero,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime debut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fin
    ) {
        return txService.genererReleve(numero, debut, fin);
    }

    // Relevé PDF téléchargeable
    @GetMapping("/{numero}/releve/pdf")
    public ResponseEntity<byte[]> relevePdf(
            @PathVariable String numero,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime debut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fin
    ) {
        byte[] pdfBytes = txService.genererRelevePdf(numero, debut, fin);

        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=releve.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }
}
