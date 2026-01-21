/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.egabank.Backend.controleur;

import com.egabank.Backend.dto.AuthConnexionDTO;
import com.egabank.Backend.dto.AuthJetonDTO;
import com.egabank.Backend.dto.UtilisateurCreateDTO;
import com.egabank.Backend.entity.Utilisateur;
import com.egabank.Backend.service.AuthentificationService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author HP
 */
@RestController
@RequestMapping("/api/auth")
public class AuthentificationControleur {
    private final AuthentificationService serviceAuthentification;

    public AuthentificationControleur(AuthentificationService serviceAuthentification) {
        this.serviceAuthentification = serviceAuthentification;
    }

    @PostMapping("/connexion")
    public AuthJetonDTO connexion(@Valid @RequestBody AuthConnexionDTO dto) {
        String jeton = serviceAuthentification.connecterEtGenererJeton(dto.nomUtilisateur(), dto.motDePasse());
        return new AuthJetonDTO(jeton);
    }
    
    @PostMapping("/inscription") public Utilisateur inscription(@Valid @RequestBody UtilisateurCreateDTO dto) { 
        return serviceAuthentification.creer(dto); 
    }
}
