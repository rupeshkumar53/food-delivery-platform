package com.fooddelivery.payment_service.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fooddelivery.payment_service.DTO.PaymentRequest;
import com.fooddelivery.payment_service.DTO.PaymentResponse;
import com.fooddelivery.payment_service.Model.Payment;
import com.fooddelivery.payment_service.Model.Payment.PaymentMethod;
import com.fooddelivery.payment_service.Model.Payment.PaymentStatus;
import com.fooddelivery.payment_service.Repository.PaymentRepository;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PaymentService {

	@Autowired
	private PaymentRepository paymentRepository;

	// Payment initiate karo
	public PaymentResponse initiatePayment(PaymentRequest request, Long customerId) {

		// Duplicate check — ek order ek payment
		if (paymentRepository.findByOrderId(request.getOrderId()).isPresent()) {
			throw new RuntimeException("Payment already exists for this order!");
		}

		Payment payment = new Payment();
		payment.setOrderId(request.getOrderId());
		payment.setCustomerId(customerId);
		payment.setAmount(request.getAmount());
		payment.setPaymentMethod(PaymentMethod.valueOf(request.getPaymentMethod().toUpperCase()));
		payment.setStatus(PaymentStatus.PENDING);

		Payment saved = paymentRepository.save(payment);
		return toResponse(saved, "Payment initiated! Complete payment.");
	}

	// Payment confirm karo
	public PaymentResponse confirmPayment(Long orderId) {

		Payment payment = paymentRepository.findByOrderId(orderId)
				.orElseThrow(() -> new RuntimeException("Payment not found!"));

		// Transaction ID generate karo
		String txnId = "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

		payment.setStatus(PaymentStatus.SUCCESS);
		payment.setTransactionId(txnId);

		Payment saved = paymentRepository.save(payment);
		return toResponse(saved, "Payment successful! TXN: " + txnId);
	}

	// Payment fail karo
	public PaymentResponse failPayment(Long orderId) {

		Payment payment = paymentRepository.findByOrderId(orderId)
				.orElseThrow(() -> new RuntimeException("Payment not found!"));

		payment.setStatus(PaymentStatus.FAILED);

		Payment saved = paymentRepository.save(payment);
		return toResponse(saved, "Payment failed!");
	}

	// Refund karo
	public PaymentResponse refundPayment(Long orderId) {

		Payment payment = paymentRepository.findByOrderId(orderId)
				.orElseThrow(() -> new RuntimeException("Payment not found!"));

		if (!payment.getStatus().equals(PaymentStatus.SUCCESS)) {
			throw new RuntimeException("Only successful payments can be refunded!");
		}

		payment.setStatus(PaymentStatus.REFUNDED);

		Payment saved = paymentRepository.save(payment);
		return toResponse(saved, "Refund initiated successfully!");
	}

	// Payment status dekho
	public PaymentResponse getByOrderId(Long orderId) {
		Payment payment = paymentRepository.findByOrderId(orderId)
				.orElseThrow(() -> new RuntimeException("Payment not found!"));
		return toResponse(payment, "");
	}

	// Customer ke saare payments
	public List<PaymentResponse> getMyPayments(Long customerId) {
		return paymentRepository.findByCustomerId(customerId).stream().map(p -> toResponse(p, ""))
				.collect(Collectors.toList());
	}

	// Entity → DTO
	private PaymentResponse toResponse(Payment p, String message) {
		PaymentResponse res = new PaymentResponse();
		res.setId(p.getId());
		res.setOrderId(p.getOrderId());
		res.setCustomerId(p.getCustomerId());
		res.setAmount(p.getAmount());
		res.setStatus(p.getStatus());
		res.setPaymentMethod(p.getPaymentMethod());
		res.setTransactionId(p.getTransactionId());
		res.setCreatedAt(p.getCreatedAt());
		res.setMessage(message);
		return res;
	}
}