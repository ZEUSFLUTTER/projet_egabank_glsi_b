package com.maxime.Ega.service;

import com.maxime.Ega.Exeption.BadRequestException;
import com.maxime.Ega.Exeption.ResourceNotFoundException;
import com.maxime.Ega.dto.transaction.DemandeHistoriqueDto;
import com.maxime.Ega.dto.transaction.HistoriqueTransactionDto;
import com.maxime.Ega.dto.transaction.TransactionDepWithDto;
import com.maxime.Ega.dto.transaction.TransferDto;
import com.maxime.Ega.entity.Account;
import com.maxime.Ega.entity.Transaction;
import com.maxime.Ega.entity.User;
import com.maxime.Ega.enums.TransactionType;
import com.maxime.Ega.mappers.transaction.HistoriqueTransactionDtoMapper;
import com.maxime.Ega.repository.AccountRepository;
import com.maxime.Ega.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements ITransactionService{

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final HistoriqueTransactionDtoMapper historiqueTransactionDtoMapper;
    private final UserService userService;

    //methode pour effectuer un depot
    @Override
    public void deposit(TransactionDepWithDto transactionDepWithDto) {
        String accountNumber = transactionDepWithDto.getAccountNumber().getAccountNumber();
        BigDecimal amount = transactionDepWithDto.getAmount();

        //verifions que le numero de compte existe
        Account  account = accountRepository.findByAccountNumber(accountNumber);
        if (account == null) {
            throw new ResourceNotFoundException("compte introuvable");
        }
         //on verifie que le montant soit positif
        if (amount.compareTo(BigDecimal.ZERO) <= 0 ){
            throw new BadRequestException("Le montant doit être positif");
        }

        //verifions si le compte est supprimer ou est present
        if (account.isDeleted()){
            throw new BadRequestException("Le account n'existe pas");
        }

        account.setBalance(account.getBalance().add(amount));
        accountRepository.save(account);

        Transaction  transaction = new Transaction();

        transaction.setTransactionId(UUID.randomUUID().toString().substring(0,4).toUpperCase()
                +(accountNumber.substring(accountNumber.length()-1)));
        transaction.setTransactionType(TransactionType.DEPOT);
        transaction.setTransactionDate(LocalDateTime.now());
        transaction.setAmount(amount);
        transaction.setAccount(account);
        transaction.setDescription("le depot sur un compte");
        transaction.setUser(userService.getLoggedUser());
        transactionRepository.save(transaction);
    }

    @Override
    public void withdraw(TransactionDepWithDto  transactionDepWithDto) {
        String accountNumber = transactionDepWithDto.getAccountNumber().getAccountNumber();
        BigDecimal amount = transactionDepWithDto.getAmount();

        //verifions que le numero de compte existe
        Account  account = accountRepository.findByAccountNumber(accountNumber);
        if (account == null) {
            throw new ResourceNotFoundException("compte introuvable");
        }

        //on verifie que le montant soit positif
        if (amount.compareTo(BigDecimal.ZERO) <= 0 ){
            throw new BadRequestException("Le montant doit être positif");
        }

        //verifions si le compte est supprimer ou est present
        if (account.isDeleted()){
            throw new BadRequestException("Le account n'existe pas");
        }

        //maintenant on verifie si le montant a retiré est inferieur ou egal au montant sur le compte
        if (amount.compareTo(account.getBalance()) > 0) {
            throw new BadRequestException("Solde insuffisant pour effectuer le retrait");
        }

        account.setBalance(account.getBalance().subtract(amount));
        accountRepository.save(account);

        Transaction  transaction = new Transaction();
        transaction.setTransactionId(UUID.randomUUID().toString().substring(0,4).toUpperCase()
                +(accountNumber.substring(accountNumber.length()-1)));
        transaction.setTransactionType(TransactionType.RETRAIT);
        transaction.setTransactionDate(LocalDateTime.now());
        transaction.setAmount(amount);
        transaction.setAccount(account);
        transaction.setDescription("retrait sur le compte ");
        transaction.setUser(userService.getLoggedUser());
        transactionRepository.save(transaction);
    }

    @Override
    public void transfer(TransferDto transferDto) {
        String accountSourceNumber = transferDto.getCompteSource().getAccountNumber();
        String accountDestNumber = transferDto.getCompteDest().getAccountNumber();
        BigDecimal amount = transferDto.getAmount();

        // Vérifier que le montant est positif
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Le montant doit être positif");
        }

        // Récupérer les comptes source et destination
        Account accountSource = accountRepository.findByAccountNumber(accountSourceNumber);
        Account accountDest = accountRepository.findByAccountNumber(accountDestNumber);

        if (accountSource == null) {
            throw new ResourceNotFoundException("Compte source introuvable");
        }
        if (accountDest == null) {
            throw new ResourceNotFoundException("Compte destination introuvable");
        }

        // Vérifier si les comptes sont actifs
        if (accountSource.isDeleted()) {
            throw new BadRequestException("Le compte source est supprimé");
        }
        if (accountDest.isDeleted()) {
            throw new BadRequestException("Le compte destination est supprimé");
        }

        // Vérifier que le solde du compte source est suffisant
        if (amount.compareTo(accountSource.getBalance()) > 0) {
            throw new BadRequestException("Solde insuffisant sur le compte source");
        }

        // Effectuer le transfert
        accountSource.setBalance(accountSource.getBalance().subtract(amount));
        accountDest.setBalance(accountDest.getBalance().add(amount));

        accountRepository.save(accountSource);
        accountRepository.save(accountDest);

        String code = (UUID.randomUUID().toString().substring(0,4).toUpperCase()
                +(accountSourceNumber.substring(accountSourceNumber.length()-1)));

        // Enregistrer la transaction de débit (source)
        Transaction transactionSource = new Transaction();
        transactionSource.setTransactionType(TransactionType.TRANSFERT_SORTANT);
        transactionSource.setTransactionDate(LocalDateTime.now());
        transactionSource.setTransactionId(code);
        transactionSource.setAmount(amount);
        transactionSource.setAccount(accountSource);
        transactionSource.setDescription("Transfert vers le compte " + accountDestNumber);
        transactionSource.setUser(userService.getLoggedUser());
        transactionRepository.save(transactionSource);

        // Enregistrer la transaction de crédit (destination)
        Transaction transactionDest = new Transaction();
        transactionDest.setTransactionType(TransactionType.TRANSFERT_ENTRANT);
        transactionDest.setTransactionDate(LocalDateTime.now());
        transactionDest.setTransactionId(code);
        transactionDest.setAmount(amount);
        transactionDest.setAccount(accountDest);
        transactionDest.setDescription("Transfert reçu du compte " + accountSourceNumber);
        transactionSource.setUser(userService.getLoggedUser());
        transactionRepository.save(transactionDest);
    }


    //methode pour demander les historique des transactions
    public List<HistoriqueTransactionDto> findHistoriqueTransactionByAccountNumber(DemandeHistoriqueDto  demandeHistoriqueDto) {
        String accountNumber = demandeHistoriqueDto.getAccountNumberDto().getAccountNumber();

        LocalDateTime dateDebut = demandeHistoriqueDto
                .getDateDebut()
                .atStartOfDay(); // 00:00:00
        LocalDateTime dateFin = demandeHistoriqueDto
                .getDateFin()
                .atTime(23, 59, 59); // fin de journée
        //verifions que le numero de compte existe
        Account  account = accountRepository.findByAccountNumber(accountNumber);
        if (account == null) {
            throw new ResourceNotFoundException("compte introuvable");
        }

        //verifions si le compte est supprimer ou est present
        if (account.isDeleted()){
            throw new BadRequestException("Le account n'existe pas");
        }

        return transactionRepository
                .findByAccount_AccountNumberAndTransactionDateBetween(accountNumber, dateDebut, dateFin)
                .stream()
                .map(historiqueTransactionDtoMapper::toDto)
                .collect(Collectors.toList());

    }



}
