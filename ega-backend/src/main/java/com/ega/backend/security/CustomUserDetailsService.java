package com.ega.backend.security;

import com.ega.backend.repository.UserAccountRepository;
import com.ega.backend.repository.ClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserAccountRepository userRepo;
    private final ClientRepository clientRepo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        var user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        
        var authorities = user.getRoles().stream()
                .map(r -> new SimpleGrantedAuthority(r.getName()))
                .collect(Collectors.toSet());
        
        // Ajouter le rôle principal comme autorité supplémentaire
        if (user.getRole() != null && !user.getRole().isEmpty()) {
            authorities.add(new SimpleGrantedAuthority("ROLE_" + user.getRole()));
        }
        
        return new User(user.getUsername(), user.getPassword(), user.isEnabled(), true, true, true, authorities);
    }
}
