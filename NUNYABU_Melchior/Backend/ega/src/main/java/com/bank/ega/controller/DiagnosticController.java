package com.bank.ega.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/diagnostic")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class DiagnosticController {
    
    private static final Logger logger = LoggerFactory.getLogger(DiagnosticController.class);

    /**
     * Endpoint de test sans authentification
     */
    @GetMapping("/ping")
    public ResponseEntity<Map<String, Object>> ping() {
        logger.info("✅ Ping reçu du frontend");
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Backend fonctionnel ✅");
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint protégé pour tester le JWT
     */
    @GetMapping("/check-token")
    public ResponseEntity<Map<String, Object>> checkToken(@RequestHeader(value = "Authorization", required = false) String token) {
        Map<String, Object> response = new HashMap<>();
        
        if (token == null || token.isEmpty()) {
            logger.warn("⚠️ Token manquant");
            response.put("status", "error");
            response.put("message", "Token manquant ❌");
            return ResponseEntity.status(401).body(response);
        }
        
        logger.info("✅ Token reçu: " + token.substring(0, Math.min(20, token.length())) + "...");
        response.put("status", "success");
        response.put("message", "Token reçu ✅");
        response.put("tokenLength", token.length());
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint pour tester la connexion avec données JSON
     */
    @PostMapping("/test-connection")
    public ResponseEntity<Map<String, Object>> testConnection(@RequestBody(required = false) Map<String, Object> payload) {
        logger.info("✅ Connexion POST reçue");
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Connexion POST fonctionnelle ✅");
        response.put("payloadReceived", payload != null);
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }
}
