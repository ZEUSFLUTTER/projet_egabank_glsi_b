package com.egabank.back;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan("com.egabank.model")
@EnableJpaRepositories("com.egabank.repository")
public class EgaBankApplication {
    public static void main(String[] args) {
        SpringApplication.run(EgaBankApplication.class, args);
    }
}