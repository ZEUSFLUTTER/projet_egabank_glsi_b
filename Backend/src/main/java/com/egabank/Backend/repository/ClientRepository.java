/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.egabank.Backend.repository;

import com.egabank.Backend.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 *
 * @author HP
 */
public interface ClientRepository extends JpaRepository<Client, Long> {
    
}
