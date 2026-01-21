package com.egabank.Backend.service.implementation;

import com.egabank.Backend.entity.Compte;
import com.egabank.Backend.service.CompteClientService;
import com.egabank.Backend.service.ReleveClientService;
import com.egabank.Backend.service.ReleveService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;

/**
 *
 * @author HP
 */
@Service
@Transactional(readOnly = true)
public class ReleveClientServiceImpl implements ReleveClientService {
    
    private final ReleveService serviceReleve;
    private final CompteClientService serviceCompteClient;

    public ReleveClientServiceImpl(ReleveService serviceReleve, CompteClientService serviceCompteClient) {
        this.serviceReleve = serviceReleve;
        this.serviceCompteClient = serviceCompteClient;
    }

    @Override
    public byte[] genererRelevePdf(Long compteId, LocalDate dateDebut, LocalDate dateFin, String courrielClient) {
        // Vérifier que le client a accès à ce compte
        Compte compte = serviceCompteClient.obtenirCompte(compteId, courrielClient);
        
        // Générer le relevé PDF en utilisant le service existant
        return serviceReleve.genererRelevePdf(compte.getNumeroCompte(), dateDebut, dateFin);
    }
}