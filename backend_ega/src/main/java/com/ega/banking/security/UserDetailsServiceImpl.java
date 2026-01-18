package com.ega.banking.security;

import com.ega.banking.model.User;
import com.ega.banking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    private final com.ega.banking.repository.ClientRepository clientRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        if (username.startsWith("CLIENT_ID:")) {
            try {
                Long clientId = Long.parseLong(username.substring(10));
                return clientRepository.findById(clientId)
                        .map(ClientUserDetails::new)
                        .orElseThrow(() -> new UsernameNotFoundException("Client introuvable avec l'ID: " + clientId));
            } catch (NumberFormatException e) {
                throw new UsernameNotFoundException("Format d'ID client invalide: " + username);
            }
        }

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur introuvable: " + username));

        return user;
    }
}
