package com.ega.bank.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "comptes")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "type_compte", discriminatorType = DiscriminatorType.STRING)
@Getter
@Setter
@NoArgsConstructor
public abstract class Compte {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Le numéro de compte est obligatoire")
    @Column(nullable = false, unique = true, length = 34)
    private String numeroCompte; // Format IBAN
    
    @Transient
    private TypeCompte typeCompte;
    
    @Column(nullable = false)
    private BigDecimal solde = BigDecimal.ZERO;
    
    @Column(nullable = false, updatable = false)
    private LocalDate dateCreation;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private Client proprietaire;
    
    @OneToMany(mappedBy = "compte", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Transaction> transactions = new ArrayList<>();
    
    @Column(nullable = false)
    private Boolean actif = true;
    
    @PrePersist
    protected void onCreate() {
        if (dateCreation == null) {
            dateCreation = LocalDate.now();
        }
        if (solde == null) {
            solde = BigDecimal.ZERO;
        }
    }
    
    /**
     * Méthode pour effectuer un versement
     */
    public void verser(BigDecimal montant) {
        if (montant.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Le montant doit être positif");
        }
        this.solde = this.solde.add(montant);
    }
    
    /**
     * Méthode pour effectuer un retrait
     */
    public void retirer(BigDecimal montant) {
        if (montant.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Le montant doit être positif");
        }
        if (this.solde.compareTo(montant) < 0) {
            throw new IllegalArgumentException("Solde insuffisant");
        }
        this.solde = this.solde.subtract(montant);
    }
}