package com.fooddelivery.order_service.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fooddelivery.order_service.DTO.OrderRequest;
import com.fooddelivery.order_service.DTO.OrderResponse;
import com.fooddelivery.order_service.Service.OrderService;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

	@Autowired
	private OrderService orderService;

	// Order place karo
	@PostMapping("/place")
	public ResponseEntity<OrderResponse> placeOrder(@RequestBody OrderRequest request,
			@RequestHeader("X-User-Id") Long customerId) {
		return ResponseEntity.ok(orderService.placeOrder(request, customerId));
	}

	// Order status dekho
	@GetMapping("/{orderId}")
	public ResponseEntity<OrderResponse> getOrder(@PathVariable Long orderId) {
		return ResponseEntity.ok(orderService.getOrderById(orderId));
	}

	// Mere saare orders
	@GetMapping("/my-orders")
	public ResponseEntity<List<OrderResponse>> myOrders(@RequestHeader("X-User-Id") Long customerId) {
		return ResponseEntity.ok(orderService.getMyOrders(customerId));
	}

	// Cancel order
	@PutMapping("/{orderId}/cancel")
	public ResponseEntity<OrderResponse> cancel(@PathVariable Long orderId,
			@RequestHeader("X-User-Id") Long customerId) {
		return ResponseEntity.ok(orderService.cancelOrder(orderId, customerId));
	}

	// Status update (Restaurant use karega)
	@PutMapping("/{orderId}/status")
	public ResponseEntity<OrderResponse> updateStatus(@PathVariable Long orderId, @RequestParam String status) {
		return ResponseEntity.ok(orderService.updateStatus(orderId, status));
	}

	// Health check
	@GetMapping("/health")
	public ResponseEntity<String> health() {
		return ResponseEntity.ok("Order Service is UP! ✅");
	}
}