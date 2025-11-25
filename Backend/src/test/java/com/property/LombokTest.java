package com.property;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class LombokTest {
    private final String name;
    private int age;
    
    // If Lombok is working, these methods should be auto-generated:
    // - getName()
    // - getAge() 
    // - setAge()
    // - constructor with 'name' parameter
    
    public static void main(String[] args) {
        // Test Lombok functionality
        LombokTest test = new LombokTest("John Doe");
        test.setAge(25);
        
        System.out.println("Name: " + test.getName());
        System.out.println("Age: " + test.getAge());
        System.out.println("Lombok is working! ✅");
    }
}