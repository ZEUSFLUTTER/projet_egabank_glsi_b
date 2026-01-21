package com.iai.ega_bank.entities;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorColumn;
import jakarta.persistence.DiscriminatorType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.Data;


@Entity
@Data
@Inheritance(strategy=InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name="type",
discriminatorType=DiscriminatorType.INTEGER)
@JsonIgnoreProperties({"hibernateLazyInitializer"})
public abstract  class CompteBancaire implements Serializable {
    @Id @GeneratedValue(strategy=GenerationType.AUTO)
    private  Long id;
    @Column(nullable= false)
    private double balance;
    @Column(nullable= false)
    private String numCompte;
    @Column(nullable= false)
    private Date CreateAt = new Date();
    @Column(nullable= false)
    @Enumerated(EnumType.STRING)
    private AccountStatus status;
    @JsonIgnore
    @ManyToOne
    private Client client;
    @JsonBackReference
    @OneToMany(mappedBy="compte")
    Collection<Operation> operations = new ArrayList<>();

}
