package com.ega.backend.controller;

import com.ega.backend.model.Client;
import com.ega.backend.model.Compte;
import com.ega.backend.model.Transaction;
import com.ega.backend.repository.ClientRepository;
import com.ega.backend.repository.CompteRepository;
import com.ega.backend.service.PdfService;
import com.ega.backend.service.TransactionService;
import com.ega.backend.service.CompteService; // ✅ Ajout de l'import
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/transaction")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private PdfService pdfService; // ✅ Injection du service PDF

    @Autowired
    private CompteService compteService; // ✅ Injection (si nécessaire, sinon retire)

    @Autowired
    private ClientRepository clientRepository; // ✅ Ajout de l'injection

    @Autowired
    private CompteRepository compteRepository; // ✅ Ajout de l'injection

    // ✅ Transactions d'un compte spécifique (utilisateur connecté ou admin)
    @GetMapping("/compte/{compteId}")
    // @PreAuthorize("hasRole('ADMIN') or @compteService.isCompteOwner(authentication.principal.username, #compteId)") // Désactivé temporairement
    public ResponseEntity<List<Transaction>> getTransactionsByCompteId(@PathVariable String compteId, Authentication authentication) {
        try {
            String email = authentication.getName();
            Optional<Client> clientOpt = clientRepository.findByEmail(email);
            if (clientOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            Client client = clientOpt.get();

            // ✅ Vérifier la propriété du compte
            Optional<Compte> compteOpt = compteRepository.findById(compteId);
            if (compteOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            Compte compte = compteOpt.get();
            if (!compte.getClientId().equals(client.getId()) && !client.getRole().equals("ADMIN")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            // Logique de récupération des transactions
            List<Transaction> transactions = transactionService.getTransactionsByCompteId(compteId);
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ✅ Transactions d'un compte sur une période (utilisateur connecté ou admin)
    @GetMapping("/compte/{compteId}/periode")
    // @PreAuthorize("hasRole('ADMIN') or @compteService.isCompteOwner(authentication.principal.username, #compteId)") // Désactivé temporairement
    public ResponseEntity<List<Transaction>> getTransactionsByCompteIdAndPeriod(
            @PathVariable String compteId,
            @RequestParam @DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            Authentication authentication) {
        try {
            String email = authentication.getName();
            Optional<Client> clientOpt = clientRepository.findByEmail(email);
            if (clientOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            Client client = clientOpt.get();

            // ✅ Vérifier la propriété du compte
            Optional<Compte> compteOpt = compteRepository.findById(compteId);
            if (compteOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            Compte compte = compteOpt.get();
            if (!compte.getClientId().equals(client.getId()) && !client.getRole().equals("ADMIN")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            // Logique de récupération des transactions
            List<Transaction> transactions = transactionService.getTransactionsByCompteIdAndPeriod(compteId, startDate, endDate);
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ✅ Toutes les transactions (admin seulement)
    @GetMapping
    // @PreAuthorize("hasRole('ADMIN')") // Géré via le rôle dans JwtAuthenticationFilter
    public ResponseEntity<List<Transaction>> getAllTransactions(Authentication authentication) {
        // Vérifier que l'utilisateur est admin
        if (!authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        List<Transaction> transactions = transactionService.getAllTransactions();
        return ResponseEntity.ok(transactions);
    }

    // ✅ Transactions de l'utilisateur connecté
    @GetMapping("/my-transactions")
    public ResponseEntity<List<Transaction>> getMyTransactions(Authentication authentication) {
        String email = authentication.getName();
        List<Transaction> transactions = transactionService.getTransactionsByEmail(email);
        return ResponseEntity.ok(transactions);
    }

    // ✅ Télécharger les transactions en PDF (utilisateur connecté)
    @GetMapping("/my-transactions/pdf")
    public ResponseEntity<byte[]> getPdfMyTransactions(Authentication authentication) {
        String email = authentication.getName();
        List<Transaction> transactions = transactionService.getTransactionsByEmail(email);

        byte[] pdfBytes = pdfService.generateTransactionPdf(transactions);

        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=transactions.pdf")
                .contentType(org.springframework.http.MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }

    // ✅ Télécharger les transactions d'un compte en PDF (admin ou propriétaire du compte)
    @GetMapping("/compte/{compteId}/pdf")
    // @PreAuthorize("hasRole('ADMIN') or @compteService.isCompteOwner(authentication.principal.username, #compteId)") // Désactivé temporairement
    public ResponseEntity<byte[]> getPdfTransactionsByCompteId(@PathVariable String compteId, Authentication authentication) {
        try {
            String email = authentication.getName();
            Optional<Client> clientOpt = clientRepository.findByEmail(email);
            if (clientOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            Client client = clientOpt.get();

            // ✅ Vérifier la propriété du compte OU le rôle admin
            Optional<Compte> compteOpt = compteRepository.findById(compteId);
            if (compteOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            Compte compte = compteOpt.get();
            if (!compte.getClientId().equals(client.getId()) && !client.getRole().equals("ADMIN")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            // Récupération des transactions pour ce compte
            List<Transaction> transactions = transactionService.getTransactionsByCompteId(compteId); // ou ce que fait ton service
            byte[] pdfBytes = pdfService.generateTransactionPdf(transactions);

            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=releve_compte_" + compteId + ".pdf")
                    .contentType(org.springframework.http.MediaType.APPLICATION_PDF)
                    .body(pdfBytes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ✅ Télécharger TOUTES les transactions en PDF (admin seulement)
    @GetMapping("/all-transactions/pdf")
    // @PreAuthorize("hasRole('ADMIN')") // Géré via le rôle dans JwtAuthenticationFilter
    public ResponseEntity<byte[]> getPdfAllTransactions(Authentication authentication) {
        // Vérifier que l'utilisateur est admin
        if (!authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List<Transaction> transactions = transactionService.getAllTransactions();

        byte[] pdfBytes = pdfService.generateTransactionPdf(transactions);

        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=all_transactions.pdf")
                .contentType(org.springframework.http.MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }
}