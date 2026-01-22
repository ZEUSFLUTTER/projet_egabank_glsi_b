package com.ega.bank.bank_api.controller;

import com.ega.bank.bank_api.dto.*;
import com.ega.bank.bank_api.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TransactionController {
    
    private final TransactionService transactionService;
    
    @GetMapping
    public ResponseEntity<List<TransactionDto>> getAllTransactions() {
        List<TransactionDto> transactions = transactionService.getAllTransactions();
        return ResponseEntity.ok(transactions);
    }
    
    @GetMapping("/compte/{numeroCompte}")
    public ResponseEntity<List<TransactionDto>> getTransactionsByCompte(@PathVariable String numeroCompte) {
        List<TransactionDto> transactions = transactionService.getTransactionsByCompte(numeroCompte);
        return ResponseEntity.ok(transactions);
    }
    
    @GetMapping("/compte/{numeroCompte}/periode")
    public ResponseEntity<List<TransactionDto>> getTransactionsByComptePeriode(
            @PathVariable String numeroCompte,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateDebut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateFin) {
        List<TransactionDto> transactions = transactionService.getTransactionsByComptePeriode(numeroCompte, dateDebut, dateFin);
        return ResponseEntity.ok(transactions);
    }
    
    @PostMapping("/depot")
    public ResponseEntity<TransactionDto> effectuerDepot(@Valid @RequestBody OperationDto operationDto) {
        TransactionDto transaction = transactionService.effectuerDepot(operationDto);
        return new ResponseEntity<>(transaction, HttpStatus.CREATED);
    }
    
    @PostMapping("/retrait")
    public ResponseEntity<TransactionDto> effectuerRetrait(@Valid @RequestBody OperationDto operationDto) {
        TransactionDto transaction = transactionService.effectuerRetrait(operationDto);
        return new ResponseEntity<>(transaction, HttpStatus.CREATED);
    }
    
    @PostMapping("/virement")
    public ResponseEntity<List<TransactionDto>> effectuerVirement(@Valid @RequestBody VirementDto virementDto) {
        List<TransactionDto> transactions = transactionService.effectuerVirement(virementDto);
        return new ResponseEntity<>(transactions, HttpStatus.CREATED);
    }
}