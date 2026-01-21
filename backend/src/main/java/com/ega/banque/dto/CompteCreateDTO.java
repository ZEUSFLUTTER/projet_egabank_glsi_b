package com.ega.banque.dto;

import com.ega.banque.entity.TypeCompte;
import jakarta.validation.constraints.NotNull;

public class CompteCreateDTO {

    @NotNull(message = "L'ID du client est requis")
    private Long clientId;

    @NotNull(message = "Le type de compte est requis")
    private TypeCompte typeCompte;

    public Long getClientId() {
        return clientId;
    }

    public void setClientId(Long clientId) {
        this.clientId = clientId;
    }

    public TypeCompte getTypeCompte() {
        return typeCompte;
    }

    public void setTypeCompte(TypeCompte typeCompte) {
        this.typeCompte = typeCompte;
    }
}
