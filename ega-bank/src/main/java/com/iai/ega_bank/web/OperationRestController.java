package com.iai.ega_bank.web;

import com.iai.ega_bank.entities.CompteBancaire;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.iai.ega_bank.dto.OperationDto;
import com.iai.ega_bank.services.OperationService;

import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class OperationRestController {
    private final OperationService operationService;

    public OperationRestController(OperationService operationService) {
        this.operationService = operationService;
    }
    // ================== Versement (débit du compte) ==================
    @PostMapping("/operation/debit")
    public ResponseEntity<?> debit(@RequestBody OperationDto dto) {

        CompteBancaire compte = operationService.debit(dto);

        return ResponseEntity.ok(
                Map.of(
                        "message", "Versement effectué avec succès",
                        "clientId", compte.getClient().getId(),
                        "numCompte", compte.getNumCompte(),
                        "balance", compte.getBalance()
                )
        );
    }


    // ================== Versement (débit du compte) ==================
    @PostMapping("/operation/credit")
    public ResponseEntity<?> credit(@RequestBody OperationDto dto) {

        CompteBancaire compte = operationService.credit(dto);

        return ResponseEntity.ok(
                Map.of(
                        "message", "Retrait effectué avec succès",
                        "clientId", compte.getClient().getId(),
                        "numCompte", compte.getNumCompte(),
                        "balance", compte.getBalance()
                )
        );
    }


    // ================== Transaction entre comptes ==================
    @PostMapping("/operation/transact")
    public ResponseEntity<?> transact(@RequestBody OperationDto dto) {

        boolean success = operationService.transact(dto);

        if (success) {
            return ResponseEntity.ok(
                    Map.of(
                            "message", "Transaction effectuée avec succès",
                            "numCompteSource", dto.getNumCompteSource(),
                            "numCompteDestination", dto.getNumCompteDestination(),
                            "amount", dto.getAmount()
                    )
            );
        }

        return ResponseEntity.badRequest().body("Échec de la transaction");
    }


    // ================== Historique des opérations ==================
    @GetMapping("/operation/historique/{numCompte}")
    public Object getOperations(@PathVariable String numCompte) {
        return operationService.findOperationsByCompte(numCompte);
    }
}
