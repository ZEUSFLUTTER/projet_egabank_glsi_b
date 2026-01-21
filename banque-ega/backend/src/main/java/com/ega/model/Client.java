package com.ega.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "clients")
@Data
@NoArgsConstructor
@AllArgsConstructor
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
    @Pattern(regexp = "M|F", message = "Le sexe doit être M (Masculin) ou F (Féminin)")
    @Column(nullable = false, length = 1)
    private String sexe;
    
    @NotBlank(message = "L'adresse est obligatoire")
    @Size(max = 200, message = "L'adresse ne peut pas dépasser 200 caractères")
    @Column(nullable = false, length = 200)
    private String adresse;
    
    @NotBlank(message = "Le numéro de téléphone est obligatoire")
    @Pattern(regexp = "^[0-9]{8,15}$", message = "Le numéro de téléphone doit contenir entre 8 et 15 chiffres")
    @Column(nullable = false, length = 15)
    private String telephone;
    
    @NotBlank(message = "Le courriel est obligatoire")
    @Email(message = "Le courriel doit être valide")
    @Column(nullable = false, unique = true, length = 100)
    private String courriel;
    
    @NotBlank(message = "La nationalité est obligatoire")
    @Size(min = 2, max = 50, message = "La nationalité doit contenir entre 2 et 50 caractères")
    @Column(nullable = false, length = 50)
    private String nationalite;
    
    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Compte> comptes = new ArrayList<>();
}

