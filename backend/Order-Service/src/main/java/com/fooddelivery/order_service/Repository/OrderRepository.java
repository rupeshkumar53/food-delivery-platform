package com.fooddelivery.order_service.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fooddelivery.order_service.Model.Order;
import com.fooddelivery.order_service.Model.Order.OrderStatus;

import java.util.List;

public interface OrderRepository
        extends JpaRepository<Order, Long> {

    List<Order> findByCustomerId(Long customerId);
    List<Order> findByRestaurantId(Long restaurantId);
    List<Order> findByStatus(OrderStatus status);
    List<Order> findByCustomerIdOrderByPlacedAtDesc(
        Long customerId);
}