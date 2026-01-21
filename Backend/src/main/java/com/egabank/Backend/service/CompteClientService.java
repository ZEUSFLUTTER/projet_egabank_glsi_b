package com.egabank.Backend.service;

import com.egabank.Backend.dto.OperationClientDTO;
import com.egabank.Backend.dto.VirementClientDTO;
import com.egabank.Backend.entity.Compte;
import java.util.List;

/**
 *
 * @author HP
 */
public interface CompteClientService {
    List<Compte> listerMesComptes(String courrielClient);
    Compte obtenirCompte(Long id, String courrielClient);
    void effectuerDepot(OperationClientDTO dto, String courrielClient);
    void effectuerRetrait(OperationClientDTO dto, String courrielClient);
    void effectuerVirement(VirementClientDTO dto, String courrielClient);
}