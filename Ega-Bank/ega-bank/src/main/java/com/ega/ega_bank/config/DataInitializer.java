package com.ega.ega_bank.config;

import com.ega.ega_bank.entite.Client;
import com.ega.ega_bank.entite.Compte;
import com.ega.ega_bank.entite.enums.Role;
import com.ega.ega_bank.entite.enums.Sexe;
import com.ega.ega_bank.entite.enums.TypeCompte;
import com.ega.ega_bank.repository.ClientRepository;
import com.ega.ega_bank.repository.CompteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDate;

@Configuration
public class DataInitializer {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner initData(ClientRepository clientRepo, CompteRepository compteRepo) {
        return args -> {
            System.out.println("=== INITIALISATION DES DONNEES DE TEST ===");
            
            // Vérifier si le client existe déjà
            boolean clientExists = clientRepo.findByCourriel("client@test.com").isPresent();
            System.out.println("Client client@test.com existe déjà: " + clientExists);
            
            // Créer un client de test s'il n'existe pas
            if (!clientExists) {
                Client client = new Client();
                client.setNom("Dupont");
                client.setPrenom("Jean");
                client.setDateNaissance(LocalDate.of(1990, 1, 1));
                client.setSexe(Sexe.MASCULIN);
                client.setAdresse("123 Rue de Test, Dakar");
                client.setTelephone("+221 77 123 45 67");
                client.setCourriel("client@test.com");
                client.setNationalite("Sénégalaise");
                client.setPassword(passwordEncoder.encode("password"));
                client.setRole(Role.CLIENT);
                clientRepo.save(client);

                // Créer un compte pour ce client
                Compte compte = new Compte();
                compte.setNumeroCompte("FR123456789");
                compte.setType(TypeCompte.COURANT);
                compte.setSolde(BigDecimal.valueOf(1000.0));
                compte.setProprietaire(client);
                compte.setDateCreation(LocalDate.now());
                compteRepo.save(compte);

                System.out.println("✅ Client de test créé: client@test.com / password");
                System.out.println("✅ Compte créé: FR123456789 avec solde 1000.0");
            } else {
                System.out.println("ℹ️ Client de test existe déjà, pas de création");
            }

            // Vérifier si l'admin existe déjà
            boolean adminExists = clientRepo.findByCourriel("admin@test.com").isPresent();
            System.out.println("Admin admin@test.com existe déjà: " + adminExists);
            
            // Créer un admin de test s'il n'existe pas
            if (!adminExists) {
                Client admin = new Client();
                admin.setNom("Admin");
                admin.setPrenom("System");
                admin.setDateNaissance(LocalDate.of(1985, 5, 15));
                admin.setSexe(Sexe.MASCULIN);
                admin.setAdresse("456 Rue Admin, Dakar");
                admin.setTelephone("+221 77 987 65 43");
                admin.setCourriel("admin@test.com");
                admin.setNationalite("Sénégalaise");
                admin.setPassword(passwordEncoder.encode("admin"));
                admin.setRole(Role.ADMIN);
                clientRepo.save(admin);

                System.out.println("✅ Admin de test créé: admin@test.com / admin");
            } else {
                System.out.println("ℹ️ Admin de test existe déjà, pas de création");
            }

            // Créer des admins supplémentaires pour les tests
            String[] adminEmails = {
                "admin@egabank.sn",
                "mamadou.diallo@egabank.sn",
                "directeur@egabank.sn"
            };
            
            String[] adminNames = {
                "Admin|Principal",
                "Diallo|Mamadou", 
                "Ndiaye|Directeur"
            };
            
            for (int i = 0; i < adminEmails.length; i++) {
                boolean adminExistsExtra = clientRepo.findByCourriel(adminEmails[i]).isPresent();
                if (!adminExistsExtra) {
                    String[] nameParts = adminNames[i].split("\\|");
                    Client adminExtra = new Client();
                    adminExtra.setNom(nameParts[0]);
                    adminExtra.setPrenom(nameParts[1]);
                    adminExtra.setDateNaissance(LocalDate.of(1980 + i, 1 + i, 15));
                    adminExtra.setSexe(Sexe.MASCULIN);
                    adminExtra.setAdresse("Siège EGA Bank, Dakar");
                    adminExtra.setTelephone("+221 33 " + (100 + i) + " 45 67");
                    adminExtra.setCourriel(adminEmails[i]);
                    adminExtra.setNationalite("Sénégalaise");
                    adminExtra.setPassword(passwordEncoder.encode("admin123"));
                    adminExtra.setRole(Role.ADMIN);
                    clientRepo.save(adminExtra);
                    
                    System.out.println("✅ Admin supplémentaire créé: " + adminEmails[i] + " / admin123");
                } else {
                    System.out.println("ℹ️ Admin " + adminEmails[i] + " existe déjà");
                }
            }

            System.out.println("=== INITIALISATION TERMINÉE ===");
        };
    }
}