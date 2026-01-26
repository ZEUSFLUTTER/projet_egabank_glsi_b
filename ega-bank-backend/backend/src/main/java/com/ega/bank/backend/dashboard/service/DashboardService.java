package com.ega.bank.backend.dashboard.service;

import com.ega.bank.backend.dashboard.dto.AdminDashboardDto;
import com.ega.bank.backend.dashboard.dto.AgentDashboardDto;
import com.ega.bank.backend.dashboard.dto.ClientDashboardDto;
import com.ega.bank.backend.entity.Client;
import com.ega.bank.backend.entity.Compte;
import com.ega.bank.backend.repository.ClientRepository;
import com.ega.bank.backend.repository.CompteRepository;
import com.ega.bank.backend.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class DashboardService {

    private final ClientRepository clientRepository;
    private final CompteRepository compteRepository;
    private final TransactionRepository transactionRepository;

    public DashboardService(
            ClientRepository clientRepository,
            CompteRepository compteRepository,
            TransactionRepository transactionRepository) {
        this.clientRepository = clientRepository;
        this.compteRepository = compteRepository;
        this.transactionRepository = transactionRepository;
    }

    // ADMIN DASHBOARD
    public AdminDashboardDto getAdminDashboard() {

        long totalClients = clientRepository.count();
        long totalComptes = compteRepository.count();
        long totalTransactions = transactionRepository.countAllTransactions();
        BigDecimal totalSoldes = compteRepository.sumAllSoldes();

        return new AdminDashboardDto(
                totalClients,
                totalComptes,
                totalTransactions,
                totalSoldes);
    }

    // AGENT DASHBOARD
    public AgentDashboardDto getAgentDashboard() {

        long nombreClients = clientRepository.count();
        long nombreComptes = compteRepository.count();
        long nombreTransactions = transactionRepository.countAllTransactions();
        BigDecimal volumeTransactions = transactionRepository.sumAllTransactionAmounts();

        return new AgentDashboardDto(
                nombreClients,
                nombreComptes,
                nombreTransactions,
                volumeTransactions);
    }

    // CLIENT DASHBOARD
    public ClientDashboardDto getClientDashboard(Long clientId) {

        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client introuvable"));

        List<Compte> comptes = compteRepository.findByClient(client);

        long nombreComptes = comptes.size();

        BigDecimal soldeTotal = comptes.stream()
                .map(Compte::getSolde)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long nombreTransactions = comptes.stream()
                .flatMap(compte -> transactionRepository.findByCompteSource(compte).stream())
                .count();

        return new ClientDashboardDto(
                nombreComptes,
                soldeTotal,
                nombreTransactions);
    }
}