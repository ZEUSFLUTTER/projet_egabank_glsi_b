package com.ega.backend.controller;

import com.ega.backend.model.AuditLog;
import com.ega.backend.model.Client;
import com.ega.backend.model.Compte;
import com.ega.backend.repository.ClientRepository;
import com.ega.backend.security.JwtTokenProvider;
import com.ega.backend.service.AuditLogService;
import com.ega.backend.service.ClientService;
import com.ega.backend.service.CompteService;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private ClientService clientService;

    @Autowired
    private CompteService compteService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private AuditLogService auditLogService; // ✅ Injection du service d'audit

    // ✅ Création de l'admin au démarrage de l'application
    @PostConstruct
    public void initDefaultAdmin() {
        createDefaultAdmin();
    }

    // ✅ Méthode pour créer un administrateur par défaut
    private void createDefaultAdmin() {
        if (clientRepository.findByRole("ADMIN").isEmpty()) {
            Client admin = new Client();
            admin.setEmail("admin@ega.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setNom("Admin");
            admin.setPrenom("EGA");
            admin.setSexe("Non spécifié");
            admin.setDateNaissance(LocalDate.now());
            admin.setAdresse("Siège social");
            admin.setTelephone("+228 71424217");
            admin.setNationalite("Togolaise");
            admin.setRole("ADMIN");
            admin.setActive(true);
            clientRepository.save(admin);
            System.out.println("Admin par défaut créé !");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody Client client) {
        System.out.println("Requête reçue dans register : " + client.getEmail());

        // ✅ Création automatique de l'admin
        createDefaultAdmin();

        // Vérifie si l'email existe déjà
        if (clientRepository.findByEmail(client.getEmail()).isPresent()) {
            // ✅ Log d'échec d'inscription
            AuditLog log = new AuditLog();
            log.setAction("INSCRIPTION_ECHEC");
            log.setEmail(client.getEmail());
            log.setSuccess(false);
            log.setTimestamp(LocalDateTime.now());
            log.setDescription("Email déjà utilisé");
            auditLogService.save(log);

            return ResponseEntity.status(400).body(Map.of("error", "Email déjà utilisé"));
        }

        // ✅ S'assure que tous les champs obligatoires sont remplis
        if (client.getNom() == null || client.getNom().trim().isEmpty()) {
            client.setNom("Non spécifié");
        }
        if (client.getPrenom() == null || client.getPrenom().trim().isEmpty()) {
            client.setPrenom("Non spécifié");
        }
        if (client.getSexe() == null || client.getSexe().trim().isEmpty()) {
            client.setSexe("Non spécifié");
        }
        if (client.getDateNaissance() == null) {
            client.setDateNaissance(LocalDate.now());
        }
        if (client.getAdresse() == null || client.getAdresse().trim().isEmpty()) {
            client.setAdresse("Non spécifiée");
        }
        if (client.getTelephone() == null || client.getTelephone().trim().isEmpty()) {
            client.setTelephone("Non spécifié");
        }
        if (client.getNationalite() == null || client.getNationalite().trim().isEmpty()) {
            client.setNationalite("Non spécifiée");
        }

        if (client.getRole() == null || client.getRole().isEmpty()) {
            client.setRole("CLIENT");
        }

        client.setPassword(passwordEncoder.encode(client.getPassword()));
        Client savedClient = clientService.saveClient(client);

        // ✅ Log de succès d'inscription
        AuditLog log = new AuditLog();
        log.setAction("INSCRIPTION_SUCCES");
        log.setEmail(client.getEmail());
        log.setSuccess(true);
        log.setTimestamp(LocalDateTime.now());
        log.setDescription("Inscription réussie");
        auditLogService.save(log);

        // Génère un token après l'inscription
        String token = jwtTokenProvider.generateToken(client.getEmail(), client.getRole());

        // Renvoie un objet avec les informations nécessaires
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Client enregistré avec succès");
        response.put("token", token);
        response.put("id", savedClient.getId());
        response.put("email", savedClient.getEmail());

        System.out.println("Client enregistré avec succès.");

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        var clientOpt = clientRepository.findByEmail(email);

        if (clientOpt.isEmpty()) {
            // ✅ Log d'échec de connexion
            AuditLog log = new AuditLog();
            log.setAction("CONNEXION_ECHEC");
            log.setEmail(email);
            log.setSuccess(false);
            log.setTimestamp(LocalDateTime.now());
            log.setDescription("Email incorrect");
            auditLogService.save(log);

            return ResponseEntity.status(401).body(Map.of("error", "Identifiants incorrects"));
        }

        Client client = clientOpt.get();
        if (!passwordEncoder.matches(password, client.getPassword())) {
            // ✅ Log d'échec de connexion
            AuditLog log = new AuditLog();
            log.setAction("CONNEXION_ECHEC");
            log.setEmail(email);
            log.setSuccess(false);
            log.setTimestamp(LocalDateTime.now());
            log.setDescription("Mot de passe incorrect");
            auditLogService.save(log);

            return ResponseEntity.status(401).body(Map.of("error", "Identifiants incorrects"));
        }

        // ✅ Log de succès de connexion
        AuditLog log = new AuditLog();
        log.setAction("CONNEXION_SUCCES");
        log.setEmail(email);
        log.setSuccess(true);
        log.setTimestamp(LocalDateTime.now());
        log.setDescription("Connexion réussie");
        auditLogService.save(log);

        // Met à jour la date de dernière connexion
        client.setLastLoginAt(LocalDateTime.now());
        client.setFailedLoginAttempts(0); // Réinitialise les tentatives échouées
        clientRepository.save(client);

        String token = jwtTokenProvider.generateToken(email, client.getRole());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("message", "Connexion réussie");
        response.put("role", client.getRole());
        response.put("client", client);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/accounts")
    public ResponseEntity<List<Compte>> getUserAccounts(Authentication authentication) {
        String email = authentication.getName();

        List<Compte> accounts = compteService.getComptesByEmail(email);

        if (accounts.isEmpty()) {
            return ResponseEntity.status(404).body(new ArrayList<>());
        }

        return ResponseEntity.ok(accounts);
    }

    // ✅ Endpoint de test
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Test successful");
    }
}