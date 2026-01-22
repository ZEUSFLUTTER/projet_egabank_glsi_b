package com.ega.bank.bank_api.exception;

/**
 * Exception levée lorsqu'on tente de créer une ressource qui existe déjà
 */
public class DuplicateResourceException extends RuntimeException {
    
    public DuplicateResourceException(String message) {
        super(message);
    }
    
    public DuplicateResourceException(String message, Throwable cause) {
        super(message, cause);
    }
}