package com.ega.bank.backend.dto.compte;

import com.ega.bank.backend.enums.TypeCompte;
import jakarta.validation.constraints.NotNull;

public class CompteRequestDto {

    @NotNull(message = "Le type de compte est obligatoire")
    private TypeCompte typeCompte;

    @NotNull(message = "L'identifiant du client est obligatoire")
    private Long clientId;

    // Getters et Setters

    public TypeCompte getTypeCompte() {
        return typeCompte;
    }

    public void setTypeCompte(TypeCompte typeCompte) {
        this.typeCompte = typeCompte;
    }

    public Long getClientId() {
        return clientId;
    }

    public void setClientId(Long clientId) {
        this.clientId = clientId;
    }
}
