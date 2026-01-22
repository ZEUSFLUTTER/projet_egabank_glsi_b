package com.ega.backend.web;

import com.ega.backend.dto.dashboard.DashboardStatsResponse;
import com.ega.backend.dto.dashboard.FinancialStatsResponse;
import com.ega.backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsResponse> getStats(Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(dashboardService.getDashboardStats(username));
    }

    @GetMapping("/admin/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DashboardStatsResponse> getAdminStats(Authentication authentication) {
        return ResponseEntity.ok(dashboardService.getAdminDashboardStats());
    }

    @GetMapping("/financial-stats")
    public ResponseEntity<FinancialStatsResponse> getFinancialStats(Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(dashboardService.getFinancialStats(username));
    }
}