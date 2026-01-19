package banque.config;

import banque.entity.Utilisateur;
import banque.enums.Role;
import banque.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        String adminEmail = "admin@egabanque.com";
        if (utilisateurRepository.findByUsername(adminEmail).isEmpty()) {
            System.out.println("⏳ Création du Super Admin par défaut...");

            Utilisateur admin = Utilisateur.builder()
                    .username(adminEmail)
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .actif(true)
                    .client(null)
                    .build();

            utilisateurRepository.save(admin);
            System.out.println("Super Admin créé : " + adminEmail + " / admin123");
        }
    }
}