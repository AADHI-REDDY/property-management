package com.property.service;

import com.property.dto.PaymentDto;
import com.property.model.Lease;
import com.property.model.Payment;
import com.property.repository.LeaseRepository;
import com.property.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final LeaseRepository leaseRepository;
    private final NotificationService notificationService;
    
    public PaymentService(PaymentRepository paymentRepository,
                         LeaseRepository leaseRepository,
                         NotificationService notificationService) {
        this.paymentRepository = paymentRepository;
        this.leaseRepository = leaseRepository;
        this.notificationService = notificationService;
    }

    public List<PaymentDto> getAllPayments() {
        return paymentRepository.findAll().stream()
                .map(PaymentDto::fromPayment)
                .collect(Collectors.toList());
    }

    public PaymentDto getPaymentById(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        return PaymentDto.fromPayment(payment);
    }

    public List<PaymentDto> getPaymentsByLandlord(Long landlordId) {
        return paymentRepository.findByLandlordId(landlordId).stream()
                .map(PaymentDto::fromPayment)
                .collect(Collectors.toList());
    }

    public List<PaymentDto> getPaymentsByTenant(Long tenantId) {
        return paymentRepository.findByTenantId(tenantId).stream()
                .map(PaymentDto::fromPayment)
                .collect(Collectors.toList());
    }

    public List<PaymentDto> getOverduePayments() {
        return paymentRepository.findOverduePayments(LocalDate.now()).stream()
                .map(PaymentDto::fromPayment)
                .collect(Collectors.toList());
    }

    public PaymentDto createPayment(PaymentDto paymentDto) {
        Lease lease = leaseRepository.findById(paymentDto.getLeaseId())
                .orElseThrow(() -> new RuntimeException("Lease not found"));

        Payment payment = Payment.builder()
                .lease(lease)
                .amount(paymentDto.getAmount())
                .dueDate(paymentDto.getDueDate())
                .status(Payment.Status.PENDING)
                .paymentMethod(paymentDto.getPaymentMethod())
                .notes(paymentDto.getNotes())
                .build();

        Payment savedPayment = paymentRepository.save(payment);

        // Send notification to tenant
        notificationService.createNotification(
                lease.getTenant(),
                "Payment Due",
                "Payment of ₹" + payment.getAmount() + " is due on " + payment.getDueDate(),
                "WARNING"
        );

        return PaymentDto.fromPayment(savedPayment);
    }

    public PaymentDto markAsPaid(Long id, String paymentMethod) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        payment.setStatus(Payment.Status.PAID);
        payment.setPaidDate(LocalDate.now());
        payment.setPaymentMethod(paymentMethod);

        Payment savedPayment = paymentRepository.save(payment);

        // Send notification to landlord
        notificationService.createNotification(
                payment.getLease().getProperty().getLandlord(),
                "Payment Received",
                "Payment of ₹" + payment.getAmount() + " received from " + payment.getLease().getTenant().getName(),
                "SUCCESS"
        );

        return PaymentDto.fromPayment(savedPayment);
    }

    public void deletePayment(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        paymentRepository.delete(payment);
    }
}