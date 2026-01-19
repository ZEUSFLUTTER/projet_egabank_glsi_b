package banque.service;

import banque.dto.DashboardStatsDto;
import banque.enums.StatutDemande;
import banque.repository.ClientRepository;
import banque.repository.DemandeCompteRepository;
import banque.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {

    private final ClientRepository clientRepository;
    private final DemandeCompteRepository demandeRepository;
    private final TransactionRepository transactionRepository;

    public DashboardStatsDto getDashboardStats() {
        // 1. Total Clients (Actifs)
        long nbClients = clientRepository.countByEstSupprimeFalse();

        // 2. Demandes Traitées (Tout ce qui n'est PAS "EN_ATTENTE")
        long nbDemandesTraitees = demandeRepository.countByStatutNot(StatutDemande.EN_ATTENTE);

        // 3. Volume Transactions (Nombre total de lignes dans la table transaction)
        long nbTransactions = transactionRepository.count();

        return DashboardStatsDto.builder()
                .totalClients(nbClients)
                .demandesTraitees(nbDemandesTraitees)
                .volumeTransactions(nbTransactions)
                .build();
    }
}