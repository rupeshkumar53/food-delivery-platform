package com.fooddelivery.restaurant.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fooddelivery.restaurant.DTO.MenuItemRequest;
import com.fooddelivery.restaurant.DTO.MenuItemResponse;
import com.fooddelivery.restaurant.Model.MenuItem;
import com.fooddelivery.restaurant.Repository.MenuItemRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MenuService {

    @Autowired
    private MenuItemRepository menuItemRepository;

    // Add Item
    public MenuItemResponse addItem(MenuItemRequest request) {

        MenuItem item = new MenuItem();
        item.setRestaurantId(request.getRestaurantId());
        item.setName(request.getName());
        item.setDescription(request.getDescription());
        item.setPrice(request.getPrice());
        item.setCategory(request.getCategory());
        item.setVeg(request.isVeg());
        item.setImageUrl(request.getImageUrl());
        item.setAvailable(true);

        return convertToResponse(menuItemRepository.save(item));
    }

    // Get Menu by Restaurant
    public List<MenuItemResponse> getMenu(Long restaurantId) {

        return menuItemRepository
                .findByRestaurantIdAndIsAvailable(restaurantId, true)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // Toggle Availability
    public MenuItemResponse toggleAvailability(Long itemId) {

        MenuItem item = menuItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found!"));

        item.setAvailable(!item.isAvailable());

        return convertToResponse(menuItemRepository.save(item));
    }

    // Entity → DTO
    private MenuItemResponse convertToResponse(MenuItem item) {

        MenuItemResponse res = new MenuItemResponse();
        res.setId(item.getId());
        res.setRestaurantId(item.getRestaurantId());
        res.setName(item.getName());
        res.setDescription(item.getDescription());
        res.setPrice(item.getPrice());
        res.setCategory(item.getCategory());
        res.setVeg(item.isVeg());
        res.setAvailable(item.isAvailable());
        res.setImageUrl(item.getImageUrl());

        return res;
    }
}