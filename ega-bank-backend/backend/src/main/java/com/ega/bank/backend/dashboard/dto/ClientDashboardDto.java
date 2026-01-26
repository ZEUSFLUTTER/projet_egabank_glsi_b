package com.ega.bank.backend.dashboard.dto;

import java.math.BigDecimal;

public class ClientDashboardDto {

    private long nombreComptes;
    private BigDecimal soldeTotal;
    private long nombreTransactions;

    public ClientDashboardDto() {
    }

    public ClientDashboardDto(long nombreComptes, BigDecimal soldeTotal, long nombreTransactions) {
        this.nombreComptes = nombreComptes;
        this.soldeTotal = soldeTotal;
        this.nombreTransactions = nombreTransactions;
    }

    public long getNombreComptes() {
        return nombreComptes;
    }

    public void setNombreComptes(long nombreComptes) {
        this.nombreComptes = nombreComptes;
    }

    public BigDecimal getSoldeTotal() {
        return soldeTotal;
    }

    public void setSoldeTotal(BigDecimal soldeTotal) {
        this.soldeTotal = soldeTotal;
    }

    public long getNombreTransactions() {
        return nombreTransactions;
    }

    public void setNombreTransactions(long nombreTransactions) {
        this.nombreTransactions = nombreTransactions;
    }
}