package com.property.service;

import com.property.dto.MaintenanceRequestDto;
import com.property.model.MaintenanceRequest;
import com.property.model.Property;
import com.property.model.User;
import com.property.repository.MaintenanceRequestRepository;
import com.property.repository.PropertyRepository;
import com.property.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MaintenanceService {

    private final MaintenanceRequestRepository maintenanceRequestRepository;
    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    
    public MaintenanceService(MaintenanceRequestRepository maintenanceRequestRepository,
                             PropertyRepository propertyRepository,
                             UserRepository userRepository,
                             NotificationService notificationService) {
        this.maintenanceRequestRepository = maintenanceRequestRepository;
        this.propertyRepository = propertyRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    public List<MaintenanceRequestDto> getAllRequests() {
        return maintenanceRequestRepository.findAll().stream()
                .map(MaintenanceRequestDto::fromMaintenanceRequest)
                .collect(Collectors.toList());
    }

    public MaintenanceRequestDto getRequestById(Long id) {
        MaintenanceRequest request = maintenanceRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Maintenance request not found"));
        return MaintenanceRequestDto.fromMaintenanceRequest(request);
    }

    public List<MaintenanceRequestDto> getRequestsByLandlord(Long landlordId) {
        return maintenanceRequestRepository.findByLandlordId(landlordId).stream()
                .map(MaintenanceRequestDto::fromMaintenanceRequest)
                .collect(Collectors.toList());
    }

    public List<MaintenanceRequestDto> getRequestsByTenant(Long tenantId) {
        return maintenanceRequestRepository.findByTenantId(tenantId).stream()
                .map(MaintenanceRequestDto::fromMaintenanceRequest)
                .collect(Collectors.toList());
    }

    public MaintenanceRequestDto createRequest(MaintenanceRequestDto requestDto, String tenantEmail) {
        User tenant = userRepository.findByEmail(tenantEmail)
                .orElseThrow(() -> new RuntimeException("Tenant not found"));

        Property property = propertyRepository.findById(requestDto.getPropertyId())
                .orElseThrow(() -> new RuntimeException("Property not found"));

        MaintenanceRequest request = MaintenanceRequest.builder()
                .property(property)
                .tenant(tenant)
                .title(requestDto.getTitle())
                .description(requestDto.getDescription())
                .category(MaintenanceRequest.Category.valueOf(requestDto.getCategory().toUpperCase()))
                .priority(MaintenanceRequest.Priority.valueOf(requestDto.getPriority().toUpperCase()))
                .status(MaintenanceRequest.Status.PENDING)
                .estimatedCost(requestDto.getEstimatedCost())
                .build();

        MaintenanceRequest savedRequest = maintenanceRequestRepository.save(request);

        // Send notification to landlord
        notificationService.createNotification(
                property.getLandlord(),
                "New Maintenance Request",
                "New maintenance request for " + property.getTitle(),
                "INFO"
        );

        return MaintenanceRequestDto.fromMaintenanceRequest(savedRequest);
    }

    public MaintenanceRequestDto updateRequest(Long id, MaintenanceRequestDto requestDto, String userEmail) {
        MaintenanceRequest request = maintenanceRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Maintenance request not found"));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check permissions
        boolean isAdmin = user.getRoles().stream()
                              .anyMatch(role -> role.getName().equals("ROLE_ADMIN"));

        if (!request.getTenant().getId().equals(user.getId()) && 
            !request.getProperty().getLandlord().getId().equals(user.getId()) &&
            !isAdmin) {
            throw new RuntimeException("You don't have permission to update this request");
        }

        request.setTitle(requestDto.getTitle());
        request.setDescription(requestDto.getDescription());
        request.setCategory(MaintenanceRequest.Category.valueOf(requestDto.getCategory().toUpperCase()));
        request.setPriority(MaintenanceRequest.Priority.valueOf(requestDto.getPriority().toUpperCase()));
        
        if (requestDto.getStatus() != null) {
            request.setStatus(MaintenanceRequest.Status.valueOf(requestDto.getStatus().toUpperCase()));
            if (request.getStatus() == MaintenanceRequest.Status.COMPLETED) {
                request.setCompletedAt(LocalDateTime.now());
            }
        }
        
        if (requestDto.getAssignedTo() != null) {
            request.setAssignedTo(requestDto.getAssignedTo());
        }
        
        if (requestDto.getActualCost() != null) {
            request.setActualCost(requestDto.getActualCost());
        }

        MaintenanceRequest savedRequest = maintenanceRequestRepository.save(request);
        return MaintenanceRequestDto.fromMaintenanceRequest(savedRequest);
    }

    public void deleteRequest(Long id, String userEmail) {
        MaintenanceRequest request = maintenanceRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Maintenance request not found"));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check permissions
        boolean isAdmin = user.getRoles().stream()
                              .anyMatch(role -> role.getName().equals("ROLE_ADMIN"));

        if (!request.getTenant().getId().equals(user.getId()) && 
            !request.getProperty().getLandlord().getId().equals(user.getId()) &&
            !isAdmin) {
            throw new RuntimeException("You don't have permission to delete this request");
        }

        maintenanceRequestRepository.delete(request);
    }
}
