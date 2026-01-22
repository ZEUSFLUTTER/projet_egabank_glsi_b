package com.ega.backend.security;

import com.ega.backend.dto.auth.LoginRequest;
import com.ega.backend.dto.auth.RegisterRequest;
import com.ega.backend.repository.RoleRepository;
import com.ega.backend.repository.UserAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final UserAccountRepository userRepo;
    private final RoleRepository roleRepo;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public void register(RegisterRequest req) {
        if (userRepo.findByUsername(req.username()).isPresent()) {
            throw new IllegalArgumentException("Username already exists");
        }
        if (userRepo.findByEmail(req.email()).isPresent()) {
            throw new IllegalArgumentException("Email already exists");
        }

        // Déterminer le rôle (par défaut CLIENT si null ou vide)
        String roleValue = (req.role() == null || req.role().isBlank()) ? "CLIENT" : req.role();

        // Créer l'utilisateur avec le rôle déterminé
        var user = UserAccount.builder()
            .username(req.username())
            .email(req.email())
            .password(passwordEncoder.encode(req.password()))
            .enabled(true)
            .role(roleValue)
            .build();

        // Ajouter le rôle à l'utilisateur
        var role = roleRepo.findByName("ROLE_" + user.getRole())
            .orElseGet(() -> roleRepo.save(Role.builder().name("ROLE_" + user.getRole()).build()));
        user.getRoles().add(role);

        userRepo.save(user);
    }

    public Authentication authenticate(LoginRequest req) throws AuthenticationException {
        return authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(req.username(), req.password()));
    }
}
