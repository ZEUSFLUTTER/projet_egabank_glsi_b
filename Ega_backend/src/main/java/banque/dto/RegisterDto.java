package banque.dto;

import banque.enums.Sexe;
import lombok.Data;
import java.time.LocalDate;

@Data
public class RegisterDto {
    // Infos Utilisateur
    private String email;
    private String password;

    // Infos Client
    private String nom;
    private String prenom;
    private LocalDate dateNaiss;
    private Sexe sexe; // Féminin ou Masculin
    private String adresse;
    private String telephone;
    private String nationalite;
}