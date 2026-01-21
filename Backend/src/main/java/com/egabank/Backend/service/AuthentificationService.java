/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.egabank.Backend.service;

import com.egabank.Backend.dto.UtilisateurCreateDTO;
import com.egabank.Backend.entity.Utilisateur;

/**
 *
 * @author HP
 */
public interface AuthentificationService {
    String connecterEtGenererJeton(String nomUtilisateur, String motDePasse);
    Utilisateur creer(UtilisateurCreateDTO dto);
}
