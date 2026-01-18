package com.iai.ega_bank.services;

import com.iai.ega_bank.dto.OperationDto;
import com.iai.ega_bank.entities.*;
import com.iai.ega_bank.repositories.CompteBancaireRepository;
import com.iai.ega_bank.repositories.OperationRepository;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class OperationServiceImpl implements OperationService {

    private final OperationRepository operationRepository;
    private final CompteBancaireRepository compteBancaireRepository;

    public OperationServiceImpl(OperationRepository operationRepository,
                                CompteBancaireRepository compteBancaireRepository) {
        this.operationRepository = operationRepository;
        this.compteBancaireRepository = compteBancaireRepository;
    }

    // ================== effectuer versement==================
    @Override
    public CompteBancaire debit(OperationDto dto){
        Optional<CompteBancaire> compteOpt = this.compteBancaireRepository.findByNumCompte(dto.getNumCompteSource());
               if(compteOpt.isPresent()){
                   CompteBancaire compte=compteOpt.get();
                   if (compte.getStatus().equals(AccountStatus.ACTIVATED)){
                       Operation operation = new Operation();
                       operation.setAmount(dto.getAmount());
                       operation.setOperationDate(new Date());
                       operation.setOperationType(TypeOperation.CREDIT);
                       operation.setCompte(compte);
                       operation.setNumOperation(generateAccountNumber());
                       compte.setBalance(compte.getBalance() + dto.getAmount());
                       compteBancaireRepository.save(compte);
                       operationRepository.save(operation);
                       return compte;
                   }
                   else {
                       throw new RuntimeException("compte suspendu");
                   }
               }
               else {
                   throw new RuntimeException("compte introuvable");
               }
    }

    // ================== effectuer retrait ==================
    @Override
    public CompteBancaire credit(OperationDto dto) {
        Optional<CompteBancaire> compteOpt = this.compteBancaireRepository.findByNumCompte(dto.getNumCompteSource());
        if (compteOpt.isPresent()) {
            CompteBancaire compte = compteOpt.get();
            if (compte.getStatus().equals(AccountStatus.ACTIVATED)) {

                // Vérifier le solde si c'est un compte courant avec découvert limité
                if (compte instanceof CompteCourant) {
                    CompteCourant courant = (CompteCourant) compte;
                    if (courant.getBalance() - dto.getAmount() < -courant.getDecouvert()) {
                        throw new RuntimeException("Solde insuffisant");
                    }
                } else if (compte instanceof CompteEpargne) {
                    CompteEpargne epargne = (CompteEpargne) compte;
                    if (epargne.getBalance() - dto.getAmount() < 0) {
                        throw new RuntimeException("Solde insuffisant");
                    }
                }
                Operation operation = new Operation();
                operation.setAmount(dto.getAmount());
                operation.setOperationDate(new Date());
                operation.setOperationType(TypeOperation.DEBIT); // Ici c'est un débit
                operation.setCompte(compte);
                operation.setNumOperation(generateAccountNumber());
                compte.setBalance(compte.getBalance() - dto.getAmount()); // Retirer le montant
                compteBancaireRepository.save(compte);
                operationRepository.save(operation);
                return compte;

            } else {
                throw new RuntimeException("Compte suspendu");
            }
        } else {
            throw new RuntimeException("Compte introuvable");
        }
    }

    private static String generateAccountNumber() {
        Random random = new Random();
        StringBuilder sb = new StringBuilder();

        // 4 zéros au début
        sb.append("0000");

        // 8 chiffres aléatoires
        for (int i = 0; i < 8; i++) {
            sb.append(random.nextInt(10));
        }
        return sb.toString();
    }

    //==================transaction=====================
    public boolean transact(OperationDto dto) {
        try {
            // Débit du compte source
            OperationDto dtoSource = new OperationDto(dto.getNumCompteSource(), null, dto.getAmount(), new Date());
             debit(dtoSource);

            // Crédit du compte destination
            OperationDto dtoDestination = new OperationDto(null, dto.getNumCompteDestination(), dto.getAmount(), new Date());
            credit(dtoDestination);
            return true;
        } catch (RuntimeException e) {
            // Ici tu peux logger l'erreur ou renvoyer false si la transaction échoue
            return false;
        }
    }


    // ================== HISTORIQUE ==================
    @Override
    public List<Operation> findOperationsByCompte(String numCompte) {

        CompteBancaire compte = compteBancaireRepository
                .findByNumCompte(numCompte)
                .orElseThrow(() -> new RuntimeException("Compte introuvable"));

        return (List<Operation>) compte.getOperations();
    }
}
