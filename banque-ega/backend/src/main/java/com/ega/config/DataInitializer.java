package com.ega.config;

import com.ega.model.Client;
import com.ega.model.Role;
import com.ega.model.User;
import com.ega.repository.ClientRepository;
import com.ega.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ClientRepository clientRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Vérifier si des utilisateurs existent déjà
        if (userRepository.count() == 0) {
            // Créer un client de test
            Client client = new Client();
            client.setNom("Admin");
            client.setPrenom("System");
            client.setDateNaissance(LocalDate.of(1990, 1, 1));
            client.setSexe("M");
            client.setAdresse("123 Admin Street");
            client.setTelephone("12345678");
            client.setCourriel("admin@ega.com");
            client.setNationalite("TN");
            Client savedClient = clientRepository.save(client);

            // Créer un utilisateur admin
            User adminUser = new User();
            adminUser.setCourriel("admin@ega.com");
            adminUser.setMotDePasse(passwordEncoder.encode("admin123"));
            adminUser.setRole(Role.ROLE_ADMIN);
            adminUser.setClient(savedClient);
            adminUser.setEnabled(true);
            userRepository.save(adminUser);

            System.out.println("================================================");
            System.out.println("Utilisateur admin créé:");
            System.out.println("Email: admin@ega.com");
            System.out.println("Password: admin123");
            System.out.println("================================================");
        }
    }
}



