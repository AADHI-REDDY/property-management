package com.property.repository;

import com.property.model.Lease;
import com.property.model.Property;
import com.property.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface LeaseRepository extends JpaRepository<Lease, Long> {
    List<Lease> findByProperty(Property property);
    List<Lease> findByTenant(User tenant);
    List<Lease> findByPropertyId(Long propertyId);
    List<Lease> findByTenantId(Long tenantId);
    List<Lease> findByStatus(Lease.Status status);
    
    @Query("SELECT l FROM Lease l WHERE l.endDate <= :cutoffDate AND l.status = 'ACTIVE'")
    List<Lease> findExpiredLeases(@Param("cutoffDate") LocalDate cutoffDate);
    
    @Query("SELECT l FROM Lease l WHERE l.property.landlord.id = :landlordId")
    List<Lease> findByLandlordId(@Param("landlordId") Long landlordId);
    
    @Query("SELECT l FROM Lease l WHERE l.endDate BETWEEN :startDate AND :endDate AND l.status = 'ACTIVE'")
    List<Lease> findLeasesExpiringBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}