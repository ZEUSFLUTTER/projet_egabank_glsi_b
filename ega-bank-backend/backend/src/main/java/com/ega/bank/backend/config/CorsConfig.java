package com.ega.bank.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        // Origine autorisée (Angular)
        configuration.setAllowedOrigins(
                List.of("http://localhost:4200"));

        // Méthodes HTTP autorisées
        configuration.setAllowedMethods(
                List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));

        // Headers autorisés depuis le frontend
        configuration.setAllowedHeaders(
                List.of("Authorization", "Content-Type"));

        // Headers exposés au frontend
        configuration.setExposedHeaders(
                List.of("Authorization"));

        // Autoriser l’envoi du header Authorization
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

        // Appliquer la config à toutes les routes
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}