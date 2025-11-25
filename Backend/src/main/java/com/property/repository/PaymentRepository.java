package com.property.repository;

import com.property.model.Payment;
import com.property.model.Lease;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByLease(Lease lease);
    List<Payment> findByLeaseId(Long leaseId);
    List<Payment> findByStatus(Payment.Status status);
    
    @Query("SELECT p FROM Payment p WHERE p.dueDate < :currentDate AND p.status = 'PENDING'")
    List<Payment> findOverduePayments(@Param("currentDate") LocalDate currentDate);
    
    @Query("SELECT p FROM Payment p WHERE p.lease.tenant.id = :tenantId")
    List<Payment> findByTenantId(@Param("tenantId") Long tenantId);
    
    @Query("SELECT p FROM Payment p WHERE p.lease.property.landlord.id = :landlordId")
    List<Payment> findByLandlordId(@Param("landlordId") Long landlordId);
    
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'PAID'")
    java.math.BigDecimal getTotalPaidAmount();
    
    @Query("SELECT COUNT(p) FROM Payment p WHERE p.status = 'PENDING'")
    Long countPendingPayments();
}