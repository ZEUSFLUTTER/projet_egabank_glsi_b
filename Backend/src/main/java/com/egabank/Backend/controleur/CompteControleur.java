/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.egabank.Backend.controleur;

import com.egabank.Backend.dto.CompteCourantCreationDTO;
import com.egabank.Backend.dto.CompteCourantModificationDTO;
import com.egabank.Backend.dto.CompteEpargneCreationDTO;
import com.egabank.Backend.dto.CompteEpargneModificationDTO;
import com.egabank.Backend.dto.OperationDTO;
import com.egabank.Backend.dto.VirementDTO;
import com.egabank.Backend.entity.Compte;
import com.egabank.Backend.entity.CompteCourant;
import com.egabank.Backend.entity.CompteEpargne;
import com.egabank.Backend.service.CompteService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author HP
 */

@RestController
@RequestMapping("/api/comptes")
public class CompteControleur {
    private final CompteService serviceComptes;

    public CompteControleur(CompteService serviceComptes) {
        this.serviceComptes = serviceComptes;
    }

    @PostMapping("/courant")
    public CompteCourant creerCourant(@Valid @RequestBody CompteCourantCreationDTO dto) {
        return serviceComptes.creerCompteCourant(dto);
    }

    @PostMapping("/epargne")
    public CompteEpargne creerEpargne(@Valid @RequestBody CompteEpargneCreationDTO dto) {
        return serviceComptes.creerCompteEpargne(dto);
    }

    @GetMapping("/{numeroCompte}")
    public Compte consulter(@PathVariable String numeroCompte) {
        return serviceComptes.consulter(numeroCompte);
    }

    @PostMapping("/depot")
    public void depot(@Valid @RequestBody OperationDTO dto) {
        serviceComptes.effectuerDepot(dto.numeroCompte(), dto.montant(), dto.libelle());
    }


    @PostMapping("/retrait")
    public void retrait(@Valid @RequestBody OperationDTO dto) {
        serviceComptes.effectuerRetrait(dto.numeroCompte(), dto.montant(), dto.libelle());
    }

    @PostMapping("/virement")
    public void virement(@Valid @RequestBody VirementDTO dto) {
        serviceComptes.effectuerVirement(dto.numeroCompteSource(), dto.numeroCompteDestination(), dto.montant(), dto.libelle());
    }
    
    @PutMapping("/courant/{numeroCompte}")
    public CompteCourant modifierCourant(@PathVariable String numeroCompte, @Valid @RequestBody CompteCourantModificationDTO dto) {
        return serviceComptes.modifierCompteCourant(numeroCompte, dto);
    }
    
    @PutMapping("/epargne/{numeroCompte}")
    public CompteEpargne modifierEpargne(@PathVariable String numeroCompte, @Valid @RequestBody CompteEpargneModificationDTO dto) {
        return serviceComptes.modifierCompteEpargne(numeroCompte, dto);
    }
    
    @DeleteMapping("/{numeroCompte}")
    public void supprimer(@PathVariable String numeroCompte) {
        serviceComptes.supprimer(numeroCompte);
    }
    
    @GetMapping
    public List<Compte> lister() {
        return serviceComptes.lister();
    }
}
