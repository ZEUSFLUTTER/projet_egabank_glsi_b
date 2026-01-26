package com.ega.bank.backend.dashboard.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class DashboardTransactionDto {

    private LocalDateTime date;
    private BigDecimal montant;
    private String type;

    public DashboardTransactionDto() {}

    public DashboardTransactionDto(LocalDateTime date, BigDecimal montant, String type) {
        this.date = date;
        this.montant = montant;
        this.type = type;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public BigDecimal getMontant() {
        return montant;
    }

    public void setMontant(BigDecimal montant) {
        this.montant = montant;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
