package com.ega.ega_bank.controller;

import com.ega.ega_bank.dto.OperationRequest;
import com.ega.ega_bank.dto.TransactionDTO;
import com.ega.ega_bank.dto.VirementRequest;
import com.ega.ega_bank.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping("/depot")
    public ResponseEntity<TransactionDTO> deposer(@Valid @RequestBody OperationRequest request) {
        TransactionDTO transaction = transactionService.deposer(request);
        return new ResponseEntity<>(transaction, HttpStatus.CREATED);
    }

    @PostMapping("/retrait")
    public ResponseEntity<TransactionDTO> retirer(@Valid @RequestBody OperationRequest request) {
        TransactionDTO transaction = transactionService.retirer(request);
        return new ResponseEntity<>(transaction, HttpStatus.CREATED);
    }

    @PostMapping("/virement")
    public ResponseEntity<TransactionDTO> virement(@Valid @RequestBody VirementRequest request) {
        TransactionDTO transaction = transactionService.virement(request);
        return new ResponseEntity<>(transaction, HttpStatus.CREATED);
    }

    @GetMapping("/compte/{numeroCompte}")
    public ResponseEntity<List<TransactionDTO>> getTransactionsByCompte(@PathVariable String numeroCompte) {
        List<TransactionDTO> transactions = transactionService.getTransactionsByCompte(numeroCompte);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/compte/{numeroCompte}/periode")
    public ResponseEntity<List<TransactionDTO>> getTransactionsByPeriode(
            @PathVariable String numeroCompte,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateDebut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateFin) {
        List<TransactionDTO> transactions = transactionService.getTransactionsByPeriode(numeroCompte, dateDebut, dateFin);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping
    public ResponseEntity<List<TransactionDTO>> getAllTransactions() {
        List<TransactionDTO> transactions = transactionService.getAllTransactions();
        return ResponseEntity.ok(transactions);
    }
}
