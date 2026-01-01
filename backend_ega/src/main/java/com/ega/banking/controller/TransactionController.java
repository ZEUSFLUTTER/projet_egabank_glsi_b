package com.ega.banking.controller;

import com.ega.banking.dto.*;
import com.ega.banking.service.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
@Tag(name = "Transactions", description = "API de gestion des transactions bancaires")
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping("/depot")
    @Operation(summary = "Effectuer un dépôt")
    public ResponseEntity<TransactionDTO> effectuerDepot(@Valid @RequestBody DepotRequest request) {
        return new ResponseEntity<>(transactionService.effectuerDepot(request), HttpStatus.CREATED);
    }

    @PostMapping("/retrait")
    @Operation(summary = "Effectuer un retrait")
    public ResponseEntity<TransactionDTO> effectuerRetrait(@Valid @RequestBody RetraitRequest request) {
        return new ResponseEntity<>(transactionService.effectuerRetrait(request), HttpStatus.CREATED);
    }

    @PostMapping("/virement")
    @Operation(summary = "Effectuer un virement")
    public ResponseEntity<TransactionDTO> effectuerVirement(@Valid @RequestBody VirementRequest request) {
        return new ResponseEntity<>(transactionService.effectuerVirement(request), HttpStatus.CREATED);
    }

    @GetMapping("/compte/{compteId}")
    @Operation(summary = "Obtenir toutes les transactions d'un compte")
    public ResponseEntity<List<TransactionDTO>> obtenirTransactionsParCompte(@PathVariable Long compteId) {
        return ResponseEntity.ok(transactionService.obtenirTransactionsParCompte(compteId));
    }
}
