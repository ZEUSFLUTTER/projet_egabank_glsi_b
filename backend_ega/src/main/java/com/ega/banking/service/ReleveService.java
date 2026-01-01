package com.ega.banking.service;

import com.ega.banking.dto.TransactionDTO;
import com.ega.banking.exception.ResourceNotFoundException;
import com.ega.banking.model.Compte;
import com.ega.banking.repository.CompteRepository;
import com.ega.banking.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class ReleveService {

    private final TransactionRepository transactionRepository;
    private final CompteRepository compteRepository;
    private final TransactionService transactionService;

    public List<TransactionDTO> genererReleve(Long compteId, LocalDateTime dateDebut, LocalDateTime dateFin) {
        log.info("Génération du relevé pour le compte ID={} du {} au {}",
                compteId, dateDebut, dateFin);

        // Vérifier que le compte existe
        Compte compte = compteRepository.findById(compteId)
                .orElseThrow(() -> new ResourceNotFoundException("Compte", "id", compteId));

        // Récupérer les transactions
        List<TransactionDTO> transactions = transactionService.obtenirTransactionsParPeriode(
                compteId, dateDebut, dateFin);

        log.info("Relevé généré avec {} transactions", transactions.size());
        return transactions;
    }

    public List<TransactionDTO> genererReleveMensuel(Long compteId, int annee, int mois) {
        log.info("Génération du relevé mensuel pour le compte ID={} - {}/{}",
                compteId, mois, annee);

        LocalDateTime dateDebut = LocalDateTime.of(annee, mois, 1, 0, 0);
        LocalDateTime dateFin = dateDebut.plusMonths(1).minusSeconds(1);

        return genererReleve(compteId, dateDebut, dateFin);
    }

    public List<TransactionDTO> genererReleveAnnuel(Long compteId, int annee) {
        log.info("Génération du relevé annuel pour le compte ID={} - {}", compteId, annee);

        LocalDateTime dateDebut = LocalDateTime.of(annee, 1, 1, 0, 0);
        LocalDateTime dateFin = LocalDateTime.of(annee, 12, 31, 23, 59, 59);

        return genererReleve(compteId, dateDebut, dateFin);
    }
}
