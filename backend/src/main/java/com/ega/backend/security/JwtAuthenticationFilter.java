package com.ega.backend.security;

import com.ega.backend.model.Client;
import com.ega.backend.repository.ClientRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private ClientRepository clientRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String token = getTokenFromRequest(request);

        if (token != null && tokenProvider.validateToken(token)) {
            try {
                String email = tokenProvider.getUsernameFromToken(token);
                var clientOpt = clientRepository.findByEmail(email);

                if (clientOpt.isPresent()) {
                    Client client = clientOpt.get();

                    // ✅ Vérifie si le compte est actif
                    if (Boolean.TRUE.equals(client.getActive())) {
                        String role = client.getRole();
                        var authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role));

                        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                                email, null, authorities);

                        SecurityContextHolder.getContext().setAuthentication(authentication);
                        
                        logger.info("Authentification réussie pour: {} avec rôle: ROLE_{}", email, role);
                    } else {
                        logger.warn("Compte désactivé: {}", email);
                    }
                }
            } catch (Exception e) {
                logger.error("Erreur lors de l'authentification JWT", e);
            }
        }

        filterChain.doFilter(request, response);
    }

    private String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}