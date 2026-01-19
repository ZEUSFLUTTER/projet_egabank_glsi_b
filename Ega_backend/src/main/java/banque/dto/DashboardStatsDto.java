package banque.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardStatsDto {
    private long totalClients;
    private long demandesTraitees;     // Validées ou Rejetées
    private long volumeTransactions;   // Nombre total de transactions
}