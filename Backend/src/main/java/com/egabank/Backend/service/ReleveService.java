/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.egabank.Backend.service;

import com.egabank.Backend.entity.Releve;
import java.time.LocalDate;
import java.util.List;

/**
 *
 * @author HP
 */
public interface ReleveService {
    Releve creer(Releve releve);
    Releve consulter(Long id);
    List<Releve> listerParCompte(String numeroCompte);
    void supprimer(Long id);
    byte[] genererRelevePdf(String numeroCompte, LocalDate dateDebut, LocalDate dateFin);
}
