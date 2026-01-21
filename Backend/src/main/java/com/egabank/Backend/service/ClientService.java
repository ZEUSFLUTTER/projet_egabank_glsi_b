/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.egabank.Backend.service;

import com.egabank.Backend.dto.ClientCreationDTO;
import com.egabank.Backend.entity.Client;
import java.util.List;

/**
 *
 * @author HP
 */
public interface ClientService {
    Client creer(ClientCreationDTO dto);
    Client modifier(Long id, ClientCreationDTO dto);
    void supprimer(Long id);
    Client trouver(Long id);
    List<Client> lister();
}
