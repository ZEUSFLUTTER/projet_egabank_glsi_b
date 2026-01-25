package com.ega.backend.model;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Pattern;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Document(collection = "comptes")
public class Compte {

    @Id
    private String id;
    @NotNull(message = "L'ID client est obligatoire")

    private String clientId;

    @Pattern(regexp = "^ACC\\d{12}$", message = "Le numéro de compte doit commencer par 'ACC' suivi de 12 chiffres")
    private String numeroCompte;

    @DecimalMin(value = "0.0", message = "Le solde doit être supérieur ou égal à 0")
    private BigDecimal solde = BigDecimal.ZERO;

    private String devise = "EUR";

    @NotNull(message = "Le type de compte est obligatoire")
    private TypeCompte type;

    private LocalDateTime createdAt = LocalDateTime.now();
    private Boolean isActive = true;
    private LocalDateTime closedAt; // Date de fermeture si fermé
    private String description; // Optionnelle
}