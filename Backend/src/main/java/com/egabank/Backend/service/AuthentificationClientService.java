package com.egabank.Backend.service;

import com.egabank.Backend.dto.ClientInscriptionDTO;
import com.egabank.Backend.dto.ClientConnexionDTO;
import com.egabank.Backend.dto.ClientAuthJetonDTO;
import com.egabank.Backend.dto.ChangementMotDePasseDTO;
import com.egabank.Backend.entity.Client;

/**
 *
 * @author HP
 */
public interface AuthentificationClientService {
    Client inscrire(ClientInscriptionDTO dto);
    ClientAuthJetonDTO connecter(ClientConnexionDTO dto);
    Client obtenirProfilClient(String courriel);
    void changerMotDePasse(String courriel, ChangementMotDePasseDTO dto);
}