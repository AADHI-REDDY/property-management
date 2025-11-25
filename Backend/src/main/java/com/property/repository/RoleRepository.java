package com.property.repository;

import com.property.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {
    // This method is what your services will use
    Optional<Role> findByName(String name);
}