package com.ega.bank.security;

import com.ega.bank.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Filtre qui intercepte TOUTES les requêtes HTTP pour vérifier le token JWT
 * C'est le "vigile" qui scanne votre bracelet à chaque entrée
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    
    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        
        // 1. Récupère l'en-tête "Authorization" de la requête
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String username;
        
        // 2. Vérifie si l'en-tête existe et commence par "Bearer "
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            // Pas de token, on laisse passer (Spring Security bloquera si nécessaire)
            filterChain.doFilter(request, response);
            return;
        }
        
        // 3. Extrait le token (enlève "Bearer " du début)
        jwt = authHeader.substring(7);
        
        try {
            // 4. Extrait le username du token
            username = jwtService.extractUsername(jwt);
            
            // 5. Si username existe et qu'aucun utilisateur n'est déjà authentifié
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                
                // 6. Charge les détails de l'utilisateur depuis la base de données
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
                
                // 7. Valide le token
                if (jwtService.validateToken(jwt, userDetails)) {
                    
                    // 8. Crée un objet d'authentification
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
                    
                    authToken.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request)
                    );
                    
                    // 9. Place l'utilisateur dans le contexte de sécurité
                    // À partir de maintenant, Spring sait qui vous êtes !
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception e) {
            // Token invalide, on continue sans authentifier
            logger.error("Erreur lors de la validation du token JWT: " + e.getMessage());
        }
        
        // 10. Continue la chaîne de filtres
        filterChain.doFilter(request, response);
    }
}