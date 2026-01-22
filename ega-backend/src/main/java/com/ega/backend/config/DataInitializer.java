package com.ega.backend.config;

import com.ega.backend.repository.RoleRepository;
import com.ega.backend.repository.UserAccountRepository;
import com.ega.backend.security.Role;
import com.ega.backend.security.UserAccount;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

@Configuration
@RequiredArgsConstructor
@Profile("!test")
public class DataInitializer implements CommandLineRunner {

    private final UserAccountRepository userRepo;
    private final RoleRepository roleRepo;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.username:admin}")
    private String adminUsername;
    @Value("${app.admin.email:admin@ega.local}")
    private String adminEmail;
    @Value("${app.admin.password:Admin@123}")
    private String adminPassword;

    @Override
    @Transactional
    public void run(String... args) {
        // Ensure roles exist (in case migrations are disabled or failed)
        Role roleAdmin = roleRepo.findByName("ROLE_ADMIN")
                .orElseGet(() -> roleRepo.save(Role.builder().name("ROLE_ADMIN").build()));
        Role roleClient = roleRepo.findByName("ROLE_CLIENT")
                .orElseGet(() -> roleRepo.save(Role.builder().name("ROLE_CLIENT").build()));

        // Create default admin if missing
        userRepo.findByUsername(adminUsername).orElseGet(() -> {
            UserAccount admin = UserAccount.builder()
                    .username(adminUsername)
                    .email(adminEmail)
                    .password(passwordEncoder.encode(adminPassword))
                    .enabled(true)
                    .role("ADMIN")  // Rôle principal
                    .build();
            admin.getRoles().add(roleAdmin);  // Rôle dans la table de jointure
            return userRepo.save(admin);
        });
    }
}
