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
    private final com.ega.banking.repository.ClientRepository clientRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        userRepository.findByUsername("admin").ifPresentOrElse(
                admin -> {
                    admin.setPassword(passwordEncoder.encode("admin123"));
                    userRepository.save(admin);
                    log.info("DataInitializer: Mot de passe pour 'admin' réinitialisé à 'admin123'");
                },
                () -> {
                    User admin = new User();
                    admin.setUsername("admin");
                    admin.setPassword(passwordEncoder.encode("admin123"));
                    admin.setRole("ROLE_ADMIN");
                    admin.setEmail("admin@egabank.com");
                    admin.setEnabled(true);
                    userRepository.save(admin);
                    log.info("DataInitializer: Compte administrateur par défaut créé (admin/admin123)");
                });
    }
}
