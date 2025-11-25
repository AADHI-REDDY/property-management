package com.property.controller;

import com.property.dto.LeaseDto;
import com.property.service.LeaseService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leases")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class LeaseController {

    private final LeaseService leaseService;
    
    public LeaseController(LeaseService leaseService) {
        this.leaseService = leaseService;
    }

    @GetMapping
    public ResponseEntity<List<LeaseDto>> getAllLeases() {
        List<LeaseDto> leases = leaseService.getAllLeases();
        return ResponseEntity.ok(leases);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LeaseDto> getLeaseById(@PathVariable Long id) {
        LeaseDto lease = leaseService.getLeaseById(id);
        return ResponseEntity.ok(lease);
    }

    @GetMapping("/landlord/{landlordId}")
    public ResponseEntity<List<LeaseDto>> getLeasesByLandlord(@PathVariable Long landlordId) {
        List<LeaseDto> leases = leaseService.getLeasesByLandlord(landlordId);
        return ResponseEntity.ok(leases);
    }

    @GetMapping("/tenant/{tenantId}")
    public ResponseEntity<List<LeaseDto>> getLeasesByTenant(@PathVariable Long tenantId) {
        List<LeaseDto> leases = leaseService.getLeasesByTenant(tenantId);
        return ResponseEntity.ok(leases);
    }

    @GetMapping("/expiring")
    public ResponseEntity<List<LeaseDto>> getExpiringLeases(@RequestParam(defaultValue = "30") int days) {
        List<LeaseDto> leases = leaseService.getExpiringLeases(days);
        return ResponseEntity.ok(leases);
    }

    @PostMapping
    public ResponseEntity<LeaseDto> createLease(
            @Valid @RequestBody LeaseDto leaseDto,
            Authentication authentication) {
        LeaseDto lease = leaseService.createLease(leaseDto, authentication.getName());
        return ResponseEntity.ok(lease);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LeaseDto> updateLease(
            @PathVariable Long id,
            @Valid @RequestBody LeaseDto leaseDto,
            Authentication authentication) {
        LeaseDto lease = leaseService.updateLease(id, leaseDto, authentication.getName());
        return ResponseEntity.ok(lease);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLease(@PathVariable Long id, Authentication authentication) {
        leaseService.deleteLease(id, authentication.getName());
        return ResponseEntity.ok().build();
    }
}