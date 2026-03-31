package com.fooddelivery.order_service.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fooddelivery.order_service.Model.OrderItem;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

	List<OrderItem> findByOrderId(Long orderId);
}