package com.property.repository;

import com.property.model.MaintenanceRequest;
import com.property.model.Property;
import com.property.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaintenanceRequestRepository extends JpaRepository<MaintenanceRequest, Long> {
    List<MaintenanceRequest> findByProperty(Property property);
    List<MaintenanceRequest> findByTenant(User tenant);
    List<MaintenanceRequest> findByPropertyId(Long propertyId);
    List<MaintenanceRequest> findByTenantId(Long tenantId);
    List<MaintenanceRequest> findByStatus(MaintenanceRequest.Status status);
    List<MaintenanceRequest> findByPriority(MaintenanceRequest.Priority priority);
    
    @Query("SELECT m FROM MaintenanceRequest m WHERE m.property.landlord.id = :landlordId")
    List<MaintenanceRequest> findByLandlordId(@Param("landlordId") Long landlordId);
    
    @Query("SELECT m FROM MaintenanceRequest m WHERE m.status = 'PENDING' AND m.priority = 'URGENT'")
    List<MaintenanceRequest> findUrgentPendingRequests();
    
    @Query("SELECT m FROM MaintenanceRequest m WHERE m.assignedTo IS NULL AND m.status = 'PENDING'")
    List<MaintenanceRequest> findUnassignedRequests();
    
    @Query("SELECT COUNT(m) FROM MaintenanceRequest m WHERE m.status = 'PENDING'")
    Long countPendingRequests();
}