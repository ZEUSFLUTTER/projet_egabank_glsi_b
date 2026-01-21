/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.egabank.Backend.service;

import java.time.LocalDate;

/**
 *
 * @author HP
 */
public interface ReleveService {
     byte[] genererRelevePdf(String numeroCompte, LocalDate dateDebut, LocalDate dateFin);
}
