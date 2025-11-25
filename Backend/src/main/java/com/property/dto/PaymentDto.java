package com.property.dto;

import com.property.model.Payment;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class PaymentDto {
    private Long id;
    private Long leaseId;
    private String propertyTitle;
    private String propertyAddress;
    private String tenantName;
    private String tenantEmail;
    private BigDecimal amount;
    private LocalDate dueDate;
    private LocalDate paidDate;
    private String status;
    private String paymentMethod;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static PaymentDto fromPayment(Payment payment) {
        return PaymentDto.builder()
                .id(payment.getId())
                .leaseId(payment.getLease().getId())
                .propertyTitle(payment.getLease().getProperty().getTitle())
                .propertyAddress(payment.getLease().getProperty().getAddress() + ", " + payment.getLease().getProperty().getCity())
                .tenantName(payment.getLease().getTenant().getName())
                .tenantEmail(payment.getLease().getTenant().getEmail())
                .amount(payment.getAmount())
                .dueDate(payment.getDueDate())
                .paidDate(payment.getPaidDate())
                .status(payment.getStatus().name().toLowerCase())
                .paymentMethod(payment.getPaymentMethod())
                .notes(payment.getNotes())
                .createdAt(payment.getCreatedAt())
                .updatedAt(payment.getUpdatedAt())
                .build();
    }
}