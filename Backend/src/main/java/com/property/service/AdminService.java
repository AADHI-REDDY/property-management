package com.property.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.property.dto.AdminStatsDto;
import com.property.dto.CreateTenantRequest;
import com.property.dto.UserResponse;
import com.property.model.Role; // <-- NEW ENTITY
import com.property.model.User;
import com.property.repository.LeaseRepository;
import com.property.repository.MaintenanceRequestRepository;
import com.property.repository.PaymentRepository;
import com.property.repository.PropertyRepository;
import com.property.repository.RoleRepository; // <-- NEW REPO
import com.property.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;
    private final LeaseRepository leaseRepository;
    private final PaymentRepository paymentRepository;
    private final MaintenanceRequestRepository maintenanceRequestRepository;
    private final RoleRepository roleRepository; // <-- Injected
    private final PasswordEncoder passwordEncoder;

    // ===========================================================
    // 1️⃣ CREATE TENANT ACCOUNT
    // ===========================================================
    public User createTenant(CreateTenantRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        User tenant = new User();
        tenant.setName(request.getName());
        tenant.setEmail(request.getEmail());
        tenant.setPhone(request.getPhone());
        tenant.setPassword(passwordEncoder.encode(request.getPassword()));

        // ✅ Use RoleRepository instead of enum
        Role tenantRole = roleRepository.findByName("ROLE_TENANT")
                .orElseThrow(() -> new RuntimeException("Error: Role 'ROLE_TENANT' not found."));
        tenant.setRoles(Set.of(tenantRole));

        return userRepository.save(tenant);
    }

    // ===========================================================
    // 2️⃣ ADMIN DASHBOARD STATS
    // ===========================================================
    public AdminStatsDto getAdminStats() {
        long totalUsers = userRepository.count();
        long totalLandlords = userRepository.findAll().stream()
                .filter(u -> u.getRoles().stream()
                        .anyMatch(r -> r.getName().equals("ROLE_LANDLORD")))
                .count();
        long totalTenants = userRepository.findAll().stream()
                .filter(u -> u.getRoles().stream()
                        .anyMatch(r -> r.getName().equals("ROLE_TENANT")))
                .count();
        long totalProperties = propertyRepository.count();
        long activeLeases = leaseRepository.findByStatus(com.property.model.Lease.Status.ACTIVE).size();
        Long pendingPayments = paymentRepository.countPendingPayments();
        Long maintenanceRequests = maintenanceRequestRepository.countPendingRequests();

        BigDecimal totalRevenue = paymentRepository.getTotalPaidAmount();
        if (totalRevenue == null) totalRevenue = BigDecimal.ZERO;

        return AdminStatsDto.builder()
                .totalUsers(totalUsers)
                .totalLandlords(totalLandlords)
                .totalTenants(totalTenants)
                .totalProperties(totalProperties)
                .activeLeases(activeLeases)
                .pendingPayments(pendingPayments)
                .maintenanceRequests(maintenanceRequests)
                .totalRevenue(totalRevenue)
                .build();
    }

    // ===========================================================
    // 3️⃣ USER MANAGEMENT
    // ===========================================================
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserResponse::fromUser)
                .collect(Collectors.toList());
    }

    public List<UserResponse> getUsersByRole(String roleName) {
        return userRepository.findAll().stream()
                .filter(u -> u.getRoles().stream()
                        .anyMatch(r -> r.getName().equals(roleName.toUpperCase())))
                .map(UserResponse::fromUser)
                .collect(Collectors.toList());
    }

    public UserResponse updateUserRole(Long userId, String newRoleName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Role newRole = roleRepository.findByName(newRoleName.toUpperCase())
                .orElseThrow(() -> new RuntimeException("Error: Role '" + newRoleName + "' not found."));

        user.setRoles(Set.of(newRole));
        User savedUser = userRepository.save(user);
        return UserResponse.fromUser(savedUser);
    }

    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        userRepository.delete(user);
    }

    public UserResponse getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return UserResponse.fromUser(user);
    }
}
