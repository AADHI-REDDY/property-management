package com.property.repository;

import com.property.model.Role; // <-- Import the entity
import com.property.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
// import org.springframework.data.repository.query.Param; // Keep if you use findByRoleName later
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    // This method name is correct if you want to find users having a specific Role object
    List<User> findByRolesContains(Role role);

    // --- CORRECTED QUERIES ---

    // Use JOIN to look inside the 'roles' collection for the role named 'ROLE_TENANT'
    @Query("SELECT u FROM User u JOIN u.roles r WHERE r.name = 'ROLE_TENANT'")
    List<User> findAllTenants();

    // Use JOIN to look inside the 'roles' collection for the role named 'ROLE_LANDLORD'
    @Query("SELECT u FROM User u JOIN u.roles r WHERE r.name = 'ROLE_LANDLORD'")
    List<User> findAllLandlords();

    // Optional: If you need a method to find users by any role name string:
    // @Query("SELECT u FROM User u JOIN u.roles r WHERE r.name = :roleName")
    // List<User> findByRoleName(@Param("roleName") String roleName);
}