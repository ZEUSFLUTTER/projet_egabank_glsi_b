package com.bank.ega.controller;

import com.bank.ega.config.JwtUtil;
import com.bank.ega.entity.Utilisateur;
import com.bank.ega.service.UtilisateurService;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    
    private final UtilisateurService utilisateurService;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UtilisateurService utilisateurService, JwtUtil jwtUtil, PasswordEncoder passwordEncoder) {
        this.utilisateurService = utilisateurService;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<Utilisateur> register(@RequestBody Utilisateur utilisateur) {
        Utilisateur saved = utilisateurService.register(utilisateur);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Utilisateur utilisateur) {
        logger.info("🔐 Tentative de connexion pour: " + utilisateur.getUsername());
        
        try {
            Utilisateur existing = utilisateurService.findByUsername(utilisateur.getUsername());

            if (existing == null) {
                logger.warn("❌ Utilisateur non trouvé: " + utilisateur.getUsername());
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Utilisateur non trouvé");
                return ResponseEntity.status(401).body(errorResponse);
            }

            if (!passwordEncoder.matches(utilisateur.getPassword(), existing.getPassword())) {
                logger.warn("❌ Mot de passe incorrect pour: " + utilisateur.getUsername());
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Mot de passe incorrect");
                return ResponseEntity.status(401).body(errorResponse);
            }

            String token = jwtUtil.generateToken(existing);
            logger.info("✅ Token généré pour: " + utilisateur.getUsername());

            Map<String, Object> response = new HashMap<>();
            response.put("id", existing.getId());
            response.put("token", token);
            response.put("username", existing.getUsername());
            response.put("role", existing.getRole());

            logger.info("✅ Réponse login envoyée: id=" + existing.getId() + ", role=" + existing.getRole());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("❌ Erreur lors du login: " + e.getMessage(), e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Erreur serveur: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

}

