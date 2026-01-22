package com.ega.bank.bank_api.config;

import com.ega.bank.bank_api.entity.User;
import com.ega.bank.bank_api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        // Créer un utilisateur admin par défaut
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@ega-bank.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(User.Role.ADMIN);
            userRepository.save(admin);
            
            System.out.println("Utilisateur admin créé: admin / admin123");
        }
        
        // Créer un utilisateur normal par défaut
        if (!userRepository.existsByUsername("user")) {
            User user = new User();
            user.setUsername("user");
            user.setEmail("user@ega-bank.com");
            user.setPassword(passwordEncoder.encode("user123"));
            user.setRole(User.Role.CLIENT);
            userRepository.save(user);
            
            System.out.println("Utilisateur normal créé: user / user123");
        }
    }
}