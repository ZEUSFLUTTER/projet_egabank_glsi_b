package com.ega.backend.security.jwt;

import com.ega.backend.security.CustomUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String username;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            if (log.isDebugEnabled()) {
                log.debug("[JWT] No Authorization header or not Bearer for path {}", request.getRequestURI());
            }
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);
        try {
            username = jwtService.extractUsername(jwt);
            if (log.isDebugEnabled()) {
                log.debug("[JWT] Extracted username '{}' from token for path {}", username, request.getRequestURI());
            }
        } catch (Exception e) {
            log.warn("[JWT] Failed to parse token for path {}: {}", request.getRequestURI(), e.getMessage());
            filterChain.doFilter(request, response);
            return;
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                if (jwtService.validateToken(jwt, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    if (log.isDebugEnabled()) {
                        log.debug("[JWT] Authentication set for '{}' on path {}", username, request.getRequestURI());
                    }
                } else {
                    log.warn("[JWT] Token validation failed for '{}' on path {}", username, request.getRequestURI());
                }
            } catch (org.springframework.security.core.userdetails.UsernameNotFoundException ex) {
                log.warn("[JWT] User from token not found: {} (path {})", username, request.getRequestURI());
                // treat as unauthenticated — continue filter chain without throwing
            } catch (Exception ex) {
                log.warn("[JWT] Unexpected error while loading user '{}' : {}", username, ex.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }
}
