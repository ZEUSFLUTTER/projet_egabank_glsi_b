package com.ega.backend.model;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.DecimalMin;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Document(collection = "transactions")
public class Transaction {

    @Id
    private String id;
    @NotNull(message = "L'ID du compte source est obligatoire")

    private String compteSourceId;

    private String compteDestId; // Peut être null pour dépôt/retrait

    @NotNull(message = "Le type de transaction est obligatoire")
    private String type; // "depot", "retrait", "virement_entrant", "virement_sortant"

    @DecimalMin(value = "0.01", message = "Le montant doit être supérieur à 0")
    @NotNull(message = "Le montant est obligatoire")
    private BigDecimal montant;

    @NotNull(message = "La date est obligatoire")
    private LocalDateTime date = LocalDateTime.now();

    private String description;

    @NotNull(message = "L'état de la transaction est obligatoire")
    private String etat = "TERMINEE"; // TERMINEE, EN_COURS, ECHEC

    private String reference; // Numéro unique de transaction
}