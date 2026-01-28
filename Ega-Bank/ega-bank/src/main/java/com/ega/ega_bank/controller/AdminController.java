package com.ega.ega_bank.controller;

import com.ega.ega_bank.dto.AdminRequest;
import com.ega.ega_bank.dto.ClientRequest;
import com.ega.ega_bank.dto.ClientResponse;
import com.ega.ega_bank.dto.CompteRequestAdmin;
import com.ega.ega_bank.dto.CompteResponse;
import com.ega.ega_bank.dto.ReleveResponse;
import com.ega.ega_bank.entite.Client;
import com.ega.ega_bank.entite.Compte;
import com.ega.ega_bank.entite.Transaction;
import com.ega.ega_bank.service.AdminService;
import com.ega.ega_bank.service.CompteService;
import com.ega.ega_bank.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;
    private final CompteService compteService;
    private final TransactionService transactionService;

    public AdminController(AdminService adminService, CompteService compteService, TransactionService transactionService) {
        this.adminService = adminService;
        this.compteService = compteService;
        this.transactionService = transactionService;
    }

    // --- ADMIN ---
    @PostMapping("/register")
    public Client register(@Valid @RequestBody AdminRequest req) {
        return adminService.createAdmin(req);
    }

    // --- CLIENT CRUD ---
    @PostMapping("/clients")
    public Client createClient(@Valid @RequestBody ClientRequest req) {
        return adminService.createClient(req);
    }

    @GetMapping("/clients")
    public List<ClientResponse> listClients() {
        List<Client> clients = adminService.listClients();
        return clients.stream()
            .map(client -> new ClientResponse(
                client.getId(),
                client.getNom(),
                client.getPrenom(),
                client.getDateNaissance(),
                client.getSexe(),
                client.getAdresse(),
                client.getTelephone(),
                client.getCourriel(),
                client.getNationalite(),
                client.getRole(),
                client.getComptes() != null ? client.getComptes().size() : 0
            ))
            .toList();
    }

    @GetMapping("/clients/count")
    public long countClients() {
        return adminService.countClients();
    }

    @GetMapping("/admins")
    public List<Client> listAdmins() {
        return adminService.listAdmins();
    }

    @GetMapping("/clients/{id}")
    public Client getClient(@PathVariable Long id) {
        return adminService.getClient(id);
    }

    @PutMapping("/clients/{id}")
    public Client updateClient(@PathVariable Long id, @Valid @RequestBody ClientRequest req) {
        return adminService.updateClient(id, req);
    }

    @DeleteMapping("/clients/{id}")
    public void deleteClient(@PathVariable Long id) {
        adminService.deleteClient(id);
    }

    // --- COMPTES ---
    @GetMapping("/clients/{id}/comptes")
    public List<CompteResponse> getComptesByClient(@PathVariable Long id) {
        List<Compte> comptes = compteService.listByClient(id);
        // Conversion en DTO pour éviter les références circulaires
        return comptes.stream()
            .map(compte -> new CompteResponse(
                compte.getId(),
                compte.getNumeroCompte(),
                compte.getType(),
                compte.getDateCreation(),
                compte.getSolde()
            ))
            .toList();
    }

    @PostMapping("/clients/{id}/comptes")
    public Compte createCompteForClient(@PathVariable Long id, @Valid @RequestBody CompteRequestAdmin req) {
        // S'assurer que l'ID du propriétaire correspond à l'ID dans l'URL
        req.setProprietaireId(id);
        return compteService.createForAnyClient(req);
    }

    // --- TRANSACTIONS ET HISTORIQUE ---
    @GetMapping("/clients/{id}/transactions")
    public List<Transaction> getTransactionsByClient(@PathVariable Long id) {
        return transactionService.historiqueClient(id);
    }

    @GetMapping("/clients/{id}/transactions/periode")
    public List<Transaction> getTransactionsByClientAndPeriode(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime debut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fin
    ) {
        return transactionService.transactionsByClientAndPeriode(id, debut, fin);
    }

    @GetMapping("/clients/{id}/releve")
    public ReleveResponse getReleveClient(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime debut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fin
    ) {
        return transactionService.genererReleveClient(id, debut, fin);
    }

    @GetMapping("/clients/{id}/releve/pdf")
    public ResponseEntity<byte[]> getReleveClientPdf(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime debut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fin
    ) {
        byte[] pdfBytes = transactionService.genererReleveClientPdf(id, debut, fin);
        
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=releve-client-" + id + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }
}
