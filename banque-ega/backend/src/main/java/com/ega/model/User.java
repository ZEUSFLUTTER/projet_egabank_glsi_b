package com.ega.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User implements UserDetails {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Le courriel est obligatoire")
    @Email(message = "Le courriel doit être valide")
    @Column(nullable = false, unique = true, length = 100)
    private String courriel;
    
    @NotBlank(message = "Le mot de passe est obligatoire")
    @Column(nullable = false)
    private String motDePasse;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role = Role.ROLE_USER;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id")
    private Client client;
    
    @Column(nullable = false)
    private Boolean enabled = true;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getPassword() {
        return motDePasse;
    }

    @Override
    public String getUsername() {
        return courriel;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }
}

