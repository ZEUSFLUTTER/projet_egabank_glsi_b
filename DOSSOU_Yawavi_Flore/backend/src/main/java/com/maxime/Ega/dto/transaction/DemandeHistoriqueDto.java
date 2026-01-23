package com.maxime.Ega.dto.transaction;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DemandeHistoriqueDto {

    private LocalDate dateDebut;
    private LocalDate dateFin;
    private HistoriqueTransAccountDto  accountNumberDto;
}
