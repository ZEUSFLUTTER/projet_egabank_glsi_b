package com.egabank.back.service;

import com.egabank.back.model.User;
import com.egabank.back.repository.UserRepository;
import com.egabank.back.model.Account;
import com.egabank.back.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AccountService {
    
    @Autowired
    private AccountRepository accountRepository;
    
    public Account createAccount(Account account) {
        // Vérifier que le numéro de compte est fourni
        if (account.getNumeroCompte() == null || account.getNumeroCompte().isEmpty()) {
            throw new RuntimeException("Le numéro de compte est requis");
        }
        
        // Vérifier l'unicité
        if (accountRepository.findByNumeroCompte(account.getNumeroCompte()).isPresent()) {
            throw new RuntimeException("Ce numéro de compte existe déjà");
        }
        
        // Le solde initial sera 0 (défini dans l'entité)
        return accountRepository.save(account);
    }
}