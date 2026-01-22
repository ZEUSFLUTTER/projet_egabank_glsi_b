package com.ega.backend.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse {
    private BigDecimal totalBalance;
    private Integer totalAccounts;
    private Integer totalTransactions;
    private Integer totalCategories;
    private BigDecimal totalCredits;
    private BigDecimal totalDebits;
    private BigDecimal monthlyEarnings;
    private BigDecimal monthlyExpenses;
    private Integer creditCount;
    private Integer debitCount;
    
    // Champs spécifiques pour les admins
    private Integer totalClients;
    private Integer activeClients;
    private Integer activeAccounts;
    private Integer newAccountsThisMonth;
    private Integer newClientsThisMonth;
}