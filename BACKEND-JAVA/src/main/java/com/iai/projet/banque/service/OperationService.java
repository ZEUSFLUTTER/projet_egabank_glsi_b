package com.iai.projet.banque.service;

import com.iai.projet.banque.entity.Client;
import com.iai.projet.banque.entity.Compte;
import com.iai.projet.banque.entity.Operation;
import com.iai.projet.banque.entity.Utilisateur;
import com.iai.projet.banque.models.OperationDTO;
import com.iai.projet.banque.models.ReleveDTO;
import com.iai.projet.banque.repository.ClientRepository;
import com.iai.projet.banque.repository.CompteRepository;
import com.iai.projet.banque.repository.OperationRepository;
import com.iai.projet.banque.repository.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
public class OperationService {
    @Autowired
    private OperationRepository operationRepository;
    @Autowired
    private CompteRepository compteRepository;
    @Autowired
    private UtilisateurRepository utilisateurRepository;
    @Autowired
    private ClientRepository clientRepository;

    public Operation create(Operation operation) {
        Operation o = operationRepository.save(operation);
        return o;
    }

    public OperationDTO retraitCompte(OperationDTO operation) {
        Operation operation1 = new Operation();
        Compte cc = new Compte();
        if (operation != null && operation.getNumeroCompte() != null) {
            Compte c = compteRepository.findByNumeroCompte(operation.getNumeroCompte());
            if (c != null && c.getSoldeCompte() > 0) {

                if (c.getSoldeCompte() > Double.parseDouble(operation.getMontant())) {
                    c.setSoldeCompte(c.getSoldeCompte() - Double.parseDouble(operation.getMontant()));
                    cc = compteRepository.save(c);
                    //Enregsitrement
                    operation1.setTypeOperation(operation.getTypeOperation());
                    operation1.setDateOperation(LocalDate.now());
                    operation1.setCompteDestinationId(null);
                    operation1.setCompteSourceId(c.getId());
                    operation1.setMontant(Double.parseDouble(operation.getMontant()));
                    operation1.setDescription(operation.getTypeOperation());

                    operationRepository.save(operation1);
                } else {
                    throw new RuntimeException("Solde du compte inférieur au montant du retrait");
                }
            } else {
                throw new RuntimeException("Solde du compte insuffisant (solde ≤ 0)");
            }
        }
        Objects.requireNonNull(operation).setMontant(String.valueOf(cc.getSoldeCompte()));
        return operation;
    }

    public OperationDTO depotCompte(OperationDTO operationDTO) {
        Operation operation1 = new Operation();
        Compte c = new Compte();
        if (operationDTO.getNumeroCompte() != null) {
            Compte compte = compteRepository.findByNumeroCompte(operationDTO.getNumeroCompte());
            if (operationDTO != null && compte != null) {
                compte.setSoldeCompte(compte.getSoldeCompte() + Double.valueOf(operationDTO.getMontant()));
                c = compteRepository.save(compte);
                //Enregsitrement
                operation1.setTypeOperation(operationDTO.getTypeOperation());
                operation1.setCompteDestinationId(null);
                operation1.setDateOperation(LocalDate.now());
                operation1.setCompteSourceId(compte.getId());
                operation1.setMontant(Double.valueOf(operationDTO.getMontant()));
                operation1.setDescription(operationDTO.getTypeOperation());
                operationRepository.save(operation1);
            }
        } else {
            throw new IllegalArgumentException("Le numero de compte  non defini ");
        }
        operationDTO.setMontant(String.valueOf(c.getSoldeCompte()));
        return operationDTO;
    }

    public List<Operation> getTransactionsDepot(String username) {
        Optional<Client> clt = Optional.empty();
        Compte cpte = new Compte();
        Optional<Utilisateur> c = utilisateurRepository.findByUsername(username);
        if (c.get().getClientId() != null) {
            clt = clientRepository.findById(c.get().getClientId());
        }
        if (clt.get().getId() != null) {
            cpte = compteRepository.findByIdClient(clt.get().getId());
        }
        List<Operation> os = new ArrayList<>();
        if (c != null) {
            os = operationRepository.findFirst5ByCompteSourceIdAndTypeOperationOrderByIdDesc(cpte.getId(), "DEP");
        }
        return os;
    }

