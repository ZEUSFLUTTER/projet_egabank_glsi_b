package banque.config;

import banque.entity.Client;
import banque.entity.Compte;
import banque.entity.Utilisateur;
import banque.enums.Role;
import banque.enums.Sexe;
import banque.enums.StatutCompte;
import banque.enums.TypeCompte;
import banque.repository.ClientRepository;
import banque.repository.CompteRepository;
import banque.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UtilisateurRepository utilisateurRepository;
    private final ClientRepository clientRepository;
    private final CompteRepository compteRepository;
    private final PasswordEncoder passwordEncoder;

    public static final String COMPTE_BANQUE_INTERNE = "EGA-BANK-LIQUIDITY";

    @Override
    public void run(String... args) throws Exception {

        // 1. ADMIN
        String adminEmail = "admin@egabanque.com";
        if (utilisateurRepository.findByUsername(adminEmail).isEmpty()) {
            System.out.println("⏳ Création du Super Admin...");
            Utilisateur admin = Utilisateur.builder()
                    .username(adminEmail)
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .actif(true)
                    .build();
            utilisateurRepository.save(admin);
            System.out.println("✅ Super Admin créé.");
        }

        // 2. COMPTE INTERNE BANQUE
        if (compteRepository.findByNumeroCompte(COMPTE_BANQUE_INTERNE).isEmpty()) {
            System.out.println("⏳ Création du Compte Interne de la Banque...");

            // A. Créer le "Client" Banque
            Client banqueClient = Client.builder()
                    .nom("EGA")
                    .prenom("BANQUE INTERNE")
                    .email("tresorerie@egabanque.com")
                    .telephone("00000000")
                    .adresse("Siège Social Lomé")
                    .dateNaiss(LocalDate.now())
                    .nationalite("TOGOLAISE")
                    .sexe(Sexe.Féminin) // Ou "M" / "F" selon votre format ou Enum
                    .estSupprime(false)
                    .build();

            clientRepository.save(banqueClient);

            // B. Créer le Compte
            Compte compteBanque = Compte.builder()
                    .numeroCompte(COMPTE_BANQUE_INTERNE)
                    .solde(BigDecimal.ZERO)
                    .typeCompte(TypeCompte.COURANT)
                    .statut(StatutCompte.ACTIF)
                    .dateCreation(LocalDateTime.now())
                    .client(banqueClient)
                    .build();

            compteRepository.save(compteBanque);
            System.out.println("✅ Compte Banque créé : " + COMPTE_BANQUE_INTERNE);
        }
    }
}