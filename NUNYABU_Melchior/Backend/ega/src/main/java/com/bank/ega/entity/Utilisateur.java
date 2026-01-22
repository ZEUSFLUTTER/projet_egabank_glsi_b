package com.bank.ega.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "utilisateur")
public class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    @NotBlank(message = "Le username est obligatoire")
    private String username;

    @Column(nullable = false)
    @NotBlank(message = "Le password est obligatoire")
    private String password;

    @Column(nullable = false)
    @NotBlank(message = "Le rôle est obligatoire")
    private String role; // ADMIN, CLIENT

    @OneToOne
    @JoinColumn(name = "client_id", unique = true)
    private Client client;

    @Column(nullable = false, updatable = false)
    private LocalDateTime dateCreation = LocalDateTime.now();

    @Column(nullable = false)
    private LocalDateTime dateModification = LocalDateTime.now();

    @Column(nullable = false)
    private Boolean actif = true;
}
