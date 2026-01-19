package com.example.egabank.service;

import com.example.egabank.dto.VirementRequest;
import com.example.egabank.entity.Transaction;
import com.example.egabank.entity.Compte;
import com.example.egabank.entity.TypeTransaction;
import com.example.egabank.entity.Statut;
import com.example.egabank.repository.CompteRepository;
import com.example.egabank.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;




@Service
public class TransactionService {

    @Autowired private CompteRepository compteRepo;
    @Autowired private TransactionRepository transactionRepo;

    @Transactional
    @SuppressWarnings("null")
public void effectuerVirement(VirementRequest req) {
    Compte source = compteRepo.findByNumeroCompte(req.getIbanSource())
        .orElseThrow(() -> new RuntimeException("Compte source introuvable"));
    Compte dest = compteRepo.findByNumeroCompte(req.getIbanDestination())
        .orElseThrow(() -> new RuntimeException("Compte destination introuvable"));

    if (source.getSolde() < req.getMontant()) {
        throw new RuntimeException("Solde insuffisant");
    }

    source.setSolde(source.getSolde() - req.getMontant());
    dest.setSolde(dest.getSolde() + req.getMontant());

    Transaction tx = Transaction.builder()
            .typeTransaction(TypeTransaction.VIREMENT)
            .montant(req.getMontant())
            .dateTransaction(LocalDateTime.now())
            .compteSource(source)
            .compteDestination(dest)
            .statut(Statut.VALIDE)
            .build();
    
    transactionRepo.save(tx);
}
}