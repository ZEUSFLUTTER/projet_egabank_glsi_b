package com.banque.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
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
    
    @NotBlank(message = "Le nom est requis")
    @Column(nullable = false)
    private String nom;
    
    @NotBlank(message = "Le prénom est requis")
    @Column(nullable = false)
    private String prenom;
    
    @NotNull(message = "La date de naissance est requise")
    @Past(message = "La date de naissance doit être dans le passé")
    @Column(name = "date_naissance", nullable = false)
    private LocalDate dateNaissance;
    
    @NotBlank(message = "Le sexe est requis")
    @Column(nullable = false)
    private String sexe;
    
    @NotBlank(message = "Le courriel est requis")
    @Email(message = "Le courriel doit être valide")
    @Column(nullable = false, unique = true)
    private String courriel;
    
    @NotBlank(message = "L'adresse est requise")
    @Column(nullable = false)
    private String adresse;
    
    @NotBlank(message = "Le numéro de téléphone est requis")
    @Column(name = "num_telephone", nullable = false)
    private String numTelephone;
    
    @NotBlank(message = "La nationalité est requise")
    @Column(nullable = false)
    private String nationalite;
    
    @Column(nullable = true)
    private String password;
    
    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Compte> comptes;
}
