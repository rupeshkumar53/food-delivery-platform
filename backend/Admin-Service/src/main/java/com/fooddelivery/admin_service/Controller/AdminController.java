package com.fooddelivery.admin_service.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.fooddelivery.admin_service.DTO.AdminStatsDTO;
import com.fooddelivery.admin_service.DTO.DeliveryPartnerDTO;
import com.fooddelivery.admin_service.DTO.OrderDTO;
import com.fooddelivery.admin_service.DTO.RestaurantDTO;
import com.fooddelivery.admin_service.DTO.RoleUpdateRequest;
import com.fooddelivery.admin_service.DTO.UserDTO;
import com.fooddelivery.admin_service.Model.AdminLog;
import com.fooddelivery.admin_service.Service.AdminService;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

	@Autowired
	private AdminService adminService;

	// ─── Helper: admin email nikalo ─────────────
	private String getAdminEmail() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		return auth != null ? auth.getName() : "unknown";
	}

	// ─── STATS ──────────────────────────────────

	@GetMapping("/stats")
	public ResponseEntity<AdminStatsDTO> getStats() {
		return ResponseEntity.ok(adminService.getStats());
	}

	// ─── USERS ──────────────────────────────────

	@GetMapping("/users")
	public ResponseEntity<List<UserDTO>> getAllUsers() {
		return ResponseEntity.ok(adminService.getAllUsers());
	}

	@DeleteMapping("/users/{id}")
	public ResponseEntity<String> deleteUser(@PathVariable Long id) {
		adminService.deleteUser(id, getAdminEmail());
		return ResponseEntity.ok("User deleted successfully!");
	}

	@PutMapping("/users/{id}/role")
	public ResponseEntity<UserDTO> updateRole(@PathVariable Long id, @RequestBody RoleUpdateRequest req) {
		return ResponseEntity.ok(adminService.updateUserRole(id, req.getRole(), getAdminEmail()));
	}

	// ─── RESTAURANTS ────────────────────────────

	@GetMapping("/restaurants")
	public ResponseEntity<List<RestaurantDTO>> getAllRestaurants() {
		return ResponseEntity.ok(adminService.getAllRestaurants());
	}

	@DeleteMapping("/restaurants/{id}")
	public ResponseEntity<String> deleteRestaurant(@PathVariable Long id) {
		adminService.deleteRestaurant(id, getAdminEmail());
		return ResponseEntity.ok("Restaurant deleted!");
	}

	@PutMapping("/restaurants/{id}/toggle")
	public ResponseEntity<RestaurantDTO> toggleRestaurant(@PathVariable Long id) {
		return ResponseEntity.ok(adminService.toggleRestaurant(id, getAdminEmail()));
	}

	// ─── DELIVERY PARTNERS ──────────────────────

	@GetMapping("/delivery-partners")
	public ResponseEntity<List<DeliveryPartnerDTO>> getAllPartners() {
		return ResponseEntity.ok(adminService.getAllDeliveryPartners());
	}

	@DeleteMapping("/delivery-partners/{id}")
	public ResponseEntity<String> deletePartner(
	        @PathVariable Long id,
	        @RequestHeader("Authorization") String token) {

	    adminService.deleteDeliveryPartner(id, getAdminEmail(), token);
	    return ResponseEntity.ok("Partner deleted!");
	}

	@PutMapping("/delivery-partners/{id}/toggle")
	public ResponseEntity<DeliveryPartnerDTO> togglePartner(@PathVariable Long id) {
		return ResponseEntity.ok(adminService.togglePartner(id, getAdminEmail()));
	}

	// ─── ORDERS ─────────────────────────────────

	@GetMapping("/orders")
	public ResponseEntity<List<OrderDTO>> getAllOrders() {
		return ResponseEntity.ok(adminService.getAllOrders());
	}

	@DeleteMapping("/orders/{id}")
	public ResponseEntity<String> deleteOrder(@PathVariable Long id) {
		adminService.deleteOrder(id, getAdminEmail());
		return ResponseEntity.ok("Order deleted!");
	}

	// ─── AUDIT LOGS ─────────────────────────────

	@GetMapping("/logs")
	public ResponseEntity<List<AdminLog>> getLogs() {
		return ResponseEntity.ok(adminService.getAllLogs());
	}

	// ─── HEALTH ─────────────────────────────────

	@GetMapping("/health")
	public ResponseEntity<String> health() {
		return ResponseEntity.ok("Admin Service is UP! 👑");
	}
}