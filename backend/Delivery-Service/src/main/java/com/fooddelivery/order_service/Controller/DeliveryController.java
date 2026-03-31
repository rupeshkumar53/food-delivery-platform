package com.fooddelivery.order_service.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fooddelivery.order_service.DTO.DeliveryPartnerResponse;
import com.fooddelivery.order_service.DTO.LocationUpdateRequest;
import com.fooddelivery.order_service.Model.DeliveryTracking;
import com.fooddelivery.order_service.Service.DeliveryService;

import java.util.List;

@RestController
@RequestMapping("/api/delivery")
@CrossOrigin(origins = "*")
public class DeliveryController {

	@Autowired
	private DeliveryService deliveryService;

	// Partner register
	@PostMapping("/register")
	public ResponseEntity<DeliveryPartnerResponse> register(@RequestHeader("X-User-Id") Long userId,
			@RequestParam String name, @RequestParam String phone, @RequestParam String vehicleType) {
		return ResponseEntity.ok(deliveryService.registerPartner(userId, name, phone, vehicleType));
	}

	// Available partners dekho
	@GetMapping("/available")
	public ResponseEntity<List<DeliveryPartnerResponse>> available() {
		return ResponseEntity.ok(deliveryService.getAvailablePartners());
	}

	// Location update karo
	@PutMapping("/location")
	public ResponseEntity<DeliveryPartnerResponse> updateLocation(@RequestHeader("X-User-Id") Long userId,
			@RequestBody LocationUpdateRequest request) {
		return ResponseEntity.ok(deliveryService.updateLocation(userId, request));
	}

	// Order accept karo
	@PutMapping("/accept/{orderId}")
	public ResponseEntity<DeliveryPartnerResponse> acceptOrder(@RequestHeader("X-User-Id") Long userId,
			@PathVariable Long orderId) {
		return ResponseEntity.ok(deliveryService.acceptOrder(userId, orderId));
	}

	// Delivery complete
	@PutMapping("/complete")
	public ResponseEntity<DeliveryPartnerResponse> complete(@RequestHeader("X-User-Id") Long userId) {
		return ResponseEntity.ok(deliveryService.completeDelivery(userId));
	}

	// Order tracking dekho
	@GetMapping("/track/{orderId}")
	public ResponseEntity<DeliveryTracking> trackOrder(@PathVariable Long orderId) {
		return ResponseEntity.ok(deliveryService.getLastLocation(orderId));
	}

	// Health check
	@GetMapping("/health")
	public ResponseEntity<String> health() {
		return ResponseEntity.ok("Delivery Service is UP! ✅");
	}
}