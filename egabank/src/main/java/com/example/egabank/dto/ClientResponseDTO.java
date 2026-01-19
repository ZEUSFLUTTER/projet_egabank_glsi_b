package com.example.egabank.dto;

import lombok.Data;
import lombok.Builder;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import com.example.egabank.entity.Role;
import com.example.egabank.entity.Compte;

@Data
@Builder
public class ClientResponseDTO {
    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private String adresse;
    private LocalDate dateNaissance;
    private String sexe;
    private String nationalite;
    private Role role;
    private LocalDateTime dateCreation;
    private List<Compte> comptes;
}