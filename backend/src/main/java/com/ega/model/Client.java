package com.ega.model;

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

    @NotBlank
    @Column(nullable = false, length = 50)
    private String nom;

    @NotBlank
    @Column(nullable = false, length = 50)
    private String prenom;

    @NotNull
    @Past
    @Column(nullable = false)
    private LocalDate dateNaissance;

    @NotBlank
    @Pattern(regexp = "M|F")
    @Column(nullable = false, length = 1)
    private String sexe;

    @NotBlank
    @Column(nullable = false, length = 200)
    private String adresse;

    @NotBlank
    @Pattern(regexp = "^[0-9]{8,15}$")
    @Column(nullable = false, length = 15)
    private String telephone;

    @Email
    @NotBlank
    @Column(nullable = false, unique = true, length = 100)
    private String courriel;

    @NotBlank
    @Column(nullable = false, length = 50)
    private String nationalite;

    @Builder.Default
    @Column(nullable = false)
    private boolean actif = true;

    @Builder.Default
    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Compte> comptes = new ArrayList<>();
}
