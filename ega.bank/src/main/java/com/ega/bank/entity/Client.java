package com.ega.bank.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "clients")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Client {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Le nom est obligatoire")
    @Size(min = 2, max = 50, message = "Le nom doit contenir entre 2 et 50 caractères")
    @Column(nullable = false, length = 50)
    private String nom;
    
    @NotBlank(message = "Le prénom est obligatoire")
    @Size(min = 2, max = 50, message = "Le prénom doit contenir entre 2 et 50 caractères")
    @Column(nullable = false, length = 50)
    private String prenom;
    
    @NotNull(message = "La date de naissance est obligatoire")
    @Past(message = "La date de naissance doit être dans le passé")
    @Column(nullable = false)
    private LocalDate dateNaissance;
    
    @NotBlank(message = "Le sexe est obligatoire")
    @Pattern(regexp = "M|F", message = "Le sexe doit être M ou F")
    @Column(nullable = false, length = 1)
    private String sexe;
    
    @NotBlank(message = "L'adresse est obligatoire")
    @Size(max = 200, message = "L'adresse ne peut pas dépasser 200 caractères")
    @Column(nullable = false, length = 200)
    private String adresse;
    
    @NotBlank(message = "Le numéro de téléphone est obligatoire")
    @Pattern(regexp = "^\\+?[0-9]{8,15}$", message = "Numéro de téléphone invalide")
    @Column(nullable = false, unique = true, length = 15)
    private String telephone;
    
    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "Format d'email invalide")
    @Column(nullable = false, unique = true, length = 100)
    private String email;
    
    @NotBlank(message = "La nationalité est obligatoire")
    @Size(min = 2, max = 50, message = "La nationalité doit contenir entre 2 et 50 caractères")
    @Column(nullable = false, length = 50)
    private String nationalite;
    
    @OneToMany(mappedBy = "proprietaire", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Compte> comptes = new ArrayList<>();
    
    @Column(updatable = false)
    private LocalDate dateCreation;
    
    @PrePersist
    protected void onCreate() {
        dateCreation = LocalDate.now();
    }
    
    /**
     * Méthode utilitaire pour ajouter un compte au client
     */
    public void addCompte(Compte compte) {
        comptes.add(compte);
        compte.setProprietaire(this);
    }
    
    /**
     * Méthode utilitaire pour retirer un compte du client
     */
    public void removeCompte(Compte compte) {
        comptes.remove(compte);
        compte.setProprietaire(null);
    }
}