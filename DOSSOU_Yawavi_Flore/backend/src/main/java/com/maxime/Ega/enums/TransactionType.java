package com.maxime.Ega.enums;

public enum TransactionType {
    DEPOT,
    RETRAIT,
    TRANSFERT_ENTRANT,
    TRANSFERT_SORTANT;

    public TransactionType getEnum(String code ){
        return TransactionType.valueOf(code.toUpperCase());
    }
}
