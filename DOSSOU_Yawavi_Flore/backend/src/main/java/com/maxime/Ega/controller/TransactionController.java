package com.maxime.Ega.controller;

import com.maxime.Ega.Exeption.ApiResponse;
import com.maxime.Ega.dto.transaction.*;
import com.maxime.Ega.service.ITransactionService;
import com.maxime.Ega.service.TransactionServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(path = "/transaction")
@RequiredArgsConstructor
public class TransactionController {
    private final ITransactionService iTransactionService;
    private final TransactionServiceImpl transactionService;

    //controller pour faire un depot
    //@PreAuthorize("hasAnyRole('ADMIN','CAISSIERE')")
    @PreAuthorize("hasRole('CAISSIERE')")
    @PostMapping(path = "/depot")
    public ResponseEntity<ApiResponse> deposit(@RequestBody TransactionDepWithDto  transactionDepWithDto) {
        iTransactionService.deposit(transactionDepWithDto);
        return ResponseEntity.ok(new ApiResponse("depot effectuer avec succes"));
    }

    //controller pour faire un retrait
    //@PreAuthorize("hasAnyRole('ADMIN','CAISSIERE')")
    @PreAuthorize("hasRole('CAISSIERE')")
    @PostMapping(path = "/retrait")
    public ResponseEntity<ApiResponse> withdraw(@RequestBody TransactionDepWithDto  transactionDepWithDto) {
        iTransactionService.withdraw(transactionDepWithDto);
        return ResponseEntity.ok(new ApiResponse("Retrait effectuer avec succes"));
    }

    //controller pour le transfer
    //@PreAuthorize("hasRole('CAISSIERE')")
    //@PreAuthorize("hasAnyRole('ADMIN','CAISSIERE')")
    @PreAuthorize("hasRole('CAISSIERE')")
    @PostMapping(path = "/transfert")
    public ResponseEntity<ApiResponse> transfer(@RequestBody TransferDto transferDto) {
        iTransactionService.transfer(transferDto);
        return ResponseEntity.ok(new ApiResponse("transfer effectuer avec succes"));
    }

    //controller pour retourner l'historique des transactions
    @PreAuthorize("hasAnyRole('ADMIN','GESTIONNAIRE')")
    //@PreAuthorize("hasRole('GESTIONNAIRE')")
    @PostMapping(path = "/historique")
    public ResponseEntity<List<HistoriqueTransactionDto>> findByAccount_AccountNumberAndTransactionDateBetween(
            @RequestBody DemandeHistoriqueDto demandeHistoriqueDto) {
        List<HistoriqueTransactionDto> historique = transactionService.findHistoriqueTransactionByAccountNumber(demandeHistoriqueDto);
        return ResponseEntity.ok(historique);
    }
}