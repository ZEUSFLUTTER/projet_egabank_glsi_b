package com.ega.banking.exception;

public class InsufficientBalanceException extends RuntimeException {

    public InsufficientBalanceException(String message) {
        super(message);
    }

    public InsufficientBalanceException() {
        super("Solde insuffisant pour effectuer cette opération");
    }
}
