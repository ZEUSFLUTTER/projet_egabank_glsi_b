package com.egabank.back; // ou com.egabank selon votre structure

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan("com.egabank.back.model") // Ajuster selon votre package
@EnableJpaRepositories("com.egabank.back.repository")
public class EgaBankApplication {
    public static void main(String[] args) {
        SpringApplication.run(EgaBankApplication.class, args);
    }
}