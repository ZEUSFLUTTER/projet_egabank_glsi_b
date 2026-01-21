package com.egabank.Backend;


import com.egabank.Backend.entity.Utilisateur;
import com.egabank.Backend.repository.UtilisateurRepository;
import com.egabank.Backend.securite.ServiceJwt;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}
        
        @Bean 
        public CommandLineRunner afficherTokenAuDemarrage(ServiceJwt serviceJwt, UtilisateurRepository depotUtilisateur, BCryptPasswordEncoder encodeur) { 
            return args -> { 
                // Créer un utilisateur de test si la base est vide
                if (depotUtilisateur.findAll().isEmpty()) {
                    Utilisateur utilisateur = new Utilisateur();
                    utilisateur.setNomUtilisateur("daniel");
                    utilisateur.setMotDePasse(encodeur.encode("L2BZUAM8a@"));
                    utilisateur.setRole("USER");
                    depotUtilisateur.save(utilisateur);
                    System.out.println("=== UTILISATEUR DE TEST CRÉÉ ===");
                    System.out.println("Utilisateur : daniel");
                    System.out.println("Mot de passe : L2BZUAM8a@");
                    System.out.println("================================");
                }
                
                // Afficher le token du premier utilisateur
                depotUtilisateur.findAll().stream().findFirst().ifPresent(utilisateur -> { 
                    String jeton = serviceJwt.genererJeton(utilisateur.getNomUtilisateur(), utilisateur.getRole()); 
                    System.out.println("=== TOKEN JWT POUR UTILISATEUR RÉEL ==="); 
                    System.out.println("Utilisateur : " + utilisateur.getNomUtilisateur()); 
                    System.out.println("Token : " + jeton); 
                    System.out.println("======================================="); 
                }); 
            }; 
        }

}
