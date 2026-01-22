package com.iai.projet.banque.controllers;

import com.iai.projet.banque.entity.Operation;
import com.iai.projet.banque.models.OperationDTO;
import com.iai.projet.banque.models.ReleveDTO;
import com.iai.projet.banque.service.OperationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedList;
import java.util.List;

@RestController
@RequestMapping("/api/operations")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OperationController {
    @Autowired
    private OperationService operationService;

    @PostMapping("/depot")
    public ResponseEntity depotCompte(@RequestBody OperationDTO operation) {
        try {
            OperationDTO createdOperation = operationService.depotCompte(operation);
            return new ResponseEntity<>(createdOperation, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }

    }

    @GetMapping("/historique/depot")
    public ResponseEntity getTransactionDepotByUsername(@RequestParam String username) {
        try {
            if (username != null && !username.isEmpty()) {
                List<Operation> createdOperation = operationService.getTransactionsDepot(username);
                return new ResponseEntity<>(createdOperation, HttpStatus.CREATED);
            }
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
        return new ResponseEntity<>("Aucun client connecté ", HttpStatus.BAD_REQUEST);
    }


    @PostMapping("/retrait")
    public ResponseEntity retraitCompte(@RequestBody OperationDTO operation) {
        try {
            OperationDTO createdOperation = operationService.retraitCompte(operation);
            return new ResponseEntity(createdOperation, HttpStatus.OK);
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }

    }

    @GetMapping("/historique/retrait")
    public ResponseEntity getTransactionRetraitByUsername(@RequestParam String username) {
        try {
            if (username != null && !username.isEmpty()) {
                List<Operation> createdOperation = operationService.getTransactionsRetrait(username);
                return new ResponseEntity<>(createdOperation, HttpStatus.CREATED);
            }
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
        return new ResponseEntity<>("Aucun client connecté ", HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/virement")
    public ResponseEntity virementCompte(@RequestBody OperationDTO operationDTO) {
        try {
            OperationDTO vir = operationService.virementCompte(operationDTO);
            return new ResponseEntity(vir, HttpStatus.OK);
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }

    }

    @GetMapping("/historique/virement")
    public ResponseEntity getTransactionVirementByUsername(@RequestParam String username) {
        try {
            if (username != null && !username.isEmpty()) {
                List<Operation> createdOperation = operationService.getTransactionsVirement(username);
                return new ResponseEntity<>(createdOperation, HttpStatus.CREATED);
            }
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
        return new ResponseEntity<>("Aucun client connecté ", HttpStatus.BAD_REQUEST);
    }

    /**
     * GET /api/operations/transactions?username=john&dateDebut=2024-01-01&dateFin=2024-12-31
     * Récupérer les transactions d'un client avec filtres optionnels
     */
    @GetMapping("/releve")
    public ResponseEntity getReleveByUsername(
            @RequestParam String username,
            @RequestParam(required = false) String dateDebut) {

        List<Operation> transactions = new LinkedList<>();

        // Si des dates sont fournies, filtrer
        if ((dateDebut != null && !dateDebut.isEmpty()) && username != null) {
            transactions = operationService.getAllOperationByDateDebutDateFinAndUsername(
                    username, dateDebut
            );
        }
        return new ResponseEntity<>(transactions, HttpStatus.OK);
    }
}
