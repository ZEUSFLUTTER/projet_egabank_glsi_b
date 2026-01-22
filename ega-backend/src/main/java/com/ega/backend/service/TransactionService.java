package com.ega.backend.service;

import com.ega.backend.domain.Account;
import com.ega.backend.domain.BankTransaction;
import com.ega.backend.domain.enums.TransactionType;
import com.ega.backend.dto.transaction.DepositWithdrawRequest;
import com.ega.backend.dto.transaction.TransactionResponse;
import com.ega.backend.dto.transaction.TransferRequest;
import com.ega.backend.exception.SoldeInsuffisantException;
import com.ega.backend.exception.CompteNotFoundException;
import com.ega.backend.repository.AccountRepository;
import com.ega.backend.repository.BankTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import com.ega.backend.repository.UserAccountRepository;
import com.ega.backend.repository.ClientRepository;
import com.ega.backend.security.UserAccount;
import com.ega.backend.domain.Client;

@Service
@RequiredArgsConstructor
@Transactional
public class TransactionService {

    private final AccountRepository accountRepository;
    private final BankTransactionRepository transactionRepository;
    private final UserAccountRepository userAccountRepository;
    private final ClientRepository clientRepository;

    @Transactional(readOnly = true)
    public List<TransactionResponse> getByAccountIdLimited(Long accountId, int limit) {
        return transactionRepository.findByAccountIdLimited(accountId, org.springframework.data.domain.PageRequest.of(0, limit))
            .stream()
            .map(this::toDto)
            .toList();
    }

    public TransactionResponse updateTransaction(Long id, com.ega.backend.dto.transaction.GenericTransactionRequest req) {
        BankTransaction tx = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found: " + id));
        // Ici, on met à jour les champs modifiables
        if (req.amount() != null) tx.setAmount(req.amount());
        if (req.type() != null) tx.setType(TransactionType.valueOf(req.type().toUpperCase()));
        // On peut ajouter d'autres champs à mettre à jour si besoin
        transactionRepository.save(tx);
        return toDto(tx);
    }

    public TransactionResponse deposit(DepositWithdrawRequest req) {
        Account dest = accountRepository.findByAccountNumber(req.accountNumber())
                .orElseThrow(() -> new CompteNotFoundException("Account not found: " + req.accountNumber()));
        BigDecimal amount = req.amount();
        dest.setBalance(dest.getBalance().add(amount));

        BankTransaction tx = BankTransaction.builder()
                .type(TransactionType.DEPOSIT)
                .amount(amount)
                .operationDate(Instant.now())
                .destinationAccount(dest)
                .build();
        transactionRepository.save(tx);
        return toDto(tx);
    }

    public TransactionResponse withdraw(DepositWithdrawRequest req) {
        Account src = accountRepository.findByAccountNumber(req.accountNumber())
                .orElseThrow(() -> new CompteNotFoundException("Account not found: " + req.accountNumber()));
        BigDecimal amount = req.amount();
        if (src.getBalance().compareTo(amount) < 0) {
            throw new SoldeInsuffisantException("Insufficient balance");
        }
        src.setBalance(src.getBalance().subtract(amount));

        BankTransaction tx = BankTransaction.builder()
                .type(TransactionType.WITHDRAWAL)
                .amount(amount)
                .operationDate(Instant.now())
                .sourceAccount(src)
                .build();
        transactionRepository.save(tx);
        return toDto(tx);
    }

