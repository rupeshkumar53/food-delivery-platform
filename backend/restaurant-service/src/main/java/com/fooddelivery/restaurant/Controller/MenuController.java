package com.fooddelivery.restaurant.Controller;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.fooddelivery.restaurant.DTO.MenuItemRequest;
import com.fooddelivery.restaurant.DTO.MenuItemResponse;
import com.fooddelivery.restaurant.Service.MenuService;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MenuController {

	@Autowired
	private  MenuService menuService;

	// Item add karo
	@PostMapping("/add")
	@PreAuthorize("hasRole('RESTAURANT')")
	public ResponseEntity<MenuItemResponse> addItem(@RequestBody MenuItemRequest request) {
		return ResponseEntity.ok(menuService.addItem(request));
	}

	// Menu dekho
	@GetMapping("/{restaurantId}")
	public ResponseEntity<List<MenuItemResponse>> getMenu(@PathVariable Long restaurantId) {
		return ResponseEntity.ok(menuService.getMenu(restaurantId));
	}

	// Toggle availability
	@PutMapping("/{itemId}/toggle")
	@PreAuthorize("hasRole('RESTAURANT')")
	public ResponseEntity<MenuItemResponse> toggle(@PathVariable Long itemId) {
		return ResponseEntity.ok(menuService.toggleAvailability(itemId));
	}
}