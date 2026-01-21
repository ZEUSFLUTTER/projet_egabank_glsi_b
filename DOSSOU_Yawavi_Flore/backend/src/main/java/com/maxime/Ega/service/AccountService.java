package com.maxime.Ega.service;

import com.maxime.Ega.Exeption.BadRequestException;
import com.maxime.Ega.Exeption.ResourceNotFoundException;
import com.maxime.Ega.dto.AccountDto;
import com.maxime.Ega.dto.AccountDtoCreateOld;
import com.maxime.Ega.dto.AccountListDto;
import com.maxime.Ega.dto.transaction.AccountListDto2;
import com.maxime.Ega.entity.Account;
import com.maxime.Ega.entity.Client;
import com.maxime.Ega.enums.AccountType;
import com.maxime.Ega.mappers.AccountListDtoMapper;
import com.maxime.Ega.mappers.ClientDtoMapper;
import com.maxime.Ega.mappers.transaction.AccountListDto2Mapper;
import com.maxime.Ega.repository.AccountRepository;
import com.maxime.Ega.repository.ClientRepository;
import lombok.RequiredArgsConstructor;
import org.iban4j.CountryCode;
import org.iban4j.Iban;
import org.iban4j.IbanUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AccountService {
    @Value("${CODE_BANQUE}")
    private String CODE_BANQUE ;
    @Value("${CODE_AGENCE}")
    private String CODE_AGENCE ;
    private final AccountRepository accountRepository;
    private final ClientRepository clientRepository;
    private final ClientDtoMapper clientDtoMapper;
    private final AccountListDtoMapper accountListDtoMapper;
    private final UserService  userService;
    private final AccountListDto2Mapper accountListDto2Mapper;


    //methode pour creer un compte pour un nouveau client
    public void createAccountnew(AccountDto accountDto){
        Optional<Client> clientBdd = clientRepository.findByEmail(accountDto.getClient().getEmail());
        if(clientBdd.isPresent()){
            throw new BadRequestException("Le client existe deja ");
        }

        Client newClient = clientDtoMapper.toEntity(accountDto.getClient());
        String code = UUID.randomUUID().toString().substring(0,4).toUpperCase()
                +accountDto.getClient().getLastName().substring(0,2).toUpperCase();
        newClient.setCodeClient(code);

        Account account = new Account();
        account.setAccountNumber(genererIbanUnique());

        String type = String.valueOf(accountDto.getAccountType());
        if (type.equals("COURANT")){
            account.setAccountType(AccountType.COURANT);
        }else if (type.equals("EPARGNE")){
            account.setAccountType(AccountType.EPARGNE);
        }
        account.setBalance(BigDecimal.ZERO);
        account.setCreatedAt(LocalDateTime.now());
        account.setClient(newClient);
        account.setUser(userService.getLoggedUser());
        accountRepository.save(account);
    }

    //methode pour creer le compte pour un client deja existant
    public void createAccountold(AccountDtoCreateOld accountDtoCreateOld){
        if (accountDtoCreateOld.getClient() == null || accountDtoCreateOld.getClient().getEmail() == null) {
            throw new ResourceNotFoundException("Le client est manquant dans le DTO");
        }

        Optional<Client> clientBdd = clientRepository.findByEmail(accountDtoCreateOld.getClient().getEmail());
        if(clientBdd.isEmpty()){
            throw new ResourceNotFoundException("Le client n'existe pas encore ");
        }
        Account account = new Account();
        account.setAccountNumber(genererIbanUnique());

        String type = String.valueOf(accountDtoCreateOld.getAccountType());
        if (type.equals("COURANT")){
            account.setAccountType(AccountType.COURANT);
        }else if (type.equals("EPARGNE")){
            account.setAccountType(AccountType.EPARGNE);
        }
        account.setBalance(BigDecimal.ZERO);
        account.setCreatedAt(LocalDateTime.now());
        account.setClient(clientBdd.get());
        account.setUser(userService.getLoggedUser());
        accountRepository.save(account);
    }

    //methode pour detailler un compte
    public AccountListDto findByAccountNumber(String accountNumber){
        Account account = accountRepository.findByAccountNumber(accountNumber);
        if(account == null){
            throw new ResourceNotFoundException("Le compte n'existe pas");
        }
        return accountListDtoMapper.toDto(account);
    }

    public AccountListDto2 findByAccountNumber2(String accountNumber){
        Account account = accountRepository.findByAccountNumber(accountNumber);
        if(account == null){
            throw new ResourceNotFoundException("Le compte n'existe pas");
        }
        return accountListDto2Mapper.toDto(account);
    }

    //methode pour lister les comptes actifs (non supprimer
    public List<AccountListDto> findAllActf(){
        return accountRepository.findByDeletedFalse()
                .stream()
                .map(accountListDtoMapper::toDto)
                .collect(Collectors.toList());
    }

    //methode pour lister les compte supprimer
    public List<AccountListDto> findAllInActf() {
        return accountRepository.findByDeletedTrue()
                .stream()
                .map(accountListDtoMapper::toDto)
                .collect(Collectors.toList());
    }

//methode pour supprimmer un compte
    public void deleteAccount(String accountNumber){
        Account account = accountRepository.findByAccountNumber(accountNumber);
        if(account == null){
            throw new ResourceNotFoundException("Le compte n'existe pas");
        }
        account.setDeleted(true);
        accountRepository.save(account);
    }

    //methode pour lister les comptes actifs liés a un client
    public List<AccountListDto> findAllAccountActifClient(String clientEmail){
        return accountRepository.findByClientEmailAndClientDeletedFalse(clientEmail)
                .stream()
                .map(accountListDtoMapper::toDto)
                .collect(Collectors
                        .toList());
    }

    //methode pour lister les comptes supprimés liés a un client
    public List<AccountListDto> findAllAccountInActfClient(String clientEmail) {
        return accountRepository.findByClientEmailAndClientDeletedTrue(clientEmail)
                .stream()
                .map(accountListDtoMapper::toDto)
                .collect(Collectors
                        .toList());
    }
    //methode pour generer un le iban
    private String genererIbanUnique() {
        String numeroCompte = String.format("%011d", new SecureRandom().nextInt(1_000_000_000));
        String nationalCheckDigit = String.format("%02d", new SecureRandom().nextInt(100));
        Iban iban = new Iban.Builder()
                .countryCode(CountryCode.FR)
                .bankCode(CODE_BANQUE)
                .branchCode(CODE_AGENCE)
                .accountNumber(numeroCompte)
                .nationalCheckDigit(nationalCheckDigit)
                .build();
        IbanUtil.validate(iban.toString());
        return iban.toString();
    }
}