package com.ega.util;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.access-token.expiration}")
    private Long accessExpiration;

    @Value("${jwt.refresh-token.expiration}")
    private Long refreshExpiration;

    private SecretKey key() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String extractUsername(String token) {
        return extractClaims(token).getSubject();
    }

    private Claims extractClaims(String token) {
        return Jwts.parser()
                .verifyWith(key())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean isAccessToken(String token) {
        return "access".equals(extractClaims(token).get("type"));
    }

    public boolean isRefreshToken(String token) {
        return "refresh".equals(extractClaims(token).get("type"));
    }

    public String generateAccessToken(UserDetails user) {
        return generateToken(user.getUsername(), "access", accessExpiration);
    }

    public String generateRefreshToken(UserDetails user) {
        return generateToken(user.getUsername(), "refresh", refreshExpiration);
    }

    private String generateToken(String subject, String type, Long exp) {
        return Jwts.builder()
                .subject(subject)
                .claim("type", type)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + exp))
                .signWith(key())
                .compact();
    }

    public boolean validateAccessToken(String token, UserDetails user) {
        try {
            return isAccessToken(token)
                    && extractUsername(token).equals(user.getUsername())
                    && extractClaims(token).getExpiration().after(new Date());
        } catch (Exception e) {
            return false;
        }
    }
}
