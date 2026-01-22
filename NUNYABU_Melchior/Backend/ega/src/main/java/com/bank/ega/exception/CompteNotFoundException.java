package com.bank.ega.exception;

public class CompteNotFoundException extends RuntimeException {
    public CompteNotFoundException(String message) {
        super(message);
    }
}
