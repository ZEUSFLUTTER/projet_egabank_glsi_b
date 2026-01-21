package com.ega.controller;

import com.ega.dto.OperationDTO;
import com.ega.dto.TransactionDTO;
import com.ega.dto.VirementDTO;
import com.ega.service.TransactionService;
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
@CrossOrigin(origins = "*")
public class TransactionController {

    private final TransactionService transactionService;

    @GetMapping
    public ResponseEntity<List<TransactionDTO>> getAllTransactions() {
        List<TransactionDTO> transactions = transactionService.getAllTransactions();
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransactionDTO> getTransactionById(@PathVariable Long id) {
        TransactionDTO transaction = transactionService.getTransactionById(id);
        return ResponseEntity.ok(transaction);
    }

    @GetMapping("/compte/{compteId}")
    public ResponseEntity<List<TransactionDTO>> getTransactionsByCompteId(@PathVariable Long compteId) {
        List<TransactionDTO> transactions = transactionService.getTransactionsByCompteId(compteId);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/compte/{compteId}/periode")
    public ResponseEntity<List<TransactionDTO>> getTransactionsByCompteIdAndPeriod(
            @PathVariable Long compteId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateDebut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateFin) {
        List<TransactionDTO> transactions = transactionService.getTransactionsByCompteIdAndPeriod(
                compteId, dateDebut, dateFin);
        return ResponseEntity.ok(transactions);
    }

    @PostMapping("/depot")
    public ResponseEntity<TransactionDTO> faireDepot(@Valid @RequestBody OperationDTO operationDTO) {
        TransactionDTO transaction = transactionService.faireDepot(operationDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(transaction);
    }

    @PostMapping("/retrait")
    public ResponseEntity<TransactionDTO> faireRetrait(@Valid @RequestBody OperationDTO operationDTO) {
        TransactionDTO transaction = transactionService.faireRetrait(operationDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(transaction);
    }

    @PostMapping("/virement")
    public ResponseEntity<TransactionDTO> faireVirement(@Valid @RequestBody VirementDTO virementDTO) {
        TransactionDTO transaction = transactionService.faireVirement(virementDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(transaction);
    }
}

