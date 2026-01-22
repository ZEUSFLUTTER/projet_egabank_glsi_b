package com.ega.backend.dto.dashboard;

import java.math.BigDecimal;

public class FinancialStatsResponse {
    private BigDecimal totalIncome;
    private BigDecimal totalExpenses;
    private BigDecimal monthlyIncome;
    private BigDecimal monthlyExpenses;
    private BigDecimal balance;

    public FinancialStatsResponse() {}

    public FinancialStatsResponse(BigDecimal totalIncome, BigDecimal totalExpenses, 
                                BigDecimal monthlyIncome, BigDecimal monthlyExpenses, BigDecimal balance) {
        this.totalIncome = totalIncome;
        this.totalExpenses = totalExpenses;
        this.monthlyIncome = monthlyIncome;
        this.monthlyExpenses = monthlyExpenses;
        this.balance = balance;
    }

    // Getters and Setters
    public BigDecimal getTotalIncome() {
        return totalIncome;
    }

    public void setTotalIncome(BigDecimal totalIncome) {
        this.totalIncome = totalIncome;
    }

    public BigDecimal getTotalExpenses() {
        return totalExpenses;
    }

    public void setTotalExpenses(BigDecimal totalExpenses) {
        this.totalExpenses = totalExpenses;
    }

    public BigDecimal getMonthlyIncome() {
        return monthlyIncome;
    }

    public void setMonthlyIncome(BigDecimal monthlyIncome) {
        this.monthlyIncome = monthlyIncome;
    }

    public BigDecimal getMonthlyExpenses() {
        return monthlyExpenses;
    }

    public void setMonthlyExpenses(BigDecimal monthlyExpenses) {
        this.monthlyExpenses = monthlyExpenses;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }
}