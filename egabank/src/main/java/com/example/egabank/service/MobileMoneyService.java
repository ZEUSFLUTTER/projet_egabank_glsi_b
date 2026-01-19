package com.example.egabank.service;

import java.util.Random;

import org.springframework.stereotype.Service;

@Service
public class MobileMoneyService {

    public boolean simulatePayment(String phone, Double amount, String provider) {
        // Simulation plus réaliste avec validation
        if (phone == null || phone.length() != 8) {
            return false; // Numéro invalide
        }
        
        if (amount == null || amount < 500 || amount > 500000) {
            return false; // Montant invalide
        }
        
        // Simulation de succès basée sur le provider
        Random random = new Random();
        double successRate = 0.85; // 85% de succès par défaut
        
        // T-Money est plus fiable que Flooz dans notre simulation
        if ("T_MONEY".equals(provider)) {
            successRate = 0.90; // 90% de succès pour T-Money
        } else if ("FLOOZ".equals(provider)) {
            successRate = 0.80; // 80% de succès pour Flooz
        }
        
        return random.nextDouble() <= successRate;
    }
}