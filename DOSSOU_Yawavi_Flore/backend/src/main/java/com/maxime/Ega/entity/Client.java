package com.maxime.Ega.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.PastOrPresent;
import lombok.*;

import java.time.LocalDate;

@Setter
@Getter
@Entity
@Table(name = "client")
@AllArgsConstructor
@NoArgsConstructor

public class Client {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "code_client" , nullable = false)
    private String codeClient;

    @Column(name = "last_name" , nullable = false)
    private String lastName;

    @Column(name = "first_name" , nullable = false)
    private String firstName;

    @Column(name = "date_of_birth", nullable = false)
    @PastOrPresent
    private LocalDate dateOfBirth;

    @Column(name = "gender", nullable = false)
    private String gender;

    @Column(name = "address", nullable = false)
    private String address;

    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "nationality", nullable = false)
    private String nationality;

    @Column(nullable = false)
    private boolean deleted = false;




}
