package com.property.repository;

import com.property.model.Property;
import com.property.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {
    List<Property> findByLandlord(User landlord);
    List<Property> findByLandlordId(Long landlordId);
    List<Property> findByStatus(Property.Status status);
    
    @Query("SELECT p FROM Property p WHERE p.city = :city AND p.status = :status")
    List<Property> findByCityAndStatus(@Param("city") String city, @Param("status") Property.Status status);
    
    @Query("SELECT p FROM Property p WHERE p.rent BETWEEN :minRent AND :maxRent")
    List<Property> findByRentRange(@Param("minRent") java.math.BigDecimal minRent, 
                                  @Param("maxRent") java.math.BigDecimal maxRent);
    
    @Query("SELECT COUNT(p) FROM Property p WHERE p.status = 'AVAILABLE'")
    Long countAvailableProperties();
    
    @Query("SELECT COUNT(p) FROM Property p WHERE p.status = 'RENTED'")
    Long countRentedProperties();
}