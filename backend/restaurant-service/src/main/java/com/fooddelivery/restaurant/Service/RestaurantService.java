package com.fooddelivery.restaurant.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fooddelivery.restaurant.DTO.RestaurantRequest;
import com.fooddelivery.restaurant.DTO.RestaurantResponse;
import com.fooddelivery.restaurant.Model.Restaurant;
import com.fooddelivery.restaurant.Repository.RestaurantRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RestaurantService {

    @Autowired
    private RestaurantRepository restaurantRepository;

    // Create Restaurant
    public RestaurantResponse create(RestaurantRequest request, Long ownerId) {

        Restaurant restaurant = new Restaurant();
        restaurant.setOwnerId(ownerId);
        restaurant.setName(request.getName());
        restaurant.setCuisineType(request.getCuisineType());
        restaurant.setAddress(request.getAddress());
        restaurant.setCity(request.getCity());
        restaurant.setLatitude(request.getLatitude());
        restaurant.setLongitude(request.getLongitude());
        restaurant.setAvgDeliveryTime(request.getAvgDeliveryTime());
        restaurant.setMinimumOrder(request.getMinimumOrder());
        restaurant.setRating(0.0);
        restaurant.setOpen(true);

        return toResponse(restaurantRepository.save(restaurant));
    }

    // Get by City
    public List<RestaurantResponse> getByCity(String city) {
        return restaurantRepository
                .findByCityAndIsOpen(city, true)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // Get by Id
    public RestaurantResponse getById(Long id) {
        Restaurant r = restaurantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Restaurant not found!"));
        return toResponse(r);
    }

    // Toggle Status
    public RestaurantResponse toggleStatus(Long id, Long ownerId) {

        Restaurant r = restaurantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Restaurant not found!"));

        if (!r.getOwnerId().equals(ownerId)) {
            throw new RuntimeException("Not authorized!");
        }

        r.setOpen(!r.isOpen());

        return toResponse(restaurantRepository.save(r));
    }

    // Convert Entity → DTO
    private RestaurantResponse toResponse(Restaurant r) {

        RestaurantResponse res = new RestaurantResponse();
        res.setId(r.getId());
        res.setName(r.getName());
        res.setCuisineType(r.getCuisineType());
        res.setAddress(r.getAddress());
        res.setCity(r.getCity());
        res.setRating(r.getRating());
        res.setOpen(r.isOpen());
        res.setAvgDeliveryTime(r.getAvgDeliveryTime());
        res.setMinimumOrder(r.getMinimumOrder());

        return res;
    }
    //all data
    public List<RestaurantResponse> getAllRestaurants() {
        return restaurantRepository.findAll()
            .stream()
            .map(this::toResponse)
            .collect(java.util.stream.Collectors.toList());
    }
    // onwer
    public List<RestaurantResponse> getByOwnerId(
            Long ownerId) {
    	System.out.println(ownerId);
        List<RestaurantResponse> d= restaurantRepository
                .findByOwnerId(ownerId)
                .stream()
                .map(this::toResponse)
                .collect(java.util.stream
                    .Collectors.toList());;
        System.out.println(d);
		return d;
    }
}