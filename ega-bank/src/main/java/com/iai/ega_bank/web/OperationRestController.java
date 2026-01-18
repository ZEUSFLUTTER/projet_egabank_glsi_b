package com.iai.ega_bank.web;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.iai.ega_bank.dto.OperationDto;
import com.iai.ega_bank.services.OperationService;

@RestController
@RequestMapping("/api/v1")
public class OperationRestController {
    private final OperationService operationService;

    public OperationRestController(OperationService operationService) {
        this.operationService = operationService;

    }
    // ================== Versement (débit du compte) ==================
    @PostMapping("operation/debit")
   void  debit(@RequestBody OperationDto dto){
        this.operationService.debit(dto);
    }

    // ================== Versement (débit du compte) ==================
    @PostMapping("/operation/credit")
    public void credit(@RequestBody OperationDto dto) {
        this.operationService.credit(dto);
    }

    // ================== Transaction entre comptes ==================
    @PostMapping("/operation/transact")
    public void transact(@RequestBody OperationDto dto) {
        this.operationService.transact(dto);
    }

    // ================== Historique des opérations ==================
    @GetMapping("/operation/historique/{numCompte}")
    public Object getOperations(@PathVariable String numCompte) {
        return operationService.findOperationsByCompte(numCompte);
    }
}
