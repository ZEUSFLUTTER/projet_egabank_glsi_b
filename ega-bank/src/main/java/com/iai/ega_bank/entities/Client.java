package com.iai.ega_bank.entities;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;

import jakarta.persistence.*;
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

    @OneToOne
    private User user; // <- ici c’est l’utilisateur lié au client
    @OneToMany(mappedBy="client")
    private Collection<CompteBancaire> comptes = new ArrayList<>();

//    public User getUser() {
//        return this.user;
//    }
}
