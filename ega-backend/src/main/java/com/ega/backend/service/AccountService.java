package com.ega.backend.service;

import com.ega.backend.domain.*;
import com.ega.backend.dto.account.AccountCreateRequest;
import com.ega.backend.dto.account.AccountResponse;
import com.ega.backend.dto.account.AccountStatementResponse;
import com.ega.backend.dto.transaction.TransactionResponse;
import com.ega.backend.exception.ClientNotFoundException;
import com.ega.backend.exception.CompteNotFoundException;
import com.ega.backend.repository.AccountRepository;
import com.ega.backend.repository.ClientRepository;
import com.ega.backend.repository.UserAccountRepository;
import com.ega.backend.security.UserAccount;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AccountService {
    private final AccountRepository accountRepository;
    private final ClientRepository clientRepository;
    private final IbanGenerator ibanGenerator;
    private final UserAccountRepository userAccountRepository;
    private final TransactionService transactionService;
    private final ClientService clientService;

    public AccountResponse create(AccountCreateRequest req) {
        Client owner = clientRepository.findById(req.ownerId())
                .orElseThrow(() -> new ClientNotFoundException("Client not found: " + req.ownerId()));

        Account account = switch (req.type().toUpperCase()) {
            case "CURRENT" -> new CurrentAccount();
            case "SAVINGS" -> new SavingsAccount();
            default -> throw new IllegalArgumentException("Unsupported account type: " + req.type());
        };
        account.setOwner(owner);
        
        // Set initial balance (default to 0 if not provided)
        BigDecimal initialBalance = req.initialBalance() != null ? req.initialBalance() : BigDecimal.ZERO;
        account.setBalance(initialBalance);

        // Generate a unique IBAN
        String iban;
        int attempts = 0;
        do {
            iban = ibanGenerator.newIban();
            attempts++;
            if (attempts > 5) {
                throw new IllegalStateException("Unable to generate unique IBAN");
            }
        } while (accountRepository.findByAccountNumber(iban).isPresent());
        account.setAccountNumber(iban);

        Account saved = accountRepository.save(account);
        return toDto(saved);
    }

    @Transactional(readOnly = true)
    public AccountResponse getByNumber(String number) {
        Account a = accountRepository.findByAccountNumber(number)
                .orElseThrow(() -> new CompteNotFoundException("Account not found: " + number));
        return toDto(a);
    }

    @Transactional(readOnly = true)
    public AccountResponse getById(Long id) {
        Account a = accountRepository.findById(id)
                .orElseThrow(() -> new CompteNotFoundException("Account not found: " + id));
        return toDto(a);
    }

    public AccountResponse update(Long id, com.ega.backend.dto.account.AccountCreateRequest req) {
        Account a = accountRepository.findById(id)
                .orElseThrow(() -> new CompteNotFoundException("Account not found: " + id));
        // Only allow changing owner for simplicity
        Client owner = clientRepository.findById(req.ownerId())
                .orElseThrow(() -> new ClientNotFoundException("Client not found: " + req.ownerId()));
        a.setOwner(owner);
        Account saved = accountRepository.save(a);
        return toDto(saved);
    }

    public void delete(Long id) {
        accountRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public com.ega.backend.dto.account.AccountBalanceResponse getBalance(Long id) {
        Account a = accountRepository.findById(id)
                .orElseThrow(() -> new CompteNotFoundException("Account not found: " + id));
        return new com.ega.backend.dto.account.AccountBalanceResponse(a.getId(), a.getBalance());
    }

    @Transactional(readOnly = true)
    public List<AccountResponse> findByClient(Long clientId) {
        return accountRepository.findByOwnerId(clientId).stream().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public List<AccountResponse> getUserAccounts(String username) {
        var userOpt = userAccountRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return List.of();
        }

        var clientOpt = clientRepository.findByEmail(userOpt.get().getEmail());
        if (clientOpt.isEmpty()) {
            return List.of();
        }

        return findByClient(clientOpt.get().getId());
    }

    @Transactional(readOnly = true)
    public Long getClientIdByUsername(String username) {
        var userOpt = userAccountRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return null;
        }

        var clientOpt = clientRepository.findByEmail(userOpt.get().getEmail());
        return clientOpt.map(Client::getId).orElse(null);
    }

    @Transactional(readOnly = true)
    public boolean isAccountOwner(String accountNumber, String username) {
        var userOpt = userAccountRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return false;
        }

        var clientOpt = clientRepository.findByEmail(userOpt.get().getEmail());
        if (clientOpt.isEmpty()) {
            return false;
        }

        var accountOpt = accountRepository.findByAccountNumber(accountNumber);
        return accountOpt.map(account -> account.getOwner().getId().equals(clientOpt.get().getId())).orElse(false);
    }

    @Transactional(readOnly = true)
    public boolean isAccountOwnerById(Long accountId, String username) {
        var userOpt = userAccountRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return false;
        }

        var clientOpt = clientRepository.findByEmail(userOpt.get().getEmail());
        if (clientOpt.isEmpty()) {
            return false;
        }

        var accountOpt = accountRepository.findById(accountId);
        return accountOpt.map(account -> account.getOwner().getId().equals(clientOpt.get().getId())).orElse(false);
    }

    @Transactional(readOnly = true)
    public List<AccountResponse> getAllAccounts() {
        return accountRepository.findAll().stream().map(this::toDto).toList();
    }

    private AccountResponse toDto(Account a) {
        String type = (a instanceof CurrentAccount) ? "CURRENT" : (a instanceof SavingsAccount ? "SAVINGS" : "UNKNOWN");
        return new AccountResponse(
                a.getId(), 
                a.getAccountNumber(), 
                type, 
                a.getCreatedAt(), 
                a.getBalance(), 
                a.getOwner().getId(),
                a.getOwner().getFirstName(),
                a.getOwner().getLastName(),
                a.getOwner().getEmail()
        );
    }

    public AccountStatementResponse generateStatement(Long accountId, String username) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new CompteNotFoundException("Account not found: " + accountId));
        
        // Vérifier les permissions
        if (!isOwnerOrAdmin(account, username)) {
            throw new RuntimeException("Access denied to account statement");
        }
        
        // Période par défaut : 3 derniers mois
        Instant periodEnd = Instant.now();
        Instant periodStart = periodEnd.minusSeconds(90 * 24 * 3600); // 90 jours
        
        // Récupérer les transactions de la période
        List<TransactionResponse> transactions = transactionService.getTransactionsByAccountAndPeriod(
            account.getAccountNumber(), periodStart, periodEnd);
        
        // Calculer les statistiques
        BigDecimal totalCredits = transactions.stream()
            .filter(t -> t.amount().compareTo(BigDecimal.ZERO) > 0)
            .map(TransactionResponse::amount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
            
        BigDecimal totalDebits = transactions.stream()
            .filter(t -> t.amount().compareTo(BigDecimal.ZERO) < 0)
            .map(t -> t.amount().abs())
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        return AccountStatementResponse.builder()
            .accountNumber(account.getAccountNumber())
            .accountType(account.getClass().getSimpleName().replace("Account", ""))
            .createdAt(account.getCreatedAt())
            .currentBalance(account.getBalance())
            .owner(clientService.toDto(account.getOwner()))
            .periodStart(periodStart)
            .periodEnd(periodEnd)
            .transactions(transactions)
            .totalCredits(totalCredits)
            .totalDebits(totalDebits)
            .transactionCount(transactions.size())
            .generatedAt(Instant.now())
            .generatedBy(username)
            .build();
    }
    
    public String generateStatementHtml(Long accountId, String username) {
        AccountStatementResponse statement = generateStatement(accountId, username);
        return buildStatementHtml(statement);
    }
    
    private String buildStatementHtml(AccountStatementResponse statement) {
        StringBuilder html = new StringBuilder();
        
        html.append("""
            <!DOCTYPE html>
            <html lang="fr">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Relevé de Compte - EGA Bank</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { 
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        background: #f8f9fa;
                        padding: 20px;
                    }
                    .container { 
                        max-width: 800px; 
                        margin: 0 auto; 
                        background: white;
                        box-shadow: 0 0 20px rgba(0,0,0,0.1);
                        border-radius: 10px;
                        overflow: hidden;
                    }
                    .header { 
                        background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
                        color: white;
                        padding: 30px;
                        text-align: center;
                    }
                    .header h1 { 
                        font-size: 2.5em;
                        margin-bottom: 10px;
                        color: #ffd700;
                    }
                    .header p { 
                        font-size: 1.2em;
                        opacity: 0.9;
                    }
                    .content { padding: 30px; }
                    .info-grid { 
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                        gap: 20px;
                        margin-bottom: 30px;
                    }
                    .info-card {
                        background: #f8f9fa;
                        padding: 20px;
                        border-radius: 8px;
                        border-left: 4px solid #ffd700;
                    }
                    .info-card h3 {
                        color: #1a1a1a;
                        margin-bottom: 10px;
                        font-size: 1.1em;
                    }
                    .info-card p {
                        color: #666;
                        font-size: 0.95em;
                    }
                    .balance {
                        text-align: center;
                        background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
                        color: #1a1a1a;
                        padding: 25px;
                        border-radius: 10px;
                        margin: 30px 0;
                    }
                    .balance h2 {
                        font-size: 2.2em;
                        margin-bottom: 5px;
                    }
                    .stats {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                        gap: 15px;
                        margin: 30px 0;
                    }
                    .stat-card {
                        text-align: center;
                        padding: 20px;
                        border-radius: 8px;
                        border: 2px solid #e9ecef;
                    }
                    .stat-card.credit { border-color: #28a745; background: #f8fff9; }
                    .stat-card.debit { border-color: #dc3545; background: #fff8f8; }
                    .stat-card.count { border-color: #007bff; background: #f8fbff; }
                    .transactions {
                        margin-top: 30px;
                    }
                    .transactions h3 {
                        color: #1a1a1a;
                        margin-bottom: 20px;
                        padding-bottom: 10px;
                        border-bottom: 2px solid #ffd700;
                    }
                    .transaction {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 15px;
                        border-bottom: 1px solid #e9ecef;
                        transition: background 0.3s;
                    }
                    .transaction:hover { background: #f8f9fa; }
                    .transaction:last-child { border-bottom: none; }
                    .transaction-info h4 {
                        color: #1a1a1a;
                        margin-bottom: 5px;
                    }
                    .transaction-info p {
                        color: #666;
                        font-size: 0.9em;
                    }
                    .transaction-amount {
                        font-weight: bold;
                        font-size: 1.1em;
                    }
                    .amount-credit { color: #28a745; }
                    .amount-debit { color: #dc3545; }
                    .footer {
                        background: #f8f9fa;
                        padding: 20px;
                        text-align: center;
                        color: #666;
                        border-top: 1px solid #e9ecef;
                    }
                    @media print {
                        body { background: white; padding: 0; }
                        .container { box-shadow: none; }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>EGA BANK</h1>
                        <p>Relevé de Compte Bancaire</p>
                    </div>
                    
                    <div class="content">
                        <div class="info-grid">
                            <div class="info-card">
                                <h3>Titulaire du Compte</h3>
                                <p><strong>""").append(statement.owner().firstName()).append(" ").append(statement.owner().lastName()).append("""
                                </strong></p>
                                <p>""").append(statement.owner().email()).append("""
                                </p>
                                <p>""").append(statement.owner().phone() != null ? statement.owner().phone() : "").append("""
                                </p>
                            </div>
                            
                            <div class="info-card">
                                <h3>Informations du Compte</h3>
                                <p><strong>N° de Compte:</strong> """).append(statement.accountNumber()).append("""
                                </p>
                                <p><strong>Type:</strong> """).append(statement.accountType()).append("""
                                </p>
                                <p><strong>Ouvert le:</strong> """).append(java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy").withZone(java.time.ZoneId.systemDefault()).format(statement.createdAt())).append("""
                                </p>
                            </div>
                            
                            <div class="info-card">
                                <h3>Période du Relevé</h3>
                                <p><strong>Du:</strong> """).append(java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy").withZone(java.time.ZoneId.systemDefault()).format(statement.periodStart())).append("""
                                </p>
                                <p><strong>Au:</strong> """).append(java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy").withZone(java.time.ZoneId.systemDefault()).format(statement.periodEnd())).append("""
                                </p>
                                <p><strong>Généré le:</strong> """).append(java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm").withZone(java.time.ZoneId.systemDefault()).format(statement.generatedAt())).append("""
                                </p>
                            </div>
                        </div>
                        
                        <div class="balance">
                            <h2>""").append(String.format("%.2f €", statement.currentBalance())).append("""
                            </h2>
                            <p>Solde Actuel</p>
                        </div>
                        
                        <div class="stats">
                            <div class="stat-card credit">
                                <h3>""").append(String.format("%.2f €", statement.totalCredits())).append("""
                                </h3>
                                <p>Total Crédits</p>
                            </div>
                            <div class="stat-card debit">
                                <h3>""").append(String.format("%.2f €", statement.totalDebits())).append("""
                                </h3>
                                <p>Total Débits</p>
                            </div>
                            <div class="stat-card count">
                                <h3>""").append(statement.transactionCount()).append("""
                                </h3>
                                <p>Transactions</p>
                            </div>
                        </div>
                        
                        <div class="transactions">
                            <h3>Historique des Transactions</h3>
            """);
        
        if (statement.transactions().isEmpty()) {
            html.append("""
                            <div class="transaction">
                                <div class="transaction-info">
                                    <p>Aucune transaction sur cette période</p>
                                </div>
                            </div>
                """);
        } else {
            for (var transaction : statement.transactions()) {
                String amountClass = transaction.amount().compareTo(BigDecimal.ZERO) >= 0 ? "amount-credit" : "amount-debit";
                String amountSign = transaction.amount().compareTo(BigDecimal.ZERO) >= 0 ? "+" : "";
                
                html.append("""
                            <div class="transaction">
                                <div class="transaction-info">
                                    <h4>""").append(getTransactionTypeName(transaction.type().toString())).append("""
                                    </h4>
                                    <p>""").append(java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm").withZone(java.time.ZoneId.systemDefault()).format(transaction.operationDate())).append("""
                                     - ID: """).append(transaction.id()).append("""
                                    </p>
                                </div>
                                <div class="transaction-amount """).append(amountClass).append("""
                                ">
                                    """).append(amountSign).append(String.format("%.2f €", transaction.amount().abs())).append("""
                                </div>
                            </div>
                    """);
            }
        }
        
        html.append("""
                        </div>
                    </div>
                    
                    <div class="footer">
                        <p>EGA Bank - Banque de confiance depuis 1985</p>
                        <p>Ce relevé a été généré automatiquement le """).append(java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy à HH:mm").withZone(java.time.ZoneId.systemDefault()).format(statement.generatedAt())).append("""
                        </p>
                    </div>
                </div>
                
                <script>
                    // Auto-print when opened in new window
                    if (window.location.search.includes('print=true')) {
                        window.onload = function() {
                            setTimeout(function() {
                                window.print();
                            }, 500);
                        };
                    }
                </script>
            </body>
            </html>
            """);
        
        return html.toString();
    }
    
    private String getTransactionTypeName(String type) {
        return switch (type.toUpperCase()) {
            case "DEPOSIT" -> "Dépôt";
            case "WITHDRAWAL" -> "Retrait";
            case "TRANSFER" -> "Virement";
            case "CREDIT" -> "Crédit";
            case "DEBIT" -> "Débit";
            default -> type;
        };
    }
    
    private boolean isOwnerOrAdmin(Account account, String username) {
        // Récupérer l'utilisateur
        UserAccount user = userAccountRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found: " + username));
        
        // Si admin, accès autorisé
        if (user.getRole() != null && "ADMIN".equals(user.getRole())) {
            return true;
        }
        
        // Vérifier aussi dans les rôles (Set<Role>)
        if (user.getRoles() != null && user.getRoles().stream()
                .anyMatch(role -> "ROLE_ADMIN".equals(role.getName()))) {
            return true;
        }
        
        // Si client, vérifier qu'il est propriétaire
        return account.getOwner().getEmail().equals(user.getEmail());
    }

    public boolean isOwner(Long accountId, String username) {
        Account account = accountRepository.findById(accountId)
                .orElse(null);
        if (account == null) return false;
        
        return isOwnerOrAdmin(account, username);
    }
}