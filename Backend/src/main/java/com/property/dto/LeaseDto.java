package com.property.dto;

import com.property.model.Lease;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class LeaseDto {
    private Long id;
    private Long propertyId;
    private String propertyTitle;
    private String propertyAddress;
    private Long tenantId;
    private String tenantName;
    private String tenantEmail;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal rentAmount;
    private BigDecimal securityDeposit;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static LeaseDto fromLease(Lease lease) {
        return LeaseDto.builder()
                .id(lease.getId())
                .propertyId(lease.getProperty().getId())
                .propertyTitle(lease.getProperty().getTitle())
                .propertyAddress(lease.getProperty().getAddress() + ", " + lease.getProperty().getCity())
                .tenantId(lease.getTenant().getId())
                .tenantName(lease.getTenant().getName())
                .tenantEmail(lease.getTenant().getEmail())
                .startDate(lease.getStartDate())
                .endDate(lease.getEndDate())
                .rentAmount(lease.getRentAmount())
                .securityDeposit(lease.getSecurityDeposit())
                .status(lease.getStatus().name().toLowerCase())
                .createdAt(lease.getCreatedAt())
                .updatedAt(lease.getUpdatedAt())
                .build();
    }
}