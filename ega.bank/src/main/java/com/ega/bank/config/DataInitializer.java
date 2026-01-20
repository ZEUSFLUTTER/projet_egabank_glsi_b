package com.ega.bank.config;

import com.ega.bank.entity.*;
import com.ega.bank.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Initialise la base de données avec des données de test
 */
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    
    private final UserRepository userRepository;
    private final ClientRepository clientRepository;
    private final CompteRepository compteRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) {
        // Créer un utilisateur ADMIN si n'existe pas
        if (!userRepository.existsByUsername("admin")) {
            User admin = User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("admin123"))
                    .role("ROLE_ADMIN")
                    .enabled(true)
                    .accountNonExpired(true)
                    .accountNonLocked(true)
                    .credentialsNonExpired(true)
                    .build();
            userRepository.save(admin);
            System.out.println("✅ Utilisateur ADMIN créé: username=admin, password=admin123");
        }
        
        // Créer un client de test
        if (!clientRepository.existsByEmail("jean.dupont@email.com")) {
            Client client = Client.builder()
                    .nom("Dupont")
                    .prenom("Jean")
                    .dateNaissance(LocalDate.of(1990, 5, 15))
                    .sexe("M")
                    .adresse("123 Rue de la Paix, Paris")
                    .telephone("+33612345678")
                    .email("jean.dupont@email.com")
                    .nationalite("Française")
                    .build();
            Client savedClient = clientRepository.save(client);
            
            // Créer un utilisateur CLIENT pour ce client
            User userClient = User.builder()
                    .username("jean.dupont")
                    .password(passwordEncoder.encode("client123"))
                    .role("ROLE_CLIENT")
                    .client(savedClient)
                    .enabled(true)
                    .accountNonExpired(true)
                    .accountNonLocked(true)
                    .credentialsNonExpired(true)
                    .build();
            userRepository.save(userClient);
            
            // Créer un compte courant pour ce client
            CompteCourant compteCourant = new CompteCourant();
            compteCourant.setNumeroCompte("FR7630001007941234567890185");
            compteCourant.setProprietaire(savedClient);
            compteCourant.setSolde(new BigDecimal("1000.00"));
            compteCourant.setDecouvertAutorise(new BigDecimal("500.00"));
            compteCourant.setActif(true);
            compteRepository.save(compteCourant);
            
            // Créer un compte épargne pour ce client
            CompteEpargne compteEpargne = new CompteEpargne();
            compteEpargne.setNumeroCompte("FR7630004000031234567890143");
            compteEpargne.setProprietaire(savedClient);
            compteEpargne.setSolde(new BigDecimal("5000.00"));
            compteEpargne.setTauxInteret(2.5);
            compteEpargne.setActif(true);
            compteRepository.save(compteEpargne);
            
            System.out.println("✅ Client de test créé:");
            System.out.println("   - Nom: Jean Dupont");
            System.out.println("   - Username: jean.dupont");
            System.out.println("   - Password: client123");
            System.out.println("   - Compte courant: " + compteCourant.getNumeroCompte() + " (Solde: 1000€)");
            System.out.println("   - Compte épargne: " + compteEpargne.getNumeroCompte() + " (Solde: 5000€)");
        }
    }
}