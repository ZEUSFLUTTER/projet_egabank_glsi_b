package com.ega.bank.exception;

/**
 * Exception levée lors d'une transaction invalide
 */
public class InvalidTransactionException extends RuntimeException {
    public InvalidTransactionException(String message) {
        super(message);
    }
}