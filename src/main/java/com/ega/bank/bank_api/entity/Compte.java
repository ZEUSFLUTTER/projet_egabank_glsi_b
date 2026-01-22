package com.ega.bank.bank_api.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.iban4j.CountryCode;
import org.iban4j.Iban;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

/**
 * Entité Compte pour la société bancaire "Ega"
 * Conforme à l'énoncé : numéro de compte (avec iban4j), type de compte, 
 * date de création, solde (nul à la création), propriétaire
 * Types disponibles : compte épargne et compte courant
 */
@Entity
@Table(name = "comptes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Compte {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Le numéro de compte est obligatoire")
    @Column(name = "numero_compte", nullable = false, unique = true, length = 34)
    private String numeroCompte;
    
    @NotNull(message = "Le type de compte est obligatoire")
    @Enumerated(EnumType.STRING)
    @Column(name = "type_compte", nullable = false)
    private TypeCompte typeCompte;
    
    @Column(name = "date_creation", updatable = false)
    private LocalDateTime dateCreation = LocalDateTime.now();
    
    // Solde nul à la création selon l'énoncé
    @NotNull(message = "Le solde ne peut pas être null")
    @DecimalMin(value = "0.0", message = "Le solde ne peut pas être négatif")
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal solde = BigDecimal.ZERO;
    
    // Propriétaire du compte
    @NotNull(message = "Le propriétaire du compte est obligatoire")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "proprietaire_id", nullable = false)
    private Client proprietaire;
    
    // Un compte peut avoir plusieurs transactions
    @OneToMany(mappedBy = "compte", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Transaction> transactions;
    
    /**
     * Types de comptes disponibles selon l'énoncé :
     * - Compte épargne
     * - Compte courant
     */
    public enum TypeCompte {
        EPARGNE("Compte Épargne"),
        COURANT("Compte Courant");
        
        private final String libelle;
        
        TypeCompte(String libelle) {
            this.libelle = libelle;
        }
        
        public String getLibelle() {
            return libelle;
        }
    }
    
    @PrePersist
    protected void onCreate() {
        dateCreation = LocalDateTime.now();
        if (solde == null) {
            solde = BigDecimal.ZERO; // Solde nul à la création
        }
        if (numeroCompte == null || numeroCompte.isEmpty()) {
            numeroCompte = genererNumeroCompte();
        }
    }
    
    /**
     * Génère un numéro de compte au format IBAN en utilisant iban4j
     * Conforme à l'énoncé qui recommande l'utilisation d'iban4j
     */
    private String genererNumeroCompte() {
        try {
            // Génération d'un IBAN pour le Sénégal (SN) - Société bancaire "Ega"
            // Code banque fictif : 00100 (5 chiffres)
            // Code guichet : 15200 (5 chiffres) 
            // Numéro de compte : généré aléatoirement (11 chiffres)
            // Clé RIB : calculée automatiquement par iban4j
            
            Random random = new Random();
            String codeBanque = "00100";
            String codeGuichet = "15200";
            
            // Génération d'un numéro de compte unique de 11 chiffres
            StringBuilder numeroCompteBuilder = new StringBuilder();
            for (int i = 0; i < 11; i++) {
                numeroCompteBuilder.append(random.nextInt(10));
            }
            String numeroCompteGenere = numeroCompteBuilder.toString();
            
            // Construction du BBAN (Basic Bank Account Number)
            String bban = codeBanque + codeGuichet + numeroCompteGenere;
            
            // Génération de l'IBAN complet
            Iban iban = new Iban.Builder()
                    .countryCode(CountryCode.SN) // Sénégal
                    .bankCode(codeBanque)
                    .branchCode(codeGuichet)
                    .accountNumber(numeroCompteGenere)
                    .build();
            
            return iban.toString();
            
        } catch (Exception e) {
            // En cas d'erreur, génération d'un numéro de compte simple
            Random random = new Random();
            return "SN12K00100152000025" + String.format("%09d", random.nextInt(1000000000));
        }
    }
    
    /**
     * Méthode utilitaire pour créditer le compte
     */
    public void crediter(BigDecimal montant) {
        if (montant.compareTo(BigDecimal.ZERO) > 0) {
            this.solde = this.solde.add(montant);
        }
    }
    
    /**
     * Méthode utilitaire pour débiter le compte
     */
    public void debiter(BigDecimal montant) {
        if (montant.compareTo(BigDecimal.ZERO) > 0 && this.solde.compareTo(montant) >= 0) {
            this.solde = this.solde.subtract(montant);
        }
    }
    
    /**
     * Vérifie si le solde est suffisant pour un retrait
     */
    public boolean soldeEstSuffisant(BigDecimal montant) {
        return this.solde.compareTo(montant) >= 0;
    }
}