package com.ega.ega_bank.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();

        // Autoriser les credentials (cookies, headers d'authentification)
        config.setAllowCredentials(true);

        // Autoriser l'origine du frontend Angular en développement
        config.addAllowedOrigin("http://localhost:4200");

        // En production, remplacez par votre domaine :
        // config.addAllowedOrigin("https://votredomaine.com");

        // Autoriser tous les headers
        config.addAllowedHeader("*");

        // Autoriser toutes les méthodes HTTP
        config.addAllowedMethod("GET");
        config.addAllowedMethod("POST");
        config.addAllowedMethod("PUT");
        config.addAllowedMethod("DELETE");
        config.addAllowedMethod("OPTIONS");

        // Configuration de la source CORS
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

        // Appliquer la configuration à tous les endpoints API
        source.registerCorsConfiguration("/api/**", config);

        return new CorsFilter(source);
    }
}
