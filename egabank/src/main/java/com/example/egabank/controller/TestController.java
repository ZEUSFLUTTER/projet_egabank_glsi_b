package com.example.egabank.controller;

import com.example.egabank.entity.Client;
import com.example.egabank.repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
public class TestController {
    
    @Autowired
    private ClientRepository clientRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @GetMapping("/cors")
    public String testCors() {
        return "CORS fonctionne !";
    }
    
    @GetMapping("/clients")
    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }
    
    @GetMapping("/check-password")
    public Map<String, Object> checkPassword(@RequestParam String email, @RequestParam String password) {
        Map<String, Object> result = new HashMap<>();
        
        Client client = clientRepository.findByEmail(email).orElse(null);
        if (client == null) {
            result.put("found", false);
            result.put("message", "Client non trouvé");
            return result;
        }
        
        boolean matches = passwordEncoder.matches(password, client.getMotDePasse());
        result.put("found", true);
        result.put("email", client.getEmail());
        result.put("role", client.getRole());
        result.put("passwordMatches", matches);
        result.put("storedPasswordHash", client.getMotDePasse());
        
        return result;
    }
    
    @GetMapping("/reset-password")
    public Map<String, Object> resetPassword(@RequestParam String email) {
        Map<String, Object> result = new HashMap<>();
        
        Client client = clientRepository.findByEmail(email).orElse(null);
        if (client == null) {
            result.put("found", false);
            result.put("message", "Client non trouvé");
            return result;
        }
        
        // Réinitialiser le mot de passe à "client123"
        String newPassword = "client123";
        client.setMotDePasse(passwordEncoder.encode(newPassword));
        clientRepository.save(client);
        
        result.put("success", true);
        result.put("email", client.getEmail());
        result.put("message", "Mot de passe réinitialisé à: client123");
        
        return result;
    }
}