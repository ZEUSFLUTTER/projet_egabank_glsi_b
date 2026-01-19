package banque.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class OperationDto {
    private String numeroCompte;
    private BigDecimal montant;
}