package com.example.egabank.util;

import io.jsonwebtoken.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import java.util.Date;

@Component
public class JwtUtils {

    @Value("${ega.app.jwtSecret}")
    private String jwtSecret;

    @Value("${ega.app.jwtExpirationMs}")
    private int jwtExpirationMs;

    // Générer le token
// Dans JwtUtils.java

public String generateJwtToken(Authentication authentication) {
    UserDetails userPrincipal = (UserDetails) authentication.getPrincipal();
    
    // Récupérer les rôles de l'utilisateur
    String roles = userPrincipal.getAuthorities().stream()
            .map(authority -> authority.getAuthority())
            .collect(java.util.stream.Collectors.joining(","));

    return Jwts.builder()
            .setSubject((userPrincipal.getUsername()))
            .claim("roles", roles) // Ajouter les rôles dans le token
            .setIssuedAt(new Date())
            .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
            // CHANGE ICI : On utilise HS256 au lieu de HS512
            .signWith(SignatureAlgorithm.HS256, jwtSecret) 
            .compact();
}

public String getUserNameFromJwtToken(String token) {
    return Jwts.parser()
            .setSigningKey(jwtSecret)
            .parseClaimsJws(token)
            .getBody()
            .getSubject();
}

public boolean validateJwtToken(String authToken) {
    try {
        Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(authToken);
        return true;
    } catch (Exception e) {
        System.err.println("JWT Error: " + e.getMessage());
    }
    return false;
}
}