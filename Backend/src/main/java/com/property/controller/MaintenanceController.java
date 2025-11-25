package com.property.controller;

import com.property.dto.MaintenanceRequestDto;
import com.property.service.MaintenanceService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maintenance")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class MaintenanceController {

    private final MaintenanceService maintenanceService;
    
    public MaintenanceController(MaintenanceService maintenanceService) {
        this.maintenanceService = maintenanceService;
    }

    @GetMapping
    public ResponseEntity<List<MaintenanceRequestDto>> getAllRequests() {
        List<MaintenanceRequestDto> requests = maintenanceService.getAllRequests();
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MaintenanceRequestDto> getRequestById(@PathVariable Long id) {
        MaintenanceRequestDto request = maintenanceService.getRequestById(id);
        return ResponseEntity.ok(request);
    }

    @GetMapping("/landlord/{landlordId}")
    public ResponseEntity<List<MaintenanceRequestDto>> getRequestsByLandlord(@PathVariable Long landlordId) {
        List<MaintenanceRequestDto> requests = maintenanceService.getRequestsByLandlord(landlordId);
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/tenant/{tenantId}")
    public ResponseEntity<List<MaintenanceRequestDto>> getRequestsByTenant(@PathVariable Long tenantId) {
        List<MaintenanceRequestDto> requests = maintenanceService.getRequestsByTenant(tenantId);
        return ResponseEntity.ok(requests);
    }

    @PostMapping
    public ResponseEntity<MaintenanceRequestDto> createRequest(
            @Valid @RequestBody MaintenanceRequestDto requestDto,
            Authentication authentication) {
        MaintenanceRequestDto request = maintenanceService.createRequest(requestDto, authentication.getName());
        return ResponseEntity.ok(request);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MaintenanceRequestDto> updateRequest(
            @PathVariable Long id,
            @Valid @RequestBody MaintenanceRequestDto requestDto,
            Authentication authentication) {
        MaintenanceRequestDto request = maintenanceService.updateRequest(id, requestDto, authentication.getName());
        return ResponseEntity.ok(request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRequest(@PathVariable Long id, Authentication authentication) {
        maintenanceService.deleteRequest(id, authentication.getName());
        return ResponseEntity.ok().build();
    }
}