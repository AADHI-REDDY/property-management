package com.property.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.Builder; // We can add Builder for flexibility
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Getter
@Setter
@Builder // Add Builder
@AllArgsConstructor // This creates the constructor (String token, UserResponse user)
@NoArgsConstructor  // This creates the no-args constructor
public class LoginResponse {

    private String token;
    private UserResponse user;

    /* * NOTE: By adding @AllArgsConstructor, Lombok automatically creates:
     * public LoginResponse(String token, UserResponse user) {
     * this.token = token;
     * this.user = user;
     * }
     * This will fix the "not visible" error in AuthService.
     */
}