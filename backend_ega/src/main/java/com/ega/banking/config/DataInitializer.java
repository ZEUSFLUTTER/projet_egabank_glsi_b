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
        // Auto-initialization disabled per user request
        // Users must register themselves via /api/auth/register
        log.info("DataInitializer: Auto-création de comptes désactivée. Les utilisateurs doivent s'inscrire.");
    }
}
