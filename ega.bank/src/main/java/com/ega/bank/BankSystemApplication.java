package com.ega.bank;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BankSystemApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(BankSystemApplication.class, args);
        System.out.println("========================================");
        System.out.println("🏦 EGA BANK SYSTEM - DÉMARRÉ");
        System.out.println("📡 API disponible sur: http://localhost:8080");
        System.out.println("🗄️  Console H2: http://localhost:8080/h2-console");
        System.out.println("========================================");
    }
}