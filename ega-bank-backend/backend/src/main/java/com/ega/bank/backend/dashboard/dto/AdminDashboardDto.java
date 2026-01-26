package com.ega.bank.backend.dashboard.dto;

import java.math.BigDecimal;

public class AdminDashboardDto {

    private long totalClients;
    private long totalComptes;
    private long totalTransactions;
    private BigDecimal totalSoldes;

    public AdminDashboardDto() {
    }

    public AdminDashboardDto(long totalClients, long totalComptes, long totalTransactions, BigDecimal totalSoldes) {
        this.totalClients = totalClients;
        this.totalComptes = totalComptes;
        this.totalTransactions = totalTransactions;
        this.totalSoldes = totalSoldes;
    }

    public long getTotalClients() {
        return totalClients;
    }

    public void setTotalClients(long totalClients) {
        this.totalClients = totalClients;
    }

    public long getTotalComptes() {
        return totalComptes;
    }

    public void setTotalComptes(long totalComptes) {
        this.totalComptes = totalComptes;
    }

    public long getTotalTransactions() {
        return totalTransactions;
    }

    public void setTotalTransactions(long totalTransactions) {
        this.totalTransactions = totalTransactions;
    }

    public BigDecimal getTotalSoldes() {
        return totalSoldes;
    }

    public void setTotalSoldes(BigDecimal totalSoldes) {
        this.totalSoldes = totalSoldes;
    }
}