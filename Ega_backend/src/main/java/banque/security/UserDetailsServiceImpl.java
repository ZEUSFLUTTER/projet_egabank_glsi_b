package banque.security;

import banque.entity.Utilisateur;
import banque.repository.UtilisateurRepository;
import lombok.*;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.*;
import java.util.*;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {
    private final UtilisateurRepository repository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Utilisateur user = repository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("L'Utilisateur " + username + " n'existe pas."));
        if (!user.getActif()) {
            throw new DisabledException("Compte utilisateur désactivé");
        }
        return new User(
                user.getUsername(),
                user.getPassword(),
                List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
        );
    }
}
