// src/main/java/com/property/service/AuthService.java
package com.property.service;

import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.property.dto.LoginRequest;
import com.property.dto.LoginResponse;
import com.property.dto.SignupRequest;
import com.property.dto.UserResponse;
import com.property.model.Role;
import com.property.model.User;
import com.property.repository.RoleRepository;
import com.property.repository.UserRepository;
import com.property.security.JwtTokenProvider;

@Service
public class AuthService {

    // --- These are all the dependencies you need ---
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    // --- Use Constructor Injection ---
    @Autowired
    public AuthService(UserRepository userRepository,
                       RoleRepository roleRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    /**
     * Handles user login and returns a JWT token and User info.
     */
    public LoginResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        String token = tokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new LoginResponse(token, new UserResponse(user));
    }

    /**
     * Handles new user registration (signup).
     */
    public UserResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        Set<String> strRoles = request.getRoles();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null || strRoles.isEmpty()) {
            // Default role: TENANT
            Role tenantRole = roleRepository.findByName("ROLE_TENANT")
                    .orElseThrow(() -> new RuntimeException("Error: Default role 'ROLE_TENANT' not found."));
            roles.add(tenantRole);
        } else {
            // Map each role string to a Role entity
            strRoles.forEach(roleName -> {
                Role role = roleRepository.findByName(roleName)
                        .orElseThrow(() -> new RuntimeException("Error: Role '" + roleName + "' not found."));
                roles.add(role);
            });
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .roles(roles)
                .phone(request.getPhone())
                .profileImage(request.getProfileImage())
                .build();

        User savedUser = userRepository.save(user);
        return new UserResponse(savedUser);
    }

    /**
     * Gets the current user's details based on their email.
     */
    public UserResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return new UserResponse(user);
    }
}