    public List<Operation> getTransactionsRetrait(String username) {
        Optional<Client> clt = Optional.empty();
        Compte cpte = new Compte();
        Optional<Utilisateur> c = utilisateurRepository.findByUsername(username);
        if (c.get().getClientId() != null) {
            clt = clientRepository.findById(c.get().getClientId());
        }
        if (clt.get().getId() != null) {
            cpte = compteRepository.findByIdClient(clt.get().getId());
        }
        List<Operation> os = new ArrayList<>();
        if (c != null) {
            os = operationRepository.findFirst5ByCompteSourceIdAndTypeOperationOrderByIdDesc(cpte.getId(), "RET");
        }
        return os;
    }

    public List<Operation> getTransactionsVirement(String username) {
        Optional<Client> clt = Optional.empty();
        Compte cpte = new Compte();
        Optional<Utilisateur> c = utilisateurRepository.findByUsername(username);
        if (c.get().getClientId() != null) {
            clt = clientRepository.findById(c.get().getClientId());
        }
        if (clt.get().getId() != null) {
            cpte = compteRepository.findByIdClient(clt.get().getId());
        }
        List<Operation> os = new ArrayList<>();
        if (c != null) {
            os = operationRepository.findFirst5ByCompteSourceIdAndTypeOperationOrderByIdDesc(cpte.getId(), "TRS");
        }
        return os;
    }

    public OperationDTO virementCompte(OperationDTO operation) {
        Operation operation1 = new Operation();
        Compte cc = new Compte();
        Compte cdest = new Compte();
        if (operation != null && operation.getNumeroCompte() != null && operation.getIdCompteDestination() != null) {
            Compte c = compteRepository.findByNumeroCompte(operation.getNumeroCompte());
            if (c != null) {
                Compte dest = compteRepository.findByNumeroCompte(operation.getIdCompteDestination());
                if (dest != null) {
                    if (c.getSoldeCompte() > 0) {
                        if (c.getSoldeCompte() > Double.parseDouble(operation.getMontant())) {
                            c.setSoldeCompte(c.getSoldeCompte() - Double.parseDouble(operation.getMontant()));
                            dest.setSoldeCompte(dest.getSoldeCompte() + Double.parseDouble(operation.getMontant()));
                            cc = compteRepository.save(c);
                            cdest = compteRepository.save(dest);
                        }

                        //Enregsitrement
                        operation1.setTypeOperation(operation.getTypeOperation());
                        operation1.setCompteDestinationId(cdest.getId());
                        operation1.setCompteSourceId(cc.getId());
                        operation1.setDateOperation(LocalDate.now());
                        operation1.setMontant(Double.parseDouble(operation.getMontant()));
                        operation1.setDescription(operation.getTypeOperation());
                        operationRepository.save(operation1);
                    } else {
                        new RuntimeException("Compte  inexistant  introuvable");
                    }
                } else {
                    new RuntimeException("Compte  destinataire  introuvable");
                }
            }
        }
        operation.setMontant(String.valueOf(cc.getSoldeCompte()));
        return operation;
    }

    public List<Operation> getOperationByNumCompteAndDate(String numCompte, Date dateOperation) {
        return new LinkedList<>();
    }

    public List<Operation> getAllOperationByDateDebutDateFinAndUsername(String username, String date) {
        List<Operation> operations = new LinkedList<>();
        Optional<Client> clt = Optional.empty();
        Compte cpte = new Compte();
        Optional<Utilisateur> c = utilisateurRepository.findByUsername(username);
        if (c.get().getClientId() != null) {
            clt = clientRepository.findById(c.get().getClientId());
        }
        if (clt.get().getId() != null) {
            cpte = compteRepository.findByIdClient(clt.get().getId());
        }
        operations = operationRepository.findOperationsAvantDate(cpte.getId(), LocalDate.parse(date));
        if (operations != null && operations.isEmpty() && username != null) {
            operations.addAll(operationRepository.findAllByCompteSourceId(cpte.getId()));
        }
        return operations;
    }

}
