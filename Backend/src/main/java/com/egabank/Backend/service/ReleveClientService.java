package com.egabank.Backend.service;

import java.time.LocalDate;

/**
 *
 * @author HP
 */
public interface ReleveClientService {
    byte[] genererRelevePdf(Long compteId, LocalDate dateDebut, LocalDate dateFin, String courrielClient);
}