package com.fooddelivery.restaurant.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.fooddelivery.restaurant.DTO.RestaurantRequest;
import com.fooddelivery.restaurant.DTO.RestaurantResponse;
import com.fooddelivery.restaurant.Service.RestaurantService;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
//@CrossOrigin(origins = "*")
public class RestaurantController {

	@Autowired
	private RestaurantService restaurantService;

	// Restaurant banao — sirf RESTAURANT role
	@PostMapping("/create")
	@PreAuthorize("hasRole('RESTAURANT')")
	public ResponseEntity<RestaurantResponse> create(@RequestBody RestaurantRequest request,
			@RequestHeader("X-User-Id") Long ownerId) {
		return ResponseEntity.ok(restaurantService.create(request, ownerId));
	}

	// City se dhundho — sabke liye open
	@GetMapping
	public ResponseEntity<List<RestaurantResponse>> getByCity(@RequestParam String city) {
		return ResponseEntity.ok(restaurantService.getByCity(city));
	}

	// Single restaurant
	@GetMapping("/{id}")
	public ResponseEntity<RestaurantResponse> getById(@PathVariable Long id) {
		return ResponseEntity.ok(restaurantService.getById(id));
	}

	// Open/Close toggle
	@PutMapping("/{id}/toggle")
	@PreAuthorize("hasRole('RESTAURANT')")
	public ResponseEntity<RestaurantResponse> toggle(@PathVariable Long id, @RequestHeader("X-User-Id") Long ownerId) {
		return ResponseEntity.ok(restaurantService.toggleStatus(id, ownerId));
	}

	// Health check
	@GetMapping("/health")
	public ResponseEntity<String> health() {
		return ResponseEntity.ok("Restaurant Service is UP! ✅");
	}
	@GetMapping("/all")
	public ResponseEntity<List<RestaurantResponse>>
	        getAllRestaurants() {
	    return ResponseEntity.ok(
	        restaurantService.getAllRestaurants());
	}
	// Owner ke restaurants
	@GetMapping("/owner/{ownerId}")
	public ResponseEntity<List<RestaurantResponse>>
	        getByOwner(
	        @PathVariable Long ownerId) {
	    return ResponseEntity.ok(
	        restaurantService
	            .getByOwnerId(ownerId));
	}
	
}