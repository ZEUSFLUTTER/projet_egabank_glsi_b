package com.backend.ega.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import java.time.LocalDate;
import java.util.List;
import java.util.ArrayList;

/**
 * Entité Client qui hérite de BaseUser
 * Représente un client de la banque avec ses comptes
 * Table: clients
 */
@Entity
@Table(name = "clients")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Client extends BaseUser {

    @Past(message = "La date de naissance doit être dans le passé")
    @Column(name = "birth_date")
    private LocalDate birthDate;

    @NotBlank(message = "Le sexe est obligatoire")
    @Pattern(regexp = "M|F|Autre", message = "Le sexe doit être M, F ou Autre")
    @Column(name = "gender")
    private String gender;

    @NotBlank(message = "L'adresse est obligatoire")
    @Column(name = "address")
    private String address;

    @NotBlank(message = "Le numéro de téléphone est obligatoire")
    @Column(name = "phone_number")
    private String phoneNumber;

    @NotBlank(message = "La nationalité est obligatoire")
    @Column(name = "nationality")
    private String nationality;

    @JsonIgnoreProperties({"owner"})
    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL)
    private List<Account> accounts = new ArrayList<>();

    // --- Constructors ---
    public Client() {
        super();
    }

    public Client(String email, String password, String firstName, String lastName, String phoneNumber) {
        super(email, password, firstName, lastName);
        this.phoneNumber = phoneNumber;
    }

    // --- Getters & Setters (spécifiques à Client) ---

    // --- Getters & Setters (spécifiques à Client) ---

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getNationality() {
        return nationality;
    }

    public void setNationality(String nationality) {
        this.nationality = nationality;
    }

    public List<Account> getAccounts() {
        return accounts;
    }

    public void setAccounts(List<Account> accounts) {
        this.accounts = accounts;
    }
}