    public TransactionResponse transfer(TransferRequest req) {
        if (req.fromAccount().equals(req.toAccount())) {
            throw new IllegalArgumentException("Source and destination accounts must differ");
        }
        Account src = accountRepository.findByAccountNumber(req.fromAccount())
                .orElseThrow(() -> new CompteNotFoundException("Account not found: " + req.fromAccount()));
        Account dest = accountRepository.findByAccountNumber(req.toAccount())
                .orElseThrow(() -> new CompteNotFoundException("Account not found: " + req.toAccount()));
        BigDecimal amount = req.amount();
        if (src.getBalance().compareTo(amount) < 0) {
            throw new SoldeInsuffisantException("Insufficient balance");
        }
        src.setBalance(src.getBalance().subtract(amount));
        dest.setBalance(dest.getBalance().add(amount));

        BankTransaction tx = BankTransaction.builder()
                .type(TransactionType.TRANSFER)
                .amount(amount)
                .operationDate(Instant.now())
                .sourceAccount(src)
                .destinationAccount(dest)
                .build();
        transactionRepository.save(tx);
        return toDto(tx);
    }

    @Transactional(readOnly = true)
    public List<TransactionResponse> getUserTransactions(String username) {
        var userOpt = userAccountRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return List.of();
        }

        var clientOpt = clientRepository.findByEmail(userOpt.get().getEmail());
        if (clientOpt.isEmpty()) {
            return List.of();
        }

        List<Account> accounts = accountRepository.findByOwnerId(clientOpt.get().getId());
        if (accounts == null || accounts.isEmpty()) {
            return List.of();
        }

        return accounts.stream()
                .flatMap(a -> transactionRepository
                        .findByAccountIdAndPeriod(a.getId(), Instant.ofEpochSecond(0), Instant.now())
                        .stream())
                .map(this::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<TransactionResponse> history(Long accountId, Instant from, Instant to) {
        return transactionRepository.findByAccountIdAndPeriod(accountId, from, to)
                .stream().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public List<TransactionResponse> historyByAccountNumber(String accountNumber, Instant from, Instant to) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new CompteNotFoundException("Account not found: " + accountNumber));
        return history(account.getId(), from, to);
    }

    private TransactionResponse toDto(BankTransaction tx) {
        return new TransactionResponse(
                tx.getId(),
                tx.getType(),
                tx.getAmount(),
                tx.getOperationDate(),
                tx.getSourceAccount() != null ? tx.getSourceAccount().getAccountNumber() : null,
                tx.getDestinationAccount() != null ? tx.getDestinationAccount().getAccountNumber() : null
        );
    }

    @Transactional(readOnly = true)
    public List<TransactionResponse> getAllTransactions() {
        return transactionRepository.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public TransactionResponse getById(Long id) {
        BankTransaction tx = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found: " + id));
        return toDto(tx);
    }

    @Transactional(readOnly = true)
    public List<TransactionResponse> getByAccountId(Long accountId) {
        return transactionRepository.findByAccountId(accountId).stream().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public List<TransactionResponse> findByDateRange(Instant from, Instant to) {
        return transactionRepository.findByPeriod(from, to).stream().map(this::toDto).toList();
    }

    public TransactionResponse createGeneric(com.ega.backend.dto.transaction.GenericTransactionRequest req) {
        String t = req.type().toUpperCase();
        switch (t) {
            case "DEPOSIT":
            case "CREDIT":
                return deposit(new com.ega.backend.dto.transaction.DepositWithdrawRequest(req.accountNumber(), req.amount()));
            case "WITHDRAW":
            case "WITHDRAWAL":
            case "DEBIT":
                return withdraw(new com.ega.backend.dto.transaction.DepositWithdrawRequest(req.accountNumber(), req.amount()));
            case "TRANSFER":
                return transfer(new com.ega.backend.dto.transaction.TransferRequest(req.fromAccount(), req.toAccount(), req.amount()));
            default:
                throw new IllegalArgumentException("Unsupported transaction type: " + req.type());
        }
    }

    public void deleteById(Long id) {
        transactionRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<TransactionResponse> getTransactionsByAccountAndPeriod(String accountNumber, Instant from, Instant to) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new CompteNotFoundException("Account not found: " + accountNumber));
        
        return transactionRepository.findByAccountAndPeriod(account.getId(), from, to)
                .stream()
                .map(this::toDto)
                .toList();
    }
}