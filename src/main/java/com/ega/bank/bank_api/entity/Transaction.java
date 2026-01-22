package com.ega.bank.bank_api.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Entité Transaction pour la société bancaire "Ega"
 * Conforme à l'énoncé : opération de dépôt, versement et virement
 * Le client peut faire plusieurs transactions sur son compte
 */
@Entity
@Table(name = "transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull(message = "Le type de transaction est obligatoire")
    @Enumerated(EnumType.STRING)
    @Column(name = "type_transaction", nullable = false)
    private TypeTransaction typeTransaction;
    
    @NotNull(message = "Le montant est obligatoire")
    @DecimalMin(value = "0.01", message = "Le montant doit être positif")
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal montant;
    
    @Column(name = "date_transaction", nullable = false)
    private LocalDateTime dateTransaction = LocalDateTime.now();
    
    @Size(max = 200, message = "La description ne peut pas dépasser 200 caractères")
    @Column(length = 200)
    private String description;
    
    // Compte sur lequel la transaction est effectuée
    @NotNull(message = "Le compte est obligatoire")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "compte_id", nullable = false)
    private Compte compte;
    
    // Pour les virements : numéro du compte destinataire
    @Column(name = "compte_destinataire", length = 34)
    private String compteDestinataire;
    
    // Solde avant et après la transaction (pour traçabilité)
    @Column(name = "solde_avant", precision = 15, scale = 2)
    private BigDecimal soldeAvant;
    
    @Column(name = "solde_apres", precision = 15, scale = 2)
    private BigDecimal soldeApres;
    
    /**
     * Types de transactions selon l'énoncé :
     * - Dépôt : ajout d'argent sur le compte
     * - Versement : synonyme de dépôt dans le contexte bancaire
     * - Virement : transfert d'un compte vers un autre
     */
    public enum TypeTransaction {
        DEPOT("Dépôt"),
        VERSEMENT("Versement"), 
        RETRAIT("Retrait"),
        VIREMENT_SORTANT("Virement sortant"),
        VIREMENT_ENTRANT("Virement entrant");
        
        private final String libelle;
        
        TypeTransaction(String libelle) {
            this.libelle = libelle;
        }
        
        public String getLibelle() {
            return libelle;
        }
    }
    
    @PrePersist
    protected void onCreate() {
        if (dateTransaction == null) {
            dateTransaction = LocalDateTime.now();
        }
    }
    
    /**
     * Constructeur pour créer une transaction simple (dépôt, versement, retrait)
     */
    public Transaction(TypeTransaction typeTransaction, BigDecimal montant, String description, 
                      Compte compte, BigDecimal soldeAvant, BigDecimal soldeApres) {
        this.typeTransaction = typeTransaction;
        this.montant = montant;
        this.description = description;
        this.compte = compte;
        this.soldeAvant = soldeAvant;
        this.soldeApres = soldeApres;
        this.dateTransaction = LocalDateTime.now();
    }
    
    /**
     * Constructeur pour créer une transaction de virement
     */
    public Transaction(TypeTransaction typeTransaction, BigDecimal montant, String description,
                      Compte compte, String compteDestinataire, BigDecimal soldeAvant, BigDecimal soldeApres) {
        this(typeTransaction, montant, description, compte, soldeAvant, soldeApres);
        this.compteDestinataire = compteDestinataire;
    }
}