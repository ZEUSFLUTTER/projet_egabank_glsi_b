package com.ega.backend.security.jwt;

import com.ega.backend.repository.UserAccountRepository;
import com.ega.backend.security.UserAccount;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {
    private final SecretKey key;
    private final long expirationMs;
    private final UserAccountRepository userAccountRepository;

    public JwtService(@Value("${app.jwt.secret:change-me-please-at-least-256-bits}") String secret,
                      @Value("${app.jwt.expirationMs:86400000}") long expirationMs,
                      UserAccountRepository userAccountRepository) {
        this.key = parseKey(secret);
        this.expirationMs = expirationMs;
        this.userAccountRepository = userAccountRepository;
    }

    private SecretKey parseKey(String secret) {
        try {
            byte[] bytes = Decoders.BASE64.decode(secret);
            return Keys.hmacShaKeyFor(bytes);
        } catch (Exception e) {
            return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        }
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        String role = null;
        
        // Récupérer l'utilisateur depuis la base de données pour obtenir le rôle principal
        UserAccount user = userAccountRepository.findByUsername(userDetails.getUsername())
            .orElse(null);
        
        if (user != null && user.getRole() != null && !user.getRole().isEmpty()) {
            role = user.getRole();
        } else {
            // Fallback: chercher dans les autorités
            if (userDetails.getAuthorities() != null) {
                role = userDetails.getAuthorities().stream()
                    .map(a -> a.getAuthority())
                    .filter(r -> r.startsWith("ROLE_"))
                    .map(r -> r.replace("ROLE_", ""))
                    .findFirst()
                    .orElse("CLIENT"); // Rôle par défaut
            }
        }
        
        // Ajouter le rôle au token
        if (role != null && !role.isEmpty()) {
            claims.put("role", role.toUpperCase());
        }
        
        return createToken(claims, userDetails.getUsername());
    }

    private String createToken(Map<String, Object> claims, String subject) {
        long now = System.currentTimeMillis();
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(now))
                .setExpiration(new Date(now + expirationMs))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }
}
