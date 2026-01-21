package com.ega.service;

import com.ega.model.User;
import com.ega.repository.UserRepository;
import com.ega.security.JwtUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String courriel) {
        User user = userRepository.findByCourriel(courriel)
            .orElseThrow(() ->
                new UsernameNotFoundException("Utilisateur non trouvé : " + courriel)
            );

        return new JwtUserDetails(
            user.getId(),
            user.getCourriel(),
            user.getMotDePasse(),
            user.getRole(),
            user.getEnabled()
        );
    }
}
