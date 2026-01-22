package com.iai.projet.banque.service;

import com.iai.projet.banque.entity.Compte;
import com.iai.projet.banque.repository.CompteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Date;

@Service
public class CompteService {
    @Autowired
    private CompteRepository compteRepository;

    public Compte create(Compte compte) {
//        if (compte.getIdClient() != null && compte.getTypeCompte() != null) {
//            compte.setNumeroCompte(compte.genererIBANPersonnalise(compte.getIdClient()));
//            compte.setDateCreation(LocalDate.now());
//        }
        Compte co = compteRepository.save(compte);
        return co;
    }

    public Compte update(Compte compte) {
        Compte cpt = new Compte();
        if (compte != null) {
            cpt.setId(compte.getId());
            cpt.setTypeCompte(compte.getTypeCompte());
        }
        return compteRepository.save(cpt);
    }

    public Boolean delete(Compte compte) {
        if (compte != null && compte.getId() != null) {
            Boolean co = compteRepository.existsById(compte.getId());
            if (co.equals(Boolean.TRUE)) {
                compteRepository.delete(compte);
                return true;
            } else
                return false;
        }
        return false;
    }

}
