package com.ega.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Configuration properties pour JWT
 * - Access Token: expire après 3 minutes d'inactivité
 * - Refresh Token: valide 7 jours pour renouveler la session
 */
@Component
@ConfigurationProperties(prefix = "jwt")
@Getter
@Setter
public class JwtProperties {
    private String secret;
    private long accessTokenExpiration;  // 3 minutes = 180000 ms
    private long refreshTokenExpiration; // 7 jours = 604800000 ms
}
