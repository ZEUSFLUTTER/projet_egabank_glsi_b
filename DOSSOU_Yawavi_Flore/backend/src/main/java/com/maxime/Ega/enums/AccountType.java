package com.maxime.Ega.enums;

public enum AccountType {
    COURANT,
    EPARGNE;

    public AccountType getEnum(String code ){
        return AccountType.valueOf(code.toUpperCase());
    }
}
