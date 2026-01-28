package com.ega.ega_bank.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.http.HttpMethod;
import java.util.List;

@Configuration
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    // 🔹 Propriété bootstrap (true = premier admin, false = admins existants seulement)
    @Value("${admin.bootstrap.enabled:true}")
    private boolean bootstrapEnabled;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> {
                    // 🔓 Permettre les requêtes OPTIONS pour CORS
                    auth.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll();

                    // 🔓 Endpoints publics (login, inscription)
                    auth.requestMatchers("/api/auth/**").permitAll();

                    // 🔐 Gestion du bootstrap pour /api/admin/register
                    if (bootstrapEnabled) {
                        auth.requestMatchers("/api/admin/register").permitAll();
                    } else {
                        auth.requestMatchers("/api/admin/register").hasRole("ADMIN");
                    }

                    // 🔐 Endpoints réservés aux admins
                    auth.requestMatchers("/api/admin/**").hasRole("ADMIN");
                    auth.requestMatchers("/api/comptes/client/**").hasRole("ADMIN"); // ✅ ajout

                    // 🔐 Endpoints réservés aux clients
                    auth.requestMatchers("/api/comptes/mes-comptes").hasRole("CLIENT"); // ✅ ajout

                    // 🔐 Endpoints accessibles aux deux rôles (CLIENT et ADMIN)
                    auth.requestMatchers("/api/comptes/**").hasAnyRole("CLIENT", "ADMIN");

                    // Tout le reste nécessite une authentification
                    auth.anyRequest().authenticated();
                })
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("http://localhost:*")); // Allow localhost with any port
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true); // Allow credentials (cookies, authorization headers)

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
