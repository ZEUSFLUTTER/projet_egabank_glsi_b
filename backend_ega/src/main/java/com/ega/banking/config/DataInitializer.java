package com.ega.banking.config;

import com.ega.banking.model.User;
import com.ega.banking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            log.info("Aucun utilisateur trouvé. Création de l'utilisateur administrateur par défaut...");

            User admin = User.builder()
                    .username("admin")
                    .email("admin@ega-bank.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role("ROLE_ADMIN")
                    .enabled(true)
                    .build();

            userRepository.save(admin);
            log.info("Utilisateur 'admin' créé avec succès (Mot de passe: admin123)");
        }
    }
}
