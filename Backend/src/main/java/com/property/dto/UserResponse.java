package com.property.dto;

import com.property.model.Role;
import com.property.model.User;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor; // Adds a public no-argument constructor

import java.util.Set;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor // Adds public UserResponse()
public class UserResponse {
    
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String profileImage;
    private Set<String> roles;

    /**
     * FIX 1: A public constructor.
     * This will satisfy any code (like my previous AuthService) calling 'new UserResponse(user)'.
     */
    public UserResponse(User user) {
        if (user != null) {
            this.id = user.getId();
            this.name = user.getName();
            this.email = user.getEmail();
            this.phone = user.getPhone();
            this.profileImage = user.getProfileImage();
            
            if (user.getRoles() != null) {
                // This converts the Set<Role> objects to a Set<String> of role names
                this.roles = user.getRoles().stream()
                                 .map(Role::getName)
                                 .collect(Collectors.toSet());
            }
        }
    }

    /**
     * FIX 2: A public static factory method.
     * This will fix all your new errors (e.g., 'fromUser(User) is undefined').
     */
    public static UserResponse fromUser(User user) {
        if (user == null) {
            return null;
        }
        // This just calls the constructor we already defined.
        return new UserResponse(user);
    }
}