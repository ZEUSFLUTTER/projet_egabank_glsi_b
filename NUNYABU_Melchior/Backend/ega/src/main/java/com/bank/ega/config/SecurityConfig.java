package com.bank.ega.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(org.springframework.security.config.annotation.web.builders.HttpSecurity http) throws Exception {
        http
        
            .csrf(csrf -> csrf.disable()) // Désactive CSRF
            .authorizeHttpRequests(auth -> auth
                // Routes publiques (authentification)
                .requestMatchers("/api/auth/**").permitAll()
                // Routes de diagnostic (test)
                .requestMatchers("/api/diagnostic/**").permitAll()
                // Documentation Swagger
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-resources/**").permitAll()
                // Routes admin
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                // Routes protégées (nécessitent JWT)
                .requestMatchers("/api/comptes/**").permitAll()
                // .authenticated()
                
                .requestMatchers("/api/profil/**").permitAll()
                // .authenticated()
                .requestMatchers("/api/parametres/**").permitAll()
                // .authenticated()
                .requestMatchers("/api/transactions/**").permitAll()
                // .authenticated()
                .requestMatchers("/api/clients/**").permitAll()
                // .authenticated()
                // // Toutes les autres routes nécessitent une authentification
                // .anyRequest().authenticated()
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)); // JWT = stateless

        // Ajouter le filtre JWT avant UsernamePasswordAuthenticationFilter
        // http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
