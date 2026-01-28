package com.ega.ega_bank.entite;

import com.ega.ega_bank.entite.enums.Sexe;
import com.ega.ega_bank.entite.enums.Role;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String nom;

    @NotBlank
    private String prenom;

    @NotNull
    private LocalDate dateNaissance;

    @NotNull
    @Enumerated(EnumType.STRING)
    private Sexe sexe;

    @NotBlank
    private String adresse;

    @NotBlank
    private String telephone;

    @Email
    @NotBlank
    @Column(unique = true)
    private String courriel;

    @NotBlank
    private String nationalite;

    // Champ rôle : par défaut CLIENT, mais peut être ADMIN si défini explicitement
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.CLIENT;

    @NotBlank
    private String password; // mot de passe encodé avec BCrypt

    @OneToMany(mappedBy = "proprietaire", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Compte> comptes = new ArrayList<>();

    // --- Constructeurs ---
    public Client() {
        // rôle par défaut déjà fixé à CLIENT
    }

    public Client(String nom, String prenom, LocalDate dateNaissance, Sexe sexe,
                  String adresse, String telephone, String courriel, String nationalite,
                  Role role, String password) {
        this.nom = nom;
        this.prenom = prenom;
        this.dateNaissance = dateNaissance;
        this.sexe = sexe;
        this.adresse = adresse;
        this.telephone = telephone;
        this.courriel = courriel;
        this.nationalite = nationalite;
        this.role = role; // accepte CLIENT ou ADMIN
        this.password = password;
    }

    // --- Getters et Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getPrenom() { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }

    public LocalDate getDateNaissance() { return dateNaissance; }
    public void setDateNaissance(LocalDate dateNaissance) { this.dateNaissance = dateNaissance; }

    public Sexe getSexe() { return sexe; }
    public void setSexe(Sexe sexe) { this.sexe = sexe; }

    public String getAdresse() { return adresse; }
    public void setAdresse(String adresse) { this.adresse = adresse; }

    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }

    public String getCourriel() { return courriel; }
    public void setCourriel(String courriel) { this.courriel = courriel; }

    public String getNationalite() { return nationalite; }
    public void setNationalite(String nationalite) { this.nationalite = nationalite; }

    public Role getRole() { return role; }
    public void setRole(Role role) {
        this.role = role; // accepte CLIENT ou ADMIN
    }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public List<Compte> getComptes() { return comptes; }
    public void setComptes(List<Compte> comptes) { this.comptes = comptes; }

    // --- toString ---
    @Override
    public String toString() {
        return "Client{" +
                "id=" + id +
                ", nom='" + nom + '\'' +
                ", prenom='" + prenom + '\'' +
                ", dateNaissance=" + dateNaissance +
                ", sexe=" + sexe +
                ", adresse='" + adresse + '\'' +
                ", telephone='" + telephone + '\'' +
                ", courriel='" + courriel + '\'' +
                ", nationalite='" + nationalite + '\'' +
                ", role=" + role +
                ", comptes=" + comptes +
                '}';
    }
}
