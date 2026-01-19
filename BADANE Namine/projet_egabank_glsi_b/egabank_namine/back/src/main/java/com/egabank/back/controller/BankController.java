package com.egabank.back.controller;


import com.egabank.back.model.User;
import com.egabank.back.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/bank")
@CrossOrigin(origins = "*")
public class BankController {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    // Utilisation des procédures stockées directement
    @PostMapping("/depot")
    public ResponseEntity<?> depotViaProcedure(@RequestBody Map<String, Object> request) {
        try {
            Long compteId = Long.parseLong(request.get("compteId").toString());
            Double montant = Double.parseDouble(request.get("montant").toString());
            
            jdbcTemplate.update("CALL sp_depot(?, ?)", 
                compteId, 
                montant);
            return ResponseEntity.ok(Map.of("message", "Dépôt effectué via procédure"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/retrait")
    public ResponseEntity<?> retraitViaProcedure(@RequestBody Map<String, Object> request) {
        try {
            Long compteId = Long.parseLong(request.get("compteId").toString());
            Double montant = Double.parseDouble(request.get("montant").toString());
            
            jdbcTemplate.update("CALL sp_retrait(?, ?)", 
                compteId, 
                montant);
            return ResponseEntity.ok(Map.of("message", "Retrait effectué via procédure"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/virement")
    public ResponseEntity<?> virementViaProcedure(@RequestBody Map<String, Object> request) {
        try {
            Long source = Long.parseLong(request.get("source").toString());
            Long destination = Long.parseLong(request.get("destination").toString());
            Double montant = Double.parseDouble(request.get("montant").toString());
            
            jdbcTemplate.update("CALL sp_virement(?, ?, ?)", 
                source, 
                destination, 
                montant);
            return ResponseEntity.ok(Map.of("message", "Virement effectué via procédure"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    // Appeler les vues SQL directement
    @GetMapping("/vues/clients-comptes")
    public List<Map<String, Object>> getClientsComptes() {
        return jdbcTemplate.queryForList("SELECT * FROM v_clients_comptes");
    }
    
    @GetMapping("/vues/transactions-detail")
    public List<Map<String, Object>> getTransactionsDetail() {
        return jdbcTemplate.queryForList("SELECT * FROM v_transactions_detail");
    }
    
    @GetMapping("/vues/transactions-jour")
    public List<Map<String, Object>> getTransactionsParJour() {
        return jdbcTemplate.queryForList("SELECT * FROM v_transactions_par_jour");
    }
    
    @GetMapping("/vues/virements")
    public List<Map<String, Object>> getVirements() {
        return jdbcTemplate.queryForList("SELECT * FROM v_virements");
    }
    
    @GetMapping("/vues/solde-client/{clientId}")
    public ResponseEntity<?> getSoldeClient(@PathVariable Long clientId) {
        try {
            List<Map<String, Object>> result = jdbcTemplate.queryForList(
                "SELECT * FROM v_solde_client WHERE client_id = ?", clientId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}