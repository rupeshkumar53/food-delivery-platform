package com.fooddelivery.restaurant.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fooddelivery.restaurant.Model.Restaurant;

public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {

	// City se restaurants dhundho
	List<Restaurant> findByCityAndIsOpen(String city, boolean isOpen);

	// Owner ke restaurants
	List<Restaurant> findByOwnerId(Long ownerId);

	// Cuisine type se
	List<Restaurant> findByCuisineTypeAndCity(String cuisineType, String city);
}