package com.bank.ega;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class GeneratePassword {
	public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String rawPassword = "Client123";
        String encodedPassword = encoder.encode(rawPassword);
        System.out.println(encodedPassword);
    }


}
