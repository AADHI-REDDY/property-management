package com.property; // <-- This is the package your IDE expects

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan; // <-- IMPORT THIS

@SpringBootApplication
// --- THIS IS THE FIX ---
// Tell Spring Boot to scan BOTH your main package AND the "com.property" package
@ComponentScan(basePackages = {"com.property.management", "com.property"})
// --- END FIX ---
public class PropertyManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(PropertyManagementApplication.class, args);
    }
}