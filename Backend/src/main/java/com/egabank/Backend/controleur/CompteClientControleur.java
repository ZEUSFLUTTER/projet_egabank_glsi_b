package com.egabank.Backend.controleur;

import com.egabank.Backend.dto.OperationClientDTO;
import com.egabank.Backend.dto.VirementClientDTO;
import com.egabank.Backend.entity.Compte;
import com.egabank.Backend.service.CompteClientService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 *
 * @author HP
 */
@RestController
@RequestMapping("/api/comptes-client")
public class CompteClientControleur {
    
    private final CompteClientService serviceCompteClient;

    public CompteClientControleur(CompteClientService serviceCompteClient) {
        this.serviceCompteClient = serviceCompteClient;
    }

    @GetMapping("/mes-comptes")
    public List<Compte> listerMesComptes(Authentication authentication) {
        return serviceCompteClient.listerMesComptes(authentication.getName());
    }

    @GetMapping("/{id}")
    public Compte obtenirCompte(@PathVariable Long id, Authentication authentication) {
        return serviceCompteClient.obtenirCompte(id, authentication.getName());
    }

    @PostMapping("/depot")
    public ResponseEntity<Map<String, String>> effectuerDepot(@Valid @RequestBody OperationClientDTO dto, 
                                               Authentication authentication) {
        serviceCompteClient.effectuerDepot(dto, authentication.getName());
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Dépôt effectué avec succès");
        response.put("status", "success");
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/retrait")
    public ResponseEntity<Map<String, String>> effectuerRetrait(@Valid @RequestBody OperationClientDTO dto, 
                                                 Authentication authentication) {
        serviceCompteClient.effectuerRetrait(dto, authentication.getName());
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Retrait effectué avec succès");
        response.put("status", "success");
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/virement")
    public ResponseEntity<Map<String, String>> effectuerVirement(@Valid @RequestBody VirementClientDTO dto, 
                                                   Authentication authentication) {
        serviceCompteClient.effectuerVirement(dto, authentication.getName());
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Virement effectué avec succès");
        response.put("status", "success");
        
        return ResponseEntity.ok(response);
    }
}