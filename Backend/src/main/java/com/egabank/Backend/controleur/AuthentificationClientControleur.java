package com.egabank.Backend.controleur;

import com.egabank.Backend.dto.ClientConnexionDTO;
import com.egabank.Backend.dto.ClientAuthJetonDTO;
import com.egabank.Backend.dto.ChangementMotDePasseDTO;
import com.egabank.Backend.entity.Client;
import com.egabank.Backend.service.AuthentificationClientService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 *
 * @author HP
 */
@RestController
@RequestMapping("/api/auth-client")
public class AuthentificationClientControleur {
    
    private final AuthentificationClientService serviceAuthentificationClient;

    public AuthentificationClientControleur(AuthentificationClientService serviceAuthentificationClient) {
        this.serviceAuthentificationClient = serviceAuthentificationClient;
    }

    @PostMapping("/connexion")
    public ClientAuthJetonDTO connexion(@Valid @RequestBody ClientConnexionDTO dto) {
        return serviceAuthentificationClient.connecter(dto);
    }

    @GetMapping("/profil")
    public Client obtenirProfil(Authentication authentication) {
        return serviceAuthentificationClient.obtenirProfilClient(authentication.getName());
    }

    @PostMapping("/changer-mot-de-passe")
    public ResponseEntity<String> changerMotDePasse(@Valid @RequestBody ChangementMotDePasseDTO dto, 
                                                   Authentication authentication) {
        serviceAuthentificationClient.changerMotDePasse(authentication.getName(), dto);
        return ResponseEntity.ok("Mot de passe modifié avec succès");
    }
}