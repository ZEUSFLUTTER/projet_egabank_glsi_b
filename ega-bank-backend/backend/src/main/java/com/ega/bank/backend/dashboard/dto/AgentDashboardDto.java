package com.ega.bank.backend.dashboard.dto;

import java.math.BigDecimal;

public class AgentDashboardDto {

    private long nombreClients;
    private long nombreComptes;
    private long nombreTransactions;
    private BigDecimal volumeTransactions;

    public AgentDashboardDto() {
    }

    public AgentDashboardDto(long nombreClients, long nombreComptes, long nombreTransactions,
            BigDecimal volumeTransactions) {
        this.nombreClients = nombreClients;
        this.nombreComptes = nombreComptes;
        this.nombreTransactions = nombreTransactions;
        this.volumeTransactions = volumeTransactions;
    }

    public long getNombreClients() {
        return nombreClients;
    }

    public void setNombreClients(long nombreClients) {
        this.nombreClients = nombreClients;
    }

    public long getNombreComptes() {
        return nombreComptes;
    }

    public void setNombreComptes(long nombreComptes) {
        this.nombreComptes = nombreComptes;
    }

    public long getNombreTransactions() {
        return nombreTransactions;
    }

    public void setNombreTransactions(long nombreTransactions) {
        this.nombreTransactions = nombreTransactions;
    }

    public BigDecimal getVolumeTransactions() {
        return volumeTransactions;
    }

    public void setVolumeTransactions(BigDecimal volumeTransactions) {
        this.volumeTransactions = volumeTransactions;
    }
}