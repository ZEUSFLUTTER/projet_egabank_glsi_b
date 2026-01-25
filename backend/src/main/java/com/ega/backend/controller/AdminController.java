package com.ega.backend.controller;

import com.ega.backend.model.*;
import com.ega.backend.repository.*;
import com.ega.backend.service.AuditLogService;
import com.ega.backend.service.ClientService; // <--- Ajout pour récupérer userName
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')") // ✅ Toutes les routes nécessitent ROLE_ADMIN
public class AdminController {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private CompteRepository compteRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuditLogService auditLogService;

    @Autowired
    private ClientService clientService; // <--- Injection du ClientService

    @Autowired
    private MongoTemplate mongoTemplate; // Pour les requêtes complexes si nécessaire


    // ✅ Créer un client (admin seulement)
    @PostMapping("/client/create")
    public ResponseEntity<?> createClient(@RequestBody Client client) {
        // Vérifier si le client existe déjà (par email)
        if (clientRepository.findByEmail(client.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Client exists"));
        }

        // Encoder le mot de passe
        String encodedPassword = passwordEncoder.encode(client.getPassword());
        client.setPassword(encodedPassword);

        // Définir le rôle par défaut à CLIENT si non spécifié
        if (client.getRole() == null || client.getRole().isEmpty()) {
            client.setRole("CLIENT");
        }

        // Définir le statut KYC par défaut à EN_ATTENTE
        if (client.getStatutKYC() == null || client.getStatutKYC().isEmpty()) {
            client.setStatutKYC("EN_ATTENTE");
        }

        // Définir la date de création
        client.setCreatedAt(LocalDateTime.now());

        Client savedClient = clientRepository.save(client);

        // Log l'action - CORRIGÉ
        auditLogService.logAction("CREATE_CLIENT", savedClient.getId(), savedClient.getNom() + " " + savedClient.getPrenom(), "Client", savedClient.getId(), "Création du client via interface admin");

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Client créé avec succès");
        response.put("client", savedClient);

        return ResponseEntity.ok(response);
    }

    // ✅ Changer le statut d'un client (actif/inactif) - Exemple
    @PutMapping("/client/{id}/toggle-status")
    public ResponseEntity<?> toggleClientStatus(@PathVariable String id) {
        Optional<Client> clientOpt = clientRepository.findById(id);
        if (clientOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Client introuvable"));
        }

        Client client = clientOpt.get();
        boolean newStatus = !client.getIsActive(); // Inverser le statut actuel
        client.setIsActive(newStatus);
        Client updatedClient = clientRepository.save(client);

        // Log l'action - CORRIGÉ
        auditLogService.logAction("TOGGLE_CLIENT_STATUS", client.getId(), client.getNom() + " " + client.getPrenom(), "Client", client.getId(), "Statut changé à " + newStatus);

        return ResponseEntity.ok(updatedClient);
    }

    // ✅ Obtenir la liste de tous les clients
    @GetMapping("/clients")
    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }

    // ✅ Obtenir un client par ID
    @GetMapping("/client/{id}")
    public ResponseEntity<Client> getClientById(@PathVariable String id) {
        Optional<Client> clientOpt = clientRepository.findById(id);
        if (clientOpt.isPresent()) {
            return ResponseEntity.ok(clientOpt.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // ✅ Obtenir la liste de tous les comptes
    @GetMapping("/comptes")
    public List<Compte> getAllComptes() {
        return compteRepository.findAll();
    }

    // ✅ Obtenir un compte par ID
    @GetMapping("/compte/{id}")
    public ResponseEntity<Compte> getCompteById(@PathVariable String id) {
        Optional<Compte> compteOpt = compteRepository.findById(id);
        if (compteOpt.isPresent()) {
            return ResponseEntity.ok(compteOpt.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // ✅ Obtenir la liste de toutes les transactions
    @GetMapping("/transactions")
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    // ✅ Obtenir une transaction par ID
    @GetMapping("/transaction/{id}")
    public ResponseEntity<Transaction> getTransactionById(@PathVariable String id) {
        Optional<Transaction> transactionOpt = transactionRepository.findById(id);
        if (transactionOpt.isPresent()) {
            return ResponseEntity.ok(transactionOpt.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // ✅ Obtenir les transactions entre deux dates (facultatif)
    @GetMapping("/transactions/date-range")
    public List<Transaction> getTransactionsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        Query query = new Query();
        query.addCriteria(Criteria.where("date").gte(startDate.atStartOfDay()).lte(endDate.atTime(23, 59, 59)));
        return mongoTemplate.find(query, Transaction.class);
    }

    // ✅ Journal d'audit - VERSION DTO : Renvoie les objets enrichis via DTO
    @GetMapping("/logs")
    public ResponseEntity<List<AuditLogDto>> getAuditLogs() { // <--- Retourne des DTOs
        List<AuditLogDto> logs = auditLogService.findAllAsDto(); // <--- Appelle la nouvelle méthode
        return ResponseEntity.ok(logs);
    }

    // ✅ Nouvel endpoint : Obtenir les statistiques globales
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getGlobalStats() {
        long totalClients = clientRepository.count(); // Compter tous les clients
        long totalComptes = compteRepository.count(); // Compter tous les comptes
        long totalTransactions = transactionRepository.count(); // Compter toutes les transactions

        // Calculer le solde total des fonds dans les comptes actifs
        List<Compte> comptesActifs = compteRepository.findByIsActiveTrue(); // Trouver les comptes actifs
        BigDecimal soldeTotalFonds = comptesActifs.stream()
            .map(Compte::getSolde)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Compter les comptes actifs et inactifs
        long comptesActifsCount = compteRepository.countByIsActiveTrue();
        long comptesInactifsCount = compteRepository.countByIsActiveFalse();

        // Compter les clients avec statut KYC approuvé/en attente
        long kycApprouveCount = clientRepository.countByStatutKYC("APPROUVE");
        long kycEnAttenteCount = clientRepository.countByStatutKYC("EN_ATTENTE");

        // Construire la réponse
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalClients", totalClients);
        stats.put("totalComptes", totalComptes);
        stats.put("totalTransactions", totalTransactions);
        stats.put("soldeTotalFonds", soldeTotalFonds);
        stats.put("comptesActifs", comptesActifsCount);
        stats.put("comptesInactifs", comptesInactifsCount);
        stats.put("kycApprouve", kycApprouveCount);
        stats.put("kycEnAttente", kycEnAttenteCount);

        return ResponseEntity.ok(stats);
    }

}