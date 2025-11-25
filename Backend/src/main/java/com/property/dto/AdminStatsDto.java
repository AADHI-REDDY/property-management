package com.property.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class AdminStatsDto {
    private Long totalUsers;
    private Long totalLandlords;
    private Long totalTenants;
    private Long totalProperties;
    private Long activeLeases;
    private Long pendingPayments;
    private Long maintenanceRequests;
    private BigDecimal totalRevenue;
}