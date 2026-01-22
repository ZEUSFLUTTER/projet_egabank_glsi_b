package com.ega.backend.web;

import com.ega.backend.dto.transaction.DepositWithdrawRequest;
import com.ega.backend.dto.transaction.TransactionResponse;
import com.ega.backend.dto.transaction.TransferRequest;
import com.ega.backend.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping("/deposit")
    public ResponseEntity<TransactionResponse> deposit(@RequestBody @Valid DepositWithdrawRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(transactionService.deposit(req));
    }

    @PostMapping("/withdraw")
    public ResponseEntity<TransactionResponse> withdraw(@RequestBody @Valid DepositWithdrawRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(transactionService.withdraw(req));
    }

    @PostMapping("/transfer")
    public ResponseEntity<TransactionResponse> transfer(@RequestBody @Valid TransferRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(transactionService.transfer(req));
    }

    @GetMapping("/history")
    public ResponseEntity<List<TransactionResponse>> history(
            @RequestParam String accountNumber,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant to
    ) {
        return ResponseEntity.ok(transactionService.historyByAccountNumber(accountNumber, from, to));
    }

    @GetMapping("/user")
    public ResponseEntity<List<TransactionResponse>> getUserTransactions(Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(transactionService.getUserTransactions(username));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<TransactionResponse>> getAllTransactions() {
        return ResponseEntity.ok(transactionService.getAllTransactions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransactionResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(transactionService.getById(id));
    }

    @GetMapping("/account/{accountId}")
    public ResponseEntity<List<TransactionResponse>> getByAccountId(@PathVariable Long accountId, @RequestParam(required = false) Integer limit) {
        if (limit != null) {
            return ResponseEntity.ok(transactionService.getByAccountIdLimited(accountId, limit));
        }
        return ResponseEntity.ok(transactionService.getByAccountId(accountId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TransactionResponse> updateTransaction(@PathVariable Long id, @RequestBody @Valid com.ega.backend.dto.transaction.GenericTransactionRequest req) {
        return ResponseEntity.ok(transactionService.updateTransaction(id, req));
    }
    @PostMapping
    public ResponseEntity<TransactionResponse> createGeneric(@RequestBody @Valid com.ega.backend.dto.transaction.GenericTransactionRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(transactionService.createGeneric(req));
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<TransactionResponse>> dateRange(
            @RequestParam(name = "from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant from,
            @RequestParam(name = "to") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant to
    ) {
        return ResponseEntity.ok(transactionService.findByDateRange(from, to));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        transactionService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
