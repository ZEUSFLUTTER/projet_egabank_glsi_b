/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.egabank.Backend.service;

import com.egabank.Backend.dto.CompteCourantCreationDTO;
import com.egabank.Backend.dto.CompteCourantModificationDTO;
import com.egabank.Backend.dto.CompteEpargneCreationDTO;
import com.egabank.Backend.dto.CompteEpargneModificationDTO;
import com.egabank.Backend.entity.Compte;
import com.egabank.Backend.entity.CompteCourant;
import com.egabank.Backend.entity.CompteEpargne;
import java.util.List;

/**
 *
 * @author HP
 */

public interface CompteService {
    CompteCourant creerCompteCourant(CompteCourantCreationDTO dto);
    CompteEpargne creerCompteEpargne(CompteEpargneCreationDTO dto);
    Compte consulter(String numeroCompte);
    void effectuerDepot(String numeroCompte, double montant, String libelle);
    void effectuerRetrait(String numeroCompte, double montant, String libelle);
    void effectuerVirement(String numeroCompteSource, String numeroCompteDestination, double montant, String libelle);
    CompteCourant modifierCompteCourant(String numeroCompte, CompteCourantModificationDTO dto);
    CompteEpargne modifierCompteEpargne(String numeroCompte, CompteEpargneModificationDTO dto);
    void supprimer(String numeroCompte);
    List<Compte> lister();
}
