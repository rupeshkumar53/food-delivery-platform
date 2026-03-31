package com.fooddelivery.restaurant.Repository;

import com.fooddelivery.restaurant.Model.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MenuItemRepository
        extends JpaRepository<MenuItem, Long> {

    // Restaurant ka poora menu
    List<MenuItem> findByRestaurantId(
        Long restaurantId);

    // Available items only
    List<MenuItem> findByRestaurantIdAndIsAvailable(
        Long restaurantId, boolean isAvailable);

    // Category se filter
    List<MenuItem> findByRestaurantIdAndCategory(
        Long restaurantId, String category);
}