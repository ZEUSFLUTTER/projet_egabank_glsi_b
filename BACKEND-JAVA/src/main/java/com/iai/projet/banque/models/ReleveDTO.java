package com.iai.projet.banque.models;

import com.iai.projet.banque.entity.Operation;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ReleveDTO {
    private String id;
    private LocalDate dateOperation;
    private String typeOperation;
    private Double montant;
    private Double soldeApres;
    private String description;
    private String numeroCompteSource;

    // Constructeur depuis l'entité
    public ReleveDTO(Operation operation    ) {
        this.id = operation.getId().toString();
        this.dateOperation = operation.getDateOperation();
        this.typeOperation = operation.getTypeOperation();
        this.montant = operation.getMontant();
        this.description = operation.getDescription();
        this.numeroCompteSource = String.valueOf(operation.getCompteSourceId());
    }
}
