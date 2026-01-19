package com.egabank.back.controller;

import com.egabank.back.model.Client;
import com.egabank.back.model.User;
import com.egabank.back.repository.ClientRepository;
import com.egabank.back.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/clients")
@CrossOrigin(origins = "*")
public class ClientController {
    
    @Autowired
    private ClientRepository clientRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    // Retirer toute la partie JWT - version simplifiée
    @GetMapping("/me")
    public ResponseEntity<?> getMyInfo(@RequestParam String username) {
        // Recherche simple par username
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body(Map.of("error", "Utilisateur non trouvé"));
        }
        
        Optional<Client> client = clientRepository.findByUserId(user.getId());
         if (client.isPresent()) {
            return ResponseEntity.ok(client.get()); // CORRECTION ICI
        } else {
            return ResponseEntity.status(404).body(Map.of("error", "Client non trouvé"));
        }   
    }
    
    @GetMapping
    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Client> getClientById(@PathVariable Long id) {
        return clientRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public Client createClient(@RequestBody Client client) {
        return clientRepository.save(client);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Client> updateClient(@PathVariable Long id, @RequestBody Client clientDetails) {
        return clientRepository.findById(id)
            .map(client -> {
                client.setNom(clientDetails.getNom());
                client.setPrenom(clientDetails.getPrenom());
                client.setDateNaissance(clientDetails.getDateNaissance());
                client.setSexe(clientDetails.getSexe());
                client.setAdresse(clientDetails.getAdresse());
                client.setTelephone(clientDetails.getTelephone());
                client.setEmail(clientDetails.getEmail());
                client.setNationalite(clientDetails.getNationalite());
                return ResponseEntity.ok(clientRepository.save(client));
            })
            .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteClient(@PathVariable Long id) {
        if (clientRepository.existsById(id)) {
            clientRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Client supprimé"));
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/{id}/comptes")
    public List<Object[]> getClientWithAccounts(@PathVariable Long id) {
        return clientRepository.findClientWithAccounts(id);
    }
}