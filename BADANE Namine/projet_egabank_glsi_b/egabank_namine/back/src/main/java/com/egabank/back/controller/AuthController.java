package com.egabank.back.controller;

import com.egabank.back.model.User;
import com.egabank.back.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private UserRepository userRepository;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
            .orElse(null);
        
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Utilisateur non trouvé"));
        }
        
        // Vérification simple du mot de passe en clair
        if (!user.getPassword().equals(request.getPassword())) {
            return ResponseEntity.status(401).body(Map.of("error", "Mot de passe incorrect"));
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("user", user);
        response.put("role", user.getRole().name()); // Utilisez .name() au lieu de .toString()
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Nom d'utilisateur déjà existant"));
        }
        
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(request.getPassword()); // EN CLAIR !
        
        // Conversion String -> Enum
        try {
            User.Role role = User.Role.valueOf(request.getRole().toUpperCase()); // Maintenant accessible
            user.setRole(role);
        } catch (IllegalArgumentException e) {
            user.setRole(User.Role.CLIENT); // Valeur par défaut
        }
        
        userRepository.save(user);
        
        return ResponseEntity.ok(Map.of("message", "Utilisateur créé avec succès"));
    }
}

class LoginRequest {
    private String username;
    private String password;
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}

class RegisterRequest {
    private String username;
    private String password;
    private String role = "CLIENT";
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}