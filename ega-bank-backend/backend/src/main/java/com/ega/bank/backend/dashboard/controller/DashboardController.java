package com.ega.bank.backend.dashboard.controller;

import com.ega.bank.backend.dashboard.dto.AdminDashboardDto;
import com.ega.bank.backend.dashboard.dto.AgentDashboardDto;
import com.ega.bank.backend.dashboard.dto.ClientDashboardDto;
import com.ega.bank.backend.dashboard.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:4200")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    // ADMIN
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminDashboardDto> getAdminDashboard() {
        return ResponseEntity.ok(dashboardService.getAdminDashboard());
    }

    // AGENT
    @GetMapping("/agent")
    @PreAuthorize("hasRole('AGENT')")
    public ResponseEntity<AgentDashboardDto> getAgentDashboard() {
        return ResponseEntity.ok(dashboardService.getAgentDashboard());
    }

    // CLIENT
    @GetMapping("/client/{clientId}")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<ClientDashboardDto> getClientDashboard(
            @PathVariable Long clientId) {
        return ResponseEntity.ok(dashboardService.getClientDashboard(clientId));
    }
}