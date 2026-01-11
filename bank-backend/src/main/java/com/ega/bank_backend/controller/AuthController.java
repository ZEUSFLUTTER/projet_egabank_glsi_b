package com.ega.bank_backend.controller;

import com.ega.bank_backend.dto.LoginRequest;
import com.ega.bank_backend.dto.LoginResponse;
import com.ega.bank_backend.security.JwtUtils;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtUtils jwtUtils;

    public AuthController(AuthenticationManager authenticationManager, UserDetailsService userDetailsService,
            JwtUtils jwtUtils) {
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password()));
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.username());
        String token = jwtUtils.generateToken(userDetails);
        return new LoginResponse(token);
    }
}
