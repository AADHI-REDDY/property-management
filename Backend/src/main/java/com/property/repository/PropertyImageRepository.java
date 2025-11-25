// src/main/java/com/property/repository/PropertyImageRepository.java
package com.property.repository;

import com.property.model.PropertyImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PropertyImageRepository extends JpaRepository<PropertyImage, Long> {
}