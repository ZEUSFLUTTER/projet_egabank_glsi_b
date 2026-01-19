package com.example.egabank.controller;

import com.example.egabank.dto.LoginRequest;
import com.example.egabank.entity.Client;
import com.example.egabank.repository.ClientRepository;
import com.example.egabank.util.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;
    
    @Autowired
    private ClientRepository clientRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody LoginRequest loginRequest) {
        // Cette ligne appelle UserDetailsServiceImpl pour comparer les infos
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        // Génération du Token
        String token = jwtUtils.generateJwtToken(authentication);
        
        // Récupération des détails de l'utilisateur
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String role = userDetails.getAuthorities().iterator().next().getAuthority();
        
        // Récupérer le client pour vérifier s'il s'agit de sa première connexion
        Client client = clientRepository.findByEmail(loginRequest.getEmail()).orElse(null);
        boolean premiereConnexion = client != null && client.getPremiereConnexion() != null && client.getPremiereConnexion();
        
        // Création de la réponse JSON
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("email", loginRequest.getEmail());
        response.put("role", role.replace("ROLE_", "")); // Enlever le préfixe ROLE_
        response.put("premiereConnexion", premiereConnexion);
        
        return response;
    }
    
    @PostMapping("/change-password")
    public Map<String, Object> changePassword(@RequestBody Map<String, String> request, Authentication authentication) {
        String email = authentication.getName();
        String oldPassword = request.get("oldPassword");
        String newPassword = request.get("newPassword");
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Vérifier l'ancien mot de passe
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, oldPassword));
            
            // Récupérer le client
            Client client = clientRepository.findByEmail(email).orElse(null);
            if (client == null) {
                response.put("success", false);
                response.put("message", "Client non trouvé");
                return response;
            }
            
            // Mettre à jour le mot de passe
            client.setMotDePasse(passwordEncoder.encode(newPassword));
            client.setPremiereConnexion(false); // Marquer que ce n'est plus la première connexion
            clientRepository.save(client);
            
            response.put("success", true);
            response.put("message", "Mot de passe modifié avec succès");
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Ancien mot de passe incorrect");
        }
        
        return response;
    }
}