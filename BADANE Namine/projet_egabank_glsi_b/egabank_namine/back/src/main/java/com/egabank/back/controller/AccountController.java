package com.egabank.back.controller;

import com.egabank.back.model.User;
import com.egabank.back.repository.UserRepository;
import com.egabank.back.model.Account;
import com.egabank.back.repository.AccountRepository;
import com.egabank.back.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/accounts")
@CrossOrigin(origins = "*")
public class AccountController {
    
    @Autowired
    private AccountRepository accountRepository;
    
    @Autowired
    private AccountService accountService;
    
    @GetMapping
    public List<Account> getAllAccounts() {
        return accountRepository.findAll();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Account> getAccountById(@PathVariable Long id) {
        return accountRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/numero/{numero}")
    public ResponseEntity<Account> getAccountByNumber(@PathVariable String numero) {
        return accountRepository.findByNumeroCompte(numero)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/client/{clientId}")
    public List<Account> getAccountsByClient(@PathVariable Long clientId) {
        return accountRepository.findByClientId(clientId);
    }
    
    @PostMapping
    public ResponseEntity<?> createAccount(@RequestBody Account account) {
        try {
            Account created = accountService.createAccount(account);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Account> updateAccount(@PathVariable Long id, @RequestBody Account accountDetails) {
        return accountRepository.findById(id)
            .map(account -> {
                account.setTypeCompte(accountDetails.getTypeCompte());
                account.setActif(accountDetails.isActif());
                return ResponseEntity.ok(accountRepository.save(account));
            })
            .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAccount(@PathVariable Long id) {
        if (accountRepository.existsById(id)) {
            accountRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Compte supprimé"));
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/client/{clientId}/solde-total")
    public ResponseEntity<?> getTotalSolde(@PathVariable Long clientId) {
        try {
            java.math.BigDecimal total = accountRepository.getTotalSoldeByClientId(clientId);
            return ResponseEntity.ok(Map.of("clientId", clientId, "soldeTotal", total));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}