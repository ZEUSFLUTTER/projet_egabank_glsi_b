package com.bank.ega.config;

import com.bank.ega.entity.*;
import com.bank.ega.repository.ClientRepository;
import com.bank.ega.repository.UtilisateurRepository;
import com.bank.ega.service.ClientService;
import com.bank.ega.service.CompteService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UtilisateurRepository utilisateurRepository;
    private final ClientRepository clientRepository;
    private final PasswordEncoder passwordEncoder;
    private final ClientService clientService;
    private final CompteService compteService;

    public DataInitializer(UtilisateurRepository utilisateurRepository,
                          ClientRepository clientRepository,
                          PasswordEncoder passwordEncoder,
                          ClientService clientService,
                          CompteService compteService) {
        this.utilisateurRepository = utilisateurRepository;
        this.clientRepository = clientRepository;
        this.passwordEncoder = passwordEncoder;
        this.clientService = clientService;
        this.compteService = compteService;
    }

    @Override
    public void run(String... args) throws Exception {
        // Créer l'admin s'il n'existe pas
        if (utilisateurRepository.findByUsername("admin").isEmpty()) {
            Utilisateur admin = new Utilisateur();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole("ADMIN");
            admin.setClient(null); // L'admin n'est pas un client
            utilisateurRepository.save(admin);
            System.out.println("✅ Compte ADMIN créé :");
            System.out.println("   Username: admin");
            System.out.println("   Password: admin123");
        }

        // Créer un client de test s'il n'existe pas
        if (clientRepository.findByEmail("client@ega.com").isEmpty()) {
            // Créer le client
            Client client = new Client();
            client.setNom("Dupont");
            client.setPrenom("Jean");
            client.setDateNaissance(LocalDate.of(1990, 5, 15));
            client.setSexe("M");
            client.setAdresse("123 Rue de la Paix, Paris");
            client.setTelephone("+33 6 12 34 56 78");
            client.setEmail("client@ega.com");
            client.setNationalite("Française");
            
            Client savedClient = clientService.creerClient(client);

            // Créer l'utilisateur pour ce client
            Utilisateur utilisateurClient = new Utilisateur();
            utilisateurClient.setUsername("client");
            utilisateurClient.setPassword(passwordEncoder.encode("client123"));
            utilisateurClient.setRole("CLIENT");
            utilisateurClient.setClient(savedClient);
            utilisateurRepository.save(utilisateurClient);

            // Créer un compte courant pour ce client
            Compte compteCourant = compteService.creerCompte(savedClient, TypeCompte.COURANT);
            
            // Créer un compte épargne pour ce client
            Compte compteEpargne = compteService.creerCompte(savedClient, TypeCompte.EPARGNE);

            // Faire un dépôt initial sur le compte courant
            compteService.depot(compteCourant.getNumeroCompte(), 50000.0, SourceDepot.ESPECES);

            System.out.println("✅ Compte CLIENT créé :");
            System.out.println("   Username: client");
            System.out.println("   Password: client123");
            System.out.println("   Email: client@ega.com");
            System.out.println("   Compte Courant: " + compteCourant.getNumeroCompte() + " (Solde: 50 000 XOF)");
            System.out.println("   Compte Épargne: " + compteEpargne.getNumeroCompte() + " (Solde: 0 XOF)");
        }

        System.out.println("\n🎉 Initialisation terminée !");
        System.out.println("═══════════════════════════════════════════════════════");
        System.out.println("📋 CREDENTIALS DE CONNEXION");
        System.out.println("═══════════════════════════════════════════════════════");
        System.out.println("👤 ADMIN:");
        System.out.println("   Username: admin");
        System.out.println("   Password: admin123");
        System.out.println("");
        System.out.println("👤 CLIENT:");
        System.out.println("   Username: client");
        System.out.println("   Password: client123");
        System.out.println("═══════════════════════════════════════════════════════\n");
    }
}
