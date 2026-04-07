package com.fooddelivery.restaurant.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fooddelivery.restaurant.DTO.MenuItemRequest;
import com.fooddelivery.restaurant.DTO.MenuItemResponse;
import com.fooddelivery.restaurant.Service.MenuService;

@RestController
@RequestMapping("/api/menu")
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