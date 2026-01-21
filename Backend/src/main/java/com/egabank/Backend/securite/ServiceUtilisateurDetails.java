/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.egabank.Backend.securite;

import com.egabank.Backend.entity.Client;
import com.egabank.Backend.entity.Utilisateur;
import com.egabank.Backend.repository.ClientRepository;
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
    private final ClientRepository depotClient;

    public ServiceUtilisateurDetails(UtilisateurRepository depotUtilisateur, ClientRepository depotClient) {
        this.depotUtilisateur = depotUtilisateur;
        this.depotClient = depotClient;
    }

    @Override
    public UserDetails loadUserByUsername(String nomUtilisateur) throws UsernameNotFoundException {
        // D'abord, essayer de trouver un utilisateur (admin)
        var utilisateurOpt = depotUtilisateur.findByNomUtilisateur(nomUtilisateur);
        if (utilisateurOpt.isPresent()) {
            Utilisateur utilisateur = utilisateurOpt.get();
            String role = utilisateur.getRole() != null ? utilisateur.getRole() : "ADMIN";
            
            return new User(
                    utilisateur.getNomUtilisateur(),
                    utilisateur.getMotDePasse(),
                    List.of(new SimpleGrantedAuthority(role))
            );
        }

        // Ensuite, essayer de trouver un client
        var clientOpt = depotClient.findByCourriel(nomUtilisateur);
        if (clientOpt.isPresent()) {
            Client client = clientOpt.get();
            
            return new User(
                    client.getCourriel(),
                    client.getMotDePasse(),
                    List.of(new SimpleGrantedAuthority("CLIENT"))
            );
        }

        throw new UsernameNotFoundException("Utilisateur ou client introuvable: " + nomUtilisateur);
    }
}
