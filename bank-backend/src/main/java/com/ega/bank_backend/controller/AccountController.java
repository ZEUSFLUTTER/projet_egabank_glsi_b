package com.ega.bank_backend.controller;

import com.ega.bank_backend.dto.AccountRequestDTO;
import com.ega.bank_backend.dto.AccountResponseDTO;
import com.ega.bank_backend.service.AccountService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AccountResponseDTO> createAccount(@Valid @RequestBody AccountRequestDTO dto) {
        return new ResponseEntity<>(accountService.createAccount(dto), HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<AccountResponseDTO> getAllAccounts() {
        return accountService.getAllAccounts();
    }

    @GetMapping("/{accountNumber}")
    @PreAuthorize("hasRole('ADMIN') or @clientSecurity.isAccountOwner(authentication, #accountNumber)")
    public AccountResponseDTO getAccountByNumber(@PathVariable String accountNumber) {
        return accountService.getAccountByNumber(accountNumber);
    }

    @GetMapping("/my-accounts")
    public List<AccountResponseDTO> getMyAccounts(Authentication authentication) {
        return accountService.getAccountsByUsername(authentication.getName());
    }
}
