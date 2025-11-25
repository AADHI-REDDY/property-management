package com.property.dto;

import com.property.model.MaintenanceRequest;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class MaintenanceRequestDto {
    private Long id;
    private Long propertyId;
    private String propertyTitle;
    private String propertyAddress;
    private Long tenantId;
    private String tenantName;
    private String title;
    private String description;
    private String category;
    private String priority;
    private String status;
    private String assignedTo;
    private BigDecimal estimatedCost;
    private BigDecimal actualCost;
    private LocalDateTime completedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static MaintenanceRequestDto fromMaintenanceRequest(MaintenanceRequest request) {
        return MaintenanceRequestDto.builder()
                .id(request.getId())
                .propertyId(request.getProperty().getId())
                .propertyTitle(request.getProperty().getTitle())
                .propertyAddress(request.getProperty().getAddress() + ", " + request.getProperty().getCity())
                .tenantId(request.getTenant().getId())
                .tenantName(request.getTenant().getName())
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory().name().toLowerCase())
                .priority(request.getPriority().name().toLowerCase())
                .status(request.getStatus().name().toLowerCase())
                .assignedTo(request.getAssignedTo())
                .estimatedCost(request.getEstimatedCost())
                .actualCost(request.getActualCost())
                .completedAt(request.getCompletedAt())
                .createdAt(request.getCreatedAt())
                .updatedAt(request.getUpdatedAt())
                .build();
    }
}