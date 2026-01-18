package com.example.egabank;

import com.example.egabank.entity.Client;
import com.example.egabank.entity.Role;
import com.example.egabank.repository.ClientRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;

@SpringBootApplication
public class EgabankApplication {

    public static void main(String[] args) {
        SpringApplication.run(EgabankApplication.class, args);
    }

@Bean
CommandLineRunner start(ClientRepository clientRepository, PasswordEncoder passwordEncoder) {
    return args -> {
        // On cherche l'admin existant
        clientRepository.findByEmail("admin@egabank.com").ifPresentOrElse(
            (admin) -> {
                // On force la mise à jour avec le mot de passe crypté
                admin.setMotDePasse(passwordEncoder.encode("admin123"));
                clientRepository.save(admin);
                System.out.println(">>> Mot de passe Admin mis à jour et crypté !");
            },
            () -> {
                // Si l'admin n'existe pas du tout, on le crée
                Client admin = Client.builder()
                        .nom("Admin")
                        .email("admin@egabank.com")
                        .motDePasse(passwordEncoder.encode("admin123"))
                        .role(Role.ROLE_ADMIN)
                        .build();
                clientRepository.save(admin);
                System.out.println(">>> Nouveau compte Admin créé avec mot de passe crypté !");
            }
        );
    };
}
}