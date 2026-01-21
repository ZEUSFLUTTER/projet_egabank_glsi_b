/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.egabank.Backend.securite;

import com.egabank.Backend.entity.Utilisateur;
import com.egabank.Backend.repository.UtilisateurRepository;
import java.util.List;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 *
 * @author HP
 */
@Service
public class ServiceUtilisateurDetails implements UserDetailsService {
    private final UtilisateurRepository depotUtilisateur;

    public ServiceUtilisateurDetails(UtilisateurRepository depotUtilisateur) {
        this.depotUtilisateur = depotUtilisateur;
    }

    @Override
    public UserDetails loadUserByUsername(String nomUtilisateur) throws UsernameNotFoundException {
        Utilisateur utilisateur = depotUtilisateur.findByNomUtilisateur(nomUtilisateur)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur introuvable"));

        return new User(
                utilisateur.getNomUtilisateur(),
                utilisateur.getMotDePasse(),
                List.of(new SimpleGrantedAuthority(utilisateur.getRole()))
        );
    }
}
