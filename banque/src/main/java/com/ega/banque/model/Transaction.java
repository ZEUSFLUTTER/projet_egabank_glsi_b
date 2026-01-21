package com.ega.banque.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long clientId; 

    private String type;     // Sera "VERSEMENT" ou "RETRAIT"
    private double montant;
    private String date;     // La date formatée envoyée par Angular

    
}