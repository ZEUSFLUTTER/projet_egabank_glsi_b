package com.ega.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.iban4j.CountryCode;
import org.iban4j.Iban;
import org.iban4j.IbanFormatException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "comptes", uniqueConstraints = {
        @UniqueConstraint(columnNames = "numero_compte")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Compte {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Le numéro de compte sera généré automatiquement, donc plus besoin de validation NotBlank côté DTO
    @Column(name = "numero_compte", nullable = false, unique = true, length = 34)
    private String numeroCompte;

    @NotNull(message = "Le type de compte est obligatoire")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 15)
    private TypeCompte typeCompte;

    @Column(nullable = false)
    private LocalDateTime dateCreation;

    @Column(nullable = false, precision = 17, scale = 2)
    private BigDecimal solde;

    @Column(nullable = false)
    private boolean actif = true;

    @NotNull(message = "Le client est obligatoire")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    @OneToMany(mappedBy = "compte", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Transaction> transactions = new ArrayList<>();

    /**
     * Méthode exécutée avant la persistance en base
     * - Initialise dateCreation si null
     * - Initialise solde à 0 si null
     * - Génère un IBAN automatiquement si numeroCompte est null ou vide
     */
    @PrePersist
    public void init() {
        if (dateCreation == null) {
            dateCreation = LocalDateTime.now();
        }
        if (solde == null) {
            solde = BigDecimal.ZERO;
        }
        if (numeroCompte == null || numeroCompte.isBlank()) {
            try {
                numeroCompte = Iban.random(CountryCode.TN).toString();
            } catch (IbanFormatException e) {
                throw new RuntimeException("Erreur génération IBAN", e);
            }
        }
    }
}
