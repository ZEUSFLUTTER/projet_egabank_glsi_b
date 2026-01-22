package com.ega.backend.exception;

public class CompteNotFoundException extends RuntimeException {
    public CompteNotFoundException(String message) {
        super(message);
    }
}
