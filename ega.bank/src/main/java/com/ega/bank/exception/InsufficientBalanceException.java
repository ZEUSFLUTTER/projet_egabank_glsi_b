package com.ega.bank.exception;

/**
 * Exception levée lorsque le solde est insuffisant
 */
public class InsufficientBalanceException extends RuntimeException {
    public InsufficientBalanceException(String message) {
        super(message);
    }
}