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

public class CompteCourant extends Compte {
    @Column(nullable = false)
    private Double decouvertAutorise = 0.0;

    public Double getDecouvertAutorise() { return decouvertAutorise; }
    public void setDecouvertAutorise(Double decouvertAutorise) {
        this.decouvertAutorise = decouvertAutorise == null ? 0.0 : decouvertAutorise;
    }
}
