package com.ega.bank.bank_api.exception;

/**
 * Exception levée lorsque le solde d'un compte est insuffisant pour une opération
 * Conforme au cahier des charges : "Faire un retrait sur son compte si le solde le permet"
 */
public class InsufficientFundsException extends RuntimeException {
    
    public InsufficientFundsException(String message) {
        super(message);
    }
    
    public InsufficientFundsException(String message, Throwable cause) {
        super(message, cause);
    }
}