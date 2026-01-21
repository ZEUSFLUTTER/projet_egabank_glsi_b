/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.egabank.Backend.service.implementation;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.egabank.Backend.dto.UtilisateurCreateDTO;
import com.egabank.Backend.entity.Utilisateur;
import com.egabank.Backend.repository.UtilisateurRepository;
import com.egabank.Backend.securite.ServiceJwt;
import com.egabank.Backend.service.AuthentificationService;

/**
 *
 * @author HP
 */
@Service
public class AuthentificationServiceImpl implements AuthentificationService {
    private final AuthenticationManager gestionnaireAuthentification;
    private final UtilisateurRepository depotUtilisateur;
    private final ServiceJwt serviceJwt;
    private final BCryptPasswordEncoder encodeur;

    public AuthentificationServiceImpl(AuthenticationManager gestionnaireAuthentification,
                                       UtilisateurRepository depotUtilisateur,
                                       ServiceJwt serviceJwt,
                                       org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder encodeur) {
        this.gestionnaireAuthentification = gestionnaireAuthentification;
        this.depotUtilisateur = depotUtilisateur;
        this.serviceJwt = serviceJwt;
        this.encodeur = encodeur;
    }

    @Override
    public String connecterEtGenererJeton(String nomUtilisateur, String motDePasse) {
        Authentication auth = gestionnaireAuthentification.authenticate(
                new UsernamePasswordAuthenticationToken(nomUtilisateur, motDePasse)
        );
        Utilisateur utilisateur = depotUtilisateur.findByNomUtilisateur(auth.getName())
            .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé"));
        String role = utilisateur.getRole();
        return serviceJwt.genererJeton(auth.getName(), role);
    }

    @Override
    public Utilisateur creer(UtilisateurCreateDTO dto) {
        // Vérifier si l'utilisateur existe déjà
        if (depotUtilisateur.findByNomUtilisateur(dto.nomUtilisateur()).isPresent()) {
            throw new IllegalArgumentException("Ce nom d'utilisateur est déjà pris");
        }
        
        Utilisateur utilisateur = new Utilisateur();
        utilisateur.setNomUtilisateur(dto.nomUtilisateur());
        utilisateur.setMotDePasse(encodeur.encode(dto.motDePasse()));
        utilisateur.setRole(dto.role());

        return depotUtilisateur.save(utilisateur);
    }

}
