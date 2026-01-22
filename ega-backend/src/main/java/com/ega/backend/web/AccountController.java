package com.ega.backend.web;

import com.ega.backend.dto.account.AccountCreateRequest;
import com.ega.backend.dto.account.AccountResponse;
import com.ega.backend.service.AccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('CLIENT')")
    public ResponseEntity<AccountResponse> create(@RequestBody AccountCreateRequest req, Authentication authentication) {
        // Si c'est un client, il ne peut créer un compte que pour lui-même
        if (authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_CLIENT"))) {
            // Récupérer l'ID du client connecté
            String username = authentication.getName();
            Long clientId = accountService.getClientIdByUsername(username);
            if (clientId == null) {
                throw new RuntimeException("Impossible de créer un compte sans être authentifié comme client. Veuillez d'abord compléter votre profil client.");
            }
            // Validation manuelle pour les clients
            if (req.type() == null || req.type().trim().isEmpty()) {
                throw new IllegalArgumentException("Le type de compte est obligatoire");
            }
            // Pour les clients, forcer l'ownerId à leur propre ID et solde initial à 0
            AccountCreateRequest clientReq = new AccountCreateRequest(clientId, req.type(), BigDecimal.ZERO);
            return ResponseEntity.status(HttpStatus.CREATED).body(accountService.create(clientReq));
        }
        // Si c'est un admin, validation complète requise
        if (req.ownerId() == null) {
            throw new IllegalArgumentException("L'ID du propriétaire est obligatoire pour les administrateurs");
        }
        if (req.type() == null || req.type().trim().isEmpty()) {
            throw new IllegalArgumentException("Le type de compte est obligatoire");
        }
        if (req.initialBalance() != null && req.initialBalance().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Le solde initial doit être positif ou nul");
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(accountService.create(req));
    }

    @GetMapping("/by-number/{accountNumber}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('CLIENT') and @accountService.isAccountOwner(#accountNumber, authentication.name))")
    public ResponseEntity<AccountResponse> getByNumber(@PathVariable String accountNumber) {
        return ResponseEntity.ok(accountService.getByNumber(accountNumber));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('CLIENT') and @accountService.isAccountOwnerById(#id, authentication.name))")
    public ResponseEntity<AccountResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(accountService.getById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('CLIENT') and @accountService.isAccountOwnerById(#id, authentication.name))")
    public ResponseEntity<AccountResponse> update(@PathVariable Long id, @RequestBody @Valid com.ega.backend.dto.account.AccountCreateRequest req) {
        return ResponseEntity.ok(accountService.update(id, req));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('CLIENT') and @accountService.isAccountOwnerById(#id, authentication.name))")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        accountService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/balance")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('CLIENT') and @accountService.isAccountOwnerById(#id, authentication.name))")
    public ResponseEntity<com.ega.backend.dto.account.AccountBalanceResponse> getBalance(@PathVariable Long id) {
        return ResponseEntity.ok(accountService.getBalance(id));
    }

    @GetMapping("/by-client/{clientId}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('CLIENT') and #clientId == @accountService.getClientIdByUsername(authentication.name))")
    public ResponseEntity<List<AccountResponse>> getByClient(@PathVariable Long clientId) {
        return ResponseEntity.ok(accountService.findByClient(clientId));
    }

    @GetMapping("/user")
    @PreAuthorize("hasRole('ADMIN') or hasRole('CLIENT')")
    public ResponseEntity<List<AccountResponse>> getUserAccounts(Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(accountService.getUserAccounts(username));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AccountResponse>> getAllAccounts() {
        return ResponseEntity.ok(accountService.getAllAccounts());
    }

    @GetMapping("/owner/{ownerId}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('CLIENT') and #ownerId == @accountService.getClientIdByUsername(authentication.name))")
    public ResponseEntity<List<AccountResponse>> getByOwnerId(@PathVariable Long ownerId) {
        return ResponseEntity.ok(accountService.findByClient(ownerId));
    }

    @GetMapping("/{id}/statement")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('CLIENT') and @accountService.isOwner(#id, authentication.name))")
    public ResponseEntity<String> generateStatement(@PathVariable Long id, Authentication authentication) {
        String html = accountService.generateStatementHtml(id, authentication.getName());
        return ResponseEntity.ok()
                .header("Content-Type", "text/html; charset=UTF-8")
                .body(html);
    }
    
    @GetMapping("/{id}/statement/data")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('CLIENT') and @accountService.isOwner(#id, authentication.name))")
    public ResponseEntity<com.ega.backend.dto.account.AccountStatementResponse> getStatementData(@PathVariable Long id, Authentication authentication) {
        return ResponseEntity.ok(accountService.generateStatement(id, authentication.getName()));
    }
}