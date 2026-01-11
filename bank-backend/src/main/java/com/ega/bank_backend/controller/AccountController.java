package com.ega.bank_backend.controller;

import com.ega.bank_backend.dto.AccountRequestDTO;
import com.ega.bank_backend.dto.AccountResponseDTO;
import com.ega.bank_backend.service.AccountService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<AccountResponseDTO> createAccount(@Valid @RequestBody AccountRequestDTO dto) {
        return new ResponseEntity<>(accountService.createAccount(dto), HttpStatus.CREATED);
    }

    @GetMapping
    public List<AccountResponseDTO> getAllAccounts() {
        return accountService.getAllAccounts();
    }

    @GetMapping("/{accountNumber}")
    public AccountResponseDTO getAccountByNumber(@PathVariable String accountNumber) {
        return accountService.getAccountByNumber(accountNumber);
    }
}
