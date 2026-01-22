package com.ega.backend.web;

import com.ega.backend.dto.auth.JwtResponse;
import com.ega.backend.dto.auth.LoginRequest;
import com.ega.backend.dto.auth.RegisterRequest;
import com.ega.backend.dto.auth.UpdateRoleRequest;
import com.ega.backend.security.AuthService;
import com.ega.backend.security.Role;
import com.ega.backend.security.UserAccount;
import com.ega.backend.security.jwt.JwtService;
import com.ega.backend.repository.RoleRepository;
import com.ega.backend.repository.UserAccountRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;
    private final UserAccountRepository userAccountRepository;
    private final RoleRepository roleRepository;

    @PostMapping("/register")
    public ResponseEntity<Void> register(@RequestBody @Valid RegisterRequest req) {
        authService.register(req);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@RequestBody @Valid LoginRequest req) {
        Authentication auth = authService.authenticate(req);
        String token = jwtService.generateToken((org.springframework.security.core.userdetails.UserDetails) auth.getPrincipal());
        return ResponseEntity.ok(new JwtResponse(token));
    }

    @GetMapping("/me")
    public ResponseEntity<com.ega.backend.dto.auth.UserProfileResponse> me(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        org.springframework.security.core.userdetails.UserDetails ud = (org.springframework.security.core.userdetails.UserDetails) authentication.getPrincipal();
        // Map roles
        java.util.Set<String> roles = authentication.getAuthorities().stream().map(a -> a.getAuthority()).collect(java.util.stream.Collectors.toSet());
        // Attempt to find user id and email via authService if available
        UserAccount u = userAccountRepository.findByUsername(ud.getUsername()).orElse(null);
        Long id = u != null ? u.getId() : null;
        String email = u != null ? u.getEmail() : null;
        com.ega.backend.dto.auth.UserProfileResponse resp = new com.ega.backend.dto.auth.UserProfileResponse(id, ud.getUsername(), email, roles);
        return ResponseEntity.ok(resp);
    }

    @PutMapping("/users/{userId}/role")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<Void> updateUserRole(@PathVariable Long userId, @RequestBody @Valid UpdateRoleRequest req) {
        UserAccount user = userAccountRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Mettre à jour le rôle principal
        user.setRole(req.role());
        
        // Mettre à jour les rôles dans la table de jointure
        user.getRoles().clear();
        Role role = roleRepository.findByName("ROLE_" + req.role())
                .orElseGet(() -> roleRepository.save(Role.builder().name("ROLE_" + req.role()).build()));
        user.getRoles().add(role);
        
        userAccountRepository.save(user);
        return ResponseEntity.ok().build();
    }
}
