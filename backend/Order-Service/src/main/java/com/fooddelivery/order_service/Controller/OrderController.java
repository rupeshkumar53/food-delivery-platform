package com.fooddelivery.order_service.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fooddelivery.order_service.DTO.OrderRequest;
import com.fooddelivery.order_service.DTO.OrderResponse;
import com.fooddelivery.order_service.Service.OrderService;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
//@CrossOrigin(origins = "*")
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
	
	// Restaurant ke orders
	@GetMapping("/restaurant-orders")
	public ResponseEntity<List<OrderResponse>>
	        restaurantOrders(
	        @RequestHeader("X-User-Id")
	        Long restaurantId) {
	    return ResponseEntity.ok(
	        orderService.getByRestaurantUserId(
	            restaurantId));
	}

	// Delivery partner ke orders
//	@GetMapping("/delivery-orders")
//	public ResponseEntity<List<OrderResponse>>
//	        deliveryOrders(
//	        @RequestHeader("X-User-Id")
//	        Long partnerId) {
//	    return ResponseEntity.ok(
//	        orderService.getByDeliveryPartnerId(
//	            partnerId));
//	}
	@GetMapping("/delivery-orders")
	public ResponseEntity<List<OrderResponse>>
	        deliveryOrders(
	        @RequestHeader(
	            value = "X-User-Id",
	            required = false,
	            defaultValue = "0")
	        Long userId) {

	    System.out.println(
	        "🔍 delivery-orders called, userId: "
	        + userId);

	    try {
	        List<OrderResponse> orders =
	            orderService.getByDeliveryPartnerId(
	                userId);
	        return ResponseEntity.ok(orders);
	    } catch (Exception e) {
	        System.out.println(
	            "❌ delivery-orders error: "
	            + e.getMessage());
	        e.printStackTrace();
	        return ResponseEntity.ok(
	            new ArrayList<>());
	    }
	}
	
	// All orders — Admin
	@GetMapping("/all")
	public ResponseEntity<List<OrderResponse>>
	        getAllOrders() {
	    return ResponseEntity.ok(
	        orderService.getAllOrders());
	}

	// Delete order — Admin
	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteOrder(
	        @PathVariable Long id) {
	    orderService.deleteOrder(id);
	    return ResponseEntity.ok(
	        "Order deleted!");
	}
}