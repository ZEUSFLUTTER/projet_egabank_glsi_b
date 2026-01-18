package com.example.egabank.service;

import com.example.egabank.entity.Client;
import com.example.egabank.repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private ClientRepository clientRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Client client = clientRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé avec l'email: " + email));

        // On retourne un objet User que Spring Security comprend
        return new org.springframework.security.core.userdetails.User(
                client.getEmail(),
                client.getMotDePasse(),
                Collections.singletonList(new SimpleGrantedAuthority(client.getRole().name()))
        );
    }
}