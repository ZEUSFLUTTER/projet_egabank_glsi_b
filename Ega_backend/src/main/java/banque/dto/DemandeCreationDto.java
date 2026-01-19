package banque.dto;

import banque.enums.TypeCompte;
import lombok.Data;

@Data
public class DemandeCreationDto {
    private Long clientId;
    private TypeCompte typeCompte;
}