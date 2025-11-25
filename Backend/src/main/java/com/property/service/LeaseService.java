package com.property.service;

import com.property.dto.LeaseDto;
import com.property.model.Lease;
import com.property.model.Property;
import com.property.model.User;
import com.property.repository.LeaseRepository;
import com.property.repository.PropertyRepository;
import com.property.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LeaseService {

    private final LeaseRepository leaseRepository;
    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    
    public LeaseService(LeaseRepository leaseRepository,
                       PropertyRepository propertyRepository,
                       UserRepository userRepository,
                       NotificationService notificationService) {
        this.leaseRepository = leaseRepository;
        this.propertyRepository = propertyRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    public List<LeaseDto> getAllLeases() {
        return leaseRepository.findAll().stream()
                .map(LeaseDto::fromLease)
                .collect(Collectors.toList());
    }

    public LeaseDto getLeaseById(Long id) {
        Lease lease = leaseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lease not found"));
        return LeaseDto.fromLease(lease);
    }

    public List<LeaseDto> getLeasesByLandlord(Long landlordId) {
        return leaseRepository.findByLandlordId(landlordId).stream()
                .map(LeaseDto::fromLease)
                .collect(Collectors.toList());
    }

    public List<LeaseDto> getLeasesByTenant(Long tenantId) {
        return leaseRepository.findByTenantId(tenantId).stream()
                .map(LeaseDto::fromLease)
                .collect(Collectors.toList());
    }

    public LeaseDto createLease(LeaseDto leaseDto, String landlordEmail) {
        User landlord = userRepository.findByEmail(landlordEmail)
                .orElseThrow(() -> new RuntimeException("Landlord not found"));

        Property property = propertyRepository.findById(leaseDto.getPropertyId())
                .orElseThrow(() -> new RuntimeException("Property not found"));

        User tenant = userRepository.findById(leaseDto.getTenantId())
                .orElseThrow(() -> new RuntimeException("Tenant not found"));

        // Check if landlord owns the property
        if (!property.getLandlord().getId().equals(landlord.getId())) {
            throw new RuntimeException("You can only create leases for your own properties");
        }

        Lease lease = Lease.builder()
                .property(property)
                .tenant(tenant)
                .startDate(leaseDto.getStartDate())
                .endDate(leaseDto.getEndDate())
                .rentAmount(leaseDto.getRentAmount())
                .securityDeposit(leaseDto.getSecurityDeposit())
                .status(Lease.Status.ACTIVE)
                .build();

        Lease savedLease = leaseRepository.save(lease);

        // Update property status to rented
        property.setStatus(Property.Status.RENTED);
        propertyRepository.save(property);

        // Send notification to tenant
        notificationService.createNotification(
                tenant,
                "New Lease Agreement",
                "New lease agreement for " + property.getTitle(),
                "INFO"
        );

        return LeaseDto.fromLease(savedLease);
    }

    public LeaseDto updateLease(Long id, LeaseDto leaseDto, String userEmail) {
        Lease lease = leaseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lease not found"));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check permissions
        boolean isAdmin = user.getRoles().stream()
                              .anyMatch(role -> role.getName().equals("ROLE_ADMIN"));

        if (!lease.getProperty().getLandlord().getId().equals(user.getId()) && !isAdmin) {
            throw new RuntimeException("You don't have permission to update this lease");
        }

        lease.setStartDate(leaseDto.getStartDate());
        lease.setEndDate(leaseDto.getEndDate());
        lease.setRentAmount(leaseDto.getRentAmount());
        lease.setSecurityDeposit(leaseDto.getSecurityDeposit());
        
        if (leaseDto.getStatus() != null) {
            lease.setStatus(Lease.Status.valueOf(leaseDto.getStatus().toUpperCase()));
        }

        Lease savedLease = leaseRepository.save(lease);
        return LeaseDto.fromLease(savedLease);
    }

    public void deleteLease(Long id, String userEmail) {
        Lease lease = leaseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lease not found"));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check permissions
        boolean isAdmin = user.getRoles().stream()
                              .anyMatch(role -> role.getName().equals("ROLE_ADMIN"));

        if (!lease.getProperty().getLandlord().getId().equals(user.getId()) && !isAdmin) {
            throw new RuntimeException("You don't have permission to delete this lease");
        }

        // Update property status back to available
        Property property = lease.getProperty();
        property.setStatus(Property.Status.AVAILABLE);
        propertyRepository.save(property);

        leaseRepository.delete(lease);
    }

    public List<LeaseDto> getExpiringLeases(int days) {
        LocalDate startDate = LocalDate.now();
        LocalDate endDate = LocalDate.now().plusDays(days);
        return leaseRepository.findLeasesExpiringBetween(startDate, endDate).stream()
                .map(LeaseDto::fromLease)
                .collect(Collectors.toList());
    }
}
