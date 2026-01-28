package com.ega.ega_bank.controller;

import com.ega.ega_bank.dto.LoginRequest;
import com.ega.ega_bank.dto.LoginResponse;
import com.ega.ega_bank.entite.Client;
import com.ega.ega_bank.entite.enums.Role;
import com.ega.ega_bank.repository.ClientRepository;
import com.ega.ega_bank.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired private JwtUtil jwtUtil;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private ClientRepository clientRepository;

    /**
     *  Endpoint de login : génère un JWT si credentials valides
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        System.out.println("=== TENTATIVE DE CONNEXION ===");
        System.out.println("Username: " + loginRequest.getCourriel());
        System.out.println("Password: [MASQUÉ]");
        
        try {
            //  Chercher le client en base
            Client client = clientRepository.findByCourriel(loginRequest.getCourriel())
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec email: " + loginRequest.getCourriel()));

            System.out.println("Utilisateur trouvé: " + client.getCourriel() + " avec rôle: " + client.getRole());

            //  Vérifier le mot de passe
            if(passwordEncoder.matches(loginRequest.getPassword(), client.getPassword())) {
                System.out.println("Mot de passe correct");
                
                //  Générer un token avec username + role
                String token = jwtUtil.generateToken(client.getCourriel(), client.getRole().name());
                System.out.println("Token généré: " + token);
                System.out.println("=== CONNEXION RÉUSSIE ===");
                
                return ResponseEntity.ok(new LoginResponse(token, client.getRole().name()));
            } else {
                System.out.println("Mot de passe incorrect");
                System.out.println("=== CONNEXION ÉCHOUÉE ===");
                return ResponseEntity.badRequest().body(new LoginResponse("Identifiants invalides"));
            }
        } catch (Exception e) {
            System.out.println("Erreur lors de la connexion: " + e.getMessage());
            System.out.println("=== CONNEXION ÉCHOUÉE ===");
            return ResponseEntity.badRequest().body(new LoginResponse("Identifiants invalides"));
        }
    }

    /**
     * Endpoint d'inscription : crée un nouveau client avec rôle CLIENT par défaut
     */
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody Client client) {
        try {
            //  Forcer le rôle à CLIENT (sécurité)
            client.setRole(Role.CLIENT);

            //Encoder le mot de passe
            client.setPassword(passwordEncoder.encode(client.getPassword()));

            // Sauvegarder en base
            clientRepository.save(client);

            return ResponseEntity.ok("Utilisateur enregistré avec succès avec rôle CLIENT");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erreur lors de l'inscription: " + e.getMessage());
        }
    }
}
