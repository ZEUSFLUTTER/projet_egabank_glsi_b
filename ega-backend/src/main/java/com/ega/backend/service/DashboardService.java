package com.ega.backend.service;

import com.ega.backend.domain.Account;
import com.ega.backend.domain.BankTransaction;
import com.ega.backend.domain.Client;
import com.ega.backend.domain.enums.TransactionType;
import com.ega.backend.dto.dashboard.DashboardStatsResponse;
import com.ega.backend.dto.dashboard.FinancialStatsResponse;
import com.ega.backend.repository.AccountRepository;
import com.ega.backend.repository.BankTransactionRepository;
import com.ega.backend.repository.ClientRepository;
import com.ega.backend.repository.UserAccountRepository;
import com.ega.backend.security.UserAccount;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.temporal.TemporalAdjusters;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final AccountRepository accountRepository;
    private final BankTransactionRepository transactionRepository;
    private final ClientRepository clientRepository;
    private final UserAccountRepository userAccountRepository;

    public DashboardStatsResponse getDashboardStats(String username) {
        UserAccount user = userAccountRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if user is admin - if so, return admin stats
        if ("ADMIN".equals(user.getRole())) {
            return getAdminDashboardStats();
        }

        // Find client by user email (clients are linked by email)
        Client client = clientRepository.findByEmail(user.getEmail())
                .orElseThrow(() -> new RuntimeException("Client not found"));

        // Get user's accounts by owner id
        List<Account> accounts = accountRepository.findByOwnerId(client.getId());

        // Calculate total balance
        BigDecimal totalBalance = accounts.stream()
                .map(Account::getBalance)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Get all transactions for user's accounts
        List<BankTransaction> allTransactions = accounts.stream()
                .flatMap(account -> transactionRepository.findByAccountId(account.getId()).stream())
                .toList();

        // Get current month transactions
        Instant startOfMonth = LocalDateTime.now()
                .with(TemporalAdjusters.firstDayOfMonth())
                .withHour(0).withMinute(0).withSecond(0).withNano(0)
                .toInstant(ZoneOffset.UTC);
        
        Instant endOfMonth = LocalDateTime.now()
                .with(TemporalAdjusters.lastDayOfMonth())
                .withHour(23).withMinute(59).withSecond(59).withNano(999999999)
                .toInstant(ZoneOffset.UTC);

        List<BankTransaction> monthlyTransactions = allTransactions.stream()
                .filter(t -> t.getOperationDate().isAfter(startOfMonth) && t.getOperationDate().isBefore(endOfMonth))
                .toList();

        // Calculate credits and debits
        BigDecimal totalCredits = allTransactions.stream()
                .filter(t -> t.getType() == TransactionType.CREDIT)
                .map(BankTransaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalDebits = allTransactions.stream()
                .filter(t -> t.getType() == TransactionType.DEBIT)
                .map(BankTransaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Monthly earnings and expenses
        BigDecimal monthlyEarnings = monthlyTransactions.stream()
                .filter(t -> t.getType() == TransactionType.CREDIT)
                .map(BankTransaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal monthlyExpenses = monthlyTransactions.stream()
                .filter(t -> t.getType() == TransactionType.DEBIT)
                .map(BankTransaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Count transactions by type
        long creditCount = allTransactions.stream()
                .filter(t -> t.getType() == TransactionType.CREDIT)
                .count();

        long debitCount = allTransactions.stream()
                .filter(t -> t.getType() == TransactionType.DEBIT)
                .count();

        return DashboardStatsResponse.builder()
                .totalBalance(totalBalance)
                .totalAccounts(accounts.size())
                .totalTransactions(allTransactions.size())
                .totalCategories(12) // Fixed number for now
                .totalCredits(totalCredits)
                .totalDebits(totalDebits)
                .monthlyEarnings(monthlyEarnings)
                .monthlyExpenses(monthlyExpenses)
                .creditCount((int) creditCount)
                .debitCount((int) debitCount)
                .build();
    }

    public DashboardStatsResponse getAdminDashboardStats() {
        // Get ALL accounts in the system
        List<Account> allAccounts = accountRepository.findAll();

        // Calculate total balance across all accounts
        BigDecimal totalBalance = allAccounts.stream()
                .map(Account::getBalance)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Get ALL transactions in the system directly
        List<BankTransaction> allTransactions = transactionRepository.findAll();

        // Get current month transactions
        Instant startOfMonth = LocalDateTime.now()
                .with(TemporalAdjusters.firstDayOfMonth())
                .withHour(0).withMinute(0).withSecond(0).withNano(0)
                .toInstant(ZoneOffset.UTC);
        
        Instant endOfMonth = LocalDateTime.now()
                .with(TemporalAdjusters.lastDayOfMonth())
                .withHour(23).withMinute(59).withSecond(59).withNano(999999999)
                .toInstant(ZoneOffset.UTC);

        List<BankTransaction> monthlyTransactions = allTransactions.stream()
                .filter(t -> t.getOperationDate().isAfter(startOfMonth) && t.getOperationDate().isBefore(endOfMonth))
                .toList();

        // Calculate credits and debits
        BigDecimal totalCredits = allTransactions.stream()
                .filter(t -> t.getType() == TransactionType.CREDIT)
                .map(BankTransaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalDebits = allTransactions.stream()
                .filter(t -> t.getType() == TransactionType.DEBIT)
                .map(BankTransaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Monthly earnings and expenses
        BigDecimal monthlyEarnings = monthlyTransactions.stream()
                .filter(t -> t.getType() == TransactionType.CREDIT)
                .map(BankTransaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal monthlyExpenses = monthlyTransactions.stream()
                .filter(t -> t.getType() == TransactionType.DEBIT)
                .map(BankTransaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Count transactions by type
        long creditCount = allTransactions.stream()
                .filter(t -> t.getType() == TransactionType.CREDIT)
                .count();

        long debitCount = allTransactions.stream()
                .filter(t -> t.getType() == TransactionType.DEBIT)
                .count();

        // Get ALL clients
        List<Client> allClients = clientRepository.findAll();
        
        // Calculate active accounts (accounts with positive balance)
        long activeAccounts = allAccounts.stream()
                .filter(account -> account.getBalance().compareTo(BigDecimal.ZERO) > 0)
                .count();
        
        // Calculate active clients (clients with at least one account)
        long activeClients = allClients.stream()
                .filter(client -> !accountRepository.findByOwnerId(client.getId()).isEmpty())
                .count();
        
        // Calculate new accounts this month (simulation - you might want to add a createdAt field to Account)
        int newAccountsThisMonth = Math.max(1, (int) (allAccounts.size() * 0.15)); // 15% simulation
        
        // Calculate new clients this month (simulation - you might want to add a createdAt field to Client)
        int newClientsThisMonth = Math.max(1, (int) (allClients.size() * 0.10)); // 10% simulation

        System.out.println("=== ADMIN DASHBOARD STATS DEBUG ===");
        System.out.println("Total accounts: " + allAccounts.size());
        System.out.println("Total balance: " + totalBalance);
        System.out.println("Total transactions: " + allTransactions.size());
        System.out.println("Total clients: " + allClients.size());
        System.out.println("Active accounts: " + activeAccounts);
        System.out.println("Active clients: " + activeClients);
        System.out.println("===================================");

        return DashboardStatsResponse.builder()
                .totalBalance(totalBalance)
                .totalAccounts(allAccounts.size())
                .totalTransactions(allTransactions.size())
                .totalCategories(12) // Fixed number for now
                .totalCredits(totalCredits)
                .totalDebits(totalDebits)
                .monthlyEarnings(monthlyEarnings)
                .monthlyExpenses(monthlyExpenses)
                .creditCount((int) creditCount)
                .debitCount((int) debitCount)
                // Admin-specific stats
                .totalClients(allClients.size())
                .activeClients((int) activeClients)
                .activeAccounts((int) activeAccounts)
                .newAccountsThisMonth(newAccountsThisMonth)
                .newClientsThisMonth(newClientsThisMonth)
                .build();
    }

    public FinancialStatsResponse getFinancialStats(String username) {
        UserAccount user = userAccountRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if user is admin
        if ("ADMIN".equals(user.getRole())) {
            // For admin, calculate stats for all accounts in the system
            List<Account> allAccounts = accountRepository.findAll();
            
            // Calculate total balance
            BigDecimal balance = allAccounts.stream()
                    .map(Account::getBalance)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            // Get all transactions in the system
            List<BankTransaction> allTransactions = transactionRepository.findAll();

            // Calculate total income (all credits)
            BigDecimal totalIncome = allTransactions.stream()
                    .filter(t -> t.getType() == TransactionType.CREDIT || t.getType() == TransactionType.DEPOSIT)
                    .map(BankTransaction::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            // Calculate total expenses (all debits)
            BigDecimal totalExpenses = allTransactions.stream()
                    .filter(t -> t.getType() == TransactionType.DEBIT || t.getType() == TransactionType.WITHDRAWAL)
                    .map(BankTransaction::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            // Get current month transactions
            Instant startOfMonth = LocalDateTime.now()
                    .with(TemporalAdjusters.firstDayOfMonth())
                    .withHour(0).withMinute(0).withSecond(0).withNano(0)
                    .toInstant(ZoneOffset.UTC);
            
            Instant endOfMonth = LocalDateTime.now()
                    .with(TemporalAdjusters.lastDayOfMonth())
                    .withHour(23).withMinute(59).withSecond(59).withNano(999999999)
                    .toInstant(ZoneOffset.UTC);

            List<BankTransaction> monthlyTransactions = allTransactions.stream()
                    .filter(t -> t.getOperationDate().isAfter(startOfMonth) && t.getOperationDate().isBefore(endOfMonth))
                    .toList();

            // Calculate monthly income
            BigDecimal monthlyIncome = monthlyTransactions.stream()
                    .filter(t -> t.getType() == TransactionType.CREDIT || t.getType() == TransactionType.DEPOSIT)
                    .map(BankTransaction::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            // Calculate monthly expenses
            BigDecimal monthlyExpenses = monthlyTransactions.stream()
                    .filter(t -> t.getType() == TransactionType.DEBIT || t.getType() == TransactionType.WITHDRAWAL)
                    .map(BankTransaction::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            return new FinancialStatsResponse(totalIncome, totalExpenses, monthlyIncome, monthlyExpenses, balance);
        }

        // For clients, find client by user email
        Client client = clientRepository.findByEmail(user.getEmail())
                .orElseThrow(() -> new RuntimeException("Client not found"));

        // Get user's accounts
        List<Account> accounts = accountRepository.findByOwnerId(client.getId());

        // Calculate total balance
        BigDecimal balance = accounts.stream()
                .map(Account::getBalance)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Get all transactions for user's accounts
        List<BankTransaction> allTransactions = accounts.stream()
                .flatMap(account -> transactionRepository.findByAccountId(account.getId()).stream())
                .toList();

        // Calculate total income (all credits)
        BigDecimal totalIncome = allTransactions.stream()
                .filter(t -> t.getType() == TransactionType.CREDIT || t.getType() == TransactionType.DEPOSIT)
                .map(BankTransaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Calculate total expenses (all debits)
        BigDecimal totalExpenses = allTransactions.stream()
                .filter(t -> t.getType() == TransactionType.DEBIT || t.getType() == TransactionType.WITHDRAWAL)
                .map(BankTransaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Get current month transactions
        Instant startOfMonth = LocalDateTime.now()
                .with(TemporalAdjusters.firstDayOfMonth())
                .withHour(0).withMinute(0).withSecond(0).withNano(0)
                .toInstant(ZoneOffset.UTC);
        
        Instant endOfMonth = LocalDateTime.now()
                .with(TemporalAdjusters.lastDayOfMonth())
                .withHour(23).withMinute(59).withSecond(59).withNano(999999999)
                .toInstant(ZoneOffset.UTC);

        List<BankTransaction> monthlyTransactions = allTransactions.stream()
                .filter(t -> t.getOperationDate().isAfter(startOfMonth) && t.getOperationDate().isBefore(endOfMonth))
                .toList();

        // Calculate monthly income
        BigDecimal monthlyIncome = monthlyTransactions.stream()
                .filter(t -> t.getType() == TransactionType.CREDIT || t.getType() == TransactionType.DEPOSIT)
                .map(BankTransaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Calculate monthly expenses
        BigDecimal monthlyExpenses = monthlyTransactions.stream()
                .filter(t -> t.getType() == TransactionType.DEBIT || t.getType() == TransactionType.WITHDRAWAL)
                .map(BankTransaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new FinancialStatsResponse(totalIncome, totalExpenses, monthlyIncome, monthlyExpenses, balance);
    }
}