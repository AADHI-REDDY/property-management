package com.property.controller;

import com.property.dto.PaymentDto;
import com.property.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class PaymentController {

    private final PaymentService paymentService;
    
    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @GetMapping
    public ResponseEntity<List<PaymentDto>> getAllPayments() {
        List<PaymentDto> payments = paymentService.getAllPayments();
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaymentDto> getPaymentById(@PathVariable Long id) {
        PaymentDto payment = paymentService.getPaymentById(id);
        return ResponseEntity.ok(payment);
    }

    @GetMapping("/landlord/{landlordId}")
    public ResponseEntity<List<PaymentDto>> getPaymentsByLandlord(@PathVariable Long landlordId) {
        List<PaymentDto> payments = paymentService.getPaymentsByLandlord(landlordId);
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/tenant/{tenantId}")
    public ResponseEntity<List<PaymentDto>> getPaymentsByTenant(@PathVariable Long tenantId) {
        List<PaymentDto> payments = paymentService.getPaymentsByTenant(tenantId);
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/overdue")
    public ResponseEntity<List<PaymentDto>> getOverduePayments() {
        List<PaymentDto> payments = paymentService.getOverduePayments();
        return ResponseEntity.ok(payments);
    }

    @PostMapping
    public ResponseEntity<PaymentDto> createPayment(@Valid @RequestBody PaymentDto paymentDto) {
        PaymentDto payment = paymentService.createPayment(paymentDto);
        return ResponseEntity.ok(payment);
    }

    @PatchMapping("/{id}/paid")
    public ResponseEntity<PaymentDto> markAsPaid(
            @PathVariable Long id,
            @RequestParam(required = false) String paymentMethod) {
        PaymentDto payment = paymentService.markAsPaid(id, paymentMethod);
        return ResponseEntity.ok(payment);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayment(@PathVariable Long id) {
        paymentService.deletePayment(id);
        return ResponseEntity.ok().build();
    }
}