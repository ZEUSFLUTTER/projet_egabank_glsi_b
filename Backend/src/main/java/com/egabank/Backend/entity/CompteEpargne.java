/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.egabank.Backend.entity;

import jakarta.persistence.*;

/**
 *
 * @author HP
 */
@Entity

public class CompteEpargne extends Compte {
    @Column(nullable = false)
    private Double tauxInteret = 0.0;

    public Double getTauxInteret() { return tauxInteret; }
    public void setTauxInteret(Double tauxInteret) {
        this.tauxInteret = tauxInteret == null ? 0.0 : tauxInteret;
    }
}
