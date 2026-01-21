/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.egabank.Backend.securite;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 *
 * @author HP
 */
@Component
public class FiltreJwt extends OncePerRequestFilter {
    private final ServiceJwt serviceJwt;
    private final ServiceUtilisateurDetails serviceUtilisateurDetails;

    public FiltreJwt(ServiceJwt serviceJwt, ServiceUtilisateurDetails serviceUtilisateurDetails) {
        this.serviceJwt = serviceJwt;
        this.serviceUtilisateurDetails = serviceUtilisateurDetails;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {
        if ("OPTIONS".equalsIgnoreCase(req.getMethod())) {
            chain.doFilter(req, res);
            return;
        }

        String header = req.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            String jeton = header.substring(7);

            try {
                Claims claims = serviceJwt.lireClaims(jeton);
                String nomUtilisateur = claims.getSubject();
                
                if (nomUtilisateur != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    UserDetails details = serviceUtilisateurDetails.loadUserByUsername(nomUtilisateur);

                    var auth = new UsernamePasswordAuthenticationToken(
                            details,
                            null,
                            details.getAuthorities()
                    );
                    auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(req));
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }

            } catch (Exception ex) {
                SecurityContextHolder.clearContext();
            }
        }

        chain.doFilter(req, res);
    }
}
