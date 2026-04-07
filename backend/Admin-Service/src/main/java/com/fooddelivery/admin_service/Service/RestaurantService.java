//package com.fooddelivery.admin_service.Service;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.util.List;
//
//@Service
//@Transactional
//public class RestaurantService {
//	// All restaurants
//	public List<RestaurantResponse> 
//	        getAllRestaurants() {
//	    return restaurantRepository.findAll()
//	        .stream()
//	        .map(this::toResponse)
//	        .collect(java.util.stream
//	            .Collectors.toList());
//	}
//
//	// Delete
//	public void deleteRestaurant(Long id) {
//	    restaurantRepository.deleteById(id);
//	}
//}