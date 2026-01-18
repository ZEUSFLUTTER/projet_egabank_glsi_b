package com.iai.ega_bank.entities;

import java.io.Serializable;
import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Operation implements  Serializable{
@Id @GeneratedValue(strategy=GenerationType.AUTO)
    private  Long id;
    @Column(nullable= false)
    private double amount;
    @Column(nullable= false)
    private Date OperationDate;
    @Column(nullable= false)
    private String numOperation;
    @ManyToOne
    private CompteBancaire compte;
    @Column(nullable= false)
    @Enumerated(EnumType.STRING)
    private  TypeOperation  operationType;

}
