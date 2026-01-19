package com.ega.egabank.config;

import com.ega.egabank.entity.Client;
import com.ega.egabank.entity.User;
import com.ega.egabank.enums.Role;
import com.ega.egabank.enums.Sexe;
import com.ega.egabank.repository.ClientRepository;
import com.ega.egabank.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ClientRepository clientRepository;
    private final PasswordEncoder passwordEncoder;

    @org.springframework.beans.factory.annotation.Value("${app.admin.username:admin}")
    private String adminUsername;

    @org.springframework.beans.factory.annotation.Value("${app.admin.email:admin@egabank.com}")
    private String adminEmail;

    @org.springframework.beans.factory.annotation.Value("${app.admin.password:admin123}")
    private String adminPassword;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            log.info("Initialisation des données par défaut...");

            // Création d'un administrateur
            User admin = User.builder()
                    .username(adminUsername)
                    .email(adminEmail)
                    .password(passwordEncoder.encode(adminPassword))
                    .role(Role.ROLE_ADMIN)
                    .enabled(true)
                    .build();
            userRepository.save(admin);
            log.info("Utilisateur admin créé (username: " + adminUsername + ")");

            // Création de quelques clients de test
            createClient("Jean", "Dupont", "jean.dupont@email.com", "+22890000001", "Lomé, Togo", Sexe.MASCULIN);
            createClient("Marie", "Curie", "marie.curie@email.com", "+22890000002", "Kara, Togo", Sexe.FEMININ);

            log.info("Données initialisées avec succès !");
        }
    }

    private void createClient(String prenom, String nom, String email, String telephone, String adresse, Sexe sexe) {
        Client client = Client.builder()
                .prenom(prenom)
                .nom(nom)
                .courriel(email)
                .telephone(telephone)
                .adresse(adresse)
                .dateNaissance(LocalDate.of(1990, 1, 1))
                .sexe(sexe)
                .nationalite("Togolaise")
                .build();
        clientRepository.save(client);
    }
}
