package com.banque.security;

import com.banque.entity.Client;
import com.banque.repository.ClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class ClientDetailsService implements UserDetailsService {
    
    private final ClientRepository clientRepository;
    
    @Override
    public UserDetails loadUserByUsername(String courriel) throws UsernameNotFoundException {
        Client client = clientRepository.findByCourriel(courriel)
                .orElseThrow(() -> new UsernameNotFoundException("Client non trouvé avec le courriel: " + courriel));
        
        return org.springframework.security.core.userdetails.User.builder()
                .username(client.getCourriel())
                .password(client.getPassword() != null ? client.getPassword() : "")
                .authorities(Collections.singletonList(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_CLIENT")))
                .accountExpired(false)
                .accountLocked(false)
                .credentialsExpired(false)
                .disabled(false)
                .build();
    }
}
