package com.ega.bank.bank_api.controller;

import com.ega.bank.bank_api.dto.AuthResponse;
import com.ega.bank.bank_api.dto.LoginRequest;
import com.ega.bank.bank_api.dto.RegisterRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Backend is working!");
    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        // Authentification mock pour les tests
        if ("admin".equals(loginRequest.getUsername()) && "password".equals(loginRequest.getPassword())) {
            AuthResponse response = new AuthResponse(
                    "mock-jwt-token-admin",
                    "admin",
                    "admin@ega-bank.com",
                    "ADMIN"
            );
            return ResponseEntity.ok(response);
        } else if ("user".equals(loginRequest.getUsername()) && "password".equals(loginRequest.getPassword())) {
            AuthResponse response = new AuthResponse(
                    "mock-jwt-token-user",
                    "user",
                    "user@ega-bank.com",
                    "USER"
            );
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(401).build();
    }
    
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest registerRequest) {
        // Enregistrement mock pour les tests
        AuthResponse response = new AuthResponse(
                "mock-jwt-token-new-user",
                registerRequest.getUsername(),
                registerRequest.getEmail(),
                "USER"
        );
        return ResponseEntity.ok(response);
    }
}