package com.fooddelivery.payment_service.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fooddelivery.payment_service.Model.Payment;
import com.fooddelivery.payment_service.Model.Payment.PaymentStatus;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

	Optional<Payment> findByOrderId(Long orderId);

	List<Payment> findByCustomerId(Long customerId);

	List<Payment> findByStatus(PaymentStatus status);
}