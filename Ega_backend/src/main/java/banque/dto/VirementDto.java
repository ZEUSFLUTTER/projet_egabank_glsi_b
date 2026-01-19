package banque.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class VirementDto {
    private String compteEmetteur;
    private String compteBeneficiaire;
    private BigDecimal montant;
}