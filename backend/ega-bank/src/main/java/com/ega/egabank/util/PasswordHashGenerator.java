package com.ega.egabank.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordHashGenerator {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String password = "admin123";
        String hash = encoder.encode(password);
        
        System.out.println("===========================================");
        System.out.println("Mot de passe: " + password);
        System.out.println("Hash BCrypt: " + hash);
        System.out.println("===========================================");
        System.out.println("\nScript SQL à exécuter dans pgAdmin:");
        System.out.println("\nUPDATE users SET password = '" + hash + "' WHERE username = 'admin';");
        System.out.println("\nOu pour créer l'admin:");
        System.out.println("\nINSERT INTO users (username, password, email, role, enabled, created_at, updated_at)");
        System.out.println("VALUES ('admin', '" + hash + "', 'admin@egabank.com', 'ROLE_ADMIN', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)");
        System.out.println("ON CONFLICT (username) DO UPDATE SET password = EXCLUDED.password, enabled = EXCLUDED.enabled;");
    }
}
