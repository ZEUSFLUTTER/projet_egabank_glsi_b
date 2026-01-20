package com.ega.egabank.dto.response;

import com.ega.egabank.enums.TypeCompte;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccountLookupResponse {

    private String numeroCompte;
    private TypeCompte typeCompte;
    private String typeCompteLibelle;
    private Boolean actif;
    private String clientNomComplet;
}
