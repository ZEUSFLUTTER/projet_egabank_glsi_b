package com.iai.ega_bank.entities;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor

public class Client implements Serializable{
    @Id @GeneratedValue(strategy=GenerationType.AUTO)
    private Long id;
    private String lastName;
    private String firstName;
    private Date birthday;
    private String phone;
    private String email;
    private String address;
    private String sex;
    private String nationality;

    @OneToMany(mappedBy="client")
    private Collection<CompteBancaire> comptes = new ArrayList<>();

}
