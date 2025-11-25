// src/main/java/com/property/controller/UserController.java
package com.property.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List; // <-- Import
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize; // <-- Import
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.property.dto.UserResponse;
import com.property.model.User;
import com.property.repository.UserRepository;
import com.property.service.AdminService; // <-- Import

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class UserController {

    private final UserRepository userRepository;
    private final AdminService adminService; // <-- ADDED
    private static final String UPLOAD_DIR = "uploads/profiles/";
    
    // --- UPDATED CONSTRUCTOR ---
    public UserController(UserRepository userRepository, AdminService adminService) {
        this.userRepository = userRepository;
        this.adminService = adminService; // <-- ADDED
    }

    // --- NEW ENDPOINT TO FIX THE 500 ERROR ---
    @GetMapping("/tenants")
    @PreAuthorize("hasRole('LANDLORD') or hasRole('ADMIN')") // Only landlords/admins can see this
    public ResponseEntity<List<UserResponse>> getAllTenants() {
        // Call the service method that gets users by role
        List<UserResponse> tenants = adminService.getUsersByRole("ROLE_TENANT");
        return ResponseEntity.ok(tenants);
    }

    // --- Your Existing Methods ---

    @GetMapping("/profile")
    public ResponseEntity<UserResponse> getProfile(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(UserResponse.fromUser(user));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserResponse> updateProfile(
            @RequestBody UserResponse userRequest, // Use UserResponse DTO
            Authentication authentication) {
        
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(userRequest.getName());
        user.setPhone(userRequest.getPhone());
        
        if (userRequest.getProfileImage() != null) {
            user.setProfileImage(userRequest.getProfileImage());
        }

        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(UserResponse.fromUser(savedUser));
    }

    @PostMapping("/profile/image")
    public ResponseEntity<String> uploadProfileImage(
            @RequestParam("file") MultipartFile file,
            Authentication authentication) throws IOException {
        
        if (file.isEmpty()) {
            throw new RuntimeException("Please select a file to upload");
        }

        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String originalFilename = file.getOriginalFilename();

        if (originalFilename == null || originalFilename.isBlank()) {
            throw new RuntimeException("Invalid file: File name is missing or empty.");
        }

        String extension = "";
        int dotIndex = originalFilename.lastIndexOf(".");
        
        if (dotIndex >= 0 && dotIndex < originalFilename.length() - 1) {
            extension = originalFilename.substring(dotIndex);
        }

        String filename = UUID.randomUUID().toString() + extension;
        
        Path filePath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath);

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        String imageUrl = "/uploads/profiles/" + filename; 
        user.setProfileImage(imageUrl);
        userRepository.save(user);

        return ResponseEntity.ok(imageUrl);
    }

    @DeleteMapping("/profile/image")
    public ResponseEntity<Void> removeProfileImage(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setProfileImage(null);
        userRepository.save(user);
        
        return ResponseEntity.ok().build();
    }
}