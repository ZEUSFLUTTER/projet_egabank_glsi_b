package com.iai.projet.banque.models;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class OperationDTO {
    private Long id;
    private String typeOperation;
    private String idCompteSource;
    private String idCompteDestination;
    private String montant;
    private String numeroCompte;

}
