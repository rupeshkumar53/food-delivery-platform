package com.fooddelivery.payment_service.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fooddelivery.payment_service.DTO.PaymentRequest;
import com.fooddelivery.payment_service.DTO.PaymentResponse;
import com.fooddelivery.payment_service.Service.PaymentService;

import java.util.List;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    // Payment initiate
    @PostMapping("/initiate")
    public ResponseEntity<PaymentResponse> initiate(
            @RequestBody PaymentRequest request,
            @RequestHeader("X-User-Id") Long customerId) {
        return ResponseEntity.ok(
            paymentService.initiatePayment(
                request, customerId));
    }

    // Payment confirm
    @PutMapping("/confirm/{orderId}")
    public ResponseEntity<PaymentResponse> confirm(
            @PathVariable Long orderId) {
        return ResponseEntity.ok(
            paymentService.confirmPayment(orderId));
    }

    // Payment fail
    @PutMapping("/fail/{orderId}")
    public ResponseEntity<PaymentResponse> fail(
            @PathVariable Long orderId) {
        return ResponseEntity.ok(
            paymentService.failPayment(orderId));
    }

    // Refund
    @PutMapping("/refund/{orderId}")
    public ResponseEntity<PaymentResponse> refund(
            @PathVariable Long orderId) {
        return ResponseEntity.ok(
            paymentService.refundPayment(orderId));
    }

    // Order ki payment status
    @GetMapping("/order/{orderId}")
    public ResponseEntity<PaymentResponse> getByOrder(
            @PathVariable Long orderId) {
        return ResponseEntity.ok(
            paymentService.getByOrderId(orderId));
    }

    // Mere saare payments
    @GetMapping("/my-payments")
    public ResponseEntity<List<PaymentResponse>>
            myPayments(
            @RequestHeader("X-User-Id")
            Long customerId) {
        return ResponseEntity.ok(
            paymentService.getMyPayments(customerId));
    }

    // Health check
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok(
            "Payment Service is UP! ✅");
    }
}