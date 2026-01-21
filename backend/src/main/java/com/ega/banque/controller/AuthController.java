package com.ega.banque.controller;

import com.ega.banque.dto.LoginRequest;
import com.ega.banque.dto.RegisterRequest;
import com.ega.banque.entity.Client;
import com.ega.banque.security.JwtUtil;
import com.ega.banque.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    private final JwtUtil jwtUtil;
    private final AuthService authService;

    public AuthController(JwtUtil jwtUtil, AuthService authService) {
        this.jwtUtil = jwtUtil;
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            Client client = authService.register(request);
            String token = jwtUtil.generateToken(client.getUsername(), client.getId(), client.getRole());

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("client", Map.of(
                    "id", client.getId(),
                    "nom", client.getNom(),
                    "prenom", client.getPrenom(),
                    "email", client.getEmail(),
                    "username", client.getUsername(),
                    "role", client.getRole()));

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            // Vérifier si c'est l'admin
            if ("admin".equals(request.getUsername().trim()) && "admin".equals(request.getPassword().trim())) {
                String token = jwtUtil.generateToken("admin", null, "ADMIN");
                Map<String, Object> response = new HashMap<>();
                response.put("token", token);
                response.put("role", "ADMIN");
                response.put("username", "admin");
                return ResponseEntity.ok(response);
            }

            // Authentification client
            Client client = authService.authenticate(request.getUsername(), request.getPassword());
            String token = jwtUtil.generateToken(client.getUsername(), client.getId(), client.getRole());

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("role", client.getRole());
            response.put("client", Map.of(
                    "id", client.getId(),
                    "nom", client.getNom(),
                    "prenom", client.getPrenom(),
                    "email", client.getEmail(),
                    "username", client.getUsername()));

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(Map.of("error", e.getMessage()));
        }
    }
}
