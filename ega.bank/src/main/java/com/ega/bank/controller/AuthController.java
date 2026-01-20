package com.ega.bank.controller;

import com.ega.bank.dto.LoginRequest;
import com.ega.bank.dto.LoginResponse;
import com.ega.bank.entity.User;
import com.ega.bank.repository.UserRepository;
import com.ega.bank.service.JwtService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

/**
 * Controller pour l'authentification
 * Endpoint public (pas besoin de token JWT)
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    
    /**
     * Endpoint de connexion
     * POST /api/auth/login
     * 
     * Exemple de requête:
     * {
     *   "username": "admin",
     *   "password": "admin123"
     * }
     * 
     * Réponse:
     * {
     *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     *   "type": "Bearer",
     *   "username": "admin",
     *   "role": "ROLE_ADMIN",
     *   "clientId": null
     * }
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        // 1. Authentifier l'utilisateur avec username et password
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );
        
        // 2. Si l'authentification réussit, récupérer les détails de l'utilisateur
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        
        // 3. Générer le token JWT
        String token = jwtService.generateToken(userDetails);
        
        // 4. Mettre à jour la date de dernière connexion
        User user = userRepository.findByUsername(loginRequest.getUsername()).orElseThrow();
        user.setDerniereConnexion(LocalDateTime.now());
        userRepository.save(user);
        
        // 5. Construire la réponse
        LoginResponse response = LoginResponse.builder()
                .token(token)
                .type("Bearer")
                .username(userDetails.getUsername())
                .role(userDetails.getAuthorities().iterator().next().getAuthority())
                .clientId(user.getClient() != null ? user.getClient().getId() : null)
                .build();
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Endpoint pour vérifier si le token est valide
     * GET /api/auth/validate
     */
    @GetMapping("/validate")
    public ResponseEntity<String> validateToken() {
        return ResponseEntity.ok("Token valide");
    }
}